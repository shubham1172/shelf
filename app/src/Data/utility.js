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
    var re = new RegExp("^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$");
    if(re.test(data.substr(data.search("base64")+7))){
      callback(true);
    }else{
      callback(false);
    }
}

//Upload file to server
function uploadFile(content, callback){
  //Make a POST request and upload the file
  var fileName = crypto.randomBytes(64).toString('hex');
  var type = 'text/plain';
  var options = {
    method: "POST",
    url: domain + '/' + fileName,
    body: content,
    headers: {
      'Content-Type': type,
      'Authorization': 'Bearer ' + admin.getToken()
    }
  }
  request(options, function(error, response, body){
    body = JSON.parse(body);
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

//upload files to server and insert photos record
function uploadImages(image1, image2, callback){
  uploadFile(image1, function(data1){
    uploadFile(image2, function(data2){
        //add to photos table
        var query = {
          "type": "insert",
          "args": {
            "table": "photos",
            "objects": [{
              "photo1": data1,
              "photo2": data2 }],
            "returning": ["id"]
          }
        }
        var options = {
          method: "POST",
          url:"http://data." + config.DOMAIN + '/v1/query',
          json: true,
          headers: {
            'Authorization': 'Bearer ' + admin.getToken()
          },
          body: query
        }
        request(options, function(error, response, body){
          console.log(body);
          if(error){
            console.log(error);
            callback("Error");
          }else if(body.returning.length==1){
            //return photo id
            callback(body.returning[0].id);
          }else{
            console.log("Error in body");
            console.log(body);
            callback("Error");
          }
        });
      });
   });
}

//get photo base64 data
function fetchImage(imageURL, callback){
  var options = {
    method: "GET",
    url: domain + '/' + imageURL
  }
  request(options, function(error, response, body){
    if(error){
      console.log(error);
      callback("Error");
    }else{
      console.log("Fetched");
      callback(body);
    }
  });
}

//get photos
function fetchImages(imageURLs, callback){
  data = {};
  fetchImage(imageURLs.photo1, function(data1){
    data.image_1 = data1;
    fetchImage(imageURLs.photo2, function(data2){
      data.image_2 = data2;
      callback(data);
    });
  });
}

module.exports = {uploadImages, uploadFile, checkBase64, fetchImages};
