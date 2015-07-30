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

module.exports = {
  aliases: aliases
};