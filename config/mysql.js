var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 10,
    host     : '54.69.132.69',
    user     : 'sml',
    password : '0272',
    database : 'orion1'
});

module.exports = pool;