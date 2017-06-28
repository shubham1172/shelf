/**
 * @author: Shubham Sharma
*/

//Include modules
var express = require('express');
var path = require('path');
var auth = require('./Authorization/auth.js');
var util = require('./Authorization/utility.js'); //TODO: REMOVE
var data = require('./Data/data.js');
var router = express.Router();
var config = require('./config.js');

/**
 * Authorization requests
*/

//login
router.post('/login', function(req, res){
  auth.login(req, res);
});

//logout
router.get('/logout', function(req, res){
  auth.logout(req, res);
});

//register
router.post('/register', function(req, res){
  auth.register(req, res);
});

//info
router.get('/user-info', function(req, res){
  auth.getInfo(req, res);
});

//add details (only used if SHELF user data is missing)
router.post('/register-user', function(req, res){
  auth.registerShelf(req, res);
});

/**
 * Data requests
 */

 //get stream details
 router.get('/get-streams', function(req, res){
   data.getStreams(req, res);
 });

 //get college details
 router.get('/get-colleges', function(req, res){
   data.getColleges(req, res);
 });
//Default routing
router.get('/*', function(req, res){
  res.status(config.HTTP_CODES.OK).send("Welcome to SHELF");
});

module.exports = router;
