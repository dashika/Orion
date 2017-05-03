var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');

router.post('/', function(req, res, next) {
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
        connection.query('call insert_question(?,?);', [req.user.id, req.body.question],
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
                    res.status = 200;
                    res.send();
                }
            });
    });
});

module.exports = router;