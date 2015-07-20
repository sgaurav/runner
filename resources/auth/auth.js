var Promise = require('bluebird');
var db = require('../../db');

function checkLogin(username, password){
  return Promise.using(db.getTranscation('db'), function(dbTx) {
    return db.execute({
      type: 'select',
      table: 'users',
      where: {
        username: username,
        password: password
      }
    }, dbTx)
    .spread(function(result) {
      return result.length?true:false;
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