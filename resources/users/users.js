var Promise = require('bluebird');

var db = require('../../db');
var contract = require('../../utils/contract');
var utils = require('../../utils/utils');

// select * from users u, userdetails ud where ud.userid = u.id and u.isactive = true limit 10 offset 10;

function findAll(params, limit, offset){
  var ref = {
    isActive: 'users.isActive',
    userId: 'userdetails.userId',
    name: 'userdetails.name',
    contactNumber: 'userdetails.contactNumber',
    email: 'userdetails.email',
    userType: 'userdetails.userType',
    isOnline: 'userdetails.isOnline',
    isavailable: 'userdetails.isavailable'
  };
  params =  utils.aliases(params, ref);
  params['users.id'] = '$userdetails.userid$';

  return db.execute({
    type: 'select',
    table: ['users', 'userdetails'],
    columns: ['users.username', 'users.isActive', 'userdetails.userid', 'userdetails.name', 'userdetails.contactnumber', 'userdetails.email', 'userdetails.usertype', 'userdetails.isonline', 'userdetails.isavailable'],
    where: params,
    limit: limit,
    offset: offset
  });
};

function get(id){
  // get details of a single user
  var params = {
    'users.id': '$userdetails.userid$',
    'users.id': id
  }
  return db.execute({
    type: 'select',
    table: ['users', 'userdetails'],
    columns: ['users.username', 'users.isActive', 'userdetails.userid', 'userdetails.name', 'userdetails.contactnumber', 'userdetails.email', 'userdetails.usertype', 'userdetails.isonline', 'userdetails.isavailable'],
    where: params
  });
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