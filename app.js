"use strict";

var http = require('http');
var path = require('path');
var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var morgan = require('morgan');
var logger = require('bunyan');

var config = require('./config');

var app = express();
var router = express.Router();
var env = process.env.NODE_ENV || 'development';


//Init
app.set('port', process.env.PORT || config.port);
app.set('env',env);
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



app.use(router);

// Routes
require('./routes')(router);


var server = http.createServer(app);
server.on('error',function(err){
  util.log("Server ERR: "+ err);
  process.exit(0);
});

server.listen(app.get('port'), function(){
  util.log("Survey server listening on port " + app.get('port') + ' in ' + app.get('env'));
});

