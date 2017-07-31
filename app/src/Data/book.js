/**
 * @author: Shubham Sharma
 *
 * Handles book requests
 */

var util = require('./utility.js');
var data = require('./data.js');
var config = require("./../config.js");
var request = require("request");

/**
* Add books to SHELF
* Params required: name, author, publisher, condition_id, image_1,
*                  image_2, price, year, stream_id, memo
*/
 function addBook(req, res){
   //Check and verify params
   if(checkParamsBook(req.body, 0)){ //caller 0 indicates addBook's call
     //add images
     util.uploadImages(req.body.image_1, req.body.image_2,
       function(photoID){
         if(photoID=="Error"){
            res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
         }
         else{
           var toSend = {
             "user_id": req.session.auth.id,
             "name": req.body.name,
             "author": req.body.author,
             "publisher": req.body.publisher,
             "condition_id": req.body.condition_id,
             "photo_id": photoID,
             "price": req.body.price,
             "year": req.body.year,
             "stream_id": req.body.stream_id,
             "memo": req.body.memo,
             "college_id": req.session.auth.college_id
           }
           var query = {
             "type": "insert",
             "args": {
               "table": "book",
               "objects": [toSend],
               "returning": ["id"]
             }
           }
           var options = {
             method: "POST",
             url: "http://data." + config.DOMAIN + '/v1/query',
             json: true,
             headers: {
               "Authorization": "Bearer " + req.session.auth.token
             },
             body: query
           }
           request(options, function(error, response, body){
           console.log(body);
             if(error){
               console.log(error);
               res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
             }else if(body.returning.length==1){
               //return book id
               res.status(config.HTTP_CODES.OK).send((body.returning[0].id).toString());
             }else{
               res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
             }
           });
         }
     });
   }else{
     res.status(config.HTTP_CODES.BAD_REQUEST).send({
       code: 02,
       message: "Parameter error. Read docs for more."});
   }
 }

/**
* Check input parameters
*/
function checkParamsBook(info, caller){
  if((caller==1)||(info.name&&info.author&&info.publisher&&info.condition_id&&
      info.price&&info.year&&info.stream_id&&info.memo)){ //caller1->EditBook call
        if(info.name&&(info.name.length>30||info.name.length<3)){
          console.log("Name error");
          return false;
        }if(info.author&&(info.author.length>30||info.author.length<3)){
          console.log("Author error");
          return false;
        }if(info.publisher&&(info.publisher.length>30||info.publisher.length<3)){
          console.log("Publisher error");
          return false;
        }if(info.condition_id&&(info.condition_id<1||info.condition_id>5)){
          console.log("Condition error");
          return false;
        }if(info.price&&(info.price<1||info.price>5000)){
          console.log("Price error");
          return false;
        }var year = new Date().getFullYear();
        if(info.year&&(info.year<1990||info.year>year)){
          console.log("Year error");
          return false;
        }if(info.memo&&(info.memo.length<3||info.memo.length>210)){
          console.log("Memo error");
          return false;
        }if(info.available&&typeof(info.available)!=="boolean"){
          console.log("Available error")
          return false;
        }if(info.stream_id){
          data.checkStream(info.stream_id, function(isValid){
            if(!isValid){
              console.log("Stream error");
              return false;
            }else{
              if(caller==1)
                return true;
              checkValidImages(info.image_1, info.image_2, function(isValid2){
                if(isValid2==false)
                  console.log("Image error");
                return isValid2;
              });
            }
          });
        }
        return true;
  }else{
    console.log("Params missing");
    return false;
  }
 }

/**
* Check if all images are valid
* TODO: think about this shitty algorithm :/
*/
function checkValidImages(image1, image2, callback){
  util.checkBase64(image1, function(isValid1){
    if(isValid1){
      util.checkBase64(image2, function(isValid2){
        if(isValid2){
              callback(true);
            }else{
              callback(false);
            }
          });
        }else
          callback(false);
      });
}

/**
 * Edit books
 */
function editBook(req, res){
  //Edit only the parameters passed
  //prepare a query json
  values = {};
  possibleFields = ["name", "author", "publisher", "condition_id", "price", "year", "available", "stream_id", "memo"];
  for(var i =0;i<possibleFields.length;i++){
    if(req.body[possibleFields[i]])
      values[possibleFields[i]] = req.body[possibleFields[i]];
  }
  if(req.body.id&&checkParamsBook(values, 1)){
      //edit the entry
      var query = {
        "type": "update",
        "args": {
          "table": "book",
          "$set": values,
          "where": {"user_id": req.session.auth.id, "id": req.body.id},
          "returning": ["id"]
        }
      }
      var options = {
        method: "POST",
        url: "http://data." + config.DOMAIN + '/v1/query',
        json: true,
        headers: {
          "Authorization": "Bearer " + req.session.auth.token
        },
        body: query
      }
      request(options, function(error, response, body){
        if(error){
          console.log(error);
          res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
        }else if(body.returning.length==1){
          //return book id
          res.status(config.HTTP_CODES.OK).send(toString(body.returning[0].id));
        }else{
          res.status(config.HTTP_CODES.SERVER_ERROR)("Error");
        }
      });
  }else{
    res.status(config.HTTP_CODES.BAD_REQUEST).send({
      code: 02,
      message: "Parameter error. Read docs for more."});
  }
}

/**
 * Get complete book info
 */
function getBook(req, res){
  //book id is required to get complete info
  if(req.query.id){
    var query = {
      "type": "select",
      "args": {
        "table": "bookinfo",
        "columns": ["*"],
        "where": {"id": req.query.id, "college_id": req.session.auth.college_id}
      }
    }
    var options = {
      method: "POST",
      url: "http://data." + config.DOMAIN + '/v1/query',
      json: true,
      headers: {
        "Authorization": "Bearer " + req.session.auth.token
      },
      body: query
    }
    request(options, function(error, response, body){
      if(error){
        console.log(error);
        res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
      }else if(body.length==1)
          res.status(config.HTTP_CODES.OK).send(body[0]);
       else
          res.status(config.HTTP_CODES.FORBIDDEN).send("No such book exists");
    });
  }else{
    res.status(config.HTTP_CODES.BAD_REQUEST).send({
      code: 02,
      message: "Parameter error. Read docs for more."});
  }
}

/**
 * Get books on dashboard
 * Specify book id to receive next ten books from that ID
 */
function getBooks(req, res){
  /**
  * We will sort the books based on the following params:
  * stream_id, time
  * only books of same college will be available to the user
  */
  var query = {
    "type": "select",
    "args": {
      "table": "bookinfo",
      "columns": ["id", "user", "name", "author", "publisher", "condition", "photo_id", "price", "time"],
      "where": {
        "$and": [
          {"college_id": req.session.auth.college_id},
          {"id": {"$gt": 0}},
          {"available": true}
        ]},
      "order_by": {
        "column": "time",
        "order": "desc"
      },
      "limit": 10
    }
  }
  if(req.query.id){
    query.args.where.id.$gt = req.query.id;
  }
  var options = {
    method: "POST",
    url: "http://data." + config.DOMAIN + '/v1/query',
    json: true,
    headers: {
      "Authorization": "Bearer " + req.session.auth.token
    },
    body: query
  }
  request(options, function(error, response, body){
    if(error){
      console.log(error);
      res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
    }else
        res.status(config.HTTP_CODES.OK).send(body); //TODO: add sorting
  });
}

/**
* Get photos' base64 data
* Requires photo id
*/
function getPhotos(req, res){
  if(req.query.id){
      var query = {
        "type": "select",
        "args": {
          "table": "photos",
          "columns": ["photo1", "photo2"],
          "where": {"id": req.query.id}
        }
      }
      var options = {
        method: "POST",
        url: "http://data." + config.DOMAIN + '/v1/query',
        json: true,
        headers: {
          "Authorization": "Bearer " + req.session.auth.token
        },
        body: query
      }
      request(options, function(error, response, body){
        if(error){
          console.log(error);
          res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
        }else{
          util.fetchImages(body[0], function(data){
            res.status(config.HTTP_CODES.OK).send(data);
          });
        }
      });
  }else{
    res.status(config.HTTP_CODES.BAD_REQUEST).send({
      code: 02,
      message: "Parameter error. Read docs for more."});
  }
}

/**
* Get a list of books which the user uploaded for sale
*/
function getUploaded(req, res){
  var query = {
    "type": "select",
    "args": {
      "table": "bookinfo",
      "columns": ["id", "user", "name", "author", "publisher", "condition", "photo_id", "price", "time", "available"],
      "where": {
          "user_id": req.session.auth.id
        },
        "order_by": {
          "column": "time",
          "order": "desc"
        }
    }
  }
  var options = {
    method: "POST",
    url: "http://data." + config.DOMAIN + '/v1/query',
    json: true,
    headers: {
      "Authorization": "Bearer " + req.session.auth.token
    },
    body: query
  }
  request(options, function(error, response, body){
    if(error){
      console.log(error);
      res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
    }else
        res.status(config.HTTP_CODES.OK).send(body);
  });
}

/**
* Search books
* Results limited to 10
*/
function search(req, res){
  if(req.query.q&&req.query.q.length>1){
    var query = {
        "type": "select",
        "args": {
          "table": "bookinfo",
          "columns": ["id", "user", "name", "author", "publisher", "condition", "photo_id", "price", "time"],
          "limit": 10,
          "where": {
          	"$or": [
              {"name": {
                "$ilike": "%"+req.query.q+"%"
              }},
              {"author":{
                "$ilike": "%"+req.query.q+"%"
              }},
              {"publisher":{
                "$ilike": "%"+req.query.q+"%"
              }}
            ]
           }
  	    }
    }
    var options = {
      method: "POST",
      url: "http://data." + config.DOMAIN + '/v1/query',
      json: true,
      headers: {
        "Authorization": "Bearer " + req.session.auth.token
      },
      body: query
    }
    request(options, function(error, response, body){
      if(error){
        console.log(error);
        res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
      }else
          res.status(config.HTTP_CODES.OK).send(body);
    });
  }else{
    res.status(config.HTTP_CODES.BAD_REQUEST).send({
      code: 02,
      message: "Parameter error. Read docs for more."});
  }
}

/**
* Changes the status of a book under available column
* requires id
*/
function changeStatus(req, res, status){
  if(req.query.id){
    var query = {
        "type": "update",
        "args": {
          "table": "book",
          "$set": {'available': status},
          "where": {
          	"$and": [
              {"id": req.query.id},
              {"user_id": req.session.auth.id}
            ]
           }
  	    }
    }
    var options = {
      method: "POST",
      url: "http://data." + config.DOMAIN + '/v1/query',
      json: true,
      headers: {
        "Authorization": "Bearer " + req.session.auth.token
      },
      body: query
    }
    request(options, function(error, response, body){
      if(error){
        console.log(error);
        res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
      }else
          res.status(config.HTTP_CODES.OK).send(body);
    });
  }else{
    res.status(config.HTTP_CODES.BAD_REQUEST).send({
      code: 02,
      message: "Parameter error. Read docs for more."});
  }
}

module.exports = {addBook, editBook, getBook, getBooks, getPhotos, getUploaded, search, changeStatus};
