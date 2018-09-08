define('ember-initials/utils/hash', ['exports', 'md5'], function (exports, _md) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = hash;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function hash() {
    var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return (0, _md.default)(serialize(object));
  }

  function serialize(obj) {
    if (Array.isArray(obj)) {
      return JSON.stringify(obj.map(function (i) {
        return serialize(i);
      }));
    } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null) {
      return Object.keys(obj).sort().map(function (k) {
        return k + ':' + serialize(obj[k]);
      }).join('|');
    }

    return obj;
  }
});