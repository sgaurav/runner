/**
 * Redis connection to be used with ACL for now
 */

var redis = require('redis');
var conf = require('./conf');

function connect(options){
    return redis.createClient(conf.REDIS_PORT, conf.REDIS_HOST, options);
};

module.exports = {
    connect: connect
};