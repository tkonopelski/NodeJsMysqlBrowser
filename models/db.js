var mysql = require('mysql');

var config = require('../config/config.db');


// https://www.diycode.cc/projects/felixge/node-mysql

//local mysql db connection
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'tomek',
    password : 'tomek',
    database : 'muzea'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;