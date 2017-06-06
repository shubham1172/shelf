/**
 * @author: Shubham Sharma
*/

//Include modules
var express = require('express');
var path = require('path');
var data = require('./data.js');
var router = express.Router();

// Get book details from book id
// /get-book?id=...
router.get('/get-book', function(req, res){
  if(req.query.id){
    data.getBook(req.query.id, function(data){
      res.status(200).send(data);
    });
  }else{
    res.status(400).send("Invalid request! Use get-book?id=XX..");
  }
});

//Default routing
router.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, './public/html/index.html'));
});

module.exports = router;
