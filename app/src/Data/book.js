/**
 * @author: Shubham Sharma
 *
 * Handles book requests
 */

/**
 * Add books to SHELF
 * Params required: name, author, publisher, condition_id, photo_id,
 *                  price, year, stream_id, memo
 */
 function addBook(req, res){
   //Check and verify params

 }

 function checkParamsBook(info, callback){
  if(info.name&&info.author&&info.publisher&&info.condition_id&&info.photo_id&&
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
        }
        return true;
  }else{
    return false;
  }
 }

module.exports = {addBook};
