define('ember-bootstrap/mixins/component-parent', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Mixin.create({

    /**
     * Array of registered child components
     *
     * @property children
     * @type array
     * @protected
     */
    children: null,

    init() {
      this._super(...arguments);
      this.set('children', Ember.A());
    },

    /**
     * Register a component as a child of this parent
     *
     * @method registerChild
     * @param child
     * @public
     */
    registerChild(child) {
      Ember.run.schedule('actions', this, function () {
        this.get('children').addObject(child);
      });
    },

    /**
     * Remove the child component from this parent component
     *
     * @method removeChild
     * @param child
     * @public
     */
    removeChild(child) {
      Ember.run.schedule('actions', this, function () {
        this.get('children').removeObject(child);
      });
    }
  });
});