/**
 * @author: Amey Parundekar
 * book sell handler
 */

//Preloading animation.
document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'interactive') {
       document.getElementById('contents').style.visibility="hidden";
  } else if (state == 'complete') {
      setTimeout(function(){
         document.getElementById('interactive');
         document.getElementById('load').style.visibility="hidden";
         document.getElementById('contents').style.visibility="visible";
      },1000);
  }
}

//Script running when document ready.
$(document).ready(function(){

var branch;
var streamId = {};

    $("#file-upload-1").on("change",function(){
        var loadFile1 = function(event){
        var reader = new FileReader();
        reader.onload = function(){
        var output = document.getElementById('output1');
        output.src = reader.result;
        };
        reader.readAsDataURL($("#file-upload-1").get(0).files[0]);
    };
    loadFile1(event);
});

    $("#file-upload-2").on("change",function(){
        var loadFile2 = function(event){
        var reader = new FileReader();
        reader.onload = function(){
        var output = document.getElementById('output2');
        output.src = reader.result;
        };
       reader.readAsDataURL($("#file-upload-2").get(0).files[0]);
    };
    loadFile2(event);
    $("#photos-validation-button").click();
});

$("#photos-validation-button").on("click",function(){
    var img1;
    var img2;

    var reader1 = new FileReader();
    reader1.onload = function(){
       $("#img1-base64").append(event.target.result);
    }
    reader1.readAsDataURL($("#file-upload-1").get(0).files[0]);
    
    var reader2 = new FileReader();
    reader2.onload = function(){
       $("#img2-base64").append(event.target.result);
    }
    reader2.readAsDataURL($("#file-upload-2").get(0).files[0]);   
});


//XHR for getting streams - returns stream name, stream_id, type
      var streamReq = new XMLHttpRequest();
      streamReq.onload = function(){
              if(streamReq.readystate = XMLHttpRequest.DONE){
                  if(streamReq.status === 200||streamReq.status === 304){
                      var stream = JSON.parse(streamReq.responseText);
                      var streamTemp = {};
                      for(var i=0;i<stream.length;i++){
                        streamTemp[stream[i].stream] = null;
                      }
                      for(var i=0;i<stream.length;i++){
                        streamId[stream[i].stream] = stream[i].stream_id;
                      }
                      $('input.select-stream').autocomplete({
                            data: streamTemp,
                            limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
                            onAutocomplete: function(val) {
                              // Callback function when value is autcompleted.
                            },
                            minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
                            });
                  }
                  if(streamReq.status === 403 ){
                      console.log(streamReq.responseText);
                  }
              }
      }
      streamReq.open('GET','http://localhost:8080/get-streams',true);
      streamReq.send(null);


      //XHR for posting book
    $("#post-book").on("click",function(){
        branch = $("#stream").val();
        var postBook = new XMLHttpRequest();
        postBook.onload = function(){
            if(postBook.readyState = XMLHttpRequest.DONE){
                if(postBook.status === 200){
                    $("#sell").html("<h3 style='color:blue'>Book Uploaded successfully!</h3>");
                    var i = setTimeout(function(){
                            window.location.href = "http://localhost:8080/user-console.html#primary-info";
                            location.reload();
                             },100);
                }else{
                    $("#sell").html(postBook.responseText);
                }
            }
        }
        var name = $("#book-name").val().trim();
        var author = $("#author").val().trim();
        var publisher = $("#publisher").val().trim();
        var condition = $("#condition").val();
        var year = $("#year").val();
        var price = $("#price").val();
        var stream = $("#stream").val();
        var memo = $("#memo").val();
        var img1 = $("#img1-base64").text();
        var img2 = $("#img2-base64").text();
        var img3 = $("#img3-base64").text();
        postBook.open('POST', 'http://localhost:8080/add-book', true);
        postBook.setRequestHeader('Content-Type', 'application/json');
        var book = {name:name,author:author,publisher:publisher,condition_id:condition,price:price,year:year,stream_id:streamId[branch],memo:memo,image_1:img1,image_2:img2};
       console.log(book);
        postBook.send(JSON.stringify(book));
    });
});


