 /**
 * @author: Amey Parundekar
 * get-books
 */
app.controller('getUploaded', function($scope, $http) { 
    $http.get("http://localhost:8080/get-uploaded").success(function(response){
        $scope.uploads = response;
        $scope.custom = {
            'remove': 'Remove',
            'edit': 'Edit',
            'add': 'Add'
        }
    }); 

    var i = setTimeout(function(){

        $('.book-action').each(function(){
            var This = $(this);
            if(This.children('.available').html()==='true'){
                console.log(This.children('.available').html());
                This.children('.add-removed-book').css('display','none');
            }else{
                This.children('.remove-book').css('display','none');
            }
        });
        //XHR for removing book
        $('.remove-book').on('click',function(){
            var bookId = $(this).parent().attr('id');
            var This = $(this);
            var remove = new XMLHttpRequest();
            remove.onload = function(){
                if(remove.readyState = XMLHttpRequest.DONE){
                    if(remove.status === 200||remove.status===304){
                        This.css('display','none');
                        This.next().css('display','inline');
                    }else{
                        console.log(remove.responseText);
                    }
                }
            }
            remove.open('GET','http://localhost:8080/remove-book?id='+bookId,true);
            remove.send(null);
        });

        $('.add-removed-book').on('click',function(){
            var This = $(this);
            var bookId = $(this).parent().attr('id');
            var addBook = new XMLHttpRequest();
            addBook.onload = function(){
                if(addBook.readyState = XMLHttpRequest.DONE){
                    if(addBook.status === 200){
                        This.css('display','none');
                        This.prev().css('display','block');
                    }else{
                        console.log(addBook.responseText);
                    }
                }
            }
            addBook.open('GET','http://localhost:8080/add-removed-book?id='+bookId,true);
            addBook.send(null);
        });
    },500);
});
