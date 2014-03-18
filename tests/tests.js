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

  suite('BicyclePump#inflate() with no inflators', function () {
    var bp;

    suiteSetup(function () {
      bp = new BicyclePump();
    });

    test('inflate() initially fails when there are no Inflators', function () {
      assert.throws(function () {
        bp.inflate({});
      }, Error);
    });

  });

  suite('BicyclePump#inflate() with one Inflator', function () {
    var bp;

    suiteSetup(function () {
      var inflator;
      bp = new BicyclePump();
      inflator = function (obj, done) {
        done(obj);
      };
      bp.addInflator(inflator);
    });

    test('inflate() invokes Inflator', function (done) {
      bp.inflate({}, function (err, result) {
        assert(true, 'callback invoked');
        assert(!err, 'no error');
        assert.isObject(result);
        done();
      });
    });

    test('inflate() returns a Promise', function (done) {
      var promise;
      if (typeof Promise !== 'function') {
        assert(true, 'ES6 Promise not supported');
        done();
        return;
      }
      promise = bp.inflate({});
      assert.instanceOf(promise, Promise);
      assert.isFunction(promise.then);
      promise.then(function (result) {
        assert(true, 'onFulfilled invoked');
        assert.isObject(result);
        done();
      }, function () {
        assert(false, 'onRejected invoked');
        done();
      });
    });

  });

  suite('BicyclePump#inflate() with 1000x Inflators', function () {
    var bp;

    suiteSetup(function () {
      var i, inflator;
      bp = new BicyclePump();
      // stub inflator that always calls `next`
      inflator = function (obj, done, next) {
        if (obj) {
          next();
        } else {
          done(new Error('need something to inflate'));
        }
      };
      i = 1000;
      while (i > 0) {
        i -= 1;
        bp.addInflator(inflator);
      }
    });

    test('inflate() invokes Inflator', function (done) {
      var inflator;
      inflator = function (obj, done) {
        assert(true, 'inflator invoked');
        done(obj);
      };
      bp.addInflator(inflator);
      bp.inflate({}, function (err, result) {
        assert(true, 'callback invoked');
        assert(!err, 'no error');
        assert.isObject(result);
        done();
      });
    });

  });

  suite('BicyclePump#inflate() with one disruptive Inflator', function () {
    var bp;

    suiteSetup(function () {
      var inflator;
      bp = new BicyclePump();
      inflator = function (obj, done) {
        done(new Error('stop! ' + JSON.stringify(obj)));
      };
      bp.addInflator(inflator);
    });

    test('inflate() invokes Inflator', function (done) {
      bp.inflate({}, function (err, result) {
        assert(true, 'callback invoked');
        assert.instanceOf(err, Error);
        assert.isUndefined(result);
        done();
      });
    });

    test('inflate() returns a Promise', function (done) {
      var promise;
      if (typeof Promise !== 'function') {
        assert(true, 'ES6 Promise not supported');
        done();
        return;
      }
      promise = bp.inflate({});
      assert.instanceOf(promise, Promise);
      assert.isFunction(promise.then);
      promise.then(function () {
        assert(false, 'onFulfilled invoked');
        done();
      }, function (err) {
        assert(true, 'onRejected invoked');
        assert.instanceOf(err, Error);
        done();
      });
    });

  });

  suite('BicyclePump#inflate() with multiple working Inflators', function () {
    var bp, Cat, Dog;

    suiteSetup(function () {
      Cat = function (obj) {
        this.name = obj.name;
      };
      Cat.inflate = function (obj, done, next) {
        if (obj.rules === true) {
          done(new Cat(obj));
        } else {
          next();
        }
      };

      Dog = function (obj) {
        this.name = obj.name;
      };
      Dog.inflate = function (obj, done, next) {
        if (obj.drools === true) {
          done(new Dog(obj));
        } else {
          next();
        }
      };

      bp = new BicyclePump();
      bp.addInflator(Cat.inflate);
      bp.addInflator(Dog.inflate);
    });

    test('inflate({ name: "kitty", rules: true })', function (done) {
      bp.inflate({ name: 'kitty', rules: true }, function (err, result) {
        assert(true, 'callback invoked');
        assert(!err, 'no error');
        assert.instanceOf(result, Cat);
        assert.equal(result.name, 'kitty');
        done();
      });
    });

    test('inflate({ name: "puppy", drools: true })', function (done) {
      bp.inflate({ name: 'puppy', drools: true }, function (err, result) {
        assert(true, 'callback invoked');
        assert(!err, 'no error');
        assert.instanceOf(result, Dog);
        assert.equal(result.name, 'puppy');
        done();
      });
    });

  });

});
