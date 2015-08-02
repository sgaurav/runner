var Promise = require('bluebird');
var bcrypt = require('bcrypt');

var db = require('../../db');
var contract = require('../../utils/contract');
var utils = require('../../utils/utils');

function findAll(params, limit, offset){
  // get list of tasks as per limit, offset and params
  var ref = {
    pickupname: 'tasks.pickupname',
    pickupcontact: 'tasks.pickupcontact',
    pickuplocation: 'tasks.pickuplocation',
    pickuptime: 'tasks.pickuptime',
    pickupgps: 'tasks.pickupgps',
    dropname: 'tasks.dropname',
    dropcontact: 'tasks.dropcontact',
    droplocation: 'tasks.droplocation',
    droptime: 'tasks.droptime',
    dropgps: 'tasks.dropgps',
    runnerid: 'taskstracker.runnerid',
    isconfirmed: 'taskstracker.isconfirmed',
    confirmedon: 'taskstracker.confirmedon',
    confirmedby: 'taskstracker.confirmedby',
    isrunnerassigned: 'taskstracker.isrunnerassigned',
    runnerassignedon: 'taskstracker.runnerassignedon',
    runnerassignedby: 'taskstracker.runnerassignedby',
    isatpickup: 'taskstracker.isatpickup',
    pickupreachtime: 'taskstracker.pickupreachtime',
    pickupreachupdatedby: 'taskstracker.pickupreachupdatedby',
    pickupgps: 'taskstracker.pickupgps',
    isshipped: 'taskstracker.isshipped',
    shipstarttime: 'taskstracker.shipstarttime',
    shipstartupdatedby: 'taskstracker.shipstartupdatedby',
    shipstartgps: 'taskstracker.shipstartgps',
    isdelivered: 'taskstracker.isdelivered',
    deliverytime: 'taskstracker.deliverytime',
    deliveryupdatedby: 'taskstracker.deliveryupdatedby',
    deliverygps: 'taskstracker.deliverygps',
    iscanceled: 'taskstracker.iscanceled'
  };

  params =  utils.aliases(params, ref);
  params['tasks.id'] = '$taskstracker.taskid$';

  var columns = utils.getValues(ref);

  return db.execute({
    type: 'select',
    table: ['tasks', 'taskstracker'],
    columns: columns,
    where: params,
    limit: limit,
    offset: offset
  });
};

function get(id){
  // get details of a single task
  var params = {
    'tasks.id': '$taskstracker.taskid$',
    'tasks.id': id
  }
  return db.execute({
    type: 'select',
    table: ['tasks', 'taskstracker'],
    columns: ['tasks.id', 'tasks.orderid', 'tasks.pickuplocation', 'tasks.pickuptime', 'tasks.pickupgps', 'tasks.droplocation', 'tasks.droptime', 'tasks.dropgps', 'tasks.specialinstruction', 'tasks.pickupname', 'tasks.pickupcontact', 'tasks.dropname', 'tasks.dropcontact', 'taskstracker.runnerid', 'taskstracker.isconfirmed', 'taskstracker.confirmedon', 'taskstracker.confirmedby', 'taskstracker.isrunnerassigned', 'taskstracker.runnerassignedon', 'taskstracker.runnerassignedby', 'taskstracker.isatpickup', 'taskstracker.pickupreachtime', 'taskstracker.pickupreachupdatedby', 'taskstracker.pickupgps', 'taskstracker.isshipped', 'taskstracker.shipstarttime', 'taskstracker.shipstartupdatedby', 'taskstracker.shipstartgps', 'taskstracker.isdelivered', 'taskstracker.deliverytime', 'taskstracker.deliveryupdatedby', 'taskstracker.deliverygps', 'taskstracker.remark', 'taskstracker.iscanceled'],
    where: params
  });
};

function post(params, createdby){
  // create new task
  var ref = {
    orderid: 'tasks.orderid',
    pickupname: 'tasks.pickupname',
    pickupcontact: 'tasks.pickupcontact',
    pickuplocation: 'tasks.pickuplocation',
    pickuptime: 'tasks.pickuptime',
    pickupgps: 'tasks.pickupgps',
    dropname: 'tasks.dropname',
    dropcontact: 'tasks.dropcontact',
    droplocation: 'tasks.droplocation',
    droptime: 'tasks.droptime',
    dropgps: 'tasks.dropgps',
    specialinstruction: 'tasks.specialinstruction'
  };
  params =  utils.aliases(params, ref);
  params.createdby = createdby;
  params.createdon = 'now()';

  return Promise.using(db.getTranscation('db'), function(dbTx) {
    return db.execute({
      type: 'insert',
      table: 'tasks',
      values: params,
      returning: ['id']
    }, dbTx)
    .then(function(result) {
      var taskid = result.rows[0].id;
      return db.execute({
        type: 'insert',
        table: 'taskstracker',
        values: {
          'taskid': taskid,
          'createdby': createdby,
          'createdon': 'now()'
        }
      }, dbTx);
    });
  });
};

function patch(params){
  // update task info
  return true;
};

function remove(id, updatedby){
  return db.execute({
    type: 'update',
    table: 'taskstracker',
    values: {
      'iscanceled': 'FALSE',
      'updatedby': updatedby,
      'updatedon': 'now()'
    },
    where: {
      'taskid': id
    }
  });
}

module.exports = {
  fetchAll: findAll,
  create: post,
  fetchOne: get,
  update: patch,
  remove: remove
};