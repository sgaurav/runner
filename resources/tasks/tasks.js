var Promise = require('bluebird');
var db = require('../../db');

function get(){
  // get task status
  return true;
};

function patch(params){
  // update task status
  return true;
};

module.exports= {
  fetch: get,
  update: patch
};