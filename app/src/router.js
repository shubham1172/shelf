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
  //send the res obj to the auth file for further responses
  if(req.body.username&&req.body.password)
    auth.login(req.body.username, req.body.password, res);
  else
    res.status(400).send("Missing username/password");
});

//logout
router.get('/logout', function(req, res){
  auth.logout(res);
});

//register
router.post('/register', function(req, res){
  //check for VITSTUDENT handle
  if(req.body.username&&req.body.password&&req.body.email&&req.body.mobile)
    auth.register(req.body.username, req.body.password, req.body.email, req.body.mobile, res);
  else
    res.status(400).send("Missing parameters. Ref doc for more.");
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
