/**
 * MySQL connect code using Mongo SQL to generate SQL queries.
 */

// var mysql = require('mysql');
var pg = require('pg')
var moQuery = require('mongo-sql');
var Promise = require("bluebird");
var using = Promise.using;

var conf = require('./conf');

Promise.promisifyAll(pg);
Promise.promisifyAll(require("pg/lib/connection").prototype);
Promise.promisifyAll(require("pg/lib/pool"));

// var db = new pg(conf.postgres);

function buildQuery(spec) {
  var query = moQuery.sql(spec);
  return {
    text: query.toString().replace(/"/g, ''),
    values: query.values
  };
};

function getDisposableConn(trxnId) {
  return new Promise(function(resolve, reject) {
    pg.connect(conf.postgres, function(err, conn, done) {
      return err ? reject(err) : resolve(conn);
    });
  })
  .disposer(function(conn) {
    conn.done;
  });
};

function getTranscation(trxnId) {
  return new Promise(function(resolve, reject) {
    pg.connect(conf.postgres, function(err, conn, done) {
      if(err) return reject(err);
      conn.query('BEGIN', function(err) {
        return err ? reject(err) : resolve(conn);
      });
    });
  })
  .disposer(function(conn, promise) {
    if(promise.isFulfilled()) {
      console.log('commit');
      return conn.queryAsync('COMMIT').finally(conn.done);
    }
    else {
      console.log('rollback');
      return conn.queryAsync('ROLLBACK').finally(conn.done);
    }
    function release() {
      done();
    }
  });
};

function execute(spec, conn) {
  var query = buildQuery(spec);
  console.log(query);
  function _queryWithConn(cn) {
    return cn.queryAsync(query).then(function(result){
      return result;
    });
  }
  return conn && 'string' !== typeof conn
    ? _queryWithConn(conn)
    : using(getDisposableConn(conn), _queryWithConn);
};

module.exports = {
  execute: execute,
  getDisposableConn: getDisposableConn,
  getTranscation: getTranscation
};