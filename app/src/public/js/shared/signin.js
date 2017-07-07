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

    //Handling username-entry 
 $('#username').on("keyup",function(){
          //code for empty username entry
          if($("#username").val().trim()==""){
              $("#username-label").html("Username");
          }else{
            //XHR for getting username - returns boolean value 
            userCheck = true;
            var userReq = new XMLHttpRequest();
            userReq.onload = function(){
              if(userReq.readystate = XMLHttpRequest.DONE){
                  if(userReq.status === 200){
                    if(userReq.responseText=='true'){
                      $("#username-label").html("No such user available! :(");
                    }else{
                      $("#username-label").html("Hello :)");
                    }
                  }else if(userReq.status === 403){
                    console.log(userReq.responseText);
                  }
              }
          }
         username = $("#username").val();
         userReq.open('GET','http://localhost:8080/check-username?val='+username,true);
         userReq.send(null);
          }

      });

//XHR for login - Log in the user 
    $("#signin-button").on("click",function(){
        console.log("clicked");
        var login = new XMLHttpRequest();
        login.onload = function(){
            if(login.readystate = XMLHttpRequest.DONE){
                if(login.status === 200){
                    //console.log(login.responseText);
                    window.location.href = "http://localhost:8080/user-console.html";
                }else if(login.status === 404){
                    $("#contents").html("Invalid credentials");

                }else{
                    console.log(login.responseText);
                }
            }
        }
        var username = $("#username").val();
        var password = $("#password").val();
        login.open('POST', 'http://localhost:8080/login', true);
        login.setRequestHeader('Content-Type', 'application/json');
        login.send(JSON.stringify({username:username,password:password}));
    });

});