var Browser = require("zombie");
var assert = require("assert");
var nconf = require('nconf');

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
});
