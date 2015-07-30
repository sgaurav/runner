var Promise = require('bluebird');
var db = require('../../db');
var contract = require('../../utils/contract');

// select * from users u, userdetails ud where ud.userid = u.id and u.isactive = true limit 10 offset 10;

function findAll(params, limit, offset){
  params['users.id'] = '$userdetails.userid$';

  return db.execute({
    type: 'select',
    table: ['users', 'userdetails'],
    columns: ['userdetails.userid', 'userdetails.name', 'userdetails.contactnumber', 'userdetails.email', 'userdetails.usertype', 'userdetails.isonline', 'userdetails.isavailable'],
    where: {
      'users.id': '$userdetails.userid$'
    },
    limit: limit,
    offset: offset
  });
};

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
  fetchAll: findAll,
  create: post,
  fetchOne: get,
  update: patch,
  remove: remove
};