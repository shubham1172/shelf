/**
 * @author: Shubham Sharma
*/

//Include modules
var express = require('express');
var path = require('path');
var morgan = require('morgan'); //logging information
var router = require('./router.js'); //send traffic to this router
var bodyParser = require('body-parser');

//DEFINE APP
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', router);

//domain
var domain = "c100.hasura.me";

//START APP
app.listen(8080, function () {
  console.log('Shelf started on 8080!');
});

module.exports = {domain: domain};
