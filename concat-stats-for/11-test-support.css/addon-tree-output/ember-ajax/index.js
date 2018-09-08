define('ember-ajax/index', ['exports', 'ember-ajax/request'], function (exports, _request) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _request.default;
    }
  });
});