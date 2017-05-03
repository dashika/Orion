var domain = require('domain');

var serverDomain = domain.create();
serverDomain.on('error', function(err)
{
   console.log(err.message);
});

serverDomain.run(function(){
    var express = require('express');
    var expressSession = require('express-session');
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');

    var cookie = require('cookie');
    var connect = require('connect');
    var MemoryStore = expressSession.MemoryStore,
        sessionStore = new MemoryStore();
    var mysql = require('mysql'),
        connectionsArray = [],
        connection = mysql.createConnection({
            host: '54.69.132.69',
            user: 'sml',
            password: '0272',
            database: 'orion1',
            port: 3306
        }),
        POLLING_INTERVAL = 60000,
        pollingTimer;
    var fs = require('fs');
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

    var app = express();

////////////////////////////////////// возможно это то, что подходит под push-message ->

    var server = require('http').Server(app);
    var io = require('socket.io')(server);

    connection.connect(function(err) {
        console.log(err);
    });

    var pollingLoop = function() {
        var query = connection.query('SELECT * FROM push WHERE id_obj=(?)',[add_new]),
            users = [];
        query
            .on('error', function(err) {
                console.log(err);
                updateSockets(err);
            })
            .on('result', function(user) {
                users.push(user);
            })
            .on('end', function() {
                if (add_new != undefined) {
                     pollingTimer = setTimeout(pollingLoop(), POLLING_INTERVAL);
                     add_new = undefined;
                     updateSockets({
                         users: users
                     });
                }
            });

    };

    var user;
    var add_new;

    io.sockets.on('connection', function(socket) {
        io.set('authorization', function (data, accept) {
            if (!data.headers.cookie) {
                return accept('No cookie transmitted.', false);
            }
            data.cookie = cookieParser.signedCookies(cookie.parse(decodeURIComponent(data.headers.cookie)),'keyboard cat' );
            data.sessionID = data.cookie['express.sid'];

             sessionStore.load(data.sessionID, function (err, session) {
             if (err || !session){ return accept('Error', false); }
             data.session = session;
                 add_new = session.req.session.add_new;
                 user = session.passport.user;
             return accept(null, true);
             });
        });
        //адрес потом поменять!!
       // io.set('origins','localhost:*');
        console.log('Number of connections:' + connectionsArray.length);

            if(user != undefined && add_new != undefined) {
                pollingLoop();
            }

        socket.on('disconnect', function() {
            var socketIndex = connectionsArray.indexOf(socket);
            console.log('socket = ' + socketIndex + ' disconnected');
            if (socketIndex >=0) {
                connectionsArray.splice(socketIndex, 1);
            }
        });
        console.log('A new socket is connected!');
        socket.user = user;
        connectionsArray.push(socket);
    });

    var updateSockets = function(data) {
        // adding the time of the last update
        data.time = new Date();
        connectionsArray.forEach(function(tmpSocket) {
            if(tmpSocket.user == data.users[0].id_perscard != undefined) {
                // for current
                tmpSocket.emit('notification', data);
            }
            // foe all
           // tmpSocket.volatile.emit('notification', data);
        });
    };

    server.listen(8080);

////////////////////////////////////// <- возможно это то, что подходит под push-message

// view engine setup
    app.set('views', path.join(__dirname, 'jade'));
    app.set('view engine', 'jade');

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(expressSession({store: sessionStore, key: 'express.sid', secret: 'keyboard cat'}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(busboy());
    app.use(busboy({
        limits: {
            //не работает этот лимит
            fileSize: 2*1024*1024, //"20mb",
            files: 5
        }
    }));

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
    app.use('/realestate/add', require('./routes/object_/insert_object'));
    app.use('/realestate', require('./routes/object_/filter'));
    app.use('/realestate/marks', require('./routes/object_/get_marks'));
    app.use('/realestate/marks/', require('./routes/object_/get_by_id'));
    app.use('/realestate/', require('./routes/object_/comments'));
    app.use('/realestate/', require('./routes/object_/get_full_inf'));
    app.use('/request/add',require('./routes/request_/insert_request'));
    app.use('/request/', require('./routes/request_/get_request_by_id'));
    app.use('/request/', require('./routes/request_/comments'));
    app.use('/agent', require('./routes/agent/find_agent'));
    app.use('/agent/',require('./routes/agent/getById'));
    app.use('/agent/',require('./routes/agent/comments'));
    app.use('/agent/', require('./routes/agent/get_realtor_obj'));
    app.use('/question', require('./routes/question/find_question'));
    app.use('/question/', require('./routes/question/getById'));
    app.use('/question/', require('./routes/question/comments'));
    app.use('/question/add', require('./routes/question/insert_question'));
    app.use('/myads', require('./routes/my/advert'));
    app.use('/myreq', require('./routes/my/request'));
    app.use('/myquestions', require('./routes/my/question'));
    app.use('/favorite/', require('./routes/favorite/get_favorite'));
    app.use('/myads/', require('./routes/my/get_advert_by_id'));
    app.use('/myads/', require('./routes/my/delete_advert'));
    app.use('/myads/', require('./routes/my/update_advert'));
    app.use('/myads/marks', require('./routes/my/get_marks'));
    app.use('/myads/marks/', require('./routes/my/get_short_inf_ads'));
    app.use('/myreq/', require('./routes/request_/get_request_by_id'));
    app.use('/myreq/', require('./routes/my/delete_request'));
    app.use('/myreq/', require('./routes/my/update_request'));
    app.use('/myquestions', require('./routes/question/getById'));

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
            message: err.message
        });
    });

    module.exports = app;
});
