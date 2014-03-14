/*jslint browser:true, indent:2, node:true*/
/*global mocha, suite, test, suiteSetup, suiteTeardown, setup, teardown*/ // Mocha

/*global BicyclePump*/ // code under test
/*jslint nomen:true*/ // Karma's global __karma__

(function (global) {
  'use strict';
  var div;
  if (!global.document) {
    return; // we aren't in the browser
  }
  div = document.getElementById('mocha');
  if (!div) {
    // add Mocha's div if it is missing
    document.body.insertAdjacentHTML('afterbegin', '<div id="mocha"></div>');
  }
  mocha.setup('tdd');
}(this));


suite('BicyclePump.js', function () {
  'use strict';

  test('', function () { return true; });

});

if (this.navigator && navigator.userAgent.indexOf('PhantomJS') < 0) {
  mocha.run(); // auto-start Mocha for real browsers
}
