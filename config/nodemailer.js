var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'belyaev1969@gmail.com',
        pass: '111aaaandrey'
    }
});

module.exports = transporter;