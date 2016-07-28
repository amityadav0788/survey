var config = require(global.__base + '/config.js');
var mongoose = require('mongoose');

var MongoDB = function(log) {
	this.log = log || console;
	var index = 0;
	this.connection_string = "mongodb://";

	for(index = 0; index < config.db.mongodb.servers.length; ++index) {
		this.connection_string += config.db.mongodb.servers[index].host 
						+ ":" + config.db.mongodb.servers[index].port;
		this.connection_string += ',';
	}
	this.connection_string = this.connection_string.slice(0, -1);
	this.connection_string += '/';

	this.connection_string += config.db.mongodb.db_name + '?replicaSet=' + config.db.mongodb.replica_set;
};

MongoDB.prototype.init = function(callback) {
	var self = this;
	mongoose.connect(this.connection_string, config.db.mongodb.db_options, function(err) {
		if(err) {
			self.log.error({error: err}, 'Error occurred while connecting to mongodb');
			callback(err);
		} else {
			self.log.info('Successfully connected to mongodb');
			callback(null, true);
		}
	});
}

module.exports = MongoDB;
