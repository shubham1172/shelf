/**
 *  @author: Shubham Sharma
 *
 * Makes requests to Hasura's auth api
 */

var config = require("./../config.js");
var domain = "http://auth." + config.DOMAIN;
var request = require('request');
var util = require('./utility.js');
var data = require('./../Data/data.js');

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
        url: domain+'/login',
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
            data.getCollegeId(body.hasura_id, function(college_id){
              req.session.auth = {token: body.auth_token, id: body.hasura_id,
                                    college_id: college_id}; //added cookie
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
         "username": req.body.username.trim(),
         "password": req.body.password.trim(),
         "email": req.body.email.trim(),
         "mobile": req.body.mobile
       }
       var options = {
         method: "POST",
         url: domain+'/signup',
         json: true,
         body: query
       }
       request(options, function(error, response, body){
         if(error){
           console.log(error);
           res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
         }else if(body.hasura_id){
           //add other columns in database
           req.body.id = body.hasura_id;
           console.log(body);
           data.createUser(req, req.body, function(result){
             if(result){
               res.status(config.HTTP_CODES.OK).send("Confirm your email to login!");
             }else{
               res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
             }
           });
         }else{
           res.status(config.HTTP_CODES.FORBIDDEN).send({
             code: 04,
             message: "User already exists"});
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
  var query = {
    "type": "select",
    "args":{
        "table": "userinfo",
        "columns": ["*"],
        "where": {"id": req.session.auth.id}
    }
  }
  var options = {
    method: 'POST',
    url: "http://data." + config.DOMAIN + '/v1/query',
    json: true,
    body: query,
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
      res.status(config.HTTP_CODES.OK).send(body[0]);
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
    if(info.body.username.length<3||info.body.username.length>25){
      console.log("username error");
      return false;
    }
    if(info.body.password.length<8||info.body.password.length>50){
      console.log("password error");
      return false;
    }
    if(info.body.mobile.toString().length!=10){
      console.log("mobile error");
      return false;
    }
    return true;
  }else{
    console.log("missing param error");
    return false;
  }
}

/**
 * Check register request body for SHELF
 */
function checkRegisterShelf(info){
  if(info.body&&info.body.name&&info.body.year&&info.body.stream_id&&info.body.college_id){
    if(info.body.name.length<3||info.body.name.length>30){
      console.log("name error");
      return false;
    }
    if(info.body.year<1||info.body.year>5){
      console.log("year error");
      return false;
    }
    data.checkStream(info.body.stream_id, function(isValid){
      if(!isValid)
        console.log("Stream error");
      return isValid;
    });
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
     console.log("Register shelf error");
     res.status(config.HTTP_CODES.FORBIDDEN).send({
       code: 02,
       message: "Parameter error. Read docs for more."});
   }
 }

module.exports = {login, logout, register, getInfo, checkRegisterHasura, checkRegisterShelf};
