 /**
 * @author: Amey Parundekar
 * user-console
 */
app.controller('userConsole', function($scope, $http) { 
    $http.get("http://localhost:8080/user-info").success(function(response){
        $scope.info = response;
        }); 
    });