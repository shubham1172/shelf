/**
 * @author: Amey Parundekar
 * signup handler
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

//Image variables for base64 conversion
var img1;
var img2;
var img3;
//Script for displaying image preview.
    var loadFile1 = function(event) {
        var reader = new FileReader();
        reader.onload = function(){
        var output = document.getElementById('output1');
        output.src = reader.result;
        img1 = event.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    var loadFile2 = function(event) {
        var reader = new FileReader();
        reader.onload = function(){
        var output = document.getElementById('output2');
        output.src = reader.result;
        img2 = event.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    var loadFile3 = function(event) {
        var reader = new FileReader();
        reader.onload = function(){
        var output = document.getElementById('output3');
        output.src = reader.result;
        img3 = event.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    $("#post-book").on("click",function(){
        var postBook = new XMLHttpRequest();
        postBook.onload = function(){
            if(postBook.readyState = XMLHttpRequest.DONE){
                if(postBook.status === 200){
                    $("#sell").html("Book Uploaded successfully!");
                }else{
                    $("#sell").html(postBook.responseText);
                }
            }
        }
        var name = $("#book-name").val().trim();
        var author = $("#author").val().trim();
        var publisher = $("#publsiher").val().trim();
        var condition_id = $("#condtion").val();
        var year = $("#year").val();
        var price = $("#price").val();
        var stream = $("#stream").val();
        var memo = $("#memo").val();
        postBook.open('POST', 'http://localhost:8080/add-book', true);
        postBook.setRequestHeader('Content-Type', 'application/json');
        postBook.send(JSON.stringify({name:name,author:author,publisher:publisher,condition_id:condition,price:price,year:year,stream:stream,memo:memo,image_1:img1;image_2:img2;image_3:img3}));
    });
});