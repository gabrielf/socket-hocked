var express = require('express');
var app = express();
var nconf = require('nconf');

nconf.argv().env().file(__dirname + '/config/' + (process.env.NODE_ENV || 'development') + '.json');

app.get('/', function(req, res) {
  var body = 'Hello World';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

var port = nconf.get('port');
app.listen(port);
console.log('Listening on port: ' + port);
