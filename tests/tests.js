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
      assert.isObject(bp);
      assert.instanceOf(bp, BicyclePump);
      assert.equal(bp.constructor, BicyclePump);
    });

    test('.getInflators() initially returns empty Array', function () {
      var inflators;
      inflators = bp.getInflators();
      assert.isArray(inflators);
      assert.lengthOf(inflators, 0);
    });

    test('.addInflator() and .getInflators()', function () {
      var inflator, inflators;
      inflator = function () { return true; };
      bp.addInflator(inflator);
      inflators = bp.getInflators();
      assert.isArray(inflators);
      assert.lengthOf(inflators, 1);
      assert.includeMembers(inflators, [inflator]);
    });

  });

});
