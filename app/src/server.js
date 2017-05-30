var express = require('express');
var app = express();

//your routes here
app.get('/', function (req, res) {
    res.send("Hello, World! <br/> This is a test app by shubhamsharma1172@gmail.com");
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
