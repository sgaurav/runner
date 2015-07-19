/**
 * Express JS Backend server for Runner.
 */

var path = require('path');
process.chdir(path.join(__dirname, '..'));

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var favicon = require("serve-favicon");

var conf = require('./conf');

var app = express();
var httpServer = http.createServer(app);

app.set('case sensitive routing', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(conf.API_BASE, function ie9NoCache(req, res, next) {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.set("Pragma", "no-cache"); // HTTP 1.0.
  res.set("Expires", 0); // Proxies.
  next();
})
// app.use(favicon('favicon.ico'));
app.use(conf.signedCookie);
app.use(compression());

require('./resources/auth')(app);

var port = conf.PORT;
httpServer.listen(port, function () {
  console.log("Express http server listening on port " + port);
});