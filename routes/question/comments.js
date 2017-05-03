var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');
var aws = require('aws-sdk');
aws.config.loadFromPath('./AwsConfig.json');
var BUCKET_NAME = 'orionphoto';

router.post('/:id/comment/', function(req, res, next) {
    if (req.user == undefined)
    {
        var err = new Error('Войдите в систему, чтобы продолжить операцию !');
        err.status = 400;
        return next(err);
    }
    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        //если добавление комментария отдельная страница - то этот вызов нужен
        connection.query('call get_question_by_id(?);', [req.param('id')],
            function (err, rows) {
                if (err) {
                    connection.rollback(function () {
                        connection.release();
                        err.status = 500;
                        next(err);
                    });
                }
                else {
                    connection.commit();
                    if (rows[0][0].comments == null) {
                        rows[0][0].comments = JSON.parse('{"name": [], "message": [] }');
                    }
                    if (rows[0][0].photo_url == null) {
                        var s3 = new aws.S3();
                        var urlParams = {Bucket: BUCKET_NAME, Key: 'default.png' };
                        s3.getSignedUrl('getObject', urlParams, function (err, url) {
                            rows[0][0].photo_url = url;
                        });
                    }
                    rows[0][0].comments = JSON.parse(rows[0][0].comments);
                    rows[0][0].comments.name.push(req.user.username);
                    rows[0][0].comments.message.push(req.body.message);
                    connection.query('call insert_comment_question(?,?);', [req.param('id'), JSON.stringify(rows[0][0].comments)],
                        function (err, rows) {
                            if (err) {
                                connection.rollback(function () {
                                    connection.release();
                                    err.status = 500;
                                    next(err);
                                });
                            }
                            else {
                                connection.commit();
                                connection.release();
                                res.status = 200;
                                res.send();
                            }
                        });
                }
            });

    });
});

module.exports = router;