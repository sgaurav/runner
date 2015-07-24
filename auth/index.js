var conf = require('../conf');
var authorize = require('./auth');

var auth = module.exports = function(app){
  app.post(conf.API_BASE + 'auth/login', doLogin);
  app.get(conf.API_BASE + 'auth/logout', doLogout);
};

function doLogin(req, res, next){
  var username = req.body.username;
  var password = req.body.password;
  
  authorize.login(username, password).then(function(result){
    if(result){
      req.session.user = {
        username: username,
        userid: result.id
      };
      res.status(200).send({
        status: 'OK',
        data: {
          'login': true
        }
      });
    }
    else {
      res.status(400).send({
        status: 'ERROR',
        message: 'LOGIN FAILED'
      });
    }
  })
  .catch(function(err){
    res.sendStatus(500);
  });
};

function doLogout(req, res, next){
  var username = req.query.username;
  authorize.logout(username).then(function(result){
    if(result){
      res.sendStatus(200);
    }
  });
};