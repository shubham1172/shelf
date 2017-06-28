/**
 * @author: Shubham Sharma
 * Configuration file
 */

 var config = {}; //configuration data

 //SETUP configuration

 //PORT NUMBER
 config.PORT_NUMBER = 8080;
 //PERMITTED_URLS for auth
 config.PERMITTED_URLS = ["/", "/register", "/logout", "/login", "/check-eligible"];
 //HTTP_CODES used in app
 config.HTTP_CODES = {OK: 200, BAD_REQUEST: 400, FORBIDDEN: 403, SERVER_ERROR: 500};
 //DOMAIN
 config.DOMAIN = "c100.hasura.me";

 module.exports = config; //export
