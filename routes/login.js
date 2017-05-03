var express = require('express');
var router = express.Router();
var passport = require('passport');

router.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            var error = new Error(info.message);
            error.status = 400;
            return next(error);
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            res.json({ name: user.username, email: user.email });
        });
    })(req, res, next);
});

module.exports = router;