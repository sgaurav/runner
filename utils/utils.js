var _ = require('lodash');

function aliases(obj, ref){
  var temp = {};
  var keys = Object.keys(obj);
  var refKeys = Object.keys(ref);

  keys.forEach(function(key){
    if(refKeys.indexOf(key) > -1){
      temp[ref[key]] = obj[key];
    }
  });
  return temp;
};

// custom lodash function to check for falsies and remove them
var removeFalsies = function (obj) {
  return _.transform(obj, function (o, v, k) {
    if (v && typeof v === 'object') {
      o[k] = _.removeFalsies(v);
    } else if (v !== null) {
      o[k] = v;
    }
  });
};
_.mixin({ 'removeFalsies': removeFalsies });

module.exports = {
  aliases: aliases
};