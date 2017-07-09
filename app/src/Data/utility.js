/**
 * @author: Shubham Sharma
 *
 * Utility file for data
 */

var config = require("./../config.js");
var domain = "http://filestore." + config.DOMAIN + "/v1/file";
var request = require("request");
var crypto = require("crypto");
var admin = require('./../Authorization/admin.js');

/**
 * Check if image data is a valid base64 string
 */
function checkBase64(data, callback){
    var re = new RegExp("/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/");
    if(re.test(data)){
      callback(true);
    }else{
      callback(false);
    }
}

function uploadFile(content, callback){
  //Make a POST request and upload the file
  var fileName = crypto.randomBytes(64).toString('hex');
  var type = 'text/plain';
  var options = {
    method: "POST",
    uri: domain + '/' + fileName,
    body: content,
    headers: {
      'Content-Type': type,
      'Authorization': 'Bearer ' + admin.getToken()
    }
  }
  request(options, function(error, response, body){
    if(error){
      console.log(error);
      callback("Error");
    }else{
      console.log("File uploaded");
      if(body.file_id){
        callback(body.file_id);
      }else {
        callback("Error");
      }
    }
  });
}

function uploadImages(image1, image2, image3, callback){
  uploadFile(image1, function(data1){
    if(data1=="Error")
      callback("Error");
    uploadFile(image2, function(data2){
      if(data2=="Error")
        callback("Error");
      uploadFile(image3, function(data3){
        if(data3=="Error")
          callback("Error");
          //add to photos table
          var query = {
            "type": "insert",
            "args": {
              "table": "photos",
              "objects": [{
                "photo1": data1,
                "photo2": data2,
                "photo3": data3}],
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
              callback("Error");
            }else if(body.returning.length==1){
              //return photo id
              callback(body.returning[0].id);
            }else{
              callback("Error");
            }
          });
       });
    });
  });
}

module.exports = {uploadImages, uploadFile, checkBase64};
