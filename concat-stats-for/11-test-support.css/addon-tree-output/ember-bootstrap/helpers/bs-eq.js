define('ember-bootstrap/helpers/bs-eq', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.eq = eq;
  function eq(params) {
    return params[0] === params[1];
  }

  exports.default = Ember.Helper.helper(eq);
});