var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');
var load_image = require('./LoadImage');

router.post('/', function(req, res, next) {
    var foldername = '';//'folder' + req.user.id.toString() + '1' + '1';

    if (req.body.operation == 'продать') {
        if (req.body.object_ == 'квартира'){
            foldername = 'folder' + req.user.id.toString() + '1' + '1';
            }
        if (req.body.object_ == 'дом/таунхаус'){
            foldername = 'folder' + req.user.id.toString() + '1' + '5';
        }
        if (req.body.object_ == 'участок'){
            foldername = 'folder' + req.user.id.toString() + '1' + '4';
        }
    }
    if (req.body.operation == 'сдать в аренду')
    {
        if (req.body.object == 'квартира'){
            foldername = 'folder' + req.user.id.toString() + '2' + '1';
        }
        if (req.body.object_ == 'дом/таунхаус'){
            foldername = 'folder' + req.user.id.toString() + '2' + '5';
        }
        if (req.body.object == 'оффис'){
            foldername = 'folder' + req.user.id.toString() + '2' + '2';
        }
    }
    if (req.body.operation == 'продать/сдать в аренду') {
        if (req.body.object == 'гараж') {
            foldername = 'folder' + req.user.id.toString() + '3' + '3';
        }
    }
    if (foldername != '') {
        load_image(req, res, foldername);
    }
});