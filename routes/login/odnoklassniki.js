var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/',
    passport.authenticate('odnoklassniki', { scope: ['user_status', 'user_checkins'] }),
    function(req, res){
        // The request will be redirected to Odnoklassniki for authentication, with
        // extended permissions.
    });

router.get('/callback', passport.authenticate('odnoklassniki', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/');
    });

module.exports = router;