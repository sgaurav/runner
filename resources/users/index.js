var conf = require('../../conf');
var users = require('./users');
var status = require('./status');

// FIXME -- CHECK API AUTH HERE
module.exports = function(app){
  app.get(conf.API_BASE + 'users', userInfo);
  app.patch(conf.API_BASE + 'users', userUpdate);
  app.delete(conf.API_BASE + 'users', userDelete);

  // users/status
  app.get(conf.API_BASE + 'users/status', statusInfo);
  app.patch(conf.API_BASE + 'users/status', statusUpdate);
};

function userInfo(req, res, next){
  users.fetch().then(function(result){
    // get user profile data and send back
    return res.status(200).send({
      status: 'OK',
      data: {

      }
    });
  })
  .catch(function(err){
    return res.status(500).send({
      status: 'ERROR',
      message: 'Something went wrong'
    });
  });
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

function statusInfo(req, res, next){
  return status.fetch().then(function(result){
    return res.status(200).send({
      status: 'OK',
      data: {
        online: 'true'
      }
    });
  })
  .catch(function(err){
    return res.status(500).send({
      status: 'ERROR',
      message: 'Something went wrong'
    });
  });
};

function statusUpdate(req, res, next){
  var params = req.body.params;
  return status.update(params).then(function(result){
    return res.sendStatus(200);
  })
  .catch(function(err){
    return res.status(500).send({
      status: 'ERROR',
      message: 'Something went wrong'
    });
  });
};