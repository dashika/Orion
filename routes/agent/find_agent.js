var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');

router.post('/', function(req, res, next) {
    var answer = new Array();
    var i = 0;
    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        else {
            if (typeof(req.body.operation) == 'object') {
                req.body.operation.forEach(function (el, idx) {
                    if (typeof(req.body.object_) == 'object') {
                        req.body.object_.forEach(function (el1, idx) {
                            find(el, el1, connection);
                        });
                    }
                    else {
                        find(el, req.body.object_, connection);
                    }
                });
            }
            else {
                if (typeof(req.body.object) == 'object') {
                    req.body.object_.forEach(function (el1, idx) {
                        find(req.body.operation, el1, connection);
                    });
                }
                else {
                    find(req.body.operation, req.body.object_, connection);
                }
            }
            connection.commit();
            connection.release(); // ? не перенести бы это в цикл ниже как в get_realtor_obj
        }
    });

   function find(operation, object_, connection) {
           connection.beginTransaction(function (err) {
               if (err) {
                   connection.rollback();
                   connection.release();
                   return next(err);
               }
               else {
                   connection.query('call find_agent(?,?,?,?);', [req.body.city, object_, operation, req.body.commission ],
                       function (err, rows) {
                           if (err) {
                               connection.rollback(function () {
                                   connection.release();
                                   err.status = 500;
                                   next(err);
                               });
                           }
                           else {
                               for(var ind = 0; ind < rows[0].length; ind++) {
                                   answer[i++] = rows[0][ind];
                               }
                               res.status = 200;
                               res.send();
                           }
                       });
               }
           });
       };

});

module.exports = router;