"use strict";
var RedisIO = require('ioredis');
var config = require(global.__base + '/config.js');
var events = require('events');

var Redis = function(log) {
	this.log = log || console;
};

module.exports = Redis;

Redis.prototype.init = function(callback) {
	var self = this;
	self.master_redis = new RedisIO(config.cache.redis.master.port, config.cache.redis.master.host);

	self.master_redis.on('error', function(err) {
		self.log.error({error: err}, 'Error occurred while connecting to master redis');
		callback(err);
	});

	self.master_redis.on('connect', function() {
		self.log.info('Successfully connected to master redis');
		self.slave_redis = new RedisIO(config.cache.redis.slaves[0].port, config.cache.redis.slaves[0].host); //TODO: Randomize

		self.slave_redis.on('error', function(err) {
			self.log.error({error: err}, 'Error occurred while connecting to slave redis');
			callback(err);
		});

		self.slave_redis.on('connect', function() {
			self.log.info('Successfully connected to slave redis');
			callback(null, true);
		});
	});
}

Redis.prototype.fetchSlave = function() {
	return this.slave_redis;
}

Redis.prototype.fetchMaster = function() {
	return this.master_redis;
}
