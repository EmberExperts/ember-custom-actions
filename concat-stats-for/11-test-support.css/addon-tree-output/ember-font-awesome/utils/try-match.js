define('ember-font-awesome/utils/try-match', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (object, regex) {
    return typeof object === 'string' && object.match(regex);
  };
});