define('ember-bootstrap/components/base/bs-navbar/link-to', ['exports', 'ember-bootstrap/components/bs-nav/link-to'], function (exports, _linkTo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _linkTo.default.extend({

    /**
     * @property collapseNavbar
     * @type {Boolean}
     * @default true
     * @public
     */
    collapseNavbar: true,

    /**
     * @event onCollapse
     * @private
     */
    onCollapse: function onCollapse() {},
    click: function click() {
      if (this.get('collapseNavbar')) {
        this.onCollapse();
      }
    }
  });
});