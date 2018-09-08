define('ember-bootstrap/components/base/bs-accordion', ['exports', 'ember-bootstrap/templates/components/bs-accordion', 'ember-bootstrap/utils/listen-to-cp'], function (exports, _bsAccordion, _listenToCp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _bsAccordion.default,
    ariaRole: 'tablist',

    /**
     * The value of the currently selected accordion item. Set this to change selection programmatically.
     *
     * When the selection is changed by user interaction this property will not update by using two-way bindings in order
     * to follow DDAU best practices. If you want to react to such changes, subscribe to the `onChange` action
     *
     * @property selected
     * @public
     */
    selected: null,

    /**
     * The value of the currently selected accordion item
     *
     * @property isSelected
     * @private
     */
    isSelected: (0, _listenToCp.default)('selected'),

    /**
     * Action when the selected accordion item is about to be changed.
     *
     * You can return false to prevent changing the active item, and do that in your action by
     * setting the `selected` accordingly.
     *
     * @event onChange
     * @param newValue
     * @param oldValue
     * @public
     */
    onChange: function onChange(newValue, oldValue) {},
    // eslint-disable-line no-unused-vars

    actions: {
      change: function change(newValue) {
        var oldValue = this.get('isSelected');
        if (oldValue === newValue) {
          newValue = null;
        }
        if (this.get('onChange')(newValue, oldValue) !== false) {
          this.set('isSelected', newValue);
        }
      }
    }

  });
});