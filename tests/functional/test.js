var Browser = require("zombie");
var assert = require("assert");
var nconf = require('nconf');
var request = require('request');
var io = require('socket.io-client');

nconf.argv().env().file(__dirname + '/../../config/' + (process.env.NODE_ENV || 'development') + '.json');

var baseUrl = 'http://' + nconf.get('host') + ':' + nconf.get('port');

browser = new Browser()

describe('SocketHooked (' + baseUrl + ')', function () {
  it('should have a start page', function (done) {
    browser.visit(baseUrl + "/", function () {
      assert.ok(browser.success);
      assert.equal(browser.text(), "Hello World");
      done();
    });
  });
  it('should have a revision page', function (done) {
    browser.visit(baseUrl + "/revision", function () {
      assert.ok(browser.success);
      assert.ok(browser.text().trim().match(/^[0-9a-f]{7}$/));
      done();
    });
  });
  describe('Listeners to /channel/1234', function () {
    it('should receive web hooks posted to /channel/1234', function (done) {
      var socket = io.connect(baseUrl);
      var expected = {data: "Hello, World!"};

      socket.on('webhook', function (data) {
        assert.deepEqual(data, expected);
        done();
      });

      socket.on('connect', function () {
        socket.emit('listen', '1234');

        process.nextTick(function () {
          request({url: baseUrl + "/channel/1234", method: 'POST', json: expected}, function(err, response, body) {
            assert.equal(err, null);
            assert.equal(response.statusCode, 200);
          });
        });
      });
    });
  });
});
