var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');
var aws = require('aws-sdk');
aws.config.loadFromPath('./AwsConfig.json');
var BUCKET_NAME = 'orionphoto';

router.get('/:id/delete', function(req, res, next) {
    var foldername = '';

    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        connection.query('call delete_obj(?);', [req.param('id')],
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
                    foldername = rows[0][0].photo;
                    deleteFileFromS3();
                    res.status = 200;
                    res.send();
                }
            });
    });

    function deleteFileFromS3() {
        var s3 = new aws.S3();
        s3.createBucket(function () {
            /// get all from bucket
            var param = {Bucket: BUCKET_NAME};
            s3.listObjects(param, function (err, data) {
                var bucketContents = data.Contents;
                for (var i = 0; i < bucketContents.length; i++) {
                    if (bucketContents[i].Key.indexOf(foldername) !=  -1 ) {
                        var params = {Bucket: BUCKET_NAME, Delete: {
                            Objects: [
                                { Key: bucketContents[i].Key }
                            ]
                        } };
                        s3.deleteObjects(params, function (err) {
                            if (err) {
                                err.status = 400;
                                err.message = 'Не удалось удалить файл !';
                                next(err);
                            }
                        });
                    }
                }
            });

        });
    }
});

module.exports = router;