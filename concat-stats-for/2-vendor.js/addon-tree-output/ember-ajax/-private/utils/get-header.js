define('ember-ajax/-private/utils/get-header', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getHeader;


  /**
   * Do a case-insensitive lookup of an HTTP header
   *
   * @function getHeader
   * @private
   * @param {Object} headers
   * @param {string} name
   * @return {string}
   */
  function getHeader(headers, name) {
    if (Ember.isNone(headers) || Ember.isNone(name)) {
      return; // ask for nothing, get nothing.
    }

    var matchedKey = Ember.A(Object.keys(headers)).find(function (key) {
      return key.toLowerCase() === name.toLowerCase();
    });

    return headers[matchedKey];
  }
});