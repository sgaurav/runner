var Promise = require('bluebird');
var bcrypt = require('bcryptjs');
var db = require('../db');

function checkLogin(username, password) {
  return Promise.using(db.getTranscation('db'), function(dbTx) {
    return db.execute({
      type: 'select',
      table: 'Users',
      columns: ['Id', 'Password']
      where: {
        username: username
      }
    }, dbTx)
    .spread(function(result) {
      var hash = result[0].Password;
      var userid = result[0].Id;
      var match = bcrypt.compareSync(password, hash);
      return match ? {'id': userid} : false;
    });
  });
};

function doLogout(username) {
  return true;
};

module.exports = {
  login: checkLogin,
  logout: doLogout
};