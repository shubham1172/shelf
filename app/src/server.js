var express = require('express');
var path = require('path');
var app = express();

//default route
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './public/html/index.html'));
});
//js
app.get('/scripts.js', function (req, res) {
    res.sendFile(path.join(__dirname, './public/js/scripts.js'));
});
//css
app.get('/styles.css', function (req, res) {
    res.sendFile(path.join(__dirname, './public/css/styles.css'));
});
app.listen(8080, function () {
  console.log('Web app started on 8080!');
});
