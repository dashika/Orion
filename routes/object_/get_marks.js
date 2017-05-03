var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');

router.post('/', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        connection.query('call get_labels(?,?,?);', [req.body.city, req.body.operation, req.body.object_],
            function (err, rows) {
                if (err) {
                    connection.rollback(function () {
                        connection.release();
                        err.status = 400;
                        next(err);
                    });
                }
                else {
                    res.status = 200;
                    connection.commit();
                    connection.release();
                }
            });
    });
});

module.exports = router;