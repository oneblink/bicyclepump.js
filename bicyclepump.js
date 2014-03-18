/*jslint indent:2, node:true*/
/*global define, require*/ // Require.JS

// if the module has no dependencies, the above pattern can be simplified to
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.BicyclePump = factory();
  }
}(this, function () {
  'use strict';

  /**
   * @module bicyclepump
   */

  var BicyclePump, asyncExec, asyncForEach;

  // https://github.com/caolan/async/blob/master/lib/async.js#L75
  // asynchronous execution with browser-compatible fallback
  if (typeof setImmediate === 'function') {
    asyncExec = function (fn) {
      // not a direct alias for IE10 compatibility
      setImmediate(fn);
    };
  } else if (typeof process === 'object' && process && process.nextTick) {
    asyncExec = process.nextTick;
  } else {
    asyncExec = function (fn) {
      setTimeout(fn, 0);
    };
  }

  // https://github.com/caolan/async/blob/master/lib/async.js#L127
  // inspired by async.eachSeries, but tailored for BicyclePump
  asyncForEach = function (arr, obj, callback) {
    var index, inflator, iterate, noop, done, next;
    index = arr.length;
    noop = function () { return true; };
    callback = callback || noop;
    done = function (result) {
      result = result || new Error('inflation returned no result');
      if (result instanceof Error) {
        callback(result);
        callback = noop;
      } else {
        asyncExec(function () {
          callback(null, result);
        });
      }
    };
    next = function () {
      asyncExec(iterate);
    };
    iterate = function () {
      index -= 1;
      inflator = arr[index];
      inflator(obj, done, next);
    };
    iterate();
  };

  /**
   * @public
   * @constructor BicyclePump
   * @alias module:bicyclepump
   */
  BicyclePump = function () {
    /**
     * @property {inflator[]} inflators
     */
    var inflators;

    inflators = [];

    /**
     * @public
     * @memberof BicyclePump#
     * @param {inflator} fn
     */
    this.addInflator = function (fn) {
      if (typeof fn === 'function') {
        inflators.push(fn);
      }
    };

    /**
     * @public
     * @memberof BicyclePump#
     * @param {inflator} fn
     */
    this.removeInflator = function (fn) {
      var index;
      index = inflators.indexOf(fn);
      inflators.splice(index, 1);
    };

    /**
     * @public
     * @memberof BicyclePump#
     * @return {inflator[]}
     */
    this.getInflators = function () {
      var copy;
      copy = [];
      copy.push.apply(copy, inflators);
      return copy;
    };

    /**
     * @public
     * @memberof BicyclePump#
     * @param {Object} obj
     * @param {Function} [callback]
     * @return {Promise} but only if ES6 Promises are available
     */
    this.inflate = function (obj, callback) {
      var done;
      if (!obj) {
        throw new Error('need something to inflate');
      }
      if (!inflators.length) {
        throw new Error('need to register an Inflator first');
      }
      done = function (err, result) {
        if (typeof callback === 'function') {
          callback(err, result);
        }
      };
      if (typeof Promise === 'function') {
        return new Promise(function (resolve, reject) {
          asyncForEach(inflators, obj, function (err, result) {
            done(err, result);
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      }
      asyncForEach(inflators, obj, done);
    };

    return this;
  };

  return BicyclePump;
}));
