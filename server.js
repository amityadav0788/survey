var async = require('async');

var config = require(global.__base + 'config.js');
var MongoDB = require(global.__base + '/data/db/mongodb.js');
var Redis = require(global.__base + '/data/db/redis.js');
var cluster = require('cluster');
var bunyan = require('bunyan');
var log, mongodb, redis;
var verticals = config.verticals || ['packages'];

var ota_switches = {}
var nodeId = 0;
if(cluster.isWorker) {
	nodeId = cluster.worker.id;
}
var heavyLogger = bunyan.createLogger({name: 'travel',    streams: [
	{
		type: 'rotating-file',
		path: __base+'logs/otaResponses' + nodeId + '.log',
		level: "trace",
		period: '600000ms', // 10 mins, because heavyLogger stays in memory.
		count: 10
	}
]});

var Server = function(temp_log) {
	log = temp_log;
	mongodb = new MongoDB(log);
	redis = new Redis(log);
}

Server.prototype.init = function(callback) {
	var self = this;

	async.parallel([function(cb) {
		mongodb.init(cb);
	}, function(cb) {
		redis.init(cb);
	}, function(cb) {
		//Flights specific initialization
		// if(verticals.indexOf('flights') >= 0) {
		// 	var flightsElasticSearch = require(global.__base + '/handlers/flights/misc/elasticsearch.js');
		// 	var helpers = require(global.__base + '/handlers/flights/helpers/helpers.js');

		// 	ota_switches[helpers.providers.goibibo] = (Number(config.ota_switches.flights[helpers.providers.goibibo]) === 1);
		// 	ota_switches[helpers.providers.ezeego] = (Number(config.ota_switches.flights[helpers.providers.ezeego]) === 1);
		// 	cb();
/*			flightsElasticSearch.init(function(err) {
				if(err) {
					cb(err);
				} else {
					cb();
				}
			});*/
		// 	cb();
		// } else {
		// 	cb();
		// }
		cb();
	}, function(cb) {
		//Trains specific initialization
		// if(verticals.indexOf('trains') >= 0) {
		// 	cb();
		// } else {
		// 	cb();
		// }
	}, function(cb) {
		//Package specific initialization
		if(verticals.indexOf('packages') >= 0) {
			// global.__hotelsRoutes = global.__base + 'routes/hotels/';
			// global.__hotelsHandlers = global.__base + 'handlers/hotels/';


			cb();
		} else {
			cb();
		}
	}], function(err, data) {
		if(err) {
			callback(err);
		} else {
			callback(null);
		}
	});
}

Server.prototype.faviconHandler = function(req, res, next) {
	if(req.url === '/favicon.ico') {
		res.status(200).send();
	} else {
		next()
	}
}

Server.prototype.domainRestrict = function(req, res, next) {
	//Allowed Domains
	var origin = req.headers.origin;
	if(config.isProduction){
		if(config.allowedDomains.indexOf(origin) >= 0){
			res.header('Access-Control-Allow-Origin', origin);
			res.header('Access-Control-Allow-Credentials', 'true');
		}
	} else {
		res.header('Access-Control-Allow-Origin', origin);
		res.header('Access-Control-Allow-Credentials', 'true');
	}
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,auth');
	next();
}

Server.prototype.dataLoader = function(req, res, next) {
	var self = this;
	req.log = log.child({clientId: (req.query.deviceIdentifier || 'Unknown'),
						remoteIp: req.headers['x-real-ip'],
						clientIp: req.headers['x-forwarded-for'],
						route: req.baseUrl + req.path});

	req.heavyLogger = heavyLogger.child({clientId: req.query.deviceIdentifier || 'Unknown',
						remoteIp:req.headers['x-real-ip'],
						clientIp:req.headers['x-forwarded-for'],
						route:req.baseUrl + req.path});

	req.startTime = new Date();
	req.slave_redis = redis.fetchSlave();
	req.master_redis = redis.fetchMaster();
	req.verticals = verticals;
	req.ota_switches = ota_switches;
	next();
}

module.exports = Server;
