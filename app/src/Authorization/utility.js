/**
 * @author: Shubham Sharma
 *
 * This file manages all database transactions for auth
 */
var config = require('./../config.js');
var domain = "http://data." + config.DOMAIN;
var request = require('request');


//collects user information from database
function getInfo(id, token, callback){
  var query = {
    "type": "select",
    "args":{
        "table": "userinfo",
        "columns": ["id", "name", "year", "stream", "college"],
        "where": {"id": id}
    }
  }
  var options = {
    method: 'POST',
    url: domain+'/v1/query',
    headers: {
      'Authorization': 'Bearer '+token,
      'Content-Type': 'application/json'
    },
    json: true,
    body: query
  }
  request(options, function(error, response, body){
    if(error){
      console.log(error);
      callback("Error");
    }else{
      callback(body[0]);
    }
  });
}

//Checks if user holds an account in our database
function checkEligible(id, token, callback){
    var query = {
      "type": "count",
      "args":{
          "table": "user",
          "where": {"id": id}
      }
    }
    var options = {
      method: 'POST',
      url: domain+'/v1/query',
      headers: {
        'Authorization': 'Bearer '+ token,
        'Content-Type': 'application/json'
      },
      json: true,
      body: query
    }
    request(options, function(error_, response_, body_){
      if(error_){
        console.log(error_);
        callback("Error");
      }else{
        if(body_.count==1)
          callback(true);
        else
          callback(false);
      }
    });
}

module.exports = {getInfo: getInfo, checkEligible: checkEligible};
