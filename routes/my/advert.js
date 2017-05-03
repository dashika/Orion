var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');

router.get('/', function(req, res, next) {
    var answer = new Array();
    var i = 0;

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
        connection.query('call get_adrert(?);', [req.user.id],
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
                    if(rows[0][0] != undefined) {
                        for(var ind = 0; ind < rows[0].length; ind++ ) {
                            getInfObj(connection, rows[0][ind],rows[0].length );
                        }
                    }
                    res.status = 200;
                    res.send();
                }
            });
    });

    function getInfObj(connection, row, ind)
    {
            connection.query('call get_obj_inf(?);', [row.id],
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
                        if (ind == i)
                        {
                            connection.release();
                        }
                        res.status = 200;
                        res.send();
                    }
                });
    }
});

module.exports = router;