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
});

    $("#file-upload-3").on("change",function(){
        var loadFile3 = function(event){
        var reader = new FileReader();
        reader.onload = function(){
        var output = document.getElementById('output3');
        output.src = reader.result;
        };
        reader.readAsDataURL($("#file-upload-3").get(0).files[0]);
    };
    loadFile3(event);
    $("#photos-validation-button").click();
});


$("#photos-validation-button").on("click",function(){
    var img1;
    var img2;
    var img3;

    var reader1 = new FileReader();
    reader1.onload = function(){
       $("#img1-base64").append(event.target.result);
    }
    reader1.readAsDataURL($("#file-upload-1").get(0).files[0]);
    
    var reader2 = new FileReader();
    reader2.onload = function(){
       $("#img2-base64").append(event.target.result);
    }
    reader2.readAsDataURL($("#file-upload-3").get(0).files[0]);

    var reader3 = new FileReader();
    reader3.onload = function(){
        $("#img3-base64").append(event.target.result);
    }
    reader3.readAsDataURL($("#file-upload-3").get(0).files[0]);   
});

//XHR for posting book
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
        var publisher = $("#publisher").val().trim();
        var condition = $("#condition").attr('value');
        var year = $("#year").val();
        var price = $("#price").val();
        var stream = $("#stream").val();
        var memo = $("#memo").val();
        var img1 = $("#img1-base64").text();
        var img2 = $("#img2-base64").text();
        var img3 = $("#img3-base64").text();
        postBook.open('POST', 'http://localhost:8080/add-book', true);
        postBook.setRequestHeader('Content-Type', 'application/json');
        var book = {name:name,author:author,publisher:publisher,condition_id:condition,price:price,year:year,stream_id:stream,memo:memo,image_1:img1,image_2:img2,image_3:img3};
       console.log(book);
        postBook.send(JSON.stringify(book));
    });
 });