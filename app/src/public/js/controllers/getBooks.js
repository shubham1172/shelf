 /**
 * @author: Amey Parundekar
 * get-books
 */
app.controller('getBooks', function($scope, $http) { 
    $http.get("http://localhost:8080/get-books").success(function(response){
        $scope.books = response;
    }); 
});

