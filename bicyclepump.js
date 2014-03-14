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

  var BicyclePump;

  /**
   * @callback inflator
   */

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

    return this;
  };

  return BicyclePump;
}));
