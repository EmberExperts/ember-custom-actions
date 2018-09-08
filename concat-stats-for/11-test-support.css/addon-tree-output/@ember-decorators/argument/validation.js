define('@ember-decorators/argument/validation', ['exports', '@ember-decorators/argument/-debug'], function (exports, _debug) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'immutable', {
    enumerable: true,
    get: function () {
      return _debug.immutable;
    }
  });
  Object.defineProperty(exports, 'required', {
    enumerable: true,
    get: function () {
      return _debug.required;
    }
  });
});