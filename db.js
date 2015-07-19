var mysql = require('mysql');
var moQuery = require('mongo-sql');
var Promise = require("bluebird");
var using = Promise.using;

Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var conf = require('./conf');

var pools = {};
pools.db = mysql.createPool(conf.mysql);


function prepQuery(spec) {
  var query = moQuery.sql(spec);

  return {
    stmt: query.toString().replace(/\$\d+/g, '?').replace(/"/g, ''),
    values: query.values
  };
};
