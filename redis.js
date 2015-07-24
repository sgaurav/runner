/**
 * Redis connection to be used with ACL for now
 */

var redis = require('redis');
var conf = require('./conf');

function connect(){
    return redis.createClient(conf.REDIS_PORT, conf.REDIS_HOST, {no_ready_check: true});
};

module.exports = {
    connect: connect
};