"use strict";
var mysql = require('mysql');
var path = require('path');

var base = path.join(__dirname, '../')
var config = require(base + 'config');


var mysqlConn = mysql.createPool({
    connectionLimit : 10,
    host : config.db.mysql.host,
    user : config.db.mysql.user,
    password : config.db.mysql.password,
    debug : false,
    dateStrings : 'date'
});

exports.mysqlConn = mysqlConn;

