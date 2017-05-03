var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');
var load_image = require('./LoadImage');

router.post('/', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        connection.beginTransaction(function (err) {
            if(err) {
                return next(err);
            }
            var str = 'продать';
            if ( req.body.operation == str )
            {
                req.body.operation = 'купить';
                if (req.body.object_ == 'квартира')
                {
                    var foldername = 'folder' + req.user.id.toString() + '1' + '1';

                    connection.query('call insert_object(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);', [
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
                            req.body.internet,
                            req.body.hypothec,
                            req.body.gas,
                            req.body.balcony,
                            req.body.lift,
                            foldername,
                            req.body.polygon,'', '','','', '','','','','','','',
                            req.user.id,
                            req.body.address
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
                    var foldername = 'folder' + req.user.id.toString() + '1' + '5';

                    connection.query('call insert_object(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
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
                            foldername,
                            req.body.polygon,'','', '',
                            req.body.sqarea,
                            req.body.garage,'','','','', '','',
                            req.user.id,
                            req.body.address
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
                if (req.body.object_ == 'участок')
                {
                    var foldername = 'folder' + req.user.id.toString() + '1' + '4';

                    connection.query('call insert_object(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
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
                                req.body.electricity,
                                req.user.id,
                                req.body.address
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
            }
            if (req.body.operation == 'сдать в аренду')
            {
                req.body.operation = 'снять';
                if (req.body.object_ == 'квартира')
                {
                    var foldername = 'folder' + req.user.id.toString() + '2' + '1';

                    connection.query('call insert_object(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
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
                            foldername,
                            req.body.polygon,
                            req.body.commision,
                            req.body.furniture,
                            req.body.appliances,
                            '','','','','','','','',
                            req.user.id,
                            req.body.address
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
                    var foldername = 'folder' + req.user.id.toString() + '2' + '5';

                    connection.query('call insert_object(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
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
                            foldername,
                            req.body.polygon,
                            req.body.commision,
                            req.body.furniture,
                            req.body.appliances,
                            req.body.sqarea,
                            req.body.garage, '','','','','','',
                            req.user.id,
                            req.body.address
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
                if (req.body.object_ == 'оффис')
                {
                    var foldername = 'folder' + req.user.id.toString() + '2' + '2';

                    connection.query('call insert_object(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
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
                            foldername,
                            req.body.polygon,'','','', '','',
                            req.body.height_,
                            req.body.centrcond,
                            req.body.parking,'','','',
                            req.user.id,
                            req.body.address
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
            }
            if (req.body.operation == 'продать/сдать в аренду') {
                req.body.operation = 'купить/снять';
                if (req.body.object_ == 'гараж') {
                    var foldername = 'folder' + req.user.id.toString() + '3' + '3';
                    connection.query('call insert_object(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
                        [
                            req.body.city,
                            req.body.operation,
                            req.body.district,'','','',
                            req.body.sqmain,'',
                            req.body.object_,
                            req.body.cost, '','','','','','','',
                            foldername,
                            req.body.polygon,'','','', '','','','','',
                            req.body.water,'',
                            req.body.electricity,
                            req.user.id,
                            req.body.address
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
            }
        });
    });
});

module.exports = router;