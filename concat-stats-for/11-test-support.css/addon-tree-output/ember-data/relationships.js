define('ember-data/relationships', ['exports', 'ember-data/-private'], function (exports, _private) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'belongsTo', {
    enumerable: true,
    get: function () {
      return _private.belongsTo;
    }
  });
  Object.defineProperty(exports, 'hasMany', {
    enumerable: true,
    get: function () {
      return _private.hasMany;
    }
  });
});