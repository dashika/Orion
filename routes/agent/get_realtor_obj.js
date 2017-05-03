var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');

router.get('/:id/realestate', function(req, res, next) {
    var answer = new Array();
    var i = 0;
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
                    connection.query('call getOperObj(?);', [req.param('id')],
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
                                for (var ind = 0; ind <= rows[0].length; ind++) {
                                    connection.query('call get_obj_inf(?);', [rows[0][ind].realty],
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
                                                answer[i++] = rows[0][0];
                                                if (i == ind){
                                                    connection.release();
                                                }
                                            }
                                        });
                                }
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