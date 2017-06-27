$(document).ready(function() {
  console.log("Loaded!");
  var toSend = {
    "username": "lol",
    "password": "haha"
  };
  var loginXHR = new XMLHttpRequest;
  loginXHR.onreadystatechange = function(){
      if(loginXHR.readyState == 4){
          if(loginXHR.status==200){
              //do something
              console.log(loginXHR.responseText);
          }else{
              console.log(loginXHR.responseText);
          }
      }
  }
  loginXHR.open("POST",'/login');
  loginXHR.setRequestHeader("Content-Type", "application/json");
  loginXHR.send(JSON.stringify(toSend));
});
