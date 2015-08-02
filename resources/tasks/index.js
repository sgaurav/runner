var _ = require('lodash');

var conf = require('../../conf');
var tasks = require('./tasks');
var acl = require('../../acl');

//FIXME -- API Auth code here
module.exports = function(app){
  // resource level calls
  app.get(conf.API_BASE + 'tasks', acl.bouncer(), findTasks);
  app.post(conf.API_BASE + 'tasks', acl.bouncer(), createTask);

  // attribute specific calls
  app.get(conf.API_BASE + 'tasks/:id', acl.bouncer(), taskInfo);
  app.patch(conf.API_BASE + 'tasks/:id', acl.bouncer(), taskUpdate);
  app.delete(conf.API_BASE + 'tasks/:id', acl.bouncer(), taskDelete);
};

function findTasks(req, res, next){
  // FIXME - ugly and will not serve most of use cases, needs more thoughs.
  var defaults = {
    limit: '10',
    offset: '0',
    pickupname: null,
    pickupcontact: null,
    pickuplocation: null,
    pickuptime: null,
    pickupgps: null,
    dropname: null,
    dropcontact: null,
    droplocation: null,
    droptime: null,
    dropgps: null,
    runnerid: null,
    isconfirmed: null,
    confirmedon: null,
    confirmedby: null,
    isrunnerassigned: null,
    runnerassignedon: null,
    runnerassignedby: null,
    isatpickup: null,
    pickupreachtime: null,
    pickupreachupdatedby: null,
    pickupgps: null,
    isshipped: null,
    shipstarttime: null,
    shipstartupdatedby: null,
    shipstartgps: null,
    isdelivered: null,
    deliverytime: null,
    deliveryupdatedby: null,
    deliverygps: null,
    iscanceled: null
  };

  var params = _.assign(defaults, req.query);
  params = _.removeFalsies(params);

  var limit = parseInt(params.limit);
  var offset = parseInt(params.offset);

  //delete keys from object
  delete params.limit;
  delete params.offset;

  return tasks.fetchAll(params, limit, offset)
  .then(function(result){
    return res.status(200).send({
      status: 'OK',
      data: result.rows
    });
  })
  .catch(function(err){
    return res.status(500).send({
      status: 'ERROR',
      message: 'Something went wrong, please try again.'
    });
  });
};

function createTask(req, res, next){
  var defaults = {
    orderid: null,
    pickupname: null,
    pickupcontact: null,
    pickuplocation: null,
    pickuptime: null,
    pickupgps: null,
    dropname: null,
    dropcontact: null,
    droplocation: null,
    droptime: null,
    dropgps: null,
    specialinstruction: null
  };

  var params = _.assign(defaults, req.body);
  params = _.removeFalsies(params);

  var createdby = req.session.user.userId;

  return tasks.create(params, createdby)
  .then(function(){
    return res.sendStatus(200);
  })
  .catch(function(err){
    return res.status(500).send({
      status: 'ERROR',
      message: 'Something went wrong, please try again.'
    });
  });
};

function taskInfo(req, res, next){
  var id = req.params.id;
  return tasks.fetchOne(id)
  .then(function(result){
    res.status(200).send(result.rows[0]);
  })
  .catch(function(err){
    return res.status(500).send({
      status: 'ERROR',
      message: 'Something went wrong, please try again.'
    });
  });
};

function taskUpdate(req, res, next){
};

function taskDelete(req, res, next){
  var id = req.params.id;
  var updatedby = req.session.user.userId;

  return tasks.remove(id, updatedby)
  .then(function(){
    return res.sendStatus(200);
  })
  .catch(function(err){
    return res.status(500).send({
      status: 'ERROR',
      message: 'Something went wrong, please try again.'
    });
  });
};