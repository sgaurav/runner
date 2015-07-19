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


function buildQuery(spec) {
  var query = moQuery.sql(spec);

  return {
    stmt: query.toString().replace(/\$\d+/g, '?').replace(/"/g, ''),
    values: query.values
  };
};

function getDisposableConn(poolId) {
  return pools[poolId]
  .getConnectionAsync()
  .disposer(function(conn) {
    conn.release();
  });
};

function getTranscation(poolId) {
  return new Promise(function(resolve, reject) {
    pools[poolId || 'vrm'].getConnection(function(err, conn) {
      if(err) return reject(err);
      conn.beginTransaction(function(err) {
        return err ? reject(err) : resolve(conn);
      });
    });
  })
  .disposer(function(conn, promise) {
    if(promise.isFulfilled()) {
      return conn.commitAsync().finally(release);
    }
    else {
      return conn.rollbackAsync().finally(release);
    }
    
    function release() {
      conn.release();
    }
  });
};

function execute(spec, conn) {
  var query = buildQuery(spec);

  function _queryWithConn(cn) {
    return cn.queryAsync(query.stmt, query.values);
  }
  return conn && 'string' !== typeof conn
    ? _queryWithConn(conn)
    : using(getDisposableConn(conn), _queryWithConn);
}

module.exports = {
  execute: execute,
  getDisposableConn: getDisposableConn,
  getTranscation: getTranscation
};