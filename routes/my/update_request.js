var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');
var aws = require('aws-sdk');
var crypto = require('crypto');
aws.config.loadFromPath('./AwsConfig.json');
var BUCKET_NAME = 'orionphoto';
var transporter = require('../../config/nodemailer');

router.post('/:id/alter', function(req, res, next) {
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
            else {
                connection.query('call update_request(?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?);', [ //29
                        req.param('id'),
                        req.body.city,
                        req.body.lfloor,
                        req.body.hfloor,
                        req.body.lfloors, //5
                        req.body.hfloors,
                        req.body.lrooms,
                        req.body.hrooms,
                        req.body.lsqmain,
                        req.body.hsqmain, //10
                        req.body.lsqkitchen,
                        req.body.hsqkitchen,
                        req.body.lcost,
                        req.body.hcost,
                        req.body.internet, //15
                        req.body.hypothec,
                        req.body.gas,
                        req.body.balcony,
                        req.body.lift,
                        req.body.polygon, //20
                        req.body.commision,
                        req.body.appliances,
                        req.body.lsqarea,
                        req.body.hsqarea,
                        req.body.garage, //25
                        req.body.centrcond,
                        req.body.water,
                        req.body.canalization,
                        req.body.electricity,
                        req.body.parknmb //30
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
                            if (req.body.object_ == 'квартира' || req.body.object_ == 'дом' || req.body.object_ == 'таунхаус') {
                                if (typeof(req.body.decor) == 'object') {
                                    req.body.decor.forEach(function (el, idx) {
                                        decor(rows[0][0].id, el);
                                    });
                                }
                                else {
                                    decor(rows[0][0].id, req.body.decor);
                                }
                                if (typeof(req.body.type_) == 'object') {
                                    req.body.type_.forEach(function (el, idx) {
                                        type_(rows[0][0].id, el)
                                    });
                                }
                                else {
                                    type_(rows[0][0].id, req.body.type_);
                                }
                                if (req.body.operation == 'снять') {
                                    if (typeof(req.body.furniture) == 'object') {
                                        req.body.furniture.forEach(function (el, idx) {
                                            furniture(rows[0][0].id, el);
                                        });
                                    }
                                    else {
                                        furniture(rows[0][0].id, req.body.furniture);
                                    }
                                }
                            }
                            if (req.body.object_ == 'офис' ) {
                                if (typeof(req.body.parking) == 'object') {
                                    req.body.parking.forEach(function (el, idx) {
                                        parking(rows[0][0].id, el);
                                    });
                                }
                                else {
                                    parking(rows[0][0].id, req.body.parking);
                                }
                            }
                            res.status = 200;
                            res.send();
                        }
                    });
            }
        });

    });

    function decor( id_,  decor_) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return next(err);
            }
            connection.query('call insert_decor(?,?);', [ id_, decor_ ],
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
                    }
                });
        });
    }

    function type_( id_,  type_) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return next(err);
            }
            connection.query('call insert_type(?,?);', [ id_, type_ ],
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
                    }
                });
        });
    }

    function furniture( id_,  furniture) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return next(err);
            }
            connection.query('call insert_furniture(?,?);', [ id_, furniture ],
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
                    }
                });
        });
    }

    function parking( id_,  parking) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return next(err);
            }
            connection.query('call insert_parking(?,?);', [ id_, parking ],
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
                    }
                });
        });
    }

});

module.exports = router;