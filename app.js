var express = require('express');
var app = express();
var nconf = require('nconf');
var exec = require('child_process').exec;

nconf.argv().env().file(__dirname + '/config/' + (process.env.NODE_ENV || 'development') + '.json');

app.get('/', function(req, res) {
  var body = 'Hello World';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

app.get('/revision', function(req, res) {
  exec('git rev-parse --short HEAD', function (err, stdout, stderr) {
    var revision;
    if (err) {
      revision = 'Could not read git revision: ' + stderr;
    } else {
      revision = stdout;
    }
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', revision.length);
    res.end(revision);
  });
});

var port = nconf.get('port');
app.listen(port);
console.log('Listening on port: ' + port);
