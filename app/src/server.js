/**
 * @author: Shubham Sharma
*/

//Include modules
var express = require('express');
var path = require('path');
var morgan = require('morgan'); //logging information
var router = require('./router.js'); //send traffic to this router
var bodyParser = require('body-parser');
var session = require('express-session'); //session management
var config = require('./config');

/**
 * Authenticates traffic before routing
 */
 function checkAuth(req, res, next){
    if(req.session.auth || config.PERMITTED_URLS.indexOf(req.path)>-1)
      next();
    else
      res.redirect('/');
 }

//DEFINE APP
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: 'silicon_valley',
  cookie: {maxAge: 1000*60*60}
}));
app.use(checkAuth);
app.use('/', router);

//START APP
app.listen(config.PORT_NUMBER, function () {
  console.log('Shelf started on ' + config.PORT_NUMBER);
});
