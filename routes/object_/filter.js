var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');

router.post('/', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        connection.beginTransaction(function (err) {
            if(err) {
                return next(err);
            }
            if (req.body.operation == 'купить')
            {
                if (req.body.object_ == 'квартира')
                {
                    connection.query('call find_realty(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);', [
                            req.body.city,
                            req.body.operation,
                            req.body.district,
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
                            req.body.polygon,'', '','','', '','','','','','','','','',''
                        ],
                        function(err, rows) {
                            if(err){
                                connection.rollback(function () {
                                    connection.release();
                                    next(err);
                                });
                            }
                            else {
                                connection.commit();
                                connection.release();

                            }
                        });
                }
                if (req.body.object_ == 'дом/таунхаус')
                {
                    connection.query('call find_realty(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
                        [
                            req.body.city,
                            req.body.operation,
                            req.body.district,'',
                            req.body.floors,
                            req.body.rooms,
                            req.body.sqmain,'',
                            req.body.object_,
                            req.body.cost,
                            req.body.decor,
                            req.body.type_,
                            req.body.internet,
                            req.body.hypothec,
                            req.body.gas, '','',
                            req.body.photo,
                            req.body.polygon,'','', '',
                            req.body.sqarea,
                            req.body.garage,'','','','', '',''
                        ],
                        function(err, rows) {
                            if(err){
                                connection.rollback(function () {
                                    connection.release();
                                    next(err);
                                });
                            }
                            else {
                                connection.commit();
                            }
                        });
                }
                if (req.body.object_ == 'участок')
                {
                    connection.query('call find_realty(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
                        [
                            [
                                req.body.city,
                                req.body.operation,
                                req.body.district,'', '','','','',
                                req.body.object_,
                                req.body.cost,'','','', '',
                                req.body.gas, '', '',
                                req.body.photo,
                                req.body.polygon,'', '','',
                                req.body.sqarea,'','','','',
                                req.body.water,
                                req.body.canalization,
                                req.body.electricity]
                        ],
                        function(err, rows) {
                            if(err){
                                connection.rollback(function () {
                                    connection.release();
                                    next(err);
                                });
                            }
                            else {
                                connection.commit();
                            }
                        });
                }
            }
            if (req.body.operation == 'снять')
            {
                if (req.body.object == 'квартира')
                {
                    connection.query('call find_realty(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
                        [
                            req.body.city,
                            req.body.operation,
                            req.body.district,
                            req.body.floor,
                            req.body.floors,
                            req.body.rooms,
                            req.body.sqmain,
                            req.body.sqkitchen,
                            req.body.object_,
                            req.body.cost,
                            req.body.decor,
                            req.body.type_,
                            req.body.internet,'',
                            req.body.gas,
                            req.body.balcony,
                            req.body.lift,
                            req.body.photo,
                            req.body.polygon,
                            req.body.commision,
                            req.body.furniture,
                            req.body.appliances,
                            '','','','','','','',''
                        ],
                        function(err, rows) {
                            if(err){
                                connection.rollback(function () {
                                    connection.release();
                                    next(err);
                                });
                            }
                            else {
                                connection.commit();
                            }
                        });
                }
                if (req.body.object == 'дом.таунхаус')
                {
                    connection.query('call find_realty(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
                        [
                            req.body.city,
                            req.body.operation,
                            req.body.district,'',
                            req.body.floors,
                            req.body.rooms,
                            req.body.sqmain,'',
                            req.body.object_,
                            req.body.cost,
                            req.body.decor,
                            req.body.type_,
                            req.body.internet,
                            req.body.hypothec,
                            req.body.gas,'','',
                            req.body.photo,
                            req.body.polygon,
                            req.body.commision,
                            req.body.furniture,
                            req.body.appliances,
                            req.body.sqarea,
                            req.body.garage, '','','','','',''
                        ],
                        function(err, rows) {
                            if(err){
                                connection.rollback(function () {
                                    connection.release();
                                    next(err);
                                });
                            }
                            else {
                                connection.commit();
                            }
                        });
                }
                if (req.body.object == 'оффис')
                {
                    connection.query('call find_realty(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
                        [
                            req.body.city,
                            req.body.operation,
                            req.body.district,
                            req.body.floor,
                            req.body.floors,
                            req.body.rooms,
                            req.body.sqmain,'',
                            req.body.object_,
                            req.body.cost, '','',
                            req.body.internet,'','','',
                            req.body.lift,
                            req.body.photo,
                            req.body.polygon,'','','', '','',
                            req.body.height_,
                            req.body.centrcond,
                            req.body.parking,'','',''
                        ],
                        function(err, rows) {
                            if(err){
                                connection.rollback(function () {
                                    connection.release();
                                    next(err);
                                });
                            }
                            else {
                                connection.commit();
                            }
                        });
                }
            }
            if (req.body.operation == 'купить/снять') {
                if (req.body.object == 'гараж') {
                    connection.query('call find_realty(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
                        [
                            req.body.city,
                            req.body.operation,
                            req.body.district,'','','',
                            req.body.sqmain,'',
                            req.body.object_,
                            req.body.cost, '','','','','','','',
                            req.body.photo,
                            req.body.polygon,'','','', '','','','','',
                            req.body.water,'',
                            req.body.electricity
                        ],
                        function(err, rows) {
                            if(err){
                                connection.rollback(function () {
                                    connection.release();
                                    next(err);
                                });
                            }
                            else {
                                connection.commit();
                            }
                        });
                }
            }
        });
    });
});

module.exports = router;