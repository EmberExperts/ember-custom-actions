define('ember-bootstrap/components/base/bs-dropdown/toggle', ['exports', 'ember-bootstrap/mixins/dropdown-toggle'], function (exports, _dropdownToggle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_dropdownToggle.default, {
    /**
     * Defaults to a `<a>` tag. Change for other types of dropdown toggles.
     *
     * @property tagName
     * @type string
     * @default a
     * @public
     */
    tagName: 'a',

    attributeBindings: ['href'],

    /**
     * @property inNav
     * @type {boolean}
     * @private
     */
    inNav: false,

    /**
     * Computed property to generate a `href="#"` attribute when `tagName` is "a".
     *
     * @property href
     * @type string
     * @readonly
     * @private
     */
    href: Ember.computed('tagName', function () {
      if (this.get('tagName').toUpperCase() === 'A') {
        return '#';
      }
    }),

    /**
     * When clicking the toggle this action is called.
     *
     * @event onClick
     * @param {*} value
     * @public
     */
    onClick: function onClick() {},
    click: function click(e) {
      e.preventDefault();
      this.get('onClick')();
    }
  });
});