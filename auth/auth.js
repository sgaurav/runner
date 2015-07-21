var Promise = require('bluebird');
var bcrypt= require('bcryptjs');
var db = require('../db');

function checkLogin(username, password){
  var hash = 
  return Promise.using(db.getTranscation('db'), function(dbTx) {
    return db.execute({
      type: 'select',
      table: 'users',
      columns: ['password']
      where: {
        username: username
      }
    }, dbTx)
    .spread(function(result) {
      var hash = result[0].password;
      var match = bcrypt.compareSync(password, hash);
      return match;
    });
  });
};

function doLogout(username){
  return true;
};

module.exports= {
  login: checkLogin,
  logout: doLogout
};