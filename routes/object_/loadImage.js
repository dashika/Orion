var express = require('express');
var router = express.Router();
var aws = require('aws-sdk');
var crypto = require('crypto');
aws.config.loadFromPath('./AwsConfig.json');
var BUCKET_NAME = 'orionphoto';

//router.post('/', function(req, res, next) {
module.exports =  function LoadImage(req, res, foldername){
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
    var  image_name =  crypto.randomBytes(16).toString('hex') + filename.substring(filename.lastIndexOf('.'), filename.length);
        if (!filename) {
            // If there's no file
            return false;
        }
        file.fileRead = [];
        file.on('data', function(chunk) {
            // Push chunks into the fileRead array
            this.fileRead.push(chunk);
        });
        file.on('error', function(err) {
            console.log('Error while buffering the stream: ', err);
        });
        file.on('end', function() {
            // Concat the chunks into a Buffer
            var image = Buffer.concat(this.fileRead);
            var s3 = new aws.S3();

            s3.createBucket(function () {
                var params = {Bucket: BUCKET_NAME, Key:  foldername+'/'+image_name, Body: image};
                // Put the object into the bucket.
                s3.putObject(params, function (err) {
                    if (err) {
                        res.writeHead(403, {'Content-Type': 'text/plain'});
                        res.write("Error uploading data");
                        res.end()
                    } else {
                        /// get url from loaded photo
                        var urlParams = {Bucket: BUCKET_NAME, Key: foldername+'/'+image_name+'.jpg'};
                        s3.getSignedUrl('getObject', urlParams, function (err, url) {
                            console.log('the url of the image is', url);
                        });
                        /// get all from bucket
                        var params = {Bucket: BUCKET_NAME};
                        s3.listObjects(params, function(err, data){
                            var bucketContents = data.Contents;
                            for (var i = 0; i < bucketContents.length; i++){
                                var urlParams = {Bucket: BUCKET_NAME, Key: bucketContents[i].Key};
                                s3.getSignedUrl('getObject',urlParams, function(err, url){
                                    console.log('the url of the image is', url);
                                });
                            }
                        });
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.write("Success");
                        res.end()
                    }
                });

            });
        });
    });
};