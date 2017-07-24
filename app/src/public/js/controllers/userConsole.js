 /**
 * @author: Amey Parundekar
 * user-console
 */
app.controller('userConsole', function($scope, $http) { 
    $http.get("http://shubham1172.hasura.me/user-info").success(function(response){
        $scope.info = response;
        }); 
    });