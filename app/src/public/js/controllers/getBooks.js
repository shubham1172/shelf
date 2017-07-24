 /**
 * @author: Amey Parundekar
 * get-books
 */
app.controller('getBooks', function($scope, $http) { 
    $http.get("http://shubham1172.hasura.me/get-books").success(function(response){
        $scope.books = response;
        console.log(response);
    }); 
});