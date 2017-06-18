/**
 *  @author: Shubham Sharma
 *
 * Makes requests to Hasura's auth api
 */

 function login(username, password, res){
   //TODO: check username and password
   //TODO: call auth api on Hasura
   res.status(200).send("test-login");
 }

 function logout(res){
   res.status(200).send("test-logout");
 }

function register(username, password, email, mobile, res){
    res.status(200).send("test-register");
}

module.exports = {login, logout, register}
