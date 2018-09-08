define('@ember-decorators/argument/type', ['exports', '@ember-decorators/argument/-debug'], function (exports, _debug) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'type', {
    enumerable: true,
    get: function () {
      return _debug.type;
    }
  });
  Object.defineProperty(exports, 'arrayOf', {
    enumerable: true,
    get: function () {
      return _debug.arrayOf;
    }
  });
  Object.defineProperty(exports, 'shapeOf', {
    enumerable: true,
    get: function () {
      return _debug.shapeOf;
    }
  });
  Object.defineProperty(exports, 'unionOf', {
    enumerable: true,
    get: function () {
      return _debug.unionOf;
    }
  });
  Object.defineProperty(exports, 'optional', {
    enumerable: true,
    get: function () {
      return _debug.optional;
    }
  });
  Object.defineProperty(exports, 'oneOf', {
    enumerable: true,
    get: function () {
      return _debug.oneOf;
    }
  });
});