define('ember-resolver/resolver', ['exports', 'ember-resolver/resolvers/classic'], function (exports, _classic) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _classic.default;
    }
  });
});