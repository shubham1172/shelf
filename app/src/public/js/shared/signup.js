 /**
 * @author: Amey Parundekar
 * signup handler
 */

 $(document).ready(function(){
//variables
var collegeId = {};
var streamId = {};
var name;
var username;
var year;
var contact;
var email;
var university;
var password;
var branch;

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

//XHR for getting colleges - returns college name and ID
       var collegeReq = new XMLHttpRequest();
       collegeReq.onload = function(){
              if(collegeReq.readystate = XMLHttpRequest.DONE){
                  if(collegeReq.status === 200||collegeReq.status === 304){
                      var college = JSON.parse(collegeReq.responseText);
                      var collegeTemp = {};
                      for(var i=0;i<college.length;i++){
                        collegeTemp[college[i].name] = null;
                      }
                      for(var i=0;i<college.length;i++){
                        collegeId[college[i].name] = college[i].id;
                      }
                      $('input.select-college').autocomplete({
                            data: collegeTemp,
                            limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
                            onAutocomplete: function(val) {
                              // Callback function when value is autcompleted.
                            },
                            minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
                            });
                  }
                  if(collegeReq.status === 403 ){
                      console.log(collegeReq.responseText);
                  }
              }
      }
      collegeReq.open('GET','http://localhost:8080/get-colleges',true);
      collegeReq.send(null);

//Handling username-entry 
 $('#username').on("keyup",function(){
          //code for empty username entry
          if($("#username").val()==""){
              $("#username-label").html("Username");
          }else{
            //XHR for getting username - returns boolean value 
          var userReq = new XMLHttpRequest();
          userReq.onload = function(){
              if(userReq.readystate = XMLHttpRequest.DONE){
                  if(userReq.status === 200){
                    if(userReq.responseText=='false'){
                      $("#username-label").html("Username not available! :(");
                    }else{
                      $("#username-label").html("Username Available! :)");
                    }
                  }
                  else if(userReq.status === 403){
                    console.log(userReq.responseText);
                  }
              }
          }
         username = $("#username").val();
         userReq.open('GET','http://localhost:8080/check-username?val='+username,true);
         userReq.send(null);
          }

      });

//Loading page for password. 
    $("#signup-form-part1-submit").click(function(){

//Getting values
        year = $("input[name=year]:checked").val()
        email = $("#email").val();
        contact = $("#contact").val();
        branch = $("#stream").val();
        name = $("#name").val();
        university = $("#college").val();
        username = $("#username").val();
        $("#university").html(university);
        $("#signup-box").html('Hey <span id="signup-form-header"> Sign Up</span>'+'welcome to SHELF at<b> '+university+'</b>. '+'<br><br>Set a password to continue.');
        $("#signup-form-header").html(name+', ');
        $("#signup-box").append('<br><br><div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">\
            <input class="mdl-textfield__input" type="password" id="password" placeholder="Password">\
        </div><br>')
        $("#signup-box").append('<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" id="signup-form-part2-submit">\
  SIGN UP\
</button>');

//POST request for SIGN UP
        $("#signup-form-part2-submit").on("click",function(){
              console.log(year,branch,email,contact,name,university,username,streamId[branch],collegeId[university]);
              password = $("#password").val();
              var signup = new XMLHttpRequest();
              signup.onload = function(){
                  if(signup.readystate = XMLHttpRequest.DONE){
                    if(signup.status === 200){
                      $("signup-box").html("You have been logged in.");
                    }else if(signup === 403){
                      console.log(signup.responseText);
                    }
                  }
              }
              signup.open('POST', 'http://localhost:8082/register', true);
              signup.setRequestHeader('Content-Type', 'application/json');
              signup.send(JSON.stringify({name:name,username:username,year:year,stream_id:streamId[branch],college_id:collegeId[university],mobile:contact, password: password}));
        });
    });
 });