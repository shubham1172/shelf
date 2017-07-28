/**
 * @author: Amey Parundekar
 * search-books
 */

app.controller('searchBook', function($scope, $http){ 
    $('#search-box').keypress(function(e){
        if(e.which == 13){
            console.log('pressed enter');
            var query = $('#search-box').val();
            $http.get("http://localhost:8080/search?q="+query).success(function(response){
            $scope.books = response;
            console.log(response);
            });

            var curr = 0;
            var i = setTimeout(function(){
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
        }
    });
});
