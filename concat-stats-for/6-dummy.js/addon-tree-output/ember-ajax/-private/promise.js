define('ember-ajax/-private/promise', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * AJAX Promise
   *
   * Sub-class of RSVP Promise that passes the XHR property on to the
   * child promise
   *
   * @extends RSVP.Promise
   * @private
   */
  class AJAXPromise extends Ember.RSVP.Promise {
    /**
     * Overriding `.then` to add XHR to child promise
     *
     * @public
     * @return {AJAXPromise} child promise
     */
    then() {
      const child = super.then(...arguments);

      child.xhr = this.xhr;

      return child;
    }
  }
  exports.default = AJAXPromise;
});