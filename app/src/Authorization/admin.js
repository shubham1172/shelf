/**
 * @author: Shubham Sharma
 *
 * Log in as admin for un-registered activities
 * Had to write this file to prevent updating env variable every time!
 */

 var config = require("./../config.js");
 var domain = "http://auth." + config.DOMAIN;
 var request = require('request');

 //get admin token
 function getToken(){
   return config.TOKEN;
 }

 //generate admin token
 function genToken(callback){
   //login and get token
   var toSend = {
     "username": process.env.ADMIN_USER,
     "password": process.env.ADMIN_PASS
   }
   var options = {
     method: 'POST',
     url: domain+'/login',
     json: true,
     body: toSend
   }
   request(options, function(error, response, body){
     if(error){
       console.log(error);
       callback("Error");
     }else{
       callback(body.auth_token);
     }
   });
 }

 module.exports = {getToken, genToken};
