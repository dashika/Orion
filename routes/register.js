var express = require('express');
var router = express.Router();
var pool = require('../config/mysql');
var transporter = require('../config/nodemailer');

router.post('/', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        connection.beginTransaction(function (err) {
            if(err) {
                connection.release();
                return next(err);
            }
            connection.query('call register(?,?,?,?);', [req.body.email, req.body.password, req.body.phone, req.body.name],//'qwerty12@mail.ru','qwerty9','+79184362633','Валя'],
            function (err, rows) {
                if(err){
                    connection.rollback(function () {
                        connection.release();
                        err.message = err.message.replace(err.code + ':', '');
                        if (err.message.indexOf('существует')!= -1)
                        {
                            err.status = 409;
                        }
                        else{
                            err.status = 400;
                        }
                        next(err);
                    });
                }
                else {
                    var mailOptions = {
                        from: 'M-Listing <mlisting@mlisting.com>',
                        to: rows[0][0].email,
                        subject: 'Подтверждение регистрации на M-Listing.',
                        text: 'Для подтверждения регистрации необходимо перейти по ссылке: http://54.69.132.69:8080/activate?id=' + rows[0][0].id + '&token=' + rows[0][0].token,
                        html: '<p>Для подтверждения регистрации необходимо перейти по ссылке: http://54.69.132.69:8080/activate?id=' + rows[0][0].id + '&token=' + rows[0][0].token + '</p>'
                    };
                    transporter.sendMail(mailOptions, function(err, info){
                        if (err) {
                            connection.rollback(function () {
                                connection.release();
                                err.message = 'Ошибка сервера. Попробуйте позже.';
                                next(err);
                            });
                        }
                        else {
                            connection.commit(function () {
                                connection.release();
                                res.json({ message: info.response });
                            });
                        }
                    });
                }
            });
        });
    });
});

module.exports = router;