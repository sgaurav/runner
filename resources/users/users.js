var Promise = require('bluebird');
var bcrypt = require('bcrypt');

var db = require('../../db');
var contract = require('../../utils/contract');
var utils = require('../../utils/utils');

// select * from users u, userdetails ud where ud.userid = u.id and u.isactive = true limit 10 offset 10;

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

function post(username, password, creator){
  //save user info
  var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  return Promise.using(db.getTranscation('db'), function(dbTx) {
    return db.execute({
      type: 'insert',
      table: 'users',
      values: {
        'username': username,
        'password': hash,
        'createdby': creator,
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
          'createdby': creator,
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