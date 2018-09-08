define('ember-bootstrap/components/base/bs-modal/header/close', ['exports', 'ember-bootstrap/templates/components/bs-modal/header/close'], function (exports, _close) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _close.default,
    tagName: 'button',
    classNames: ['close'],
    attributeBindings: ['type', 'aria-label'],
    'aria-label': 'Close',
    type: 'button',

    /**
     * @event onClick
     * @public
     */
    onClick: function onClick() {},
    click: function click() {
      this.get('onClick')();
    }
  });
});