var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', passport.authenticate('google',
    { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/callback',
    passport.authenticate('google', {
        successRedirect : '/',
        failureRedirect : '/'
    }));

module.exports = router;