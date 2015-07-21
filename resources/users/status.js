var Promise = require('bluebird');
var db = require('../../db');

function get(){
  // get user status
  return true;
};

function patch(params){
  // update user status
  return true;
};

module.exports= {
  fetch: get,
  update: patch
};