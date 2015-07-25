var Promise = require('bluebird');
var db = require('../../db');

function get(){
  // get user info
  return true;
};

function post(){
  //save user info
  return true;
};

function patch(params){
  // update user info
  return true;
};

function remove(){
  // delete user info
  return true;
}

module.exports = {
  fetch: get,
  create: post,
  update: patch,
  remove: remove
};