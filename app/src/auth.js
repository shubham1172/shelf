/**
 *  @author: Shubham Sharma
 *
 * Makes requests to Hasura's auth api
 */
var server = require("./server.js");
var domain = "auth." + server.domain;
var http = require("http");

function login(req, res){
   if(req.body&&req.body.username&&req.body.password){
      // call auth.<>.hasura.me/login
      var toSend = {
        "username": req.body.username,
        "password": req.body.password
      };
      var options = {
        host: domain,
        path: '/login',
        method: '/POST',
        headers: {'Content-Type': 'application/json'}
      };
      var rq = http.request(options, function(rs){
        var received = '';
        rs.on('data', function(chunk){
          received+=chunk;
        });
        rs.on('end', function(){
          console.log(JSON.parse(received));
        });
      });
      rq.write(toSend);
      rq.end();

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
