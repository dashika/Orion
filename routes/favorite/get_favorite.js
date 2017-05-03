var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');

router.get('/:type', function(req, res, next) {
    if (req.user == undefined)
    {
        var err = new Error('Войдите в систему, чтобы продолжить операцию !');
        err.status = 400;
        return next(err);
    }
    var answer = new Array();
    var i = 0;

    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        connection.query('call get_favorite(?,?);', [req.param('type'), req.user.id],
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
                            getInfObj(
                                req.param('type') == 'realestate' ? 'call get_obj_inf(?);' : req.param('type') == 'request' ? 'call get_request_by_id_short(?);' : 'call get_question_by_id(?);',
                                connection, rows[0][ind],rows[0].length );
                        }
                    }
                    res.status = 200;
                    res.send();
                }
            });
    });

    function getInfObj(query, connection, row, ind)
    {
        connection.query(query, [row.id_object],
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
                    answer[i] = rows[0][0];
                    if (rows[1][0] != undefined)
                    {
                        for(var j = 0; j < rows[1].length; j++)
                        {
                            if (answer[i].type_ == undefined)
                            {
                                answer[i].type_ = new Array();
                            }
                            answer[i].type_[j] = rows[1][j].type;
                        }
                    }
                    i += 1;
                    if (ind == i)
                    {
                        connection.release();
                    }
                }
            });
    }
});

module.exports = router;