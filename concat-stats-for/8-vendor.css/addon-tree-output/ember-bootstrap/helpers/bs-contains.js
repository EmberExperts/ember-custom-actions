define('ember-bootstrap/helpers/bs-contains', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.bsContains = bsContains;
  function bsContains(params /* , hash*/) {
    return Ember.isArray(params[0]) ? Ember.A(params[0]).includes(params[1]) : false;
  }

  exports.default = Ember.Helper.helper(bsContains);
});