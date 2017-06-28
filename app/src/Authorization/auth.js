/**
 *  @author: Shubham Sharma
 *
 * Makes requests to Hasura's auth api
 */
var config = require("./../config.js");
var domain = "http://auth." + config.DOMAIN;
var request = require('request');
var util = require('./utility.js');

/**
 * Login request
 * Body: username, password
 */
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
            req.session.auth = {token: body.auth_token, id: body.hasura_id}; //added cookie
            util.checkEligible(body.hasura_id, body.auth_token, function(isEligible){
              if(isEligible){
                req.session.auth.eligible = true;
                res.status(config.HTTP_CODES.OK).send("Logged in!");
              }
              else{
                res.status(config.HTTP_CODES.FORBIDDEN).send({
                  code: 03,
                  message: "Fill your details to continue"}); //update database
              }
            });
          }else{
            res.status(config.HTTP_CODES.FORBIDDEN).send({code: 04, message: "Invalid credentials!"});
          }
        }
      });
   }else
      res.status(config.HTTP_CODES.BAD_REQUEST).send({
        code: 02,
        message:"Missing parameters! Refer to docs for more."});
 }

/**
 * Logout request
 */
function logout(req, res){
    if(req.session&&req.session.auth&&req.session.auth.token){
      delete req.session.auth;
      config.ELIGIBILITY = false;
      res.status(config.HTTP_CODES.OK).send("Logged out!");
    }else{
      res.status(config.HTTP_CODES.FORBIDDEN).send({
        code: 05,
        message: "Please login first"});
    }
}

/**
 * Register request
 * BODY: username, password, email, mobile, name, year, stream_id, college_id
 */
function register(req, res){
    if(checkRegisterHasura(req)&&checkRegisterShelf(req)){
      /**
       * Register with HASURA and then SHELF
       */
       var query = {
         "username": req.username,
         "password": req.password,
         "email": req.email,
         "mobile": req.mobile
       }
       var options = {
         method: "POST",
         uri: domain+'/signup',
         json: true,
         body: query
       }
       request(query, function(error, response, body){
         if(error){
           console.log(error);
           res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
         }else{
           //add other columns in database
           createUser(req, req.body, function(result){
             if(result){
               res.status(config.HTTP_CODES.OK).send("Confirm your email to login!");
             }else{
               res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
             }
           });
         }
       });
    }else{
      res.status(config.HTTP_CODES.FORBIDDEN).send({
        code: 02,
        message: "Parameter error. Read docs for more."});
    }
}

/**
 * Get information about user
 */
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
      util.getInfo(body.hasura_id, req.session.auth.token, function(info){
          if(info=="Error"){
            res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
          }else{
            info.username = body.username;
            info.mobile = body.mobile;
            info.email = body.email;
            res.status(config.HTTP_CODES.OK).send(info);
          }
      });
    }
  });
}

/**
 * Check register request body for HASURA
 */
function checkRegisterHasura(info){
  if(info.body&&info.body.username&&info.body.password&&info.body.email&&
    info.body.mobile){
    //further checking
    if(info.body.username.length<5||info.body.username.length>15)
      return false;
    if(info.body.password.length<5||info.body.password.length>20)
      return false;
    if(info.body.mobile.toString().length!=10)
      return false;
  }else
    return false;
}

/**
 * Check register request body for SHELF
 */
function checkRegisterShelf(info){
  if(info.body&&info.body.name&&info.body.year&&info.body.stream_id&&info.body.college_id){
    if(info.body.name.length<3||info.body.name.length>30)
      return false;
    var year = new Date().getYear();
    if(info.body.year<(year-5)||info.body.year>year)
      return false;
    return true;
  }else
    return false;
}

/**
 * Register only SHELF
 * Will hardly be used unless some user creates an account using HASURA
 */
 function registerShelf(req, res){
   if(checkRegisterShelf(req)){
     createUser(req, req.body, function(result){
       if(result){
         res.status(config.HTTP_CODES.OK).send("Added information!");
       }else{
         res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
       }
     });
   }else{
     res.status(config.HTTP_CODES.FORBIDDEN).send({
       code: 02,
       message: "Parameter error. Read docs for more."});
   }
 }

module.exports = {login, logout, register, getInfo, checkRegisterHasura, checkRegisterShelf};
