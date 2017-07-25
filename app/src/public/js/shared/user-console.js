/**
 * @author: Amey Parundekar, Shubham Sharma(getting photos coreectly)
 */
//Preloading animation.
document.onreadystatechange = function (){
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
$(document).ready(function(){
  $("#sell-tab").on("click",function(){
      $("#sell-tab").css("color","green");
      $("#orders-tab").css("color","black");
      $("#primary-info-tab").css("color","black");
      $("#primary-info").css("display","none");
      $("#orders").css("display","none");
      $("#sell").css("display","inline");
  });

  $("#primary-info-tab").on("click",function(){
      $("#primary-info-tab").css("color","green");
      $("#orders-tab").css("color","black");
      $("#sell-tab").css("color","black");
      $("#orders").css("display","none");
      $("#sell").css("display","none");
      $("#primary-info").css("display","inline");
  });

  $("#orders-tab").on("click",function(){
      $("#orders-tab").css("color","green");
      $("#sell-tab").css("color","black");
      $("#primary-info-tab").css("color","black");
      $("#sell").css("display","none");
      $("#primary-info").css("display","none");
      $("#orders").css("display","inline");
  });

    $('.tooltipped').tooltip({delay: 10});
     $('.modal').modal();
     
     
/** Contributed by Shubham Sharma & Amey Parundekar **/
    var curr = 0; //iterator index starting at 0

    var i = setTimeout(function(){
        $('.book').on("click",function(){
        var bookId = $(this).children('.bookId').html();
        $('#book-modal').modal('open');
        var bookReq = new XMLHttpRequest();
        bookReq.onload = function(){
            if(bookReq.readyState = XMLHttpRequest.DONE){
                if(bookReq.status === 200||bookReq.status === 304){
                    var book = JSON.parse(bookReq.responseText);
                    console.log(book);
                    $("#book-title-modal").html(book.name);
                    $("#book-author-modal").html('By '+book.author);
                    $("#book-publisher-modal").html('Published by '+book.publisher);
                    $("#book-memo-modal").html("About book: "+book.memo);
                    $("#book-user-modal").html("Name: "+book.user);
                    $("#book-contact-modal").html("Contact: "+book.mobile);
                    $("#book-year-modal").html("Year: "+book.year);
                    $("#book-stream-modal").html("Stream: "+book.type+", "+book.stream);
                    $("#cost").html("₹"+book.price);
                    $("#book-condition-modal").html(book.condition);
                    var photoid = book.photo_id;
                    //Photos
                    var photos = new XMLHttpRequest();
                    photos.onload = function(){
                        if(photos.readyState = XMLHttpRequest.DONE){
                            if(photos.status===200){
                                var photo = JSON.parse(photos.responseText);
                                $("#book-photo1-modal").attr('src',photo.image_1);
                                 $("#book-photo2-modal").attr('src',photo.image_2);
                            }else{
                                console.log(photos.responseText);
                            }
                        }
                    }
                    photos.open('GET','http://localhost:8080/get-photos?id='+photoid,true);
                    photos.send(null);

                }else{
                    console.log(bookReq.responseText);
                }
            }
        }
        console.log(bookId);
        bookReq.open('GET','http://localhost:8080/get-book?id='+bookId,true);
        bookReq.send(null);
     });
        var collection = document.getElementsByClassName('card-image');
        iterate(collection);
},500);

function iterate(collection){
    if(curr<collection.length)
        appendPhotos(collection, curr);
}

function appendPhotos(collection, it){
    var photo = new XMLHttpRequest();
    photo.onload = function(){
        if(photo.readyState = XMLHttpRequest.DONE){
                    if(photo.status===200){
                        var photoData = JSON.parse(photo.responseText);
                        console.log(photoData);
                        collection[it].childNodes[3].innerHTML = '<img src='+photoData.image_1+' height="100%" width="100%">';
                        curr++;
                        iterate(collection);
                    }
            }
    }
    photo.open('GET','http://localhost:8080/get-photos?id='+collection[it].childNodes[1].innerHTML,true);
    photo.send(null);
}


});

