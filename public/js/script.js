$(function () {
  var socket = io.connect('http://localhost');

  var channel = document.location.pathname.match(/channel\/(.*)/)[1];

  socket.on('webhook', function (data) {
    $('#messages').append($('<li>').text(JSON.stringify(data)));
  });

  socket.on('connect', function () {
    socket.emit('listen', channel);
  })
});
