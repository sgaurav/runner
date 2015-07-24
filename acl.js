/**
 * ACL Layer for server. Uses Node ACL for resource level access control.
 * Attribute level controls are achieved using custom express middleware
 * built on top of acl middleware.
 */

var node_acl = require('acl');
var conf = require('./conf');
var redis = require('./redis');

var opts = {
  no_ready_check: true
};

var redisClient = redis.connect(opts);
var redisBackend = new node_acl.redisBackend(redisClient);

// initialize ACL with a logger.
var acl = new node_acl(redisBackend, logger());

var assignRoles = function() {
  acl.allow([{
    roles: 'admin',
    allows: [{
      resources: 'users',
      permissions: ['post', 'delete']
    }]
  }, {
    roles: 'author',
    allows: [{
      resources: 'tasks',
      permissions: ['post', 'delete']
    }]
  }, {
    roles: 'runner',
    allows: [{
      resources: 'users',
      permissions: ['get', 'put']
    }, {
      resources: 'tasks',
      permissions: ['get', 'put']
    }]
  }]);

  // Inherit roles
  //admin can do everything that author can do.
  // author can do everything that runner can do.
  acl.addRoleParents('admin', 'author');
  acl.addRoleParents('author', 'runner');
};

function logger() {
  return {
    debug: function(msg) {
      console.log('-DEBUG-', msg);
    }
  };
};