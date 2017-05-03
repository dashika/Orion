var express = require('express');
var router = express.Router();
var pool = require('../config/mysql');
var transporter = require('../config/nodemailer');
var token;
var id;

router.get('/', function(req, res, next) {
    token = req.query.token;
    id = req.query.id;
    res.status = 200;
    res.send();
});

router.post('/', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        connection.beginTransaction(function (err) {
            if (err) {
                connection.release();
                return next(err);
            }
            connection.query('call submit_new_password(?,?,?);', [id, token, req.body.new_password],/* '62', 'e2059de16fed1ff25eaf626a789432cd6f7108cd', 'poi567'],*/
                function (err, rows) {
                    if (err) {
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
                        subject: 'Новый пароль на M-Listing.',
                        text: 'Ваш новый пароль: ' + req.body.new_password + '.',
                        html: '<p>Ваш новый пароль: ' + req.body.new_password + '.</p>'
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
                            connection.release();
                            res.redirect('/');
                        }
                    });
                }});
        });
    });
});

module.exports = router;