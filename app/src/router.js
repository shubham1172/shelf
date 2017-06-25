/**
 * @author: Shubham Sharma
*/

//Include modules
var express = require('express');
var path = require('path');
var auth = require('./auth.js');
var data = require('./data.js');
var router = express.Router();

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

/**
 * Data requests
 */
// Get book details from book id
// /get-book?id=...
router.get('/get-book', function(req, res){
  if(req.query.id){
    data.getBook(req.query.id, function(data){
      if(data=="error")
        res.status(500).send("Error while fetching data");
      else
        res.status(200).send(data);
    });
  }else{
    res.status(400).send("Invalid request! Use get-book?id=XX..");
  }
});

// Get all books sorted personally
router.get('/get-books', function(req, res){
  data.getBooks(function(data){
    if(data=="error")
      res.status(500).send("Error while fetching data!");
    else
      res.status(200).send(data);
  });
});

//Default routing
router.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, './public/html/index.html'));
});

module.exports = router;
