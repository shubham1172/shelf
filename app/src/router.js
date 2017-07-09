/**
 * @author: Shubham Sharma
 *
 * Contains routing for the app
*/

//Include modules
var express = require('express');
var path = require('path');
var auth = require('./Authorization/auth.js');
var data = require('./Data/data.js');
var router = express.Router();
var config = require('./config.js');
var book = require('./Data/book.js');

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

//checks username is available or not
//returns bool
//query ?val=
 router.get('/check-username', function(req, res){
   data.checkUsername(req, res);
 });

 //get stream details
 router.get('/get-streams', function(req, res){
   data.getStreams(req, res);
 });

 //get college details
 router.get('/get-colleges', function(req, res){
   data.getColleges(req, res);
 });

/**
 * Book requests
 */

 //add book
 router.post('/add-book', function(req, res){
   book.addBook(req, res);
 });

//Default routing
router.get('/*', function(req, res){
  res.status(config.HTTP_CODES.OK).send("Welcome to SHELF");
});

module.exports = router;
