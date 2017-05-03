
module.exports = function() {

    var passport = require('passport');
    var pool = require('../config/mysql');
    var address = 'http://smedialink.tk:8080';

    var LocalStrategy = require('passport-local').Strategy;

    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        function (username, password, done) {
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
                    connection.query('call authenticate(?,?);', [username, password],//'qwerty01@mail.ru', 'qwerty9'],
                        function (err, rows) {
                            if (err) {
                                connection.rollback();
                                connection.release();
                                err.message = err.message.replace(err.code + ':', '');
                                err.status = 400;
                                return done(err);
                            }
                            else {
                                done(err,
                                    {
                                        id: rows[0][0].id,
                                        username: rows[0][0].name,
                                        email: rows[0][0].email
                                    });
                                connection.commit();
                                    connection.release();
                            }
                        });
                });
            });
        }
    ));

    /*
     * FACEBOOK
     */
    var FacebookStrategy = require('passport-facebook').Strategy;
    var FACEBOOK_APP_ID = 555587664586867;
    var FACEBOOK_APP_SECRET = "bef85bcc8b36c9cf7515f361ad6b2883";

    passport.use(new FacebookStrategy({
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: address + "/facebook/callback"
        },
        function (accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {
                pool.getConnection(function (err, connection) {
                    if (err) {
                        return done(err);
                    }
                    connection.query('call facebook_find_or_create(?,?);', [profile.id, profile.name.familyName + profile.name.givenName],
                        function (err, rows) {
                            if (err) {
                                connection.release();
                                return done(err);
                            }
                            done(err,
                                {
                                    id: rows[0][0].id,
                                    username: rows[0][0].login
                                });
                            connection.release();
                        });
                });
            });
        }
    ));

    /*
     * VKONTAKTE
     */
    var VKontakteStrategy = require('passport-vkontakte').Strategy;
    var VK_APP_ID = 4079362;
    var VK_APP_SECRET = 'n7DAje4OjCenG7OChEWb';

    passport.use(new VKontakteStrategy(
        {
            clientID: VK_APP_ID,
            clientSecret: VK_APP_SECRET,
            callbackURL: address + "/vk/callback"
        },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                pool.getConnection(function (err, connection) {
                    if (err) {
                        return done(err);
                    }
                    connection.query('call vk_find_or_create(?,?);', [profile.id, profile.username],
                        function (err, rows) {
                            if (err) {
                                connection.release();
                                return done(err);
                            }
                            done(err,
                                {
                                    id: rows[0][0].id,
                                    username: rows[0][0].login
                                });
                            connection.release();
                        });
                });
            });
        }
    ));

    /*
     * GOOGLE
     */
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var GOOGLE_CLIENT_ID = '621836810206-st2eee6uqj6dtrm5op0d76db9g9cukhk.apps.googleusercontent.com';
    var GOOGLE_CLIENT_SECRET = 'ms2uGqyhacuwl-N7FW5K19_s';

    passport.use(new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: address + '/google/callback'
        },
        function (req, token, refreshToken, profile, done) {
            process.nextTick(function () {
                pool.getConnection(function (err, connection) {
                    if (err)
                        return done(err);
                    connection.query('call google_find_or_create(?,?,?);', [profile.id, profile.name.givenName + ' ' + profile.name.familyName, profile.emails[0].value],
                        function (err, rows) {
                            if (err) {
                                connection.release();
                                return done(err);
                            }
                            done(err,
                                {
                                    id: rows[0][0].id,
                                    username: rows[0][0].login
                                });
                            connection.release();
                        });
                });
            });
        }
    ));


    /*
     * ODNOKLASSNIKI
     */

    var OdnoklassnikiStrategy = require('passport-odnoklassniki').Strategy;
    var Odnoklassniki_APP_ID = 1104588544;
    var ODNOKLASSNIKI_APP_PUBLIC_KEY = "CBAQKHNCEBABABABA";
    var Odnoklassniki_APP_SECRET = "C75F544870CFCE5391779451";

    passport.use(new OdnoklassnikiStrategy(
        {
            clientID: Odnoklassniki_APP_ID,
            clientPublic: ODNOKLASSNIKI_APP_PUBLIC_KEY,
            clientSecret: Odnoklassniki_APP_SECRET,
            callbackURL: address + "/odnoklassniki/callback"
        },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                pool.getConnection(function (err, connection) {
                    if (err)
                        return done(err);
                    connection.query('call odnoklassniki_find_or_create(?,?);', [profile.id, profile.name.givenName + ' ' + profile.name.familyName],
                        function (err, rows) {
                            if (err) {
                                connection.release();
                                return done(err);
                            }
                            done(err,
                                {
                                    id: rows[0][0].id,
                                    username: rows[0][0].login
                                });
                            connection.release();
                        });
                });
            });
        }
    ));


    /*
     * (de-)serialize
     */
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });


    passport.deserializeUser(function (id, done) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return done(err);
            }
            connection.query('CALL get_user_by_id(?);', [id],
                function (err, rows) {
                    if (err) {
                        connection.release();
                        return done(err);
                    }
                    done(err,
                        {
                            id: rows[0][0].id,
                            username: rows[0][0].name,
                            email: rows[0][0].email
                        });
                    connection.release();
                });
        });
    });

};

