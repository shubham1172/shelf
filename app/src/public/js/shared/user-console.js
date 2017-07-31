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
       $("#search-tab").fadeTo('fast',0);
      $("#sell-tab").css("color","green");
      $("#orders-tab").css("color","black");
      $("#primary-info-tab").css("color","black");
      $("#primary-info").css("display","none");
      $("#orders").css("display","none");
      $("#search-books").css("display","none");
      $("#sell").css("display","inline");
  });

  $("#primary-info-tab").on("click",function(){
      $("#search-tab").fadeTo('fast',0);
      $("#primary-info-tab").css("color","green");
      $("#orders-tab").css("color","black");
      $("#sell-tab").css("color","black");
      $("#orders").css("display","none");
      $("#sell").css("display","none");
      $("#search-books").css("display","none");
      $("#primary-info").css("display","inline");
  });

  $("#orders-tab").on("click",function(){
      $("#orders-tab").css("color","green");
      $("#sell-tab").css("color","black");
      $("#primary-info-tab").css("color","black");
      $("#sell").css("display","none");
      $("#primary-info").css("display","none");
      $("#search-tab").css("color","black");
      $("#search-books").css("display","none");
      $("#orders").css("display","inline");
      $("#search-tab").fadeTo('fast',100);
  });

   $("#search-tab").on("keyup",function(e){
       if(e.which == 13){
            $("#search-tab").css("color","green");
            $("#sell-tab").css("color","black");
            $("#primary-info-tab").css("color","black");
            $("#orders-tab").css("color","black");
            $("#sell").css("display","none");
            $("#orders").css("display","none");
            $("#primary-info").css("display","none");
            $("#search-books").css("display","inline");
       }
      
  });

    $('.tooltipped').tooltip({delay: 10});
    $('.modal').modal();
   
    /**
     * Contributed by Shubham Sharma
     */
    console.log(window.location.hash);
    if(window.location.hash==='#primary-info'){
        $('#primary-info-tab').click();
    }

    //XHR for edit contact
    $('#edit-contact').click(function(){
        $("#contact").css('display','none');
        $('#contact-edit').css('display','inline');
        $("#contact-edit").html('<div class="input-field book-input">\
                            <input id="mobile-edit" type="text" class="validate">\
                            <label for="mobile-edit">Mobile</label>\
                            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" id="edit-mobile-button">\
                            EDIT</button> <i class="material-icons" id="cancel-mobile-edit">indeterminate_check_box</i></div>');
        //console.log('clicked');
        $("#edit-mobile-button").click(function(){
            var editContact = new XMLHttpRequest();
            editContact.onload = function(){
                if(editContact.readyState = XMLHttpRequest.DONE){
                    if(editContact.status===200){
                       $("#contactinfo").html($('#mobile-edit').val());
                       $('#contact-edit').css('display','none');
                       $('#contact').css('display','inline');
                    }else{
                        console.log(editContact.response);
                    }
                }
            }
            var mobile = $("#mobile-edit").val();
            editContact.open('GET','http://localhost:8080/edit-mobile?new_mobile='+mobile,true);
            editContact.send(null);
        });

         $("#cancel-mobile-edit").on('click',function(){
            $('#contact-edit').css('display','none');
            $('#contact').css('display','inline');
        });
        
    });

   
// XHR for logging out
$('#logout').click(function(){
    var logout = new XMLHttpRequest();
    logout.onload = function(){
        if(logout.readyState = XMLHttpRequest.DONE){
            if(logout.status === 200){
                window.location.href = "http://localhost:8080/logout.html";
            }else{
                console.log(logout.responseText);
            }
        }
    }
    logout.open('GET','http://localhost:8080/logout',true);
    logout.send(null);
});




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


        //Edit Book
        $('.edit-book').on('click',function(){
            $('#book-edit-modal').modal('open');
            var bookId = $(this).prev().attr('id');
            var bookReq = new XMLHttpRequest();
            bookReq.onload = function(){
                if(bookReq.readyState = XMLHttpRequest.DONE){
                    if(bookReq.status === 200){
                        var data = JSON.parse(bookReq.responseText);
                        $('#book-name-edit').val(data.name);
                        $('#author-edit').val(data.author);
                        $('#publisher-edit').val(data.publisher);
                        $('#price-edit').val(data.price);
                        $('#year-edit').val(data.year);
                        $('#memo-edit').val(data.memo);
                        $('#edit-book').attr('name',data.id);
                    }else{
                        console.log(bookReq.responseText);
                    }
                }
            }
            bookReq.open('GET','http://localhost:8080/get-book?id='+bookId,true);
            bookReq.send(null);

            $("#edit-book").on("click",function(){
                var postBook = new XMLHttpRequest();
                postBook.onload = function(){
                    if(postBook.readyState = XMLHttpRequest.DONE){
                        if(postBook.status === 200){
                            $("#book-edit-modal").html("Book Edited successfully!");
                             var i = setTimeout(function(){
                            window.location.href = "http://localhost:8080/user-console.html#primary-info";
                            location.reload();
                             },100);
                        }else{
                            $("#book-edit-modal").html(postBook.responseText);
                        }
                    }
                }
                var bookId = $(this).attr('name');
                var name = $("#book-name-edit").val().trim();
                var author = $("#author-edit").val().trim();
                var publisher = $("#publisher-edit").val().trim();
                var year = $("#year-edit").val();
                var price = $("#price-edit").val();
                var memo = $("#memo-edit").val();
                postBook.open('POST', 'http://localhost:8080/edit-book', true);
                postBook.setRequestHeader('Content-Type', 'application/json');
                var book = {name:name,author:author,publisher:publisher,price:price,year:year,memo:memo,id:bookId};
            console.log(book);
                postBook.send(JSON.stringify(book));
            });
        });
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

