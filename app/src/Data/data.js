/**
 *  @author: Shubham Sharma
 *
 * Makes requests to Hasura's data api
 */

 var config = require("./../config.js");
 var domain = "http://data." + config.DOMAIN;
 var request = require('request');
 var admin = require('./../Authorization/admin.js');

 /**
  * Creates a new user in the Hasura database
  * info contains the following:
  * id, name, year, stream_id, college_id
  */
 function createUser(req, info, callback){
   /**
   * makes an insert request to user table
   */
   //check who is making the request
   var id = -1;
   if(info.id)
    id = info.id; //register app
   else
    id = req.session.auth.id; //after logging in for power users
   var query = {
     "type": "insert",
     "args": {
       "table": "user",
       "objects": [{
         "id": id,
         "name": info.name.trim(),
         "year": info.year,
         "stream_id": info.stream_id,
         "college_id": info.college_id
       }]
     }
   }
   var options = {
     method: 'POST',
     url: domain + '/v1/query',
     json: true,
     headers: {
       'Authorization': 'Bearer ' + admin.getToken()
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
     url: domain + '/v1/query',
     json: true,
     headers: {
       "Authorization": "Bearer " + admin.getToken()
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
     url: domain + '/v1/query',
     json: true,
     headers: {
       "Authorization": "Bearer " + admin.getToken()
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
        url: domain + '/v1/query',
        json: true,
        headers: {
          "Authorization": "Bearer " + admin.getToken()
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
     res.status(config.HTTP_CODES.BAD_REQUEST).send({
       code: 02,
       message: "Parameter error. Read docs for more."});
   }
}

/**
 * Checks if stream_id exists or not
 */
function checkStream(stream_id, callback){
  var query = {
    "type": "select",
    "args": {
      "table" : "stream",
      "columns": ["name"],
      "where": {"id": stream_id}
    }
  }
  var options = {
    method: "POST",
    url: domain + '/v1/query',
    json: true,
    headers: {
      "Authorization": "Bearer " + admin.getToken()
    },
    body: query
    }
    request(options, function(error, response, body){
      if(error){
        console.log(error);
        callback(false);
      }else if(body.length!=1){
        console.log(body);
        callback(false);
      }else{
          callback(true);
      }
    });
}

/**
 * Get college id of user
 */
function getCollegeId(user_id, callback){
  var query = {
    "type": "select",
    "args": {
      "table" : "user",
      "columns": ["college_id"],
      "where": {"id": user_id}
    }
  }
  var options = {
    method: "POST",
    url: domain + '/v1/query',
    json: true,
    headers: {
      "Authorization": "Bearer " + admin.getToken()
    },
    body: query
    }
    request(options, function(error, response, body){
      if(error){
        console.log(error);
        callback(false);
      }if(body.length!=1){
        console.log(body);
        callback(false);
      }else{
          callback(body[0].college_id);
      }
    });
}

/**
* Edit user's mobile
*/
function editMobile(req, res){
  if(req.query.new_mobile&&req.query.new_mobile.toString().length==10){
      var query = {
      "type": "update",
      "args": {
        "table" : {
          "name": "hasura_auth_user",
          "schema": "hauthy"
        },
        "$set": {"mobile": req.query.new_mobile},
        "where": {"id": req.session.auth.id }
      }
     }
     var options = {
       method: "POST",
       url: domain + '/v1/query',
       json: true,
       headers: {
         "Authorization": "Bearer " + admin.getToken()
       },
       body: query
     }
     request(options, function(error, response, body){
         if(error){
           console.log(error);
           res.status(config.HTTP_CODES.SERVER_ERROR).send(error);
         }else{
           res.status(config.HTTP_CODES.OK).send("Updated successfully");
         }
     });
  }else{
    res.status(config.HTTP_CODES.BAD_REQUEST).send({
      code: 02,
      message: "Parameter error. Read docs for more."});
  }
}

module.exports = {createUser, getStreams, getColleges, checkUsername, checkStream, getCollegeId, editMobile};
