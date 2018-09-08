define('@ember-decorators/argument/errors', ['exports', '@ember-decorators/argument/-debug'], function (exports, _debug) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'MutabilityError', {
    enumerable: true,
    get: function () {
      return _debug.MutabilityError;
    }
  });
  Object.defineProperty(exports, 'RequiredFieldError', {
    enumerable: true,
    get: function () {
      return _debug.RequiredFieldError;
    }
  });
  Object.defineProperty(exports, 'TypeError', {
    enumerable: true,
    get: function () {
      return _debug.TypeError;
    }
  });
});