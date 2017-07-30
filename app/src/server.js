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
var admin = require('./Authorization/admin.js');

/**
 * Authenticates traffic before routing
 */
 function checkAuth(req, res, next){
    if(req.session.auth || config.PERMITTED_URLS.indexOf(req.path)>-1){
      if(req.session.auth&&req.session.auth.eligible||config.PERMITTED_URLS.indexOf(req.path)>-1){
          if(req.session.auth&&req.path=='/')
            res.redirect('/user-console.html');
          else
            next();
      }
      else
        res.status(config.HTTP_CODES.FORBIDDEN).send({code: 03, message: "Fill your details to continue"});
    }
    else{
        res.redirect('/');
    }
 }

/**
 * Check if user is registered with Shelf
 * (for power users who register with Hasura directy)
 */

//DEFINE APP
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(session({
  secret: 'silicon_valley',
  cookie: {maxAge: 1000*60*60}
}));
app.use(checkAuth);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

//START APP
app.listen(config.PORT_NUMBER, function () {
  console.log('Shelf started on ' + config.PORT_NUMBER);
  admin.genToken(function(token){
    console.log("Logged in to Hasura.");
    config.TOKEN = token;
  });
});
