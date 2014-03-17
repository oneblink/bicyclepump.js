/*jslint indent:2, node:true*/
'use strict';

// karma.conf.js
module.exports = function (config) {
  config.set({
    autoWatch: true,
    files: [
      'node_modules/mocha/mocha.css', // Karma loads mocha.js
      'node_modules/chai/chai.js',
      'bicyclepump.js',
      'tests/tests.js'
    ],
    browsers: [
      'PhantomJS',
      'Chrome',
      'Firefox',
      'Safari',
      'IE8 - WinXP',
      'IE9 - Win7',
      'IE10 - Win7',
      'IE11 - Win7'
    ],
    frameworks: ['mocha'],
    client: {
      mocha: {
        ui: 'tdd'
      }
    }
  });
};
