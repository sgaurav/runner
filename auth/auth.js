var Promise = require('bluebird');
var bcrypt = require('bcrypt');
var db = require('../db');

function checkLogin(username, password) {
  return db.execute({
    type: 'select',
    table: 'Users',
    columns: ['Id', 'Password'],
    where: {
      UserName: username
    }
  })
  .then(function(result) {
    var hash = result.rows[0].password;
    var userid = result.rows[0].id;
    var match = bcrypt.compareSync(password, hash.trim());
    return match ? {'id': userid} : false;
  });
};

function doLogout(username) {
  return true;
};

module.exports = {
  login: checkLogin,
  logout: doLogout
};