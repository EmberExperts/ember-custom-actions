define('ember-bootstrap/components/bs-nav', ['exports', 'ember-bootstrap/components/base/bs-nav'], function (exports, _bsNav) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _bsNav.default.extend({
    classNameBindings: ['stacked:nav-stacked']
  });
});