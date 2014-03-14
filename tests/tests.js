/*jslint browser:true, indent:2, node:true*/
/*global mocha, suite, test, suiteSetup, suiteTeardown, setup, teardown*/ // Mocha

var BicyclePump, chai;

(function (global) {
  'use strict';
  var div;
  if (!BicyclePump) {
    BicyclePump = require('../bicyclepump');
    return; // we aren't in the browser
  }
  if (global.document) {
    div = document.getElementById('mocha');
    if (!div) {
      // add Mocha's div if it is missing
      document.body.insertAdjacentHTML('afterbegin', '<div id="mocha"></div>');
    }
    mocha.setup('tdd');
  }
}(this));


suite('BicyclePump.js', function () {
  'use strict';
  var assert;

  suiteSetup(function () {
    assert = (chai || require('chai')).assert;
  });

  suite('new BicyclePump', function () {
    var bp;

    suiteSetup(function () {
      bp = new BicyclePump();
    });

    test('result has correct prototype chain and .constructor', function () {
      assert.instanceOf(bp, BicyclePump);
      assert.equal(bp.constructor, BicyclePump);
    });

  });

});

if (this.navigator) {
  mocha.run(); // auto-start Mocha for web browsers
}
