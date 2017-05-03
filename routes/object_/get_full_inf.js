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
        connection.query('call get_full_inf(?);', [req.param('id')],
            function (err, rows) {
                if (err) {
                    connection.rollback(function () {
                        connection.release();
                        
                        err.status = 400;
                        next(err);
                    });
                }
                else {
                    connection.commit();
                    connection.release();
                    if(rows[0][0] != undefined && rows[0][0].photo != undefined){
                        getPhoto(rows[0][0].photo);
                    }
                    res.status = 200;
                    res.send();
                }
            });
    });

    function getPhoto(foldername) {
        var s3 = new aws.S3();
        s3.createBucket(function () {
            /// get from bucket
            var param = {Bucket: BUCKET_NAME};
            s3.listObjects(param, function (err, data) {
                var bucketContents = data.Contents;
                for (var i = 0; i < bucketContents.length; i++) {
                    if (bucketContents[i].Key.indexOf(foldername) != -1) {
                        var urlParams = {Bucket: BUCKET_NAME, Key: bucketContents[i].Key};
                        s3.getSignedUrl('getObject', urlParams, function (err, url) {
                            if (err) {
                                next(err);
                            }
                            else {
                                console.log('the url of the image is', url);
                            }
                        });
                    }
                }
            });
        });
    }
});

module.exports = router;