
 $(document).ready(function(){

     var streamReq = new XMLHttpRequest();
     streamReq.onload = function(){
            if(streamReq.readystate = XMLHttpRequest.DONE){
                if(streamReq.status === 200){
                    console.log(streamReq.responseText);
                    var response = JSON.parse(streamReq.responseText);
                    var test = {};
                    for(var i=0;i<response.length;i++){
                      console.log(response[i].stream);
                      test[response[i].stream] = null;
                    }
                    console.log(JSON.stringify(test));
                     $('input.select-stream').autocomplete({
                    data: test,
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
    streamReq.send(null)
  $('input.select-college').autocomplete({
    data: {
      "Apple": null,
      "Microsoft": null,
      "Google": 'https://placehold.it/250x250'
    },
    limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
    onAutocomplete: function(val) {
      // Callback function when value is autcompleted.
    },
    minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
  });



 });
