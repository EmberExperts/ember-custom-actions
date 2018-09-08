define('ember-initials/utils/hash', ['exports', 'md5'], function (exports, _md) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = hash;
  function hash(object = {}) {
    return (0, _md.default)(serialize(object));
  }

  function serialize(obj) {
    if (Array.isArray(obj)) {
      return JSON.stringify(obj.map(i => serialize(i)));
    } else if (typeof obj === 'object' && obj !== null) {
      return Object.keys(obj).sort().map(k => `${k}:${serialize(obj[k])}`).join('|');
    }

    return obj;
  }
});