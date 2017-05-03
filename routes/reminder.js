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
                return next(err);
            }
            connection.query('call query_for_new_password(?,?);', [req.body.email, req.body.phone],/*'qwerty12@mail.ru','+79184362633'],*/
                function (err, rows) {
                    if(err){
                        connection.rollback(function () {
                            connection.release();
                            err.message = err.message.replace(err.code + ':', '');
                            err.status = 400;
                            next(err);
                        });
                    }
                    else {
                        var mailOptions = {
                            from: 'M-Listing <mlisting@mlisting.com>',
                            to: rows[0][0].email,
                            subject: 'Восстановление пароля на M-Listing.',
                            text: 'Для подтверждения сброса старого пароля необходимо перейти по ссылке: http://54.69.132.69:8080/new_password?id=' + rows[0][0].id + '&token=' + rows[0][0].token,
                            html: '<p>Для подтверждения регистрации необходимо перейти по ссылке: http://54.69.132.69:8080/new_password?id=' + rows[0][0].id + '&token=' + rows[0][0].token + '</p>'
                        };

                        transporter.sendMail(mailOptions, function(err, info){
                            if (err) {
                                connection.rollback(function () {
                                    connection.release();
                                    err.message = 'Ошибка сервера. Попробуйте позже.';
                                    next(err);
                                });
                            }
                            else
                                connection.commit(function () {
                                    connection.release();
                                    res.json({ message: info.response });
                                });

                        });
                    }
                });
        });
    });

});

module.exports = router;