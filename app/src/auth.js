/**
 *  @author: Shubham Sharma
 *
 * Makes requests to Hasura's auth api
 */
var server = require("./server.js");
var domain = "auth." + server.domain;
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

function login(req, res){
   if(req.body&&req.body.username&&req.body.password){
      // call auth.<>.hasura.me/login
      var toSend = {
        "username": req.body.username,
        "password": req.body.password
      };
      var loginXHR = new XMLHttpRequest();
        loginXHR.onload = function(){
            if(loginXHR.readystate === XMLHttpRequest.DONE){
                if(loginXHR.status==200){
                    //do something
                    res.status(200).send(loginXHR.responseText);
                }else{
                    console.log(loginXHR.responseText);
                    res.status(400).send("Error!");
                }
            }
        }
        loginXHR.open("POST",domain+'/login');
        loginXHR.setRequestHeader("Content-Type", "application/json");
        loginXHR.send(JSON.stringify(toSend));
   }else
      res.status(400).send("Missing parameters! Refer to docs for more.");
 }

function logout(res){
   res.status(200).send("test-logout");
 }

function register(username, password, email, mobile, res){
    res.status(200).send("test-register");
}

module.exports = {login, logout, register}
