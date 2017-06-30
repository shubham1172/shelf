/**
 *  @author: Shubham Sharma
 *
 * Makes requests to Hasura's data api
 */

 var config = require("./../config.js");
 var domain = "http://data." + config.DOMAIN;
 var request = require('request');

 /**
  * Creates a new user in the Hasura database
  * info contains the following:
  * id, name, year, stream_id, college_id
  */
 function createUser(req, info, callback){
   /**
   * makes an insert request to user table
   */
   var query = {
     "type": "insert",
     "args": {
       "table": "user",
       "objects": [{
         "id": req.session.auth.id,
         "name": info.name,
         "year": info.year,
         "stream_id": info.stream_id,
         "college_id": info.college_id
       }]
     }
   }
   var options = {
     method: 'POST',
     uri: domain + '/v1/query',
     json: true,
     headers: {
       'Authorization': 'Bearer ' + req.session.auth.token
     },
     body: query
   }
   request(options, function(error, response, body){
     if(error){
        console.log(error);
        callback("Error");
     }else
       callback(true);
   });
 }

/**
 * Returns stream_id, name and type
 */
 function getStreams(req, res){
   var query = {
     "type": "select",
     "args": {
       "table" : "streaminfo",
       "columns": ["stream_id", "stream", "type"]
     }
   }
   var options = {
     method: "POST",
     uri: domain + '/v1/query',
     json: true,
     headers: {
       "Authorization": "Bearer " + process.env.TOKEN
     },
     body: query
     }
     request(options, function(error, response, body){
       if(error){
         res.status(config.HTTP_CODES.SERVER_ERROR).send(error);
       }else{
         res.status(config.HTTP_CODES.OK).send(body);
       }
     });
 }

 /**
  * Returns id and college name
  */
 function getColleges(req, res){
   var query = {
     "type": "select",
     "args": {
       "table" : "college",
       "columns": ["id", "name"]
     }
   }
   var options = {
     method: "POST",
     uri: domain + '/v1/query',
     json: true,
     headers: {
       "Authorization": "Bearer " + process.env.TOKEN
     },
     body: query
     }
     request(options, function(error, response, body){
       if(error){
         res.status(config.HTTP_CODES.SERVER_ERROR).send(error);
       }else{
         res.status(config.HTTP_CODES.OK).send(body);
       }
     });
 }

 /**
 * Returns bool if username is available or not
 */
 function checkUsername(req, res){
   if(req.query.val){
       var username = req.query.val;
       var query = {
       "type": "select",
       "args": {
         "columns": ["username"],
         "table" : {
           "name": "hasura_auth_user",
           "schema": "hauthy"
         }
       }
      }
      var options = {
        method: "POST",
        uri: domain + '/v1/query',
        json: true,
        headers: {
          "Authorization": "Bearer " + process.env.TOKEN
        },
        body: query
      }
      request(options, function(error, response, body){
          if(error){
            res.status(config.HTTP_CODES.SERVER_ERROR).send(error);
          }else{
            var toSend = true;
            for(var i=0;i<body.length;i++){
              if(body[i].username==username)
                toSend = false;
            }
            res.status(config.HTTP_CODES.OK).send(toSend);
          }
      });
   }else{
     res.status(config.HTTP_CODES.BAD_REQUEST).send("Invalid parameter. Follow /check-username?val=XXX")
   }
}
module.exports = {createUser: createUser, getStreams: getStreams,
   getColleges: getColleges, checkUsername: checkUsername};
