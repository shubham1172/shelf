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
nameCheck = false;
userCheck = false,
passCheck = false;

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
          if($("#username").val().trim()==""){
              $("#username-label").html("Username");
          }else if(($("#username").val().trim()).length>0&&($("#username").val().trim()).length<3){
              $("#username-label").html("Username must have 3 or more characters!");
          }else{
            //XHR for getting username - returns boolean value 
            userCheck = true;
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

//Handling Name entry
$("#name").on("keyup",function(){
    if($("#name").val().trim()==""){
      $("#name-label").html("Name");
    }else if(($("#name").val().trim()).length>0&&($("#name").val().trim()).length<3){
      $("#name-label").html("Name can't be less than 3 characters!");
    }else{
      nameCheck = true;
      $("#name-label").html("That's a great name! :)");
    }
});

//Email validation
function isEmail(testEmail) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(testEmail);
}

//Loading page for password. 
    $("#signup-form-part1-submit").click(function(){
        //Getting values
        year = $("input[name=year]:checked").val()
        email = $("#email").val();
        contact = $("#contact").val();
        branch = $("#stream").val();
        name = $("#name").val().trim();
        university = $("#college").val();
        username = $("#username").val();
        if(userCheck==false||nameCheck==false||isEmail(email)==false||streamId[branch]==undefined||collegeId[university]==undefined||contact.length<10){
          $("#signup-form-header").html("<h6 style='color:red; font-weight: bold'>Hmm, it seems something's wrong with your form. Please check for empty fields or errors and fix them. Then click on NEXT again. :)</h6>")
        }else{
            $("#university").html(university);
            $("#signup-box").html('Hey <span id="signup-form-header"> Sign Up</span>'+'welcome to SHELF at<b> '+university+'</b>. '+'<br><br><p id="pass-msg">Set a password to continue.\
                                    <br>It should be greater than 8 characters and less than 25.\
                                    <br>It should have at least one letter, one number and one special character.</p>');
            $("#signup-form-header").html(name+', ');
            $("#signup-box").append('<br><br><div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">\
                <input class="mdl-textfield__input" type="password" id="password" placeholder="Password">\
            </div><br>')
            $("#signup-box").append('<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" id="signup-form-part2-submit">\
                                      SIGN UP\
                                    </button>');

            //Password validation
            function isPassword(testPass){
              var regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
              return regex.test(testPass);
            }

            $("#password").on("keyup",function(){
              if($("#password").val().trim()==""){
                $("#pass-msg").html('<p id="pass-msg">Set a password to continue.\
                                    <br>It should be greater than 8 characters and less than 25.\
                                    <br>It should have at least one letter, one number and one special character.</p>');
              }else if(isPassword($("#password").val().trim())==false){
                $("#password").css("border-color","red");
                $("#pass-msg").html("Invalid Password. :(");
              }else{
                $("#password").css("border-color","green");
                $("#pass-msg").html("Great! Let's continue :)");
              }
            });


            //POST request for SIGN UP
            $("#signup-form-part2-submit").on("click",function(){
                  password = $("#password").val().trim();
                  if(isPassword(password)==false){
                     $("#pass-msg").html('<b style="color:red">Password must be more than 8 characters, have atleast one letter, one number and one special character.</b>');
                  }else{
                      var signup = new XMLHttpRequest();
                      signup.onload = function(){
                        if(signup.readystate = XMLHttpRequest.DONE){
                          if(signup.status === 200||signup.status === 304){

                              $("#signup-box").html("You have been signed up! :)<br> Check your mail to activate your account.\
                                                      <br> Then head <a href='http://localhost:8080/'>here</a> to login.");

                              $("#signup-box").append("<br><br><br><h2 style='color:blue'>Its free.</h2>\
                                                       <h2 style='color:yellow'>Its Open Sourced.</h2>\
                                                       <h2 style='color:red'>Its Yours.</h2>");
                          }else if(signup.status === 403){
                            console.log(signup.responseText);
                        }
                      }
                  } 
                      signup.open('POST', 'http://localhost:8080/register', true);
                      signup.setRequestHeader('Content-Type', 'application/json');
                      signup.send(JSON.stringify({name:name,username:username,year:year,email:email,stream_id:streamId[branch],college_id:collegeId[university],mobile:contact, password: password}));
                  }
                  
            });
        }
       
    });
 });