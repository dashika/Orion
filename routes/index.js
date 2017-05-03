var express = require('express');
var router = express.Router(),
    fs = require('fs');
var requireJade = require('../boot/requireJade');
var path = require('path').join(__dirname, '../');

/* GET home page. */
router.get('/', function(req, res) {
   // res.render('views/layout', { require: requireJade(), path: path });
    fs.readFile(__dirname + '/client.html', function(err, data) {
        if (err) {
            console.log(err);
            res.writeHead(500);
            return res.end('Error loading client.html');
        }
        res.writeHead(200);
        res.end(data);
    });
});

module.exports = router;
