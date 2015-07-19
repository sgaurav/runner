var sessions = require("client-sessions");

var conf = module.exports = {
  SITE_SECRET: getFromEnv('SITE_SECRET'),
  MYSQL_HOST: getFromEnv('MYSQL_HOST'),
  MYSQL_DB: getFromEnv('MYSQL_DB'),
  MYSQL_USER: getFromEnv('MYSQL_USER'),
  MYSQL_PASS: getFromEnv('MYSQL_PASS')
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
  host: conf.MYSQL_HOST,
  database: conf.MYSQL_DB,
  user: conf.MYSQL_USER,
  password: conf.MYSQL_PASS
};

function getFromEnv(key){
  if(!(key in process.env)){
    throw new Error ('Environment Variable ' + key + ' not present. Server will not starts.');
  }
  return process.env[key];
};