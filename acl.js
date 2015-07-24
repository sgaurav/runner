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

// Get all permissions granted to mentioned user id.
function getPermissions(id){
  return allowedPermissions(id, ['users', 'tasks']).then(function(permissions){
    return permissions;
  })
  .catch(function(err){
    return null;
  });
};

//Set a role to a user id
function setRole(id, roles){
  return addUserRoles(id, roles).then(function(){
    return true;
  })
  .catch(function(err){
    return false;
  });
};

// Unset a role from a user id
function unsetRole(id, roles){
  return removeUserRoles(id, roles).then(function(){
    return true;
  })
  .catch(function(err){
    return false;
  });
};

// Custom logger passed while ACL initialization.
// This can be used to pass data to audit table else stored in flat files.
function logger() {
  return {
    debug: function(msg) {
      console.log('-DEBUG-', msg);
    }
  };
};

// ACL Express Middleware derivative, introduces attribute level checks
function bouncer(numPathComponents, userId){

  var HttpError = function(errorCode, msg){
    this.errorCode = errorCode;
    this.msg = msg;

    Error.captureStackTrace(this, arguments);
    Error.call(this, msg);
  };

  return function(req, res, next){
    var _userId = userId,
        resource,
        url;

    // call function to fetch userId
    if(typeof userId === 'function'){
      _userId = userId(req, res);
    }
    if (!userId) {
      if((req.session) && (req.session.userId)){
        _userId = req.session.userId;
      }else{
        next(new HttpError(401, 'User not authenticated'));
        return;
      }
    }

    // Additional check - should be handled a layer up.
    if (!_userId) {
      next(new HttpError(401, 'User not authenticated'));
      return;
    }

    url = req.url.split('?')[0];
    if(!numPathComponents){
      resource = url;
    }else{
      resource = url.split('/').slice(0,numPathComponents+1).join('/');
    }

    if(!actions){
      actions = req.method.toLowerCase();
    }

    acl.logger?acl.logger.debug('Requesting '+actions+' on '+resource+' by user '+_userId):null;

    acl.isAllowed(_userId, resource, actions, function(err, allowed){
      if (err){
        next(new Error('Error checking permissions to access resource'));
      }else if(allowed === false){
        acl.logger?acl.logger.debug('Not allowed '+actions+' on '+resource+' by user '+_userId):null;
        acl.allowedPermissions(_userId, resource, function(err, obj){
          acl.logger?acl.logger.debug('Allowed permissions: '+util.inspect(obj)):null;
        });
        next(new HttpError(403,'Insufficient permissions to access resource'));
      }else{
        // add attribute level check here
        acl.logger?acl.logger.debug('Allowed '+actions+' on '+resource+' by user '+_userId):null;
        next();
      }
    });
  };
};

// Generate promise chain for setting user permissions
function allowedPermissions(id, resources) {
  return new Promise(function(resolve, reject) {
    acl.allowedPermissions(id, resources, function(err, resp) {
      return err ? reject(err) : resolve(resp);
    });
  });
};

// Generate promise chain for adding user roles
function addUserRoles(id, roles) {
  return new Promise(function(resolve, reject) {
    acl.addUserRoles(id, roles, function(err) {
      return err ? reject(err) : resolve(true);
    });
  });
};

// Generate promise chain for unsetting user roles
function removeUserRoles(id, roles) {
  return new Promise(function(resolve, reject) {
    acl.removeUserRoles(id, roles, function(err) {
      return err ? reject(err) : resolve(true);
    });
  });
};