var Browser = require("zombie");
var assert = require("assert");

browser = new Browser()

var baseUrl = process.argv[2] || 'http://localhost:8080'

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
