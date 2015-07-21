var conf = require('../../conf');
var tasks = require('./tasks');

//FIXME -- API Auth code here
module.exports = function(app){
  app.get(conf.API_BASE + 'tasks', taskInfo);
  app.patch(conf.API_BASE + 'tasks', taskUpdate);
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