var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', passport.authenticate('vkontakte'),
    function(req, res){});

router.get('/callback', passport.authenticate('vkontakte', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/');
    });

module.exports = router;