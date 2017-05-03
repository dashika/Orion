var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');
var aws = require('aws-sdk');
aws.config.loadFromPath('./AwsConfig.json');
var BUCKET_NAME = 'orionphoto';

router.get('/:id', function(req, res, next) {
    var foldername;

    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        connection.query('call get_obj_inf(?);', [req.param('id')],
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
    });
});

module.exports = router;