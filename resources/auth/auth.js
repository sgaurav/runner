var Promise = require('bluebird');
var db = require('../../db');
var conf = require('../../conf');

function checkLogin(username, password){
  return Promise.using(mdb.getTrxn(conf.MYSQL_DB), function(dbTx) {
    return mdb.runSql({
      type: 'select',
      table: 'users',
      values: {
        username: username,
        password: password
      }
    }, dbTx)
    .spread(function(result) {
      return result.insertId;
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