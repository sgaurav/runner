var _ = require('lodash');

var conf = require('../../conf');
var users = require('./tasks');
var acl = require('../../acl');

//FIXME -- API Auth code here
module.exports = function(app){
  // resource level calls
  app.get(conf.API_BASE + 'tasks', acl.bouncer(), findTasks);
  app.post(conf.API_BASE + 'tasks', acl.bouncer(), createTask);

  // attribute specific calls
  app.get(conf.API_BASE + 'tasks/:id', acl.bouncer(), taskInfo);
  app.patch(conf.API_BASE + 'tasks/:id', taskUpdate);
  app.delete(conf.API_BASE + 'tasks/:id', taskDelete);
};

function findTasks(req, res, next){

};

function createTask(req, res, next){

};

function taskInfo(req, res, next){
  return status.fetch().then(function(result){
    return res.status(200).send({
      status: 'OK',
      data: {
        //task data here
      }
    });
  })
  .catch(function(err){
    return res.status(500).send({
      status: 'ERROR',
      message: 'Something went wrong'
    });
  });
};

function taskUpdate(req, res, next){
  var params = req.body.params;
  return status.update(params).then(function(result){
    return res.sendStatus(200);
  })
  .catch(function(err){
    return res.status(500).send({
      status: 'ERROR',
      message: 'Something went wrong'
    });
  });
};

function taskDelete(req, res, next){

};