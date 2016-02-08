// Dependencies
var express = require('express');
var bodyParser = require('body-parser');

// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));

// Get and validate data
app.post('/index', function(req, res) {
    console.log("Information received !");
    
    var iputData = Object.keys(req.body)[0];
    console.log(iputData);
    if (/^[\w\s]+$/.test(iputData)) {
    	res.send(true);
    } else res.send(false);
});

// Start server
app.listen(8888);
console.log('Server is running!');
