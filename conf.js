/**
 * Configuration data goes here.
 */

var sessions = require("client-sessions");

var conf = module.exports = {
  SITE_SECRET: getFromEnv('SITE_SECRET'),
  REDIS_HOST: getFromEnv('REDIS_HOST'),
  REDIS_PORT: getFromEnv('REDIS_PORT'),
  PORT: getFromEnv('PORT'),
  API_BASE: '/api/v1/'
};

conf.signedCookie = sessions({
  cookieName: 'runner.auth',
  requestKey: 'session',
  secret: conf.SITE_SECRET,
  duration: 24 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 15,
  cookie: {
    httpOnly: true
  }
});

conf.mysql = {
  host: getFromEnv('MYSQL_HOST'),
  database: getFromEnv('MYSQL_DB'),
  user: getFromEnv('MYSQL_USER'),
  password: getFromEnv('MYSQL_PASS')
};

function getFromEnv(key){
  if(!(key in process.env)){
    throw new Error ('Environment Variable ' + key + ' not present. Server will not starts.');
  }
  return process.env[key];
};