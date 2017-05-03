var express = require('express');
var router = express.Router();
var pool = require('../config/mysql');

router.get('/', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        connection.query('call activate(?,?);', [req.query.id, req.query.token],/* '62','e2059de16fed1ff25eaf626a789432cd6f7108cd'],*/
        function (err, rows) {
            if (err) {
                connection.rollback(function () {
                    connection.release();
                    err.message = err.message.replace(err.code + ':', '');
                    err.status = 400;
                    next(err);
                });
            }
            else {
                connection.release();
                res.status = 200;
                res.send();
            }
            //res.redirect('/');
        });
    });
});

module.exports = router;