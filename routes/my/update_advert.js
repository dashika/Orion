var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');
var aws = require('aws-sdk');
var crypto = require('crypto');
aws.config.loadFromPath('./AwsConfig.json');
var BUCKET_NAME = 'orionphoto';
var transporter = require('../../config/nodemailer');

router.post('/:id/alter', function(req, res, next) {

    req.pipe(req.busboy);
    req.busboy.on('field', function (fieldname, val) {
        req.body[fieldname] = val;
    });

    var img = new Array();
    var image_name = new Array();
    var i = 0; var k = 0;

    req.busboy.on('file', function (fieldname, file, filename,encoding, mimetype) {
        if(mimetype.indexOf('image')+1)
        {
            if (req.headers['content-length'] >= (5 * 1024 * 1024 * 8)) {
                var err = new Error('Слишком большой файл. Максимальный размер 5 Мб !');
                err.status = 400;
                throw new Error(err.message);
                return next(err);
            }
        }
        if(mimetype.indexOf('video')+1) {
            if (req.headers['content-length'] >= (20 * 1024 * 1024 * 8)) {
                var err = new Error('Слишком большой файл. Максимальный размер 20 Мб !');
                err.status = 400;
                throw new Error(err.message);
                return next(err);
            }
        }
        image_name[k]  = crypto.randomBytes(16).toString('hex') + filename.substring(filename.lastIndexOf('.'), filename.length);
        k = k + 1;
        if (!filename) {
            return false;
        }
        file.fileRead = [];

        file.on('data', function (chunk) {
            this.fileRead.push(chunk);
        });

        file.on('error', function (err) {
            console.log('Error while buffering the stream: ', err);
        });

        file.on('end', function () {
            if (i < 5) {
                img[i] = Buffer.concat(this.fileRead);
            }
            else{
                console.log('files must be max 5. some files will be cut');
            }
            i = i + 1;
        });

    });

    req.busboy.on('finish', function(){
        console.log('finish, files uploaded ');
    });

    process.nextTick(
        function workDB() {
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
                        if (req.body.operation == undefined) {
                            var form = new formidable.IncomingForm();
                            form.parse(req, function (error, field, file) {
                                console.log('busboy limited, work with formidable');
                                for (var key in field) {
                                    req.body[key] = field[key];
                                }
                            });
                        }
                        connection.query('call update_object(?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?);', [ //29
                                req.param('id'),
                                req.body.city,
                                req.body.floor,
                                req.body.floors,
                                req.body.rooms, //5
                                req.body.sqmain,
                                req.body.sqkitchen,
                                req.body.cost,
                                req.body.decor,
                                req.body.type_, //10
                                req.body.internet,
                                req.body.hypothec,
                                req.body.gas,
                                req.body.balcony,
                                req.body.lift, //15
                                req.body.polygon,
                                req.body.commision,
                                req.body.furniture,
                                req.body.appliances,
                                req.body.sqarea, //20
                                req.body.garage,
                                req.body.centrcond,
                                req.body.parking,
                                req.body.water,
                                req.body.canalization, //25
                                req.body.electricity,
                                req.body.address,
                                req.body.description,
                                req.body.parknmb
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
                    }
                });

            });
        }
    );

    function compareWithRequests(id_)
    {
        pool.getConnection(function (err, connection) {
            if (err) {
                return next(err);
            }
            connection.query('call compareObjRequest(?);', [ id_ ],
                function (err, rows) {
                    if (err) {
                        connection.rollback(function () {
                            connection.release();
                            err.status = 500;
                            next(err);
                        });
                    }
                    else {
                        if (rows[0][0] != undefined ){
                            req.session.add_new = id_;
                            for(var ind = 0; ind < rows[0].length; ind++)
                            {
                                var rows_email = '';
                                var pers = rows[0][ind].perscard;
                                var request = rows[0][ind].request;
                                if(rows[0][ind].email != undefined || rows[0][ind].email != '') {
                                    rows_email = rows[0][ind].email;
                                }
                                connection.query('call get_obj_inf(?);', [ id_ ],
                                    function (err, rows) {
                                        if (err) {
                                            connection.rollback(function () {
                                                connection.release();
                                                err.status = 500;
                                                next(err);
                                            });
                                        }
                                        else {

                                            var message = '';
                                            message += (rows[0][0].id != undefined ? " id : " + rows[0][0].id + '; ' : '')
                                                + (rows[0][0].rooms != undefined ? ' комнат : ' + rows[0][0].rooms + '; ' : '')
                                                + (rows[0][0].sqmain != undefined ? ' площадь : ' + rows[0][0].sqmain + '; ' : '')
                                                + (rows[0][0].type != undefined ? ' тип : ' + rows[0][0].type + '; ' : '')
                                                + (rows[0][0].sqarea != undefined ? ' плащадь двора : ' + rows[0][0].sqarea + '; ' : '')
                                                + (rows[0][0].name != undefined ? ' имя : ' + rows[0][0].name + '; ' : '')
                                                + (rows[0][0].phone != undefined ? ' телефон : ' + rows[0][0].phone + '; ' : '');

                                            connection.query('call succes_request_result(?,?,?,?);', [ req.user.id, request, message, rows[0][0].id  ],
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
                                                    }
                                                });

                                            if (rows_email != undefined || rows_email != '') {
                                                var mailOptions = {
                                                    from: 'M-Listing <mlisting@mlisting.com>',
                                                    to: rows_email,
                                                    subject: 'Результат запроса на M-Listing.',
                                                    text: '<p> Найден объект подходящий под Ваш запрос :' + message + '</p>',
                                                    html: '<p> Найден объект подходящий под Ваш запрос :' + message + '</p>'
                                                };
                                                transporter.sendMail(mailOptions, function (err, info) {
                                                    if (err) {
                                                        connection.rollback(function () {
                                                            connection.release();
                                                            err.message = 'Ошибка сервера. Попробуйте позже.';
                                                            next(err);
                                                        });
                                                    }
                                                    else {
                                                        connection.commit();
                                                    }
                                                });
                                            }
                                        }
                                    })
                            }}
                        connection.commit();
                        connection.release();
                    }
                });
        });
    }

    function deleteFileFromS3() {
        var s3 = new aws.S3();
            s3.createBucket(function () {
                var params = {Bucket: BUCKET_NAME,  Delete: {
                    Objects: [
                        { Key: 'folder10711443' }
                    ]
                } };
                s3.deleteObjects(params, function (err) {
                    if (err) {
                        err.status = 400;
                        err.message = 'Не удалось удалить файл !';
                        next(err);
                    }
                });
        });
    }

    function sendImg() {
        var s3 = new aws.S3();
        var num = 0;
        if (i > 5) {
            i = 5;
        }
        for (var j = 0; j < i; j++) {
            s3.createBucket(function () {
                var params = {ACL: 'public-read', Bucket: BUCKET_NAME, Key: foldername + '/' + image_name[j], Body: img[j]};
                s3.putObject(params, function (err) {
                    if (err) {
                        err.status = 400;
                        err.message = 'Не удалось загрузить файл !';
                        next(err);
                    }
                });
            });
        }
        for (var j = 0; j < i; j++) {
            var urlParams = {Bucket: BUCKET_NAME, Key: foldername + '/' + image_name[j]};
            s3.getSignedUrl('getObject', urlParams, function (err, url) {
                console.log('the url of the image is', url);
                if (num == 0)// (И) - вместо 0
                {
                    pool.getConnection(function (err, connection) {
                        if (err) {
                            return next(err);
                        }
                        connection.query('call set_main_photo(?,?,?,?);', [objectindx, req.body.object_, foldername, url],
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
                };
                num++;
            });
        }
    }
});

module.exports = router;