/**
 *  @author: Shubham Sharma
 *
 * Makes requests to Hasura's auth api
 */
var config = require("./config.js");
var domain = "http://auth." + config.DOMAIN;
var request = require('request');

function login(req, res){
   if(req.body&&req.body.username&&req.body.password){
      // call auth.<>.hasura.me/login
      var toSend = {
        "username": req.body.username,
        "password": req.body.password
      };
      var options = {
        method: 'POST',
        uri: domain+'/login',
        json: true,
        body: toSend
      }
      request(options, function(error, response, body){
        if(error){
          console.log(error);
          res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
        }else{
          if(body.auth_token){
            console.log("Logged in: " + body.auth_token);
            req.session.auth = {token: body.auth_token}; //added cookie
            res.status(config.HTTP_CODES.OK).send("Logged in!");
          }else{
            res.status(config.HTTP_CODES.FORBIDDEN).send("Invalid credentials!");
          }
        }
      });
   }else
      res.status(config.HTTP_CODES.BAD_REQUEST).send("Missing parameters! Refer to docs for more.");
 }

function logout(req, res){
    if(req.session&&req.session.auth&&req.session.auth.token){
      delete req.session.auth;
      res.status(config.HTTP_CODES.OK).send("Logged out!");
    }else{
      res.status(config.HTTP_CODES.FORBIDDEN).send("Please login first");
    }
}

function register(username, password, email, mobile, res){
    res.status(200).send("test-register");
}

function getInfo(req, res){
  var options = {
    method: 'GET',
    uri: domain+'/user/account/info',
    headers: {
      'Authorization': 'Bearer '+req.session.auth.token,
      'Content-Type': 'application/json'
    }
  }
  request(options, function(error, response, body){
    if(error){
      console.log(error);
      res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
    }else{
      body = JSON.parse(body);
      var toSend = {
        "username": body.username,
        "mobile": body.mobile,
        "email": body.email
      }
      res.status(config.HTTP_CODES.OK).send(toSend);
    }
  });
}

module.exports = {login, logout, register, getInfo};
