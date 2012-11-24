var Browser = require("zombie");
var assert = require("assert");
var nconf = require('nconf');

nconf.argv().env().file(__dirname + '/../../config/' + (process.env.NODE_ENV || 'development') + '.json');

var baseUrl = 'http://' + nconf.get('host') + ':' + nconf.get('port');

browser = new Browser()

describe('SocketHooked (' + baseUrl + ')', function () {
  it('should have a start page', function () {
    browser.visit(baseUrl + "/", function () {
      assert.ok(browser.success);
      assert.equal(browser.text(), "Hello World");
    });
  });
});

//  // Fill email, password and submit form
//  browser.
//    fill("email", "zombie@underworld.dead").
//    fill("password", "eat-the-living").
//    pressButton("Sign Me Up!", function() {
//
//      // Form submitted, new page loaded.
//      assert.ok(browser.success);
//      assert.equal(browser.text("title"), "Welcome To Brains Depot");
//
//    })
