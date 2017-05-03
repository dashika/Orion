var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');

router.post('/', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        connection.beginTransaction(function (err) {
            if (err) {
                connection.rollback();
                connection.release();
                return next(err);
            }
            connection.query('call find_realty(?,?,?,?,?,?,?,?,?,?, ?,?,?,?,?,?,?,?,?,?, ?,?,?,?,?,?,?,?,?,? ,?,?,?,?,?,?);',
                [
                    req.body.city,
                    req.body.operation,
                    req.body.lfloor,
                    req.body.hfloor,
                    req.body.lfloors,
                    req.body.hfloors,
                    req.body.rooms,
                    req.body.lsqmain,
                    req.body.hsqmain,
                    req.body.lsqkitchen,
                    req.body.hsqkitchen,
                    req.body.object_,
                    req.body.lcost,
                    req.body.hcost,
                    req.body.decor,
                    req.body.type_,
                    req.body.internet,
                    req.body.hypothec,
                    req.body.gas,
                    req.body.balcony,
                    req.body.lift,
                    req.body.photo,
                    req.body.polygon,
                    req.body.commission,
                    req.body.furniture,
                    req.body.appliances,
                    req.body.lsqarea,
                    req.body.hsqarea,
                    req.body.garage,
                    req.body.centrcond,
                    req.body.parking,
                    req.body.water,
                    req.body.canalization,
                    req.body.electricity,
                    req.body.lparknmb,
                    req.body.hparknmb
                ],
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
});

module.exports = router;