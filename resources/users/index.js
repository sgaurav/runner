var conf = require('../../conf');
var users = require('./users');

// FIXME -- CHECK API AUTH HERE
module.exports = function(app){
  app.get(conf.API_BASE + 'users/me', userInfo);
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