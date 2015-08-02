var Promise = require('bluebird');
var bcrypt = require('bcrypt');

var db = require('../../db');
var contract = require('../../utils/contract');
var utils = require('../../utils/utils');

function findAll(params, limit, offset){
  // get list of users according to limit and offset
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

function post(username, hash, createdby){
  //save user info
  return Promise.using(db.getTranscation('db'), function(dbTx) {
    return db.execute({
      type: 'insert',
      table: 'users',
      values: {
        'username': username,
        'password': hash,
        'createdby': createdby,
        'createdon': 'now()'
      },
      returning: ['id']
    }, dbTx)
    .then(function(result) {
      var userid = result.rows[0].id;
      return db.execute({
        type: 'insert',
        table: 'userdetails',
        values: {
          'userid': userid,
          'name': username,
          'createdby': createdby,
          'createdon': 'now()'
        }
      }, dbTx);
    });
  });
};

function patch(params){
  // update user info
  return true;
};

function remove(id, updatedby){
  // delete user
  return Promise.using(db.getTranscation('db'), function(dbTx) {
    return db.execute({
      type: 'update',
      table: 'users',
      values: {
        'isactive': 'FALSE',
        'updatedby': updatedby,
        'updatedon': 'now()'
      },
      where: {
        'users.id': id
      }
    }, dbTx)
    .then(function(result) {
      return db.execute({
        type: 'update',
        table: 'userdetails',
        values: {
          'isonline': 'FALSE',
          'isavailable': 'FALSE',
          'updatedby': updatedby,
          'updatedon': 'now()'
        },
        where: {
        'userdetails.userid': id
      }
      }, dbTx);
    });
  });
}

module.exports = {
  fetchAll: findAll,
  create: post,
  fetchOne: get,
  update: patch,
  remove: remove
};