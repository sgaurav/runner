var _ = require('lodash');

var conf = require('../../conf');
var users = require('./users');
var acl = require('../../acl');

// FIXME -- CHECK API AUTH HERE
module.exports = function(app){
  // resource level calls
  app.get(conf.API_BASE + 'users', acl.bouncer(), findUsers);
  app.post(conf.API_BASE + 'users', acl.bouncer(), userInfo);

  // attribute specific calls
  app.get(conf.API_BASE + 'users/:id', acl.bouncer(), userInfo);
  app.patch(conf.API_BASE + 'users/:id', userUpdate);
  app.delete(conf.API_BASE + 'users/:id', userDelete);
};

function findUsers(req, res, next){
  var defaults = {
    limit: '10',
    offset: '0',
    isActive: 'TRUE',
    userId: null,
    name: null,
    contactNumber: null,
    email: null,
    userType: null,
    isOnline: null,
    isavailable: null
  };

  var params = _.assign(defaults, req.query);
  params.limit = parseInt(params.limit) > 1000 ? 1000 : params.limit;
  params = _.removeFalsies(params);

  //extract limit and offset
  var limit = parseInt(params.limit);
  var offset = parseInt(params.offset);

  //delete keys from object
  delete params.limit;
  delete params.offset;

  return users.fetchAll(params, limit, offset)
  .then(function(result){
    res.status(200).send({
      status: 'OK',
      data: result.rows
    });
  })
  .catch(function(err){
    console.log(err.routine);
    var msg = 'Something went wrong, please try again.';
    if(err.routine === 'errorMissingColumn') msg = 'Invalid column specified else no access to column.'
    return res.status(401).send({
      status: 'ERROR',
      message: msg
    });
  });
};

function userInfo(req, res, next){
  users.fetchOne()
  // .then(function(result){
    // get user profile data and send back
    return res.status(200).send({
      status: 'OK',
      data: {

      }
  })
};

function userUpdate(req, res, next){
  var params = req.body.params;
  return users.patch(params).then(function(result){
    return res.send(200);
  })
};

function userDelete(req, res, next){
  return res.send(200)
};

// custom lodash function to check for falsies and remove them
var removeFalsies = function (obj) {
  return _.transform(obj, function (o, v, k) {
    if (v && typeof v === 'object') {
      o[k] = _.removeFalsies(v);
    } else if (v !== null) {
      o[k] = v;
    }
  });
};
_.mixin({ 'removeFalsies': removeFalsies });