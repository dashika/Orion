var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', passport.authenticate('facebook'));

router.get('/callback',
    passport.authenticate('facebook', { successRedirect: '/',
        failureRedirect: function(req, res) {
            //someyhing doing
        }
    }));

module.exports = router;