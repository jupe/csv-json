/* node.js modules */
var fs = require('fs');

/* 3rd party libraries */
var csv = require('csv');

/* own libraries */  

/* Implementation */  
var cleanElement = function(str)
{
  //remove first and last " -characters if exists
  str = str.trim();
  if( str.indexOf('=')==0) str = str.slice(1);
  if( str.indexOf('"')==0) str = str.slice(1);
  if( str.indexOf('"')==str.length-1)
    str = str.slice(0, str.length-1);
  return str;
}
/**
 * Retrieve nested item from object/array
 * @param {Object|Array} obj
 * @param {String} path dot separated
 * @param {*} def default value ( if result undefined )
 * @returns {*}
 */
function path(obj, path, def){

    for(var i = 0,path = path.split('.'),len = path.length; i < len; i++){
        if(!obj || typeof obj !== 'object') return def;
        obj = obj[path[i]];
    }

    if(obj === undefined) return def;
    return obj;
}
function getObjectAsString (array, value){
   return !array.length ? value 
             : '{"' + array[0] + '":' + getObjectAsString(array.slice(1), value) + '}';
}
function getObjectFromString(str, value)
{
  var str = getObjectAsString(str.split(/\./), value);
  return JSON.parse(str);
}
/*
* Recursively merge properties of two objects 
*/
function MergeRecursive(obj1, obj2) {

  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if ( obj2[p].constructor==Object ) {
        obj1[p] = MergeRecursive(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }
    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];
    }
  }
  return obj1;
}

var recJSON = function(jsonRows, rules)
{
  var obj = [];
  for(var i=0;i<jsonRows.length;i++)
  {
    var objE = {};
    for(var key in jsonRows[i]){
      if( rules.rules && rules.rules[key] && rules.rules[key].path ){
        var value = jsonRows[i][key];
        if( rules.rules[key].convert ){
          value = rules.rules[key].convert(value);
        }
        else value = '"'+value+'"';
        var objC = getObjectFromString(rules.rules[key].path, value);
        objE = MergeRecursive(objE, objC );
      } else {
        objE[key] = jsonRows[i][key];
      }
    }
    obj.push( objE );
  }
  return obj;
}

/* EXPORTS */
module.exports.recJSON = recJSON;

module.exports.parseCsv = function(filename, rulesWithOptions, callback )
{
  //
  //    csvfile.csv
  //    ------------------------------
  //    HEAD1;HEAD2;HEAD3;HEAD4
  //    data;data;data;data
  //    ...
  var columns = [];
  var json = [];
  var parserOptions = null;

  if( typeof(rulesWithOptions) == 'function')
  {
    callback = rulesWithOptions;
    rulesWithOptions = false;
  }
  else if( !typeof(rulesWithOptions) == 'object')
  {
    rulesWithOptions = false;
  }
  if (rulesWithOptions)
  {
    parserOptions = rulesWithOptions.options;
    if (parserOptions && Object.keys(rulesWithOptions).length == 1)
    {
      rulesWithOptions = false;
    }
  }
  var isFilename = function(){
    return fs.existsSync(filename);
  }
  var x = csv();
  if( isFilename() )
    x = x.from.stream(fs.createReadStream(filename), parserOptions);
  else {
    x = x.from.string(filename, parserOptions);
  }
  x.transform( function(data){
        data.unshift(data.pop());
        return data;
      })
      .on('record', function(data,index){
        if(index == 0 ){
          //parse column headers
          for(var i=0;i<data.length;i++){
              columns.push( cleanElement(data[i]));
          }
        } else {
          //parse data row
          var row = {};
          for(var i=0;i<columns.length&&i<data.length;i++){
            var datax = cleanElement(data[i])
            if( datax != "" && datax != null )
            {
              row[ columns[i] ] = datax;
            }
          }
          json.push(row);
        }
      })
      .on('end', function(count){
        if( rulesWithOptions ){
          callback(null, recJSON(json, rulesWithOptions), {statistics: {lineCount: count, columns: columns}});
        } else {
          callback(null, json, {statistics: {lineCount: count, columns: columns}});
        }
      })
      .on('error', function(error){
        callback(error.message);
      });
}
