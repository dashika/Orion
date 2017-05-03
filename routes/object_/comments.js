var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');

router.get('/:id/comment/', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        connection.query('call get_comments(?);', [req.param('id')],
            function (err, rows) {
                if (err) {
                    connection.rollback(function () {
                        connection.release();
                        err.status = 400;
                        next(err);
                    });
                }
                else {
                    if (rows[0][0] == undefined) {
                        req.session.obj = JSON.parse('{"name": [], "message": [] }');
                    }
                    else
                    {
                        req.session.obj = JSON.parse(rows[0][0].message);
                    }
                    res.status = 200;
                    connection.commit();
                    connection.release();
                    res.send();
                }
            });
    });
});


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
        req.session.obj.name.push(req.user.username);
        req.session.obj.message.push(req.body.message);
        connection.query('call insert_comment(?,?);', [req.param('id'), JSON.stringify(req.session.obj)],
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