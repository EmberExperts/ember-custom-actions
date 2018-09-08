define('ember-bootstrap/mixins/transition-support', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Mixin.create({

    /**
     * @property transitionsEnabled
     * @type boolean
     * @private
     */
    transitionsEnabled: Ember.computed.reads('fade'),

    /**
     * Access to the fastboot service if available
     *
     * @property fastboot
     * @type {Ember.Service}
     * @private
     */
    fastboot: Ember.computed(function () {
      let owner = Ember.getOwner(this);
      return owner.lookup('service:fastboot');
    }),

    /**
     * Use CSS transitions?
     *
     * @property usesTransition
     * @type boolean
     * @readonly
     * @private
     */
    usesTransition: Ember.computed('fade', 'fastboot.isFastBoot', function () {
      return !this.get('fastboot.isFastBoot') && this.get('transitionsEnabled');
    })
  });
});