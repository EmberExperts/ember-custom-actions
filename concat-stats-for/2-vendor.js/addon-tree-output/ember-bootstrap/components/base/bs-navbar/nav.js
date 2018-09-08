define('ember-bootstrap/components/base/bs-navbar/nav', ['exports', 'ember-bootstrap/components/bs-nav'], function (exports, _bsNav) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _bsNav.default.extend({
    classNames: ['navbar-nav'],

    didReceiveAttrs: function didReceiveAttrs() {
      this._super.apply(this, arguments);
      this.set('justified', false);
    }
  });
});