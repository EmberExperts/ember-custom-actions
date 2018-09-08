define('ember-bootstrap/components/base/bs-navbar/toggle', ['exports', 'ember-bootstrap/templates/components/bs-navbar/toggle'], function (exports, _toggle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _toggle.default,
    tagName: 'button',

    classNameBindings: ['collapsed'],
    collapsed: true,

    /**
     * @event onClick
     * @public
     */
    onClick() {},

    click() {
      this.onClick();
    }

  });
});