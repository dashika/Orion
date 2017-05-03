var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');
var aws = require('aws-sdk');
aws.config.loadFromPath('./AwsConfig.json');
var BUCKET_NAME = 'orionphoto';

router.get('/:id', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        connection.query('call get_question_by_id(?);', [req.param('id')],
            function (err, rows) {
                if (err) {
                    connection.rollback(function () {
                        connection.release();
                        err.status = 400;
                        next(err);
                    });
                }
                else {
                    if (rows[0][0].comments == null) {
                      //  req.session.question_comments = JSON.parse('{"name": [], "message": [] }');
                        rows[0][0].comments = JSON.parse('{"name": [], "message": [] }');
                    }
                    else  /// если добавление комментария будет на этой же старнице, то актуальнее будет, то что закоменчено
                    {
                      //  req.session.question_comments = JSON.parse(rows[0][0].comments);
                        rows[0][0].comments = JSON.parse(rows[0][0].comments);
                    }
                    if (rows[0][0].photo_url == null) {
                        var s3 = new aws.S3();
                        var urlParams = {Bucket: BUCKET_NAME, Key: 'default.png' };
                        s3.getSignedUrl('getObject', urlParams, function (err, url) {
                            rows[0][0].photo_url = url;
                        });
                    }
                    res.status = 200;
                    connection.commit();
                    connection.release();
                    res.send();
                }
            });
    });
});

module.exports = router;