define('ember-bootstrap/mixins/dropdown-toggle', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Mixin.create({
    classNames: ['dropdown-toggle'],

    /**
     * @property ariaRole
     * @default button
     * @type string
     * @protected
     */
    ariaRole: 'button',

    /**
     * Reference to the parent dropdown component
     *
     * @property dropdown
     * @type {Components.Dropdown}
     * @private
     */
    dropdown: null,

    didReceiveAttrs: function didReceiveAttrs() {
      this._super.apply(this, arguments);
      var dropdown = this.get('dropdown');
      if (dropdown) {
        Ember.run.schedule('actions', this, function () {
          if (!this.get('isDestroyed')) {
            dropdown.set('toggle', this);
          }
        });
      }
    }
  });
});