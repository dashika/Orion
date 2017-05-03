var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');
var stringSimilarity = require('string-similarity'); // если захочется еще и отсортировать по рейтингу самых подходящих )

router.post('/', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        else {
            connection.beginTransaction(function (err) {
                if (err) {
                    connection.rollback();
                    connection.release();
                    return next(err);
                }
                else {
                    connection.query('call find_question(?);',[req.body.query],
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
        }
    });
});

module.exports = router;