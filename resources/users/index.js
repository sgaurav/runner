var conf = require('../../conf');
var users = require('./users');
var acl = require('../../acl');

// FIXME -- CHECK API AUTH HERE
module.exports = function(app){
  app.get(conf.API_BASE + 'users', acl.bouncer(), userInfo);
  app.patch(conf.API_BASE + 'users', userUpdate);
  app.delete(conf.API_BASE + 'users', userDelete);
};

function userInfo(req, res, next){
  users.fetch()
  // .then(function(result){
    // get user profile data and send back
    return res.status(200).send({
      status: 'OK',
      data: {

      }
    // });
  })
  // .catch(function(err){
  //   return res.status(500).send({
  //     status: 'ERROR',
  //     message: 'Something went wrong'
  //   });
  // });
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