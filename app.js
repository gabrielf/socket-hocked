var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var nconf = require('nconf');
var exec = require('child_process').exec;

/**
 * As a courtesy to the next developer may we suggest that you write tests for new code. Thank you!
 */

nconf.argv().env().file(__dirname + '/config/' + (process.env.NODE_ENV || 'development') + '.json');

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.set('view engine', 'jade');
});

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

var channels = {};
var sockets = {};

app.get('/channel/:channel', function(req, res) {
  res.render('channel', {channel: req.params.channel});
});

app.post('/channel/:channel', function(req, res) {
  var sockets = channels[req.params.channel];
  if (!sockets) {
    console.log('Message to channel that noone listens to', req.params.channel);
    res.end();
    return;
  }
  console.log('got webhook call', req.body);
  sockets.forEach(function (socket) {
    socket.emit('webhook', req.body);
  });
  res.end();
});

io.configure(function () {
  io.set('log level', 2);
})

io.sockets.on('connection', function (socket) {

  socket.on('listen', function (channel) {
    console.log('new socket listening on channel', channel);

    if (!sockets[socket.id]) {
      sockets[socket.id] = [];
    }
    sockets[socket.id].push(channel);

    if (!channels[channel]) {
      channels[channel] = [];
    }
    channels[channel].push(socket);
  });

  socket.on('disconnect', function () {
    console.log('socket disconnected');

    if (!sockets[socket.id]) {
      return;
    }

    sockets[socket.id].forEach(function (channel) {
      if (!channels[channel] || channels[channel].indexOf(socket) == -1) {
        return;
      }

      channels[channel].splice(channels[channel].indexOf(socket), 1);

      if (channels[channel].length == 0) {
        delete channels[channel];
      }
    });

    delete sockets[socket.id];
  });
});

var port = nconf.get('port');
server.listen(port);
console.log('Listening on port: ' + port);
