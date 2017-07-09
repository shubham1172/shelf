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
 *                  image_2, image_3, price, year, stream_id, memo
 */
 function addBook(req, res){
   //Check and verify params
   if(checkParamsBook(req.body){
     //add images
     util.uploadImages(req.body.image_1, req.body.image_2, req.body.image_3,
       function(photoID){
         if(photoID=="Error")
          res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
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
             "memo": req.body.memo
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
             uri: config.domain + '/v1/query',
             json: true,
             body: query
           }
           request(options, function(error, response, body){
             if(error){
               console.log(error);
               res.status(config.HTTP_CODES.SERVER_ERROR).send("Error");
             }else if(body.returning.length==1){
               //return book id
               res.status(config.HTTP_CODES.OK).send(body.returning[0].id);
             }else{
               res.status(config.HTTP_CODES.SERVER_ERROR)("Error");
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
function checkParamsBook(info){
  if(info.name&&info.author&&info.publisher&&info.condition_id&&
      info.price&&info.year&&info.stream_id&&info.memo){
        if(info.name.length>30||info.name.length<5){
          console.log("Name error");
          return false;
        }if(info.author.length>30||info.author.length<5){
          console.log("Author error");
          return false;
        }if(info.publisher.length>30||info.publisher.length<5){
          console.log("Publisher error");
          return false;
        }if(info.condition_id<1||info.condition_id>5){
          console.log("Condition error");
          return false;
        }if(info.price<1||info.price>5000){
          console.log("Price error");
          return false;
        }var year = new Date().getFullYear();
        if(info.year<1990||info.year>year){
          console.log("Year error");
          return false;
        }if(info.memo.length<5||info.memo.length>100){
          console.log("Memo error");
          return false;
        }data.checkStream(info.stream_id, function(isValid){
          if(!isValid){
            console.log("Stream error");
            return false;
          }else{
            checkValidImages(info.image_1, info.image_2, info.image_3, function(isValid2){
              if(!isValid2)
                console.log("Image error");
              return isValid2;
            });
          }
        });
  }else{
    return false;
  }
 }

 /**
  * Check if all images are valid
  * TODO: think about this shitty algorithm :/
  */
  function checkValidImages(image1, image2, image3, callback){
    util.checkBase64(image1, function(isValid1){
      if(isValid1){
        util.checkBase64(image2, function(isValid2){
          if(isValid2){
            util.checkBase64(image3, function(isValid3){
              if(isValid3)
                callback(true);
            });
          }
        });
      }
      callback(false);
    });
  }

module.exports = {addBook};
