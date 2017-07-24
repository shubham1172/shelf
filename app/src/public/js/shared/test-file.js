$(document).ready(function(){
    $('#upload').click(function(){
    var reader = new FileReader();
    reader.onload = function(event){
      console.log(event.target.result);
      var request = new XMLHttpRequest();
      request.onload = function(){
      if(request.readystate = XMLHttpRequest.DONE){
          if(request.status === 200){
                 $('body').append("<br>DONE!");
          }else{
                 $('body').append("<br>NOT DONE!");
          }
        }
      }
      request.open('POST','http://shubham1172.hasura.me/test-file',true);
      request.setRequestHeader('Content-Type', 'application/json');
      request.send(JSON.stringify({photo: event.target.result}));
    };
    reader.readAsDataURL($("#test").get(0).files[0]);
  });
});

var loadFile = function(event) {
        var reader = new FileReader();
        reader.onload = function(){
        var output = document.getElementById('output');
        output.src = reader.result;
        img = event.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
};