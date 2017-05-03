var express = require('express');
var expressSession = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var multiparty = require('multiparty');

var busboy = require('connect-busboy');
// config Passport
var passport = require('passport');
require('./boot/index')(app);

var routes = require('./routes/index');
var register = require('./routes/register');
var login = require('./routes/login');
var facebook = require('./routes/login/facebook');
var vk = require('./routes/login/vk');
var google = require('./routes/login/google');
var odnoklassniki = require('./routes/login/odnoklassniki');
var activate = require('./routes/activate');
var logout = require('./routes/logout');
var reminder = require('./routes/reminder');
var new_pass = require('./routes/new_password');
var insert_object = require('./routes/object_/insert_object');
var filter = require('./routes/object_/filter');
var img = require('./routes/object_/loadImage');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/// passport init
app.use(expressSession({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(busboy());
//app.use(express.multipart());
//app.use(methodOverride());
//app.use(app.router);

app.use('/', routes);
app.use('/register', register);
app.use('/login', login);
app.use('/logout', logout);
app.use('/facebook', facebook);
app.use('/vk', vk);
app.use('/google', google);
app.use('/odnoklassniki', odnoklassniki);
app.use('/activate', activate);
app.use('/login/reminder', reminder);
app.use('/new_password', new_pass);
app.use('/insert_object', insert_object);
app.use('/img', img);
app.use('/filter', filter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});


module.exports = app;
