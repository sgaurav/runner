var conf = require('../../conf');
var authorize = require('./auth');

var auth = module.exports = function(app){
  app.post(conf.API_BASE + 'auth/login', doLogin);
  app.get(conf.API_BASE + 'auth/logout', doLogout);
};

function doLogin(req, res, next){
  var username = req.body.username;
  var password = req.body.password;
  
  authorize.login(username, password).then(function(result){
    res.sendStatus(200);
  });
};

function doLogout(req, res, next){
  var username = req.query.username;
  authorize.logout(username).then(function(result){
    res.send(200);
  });
};