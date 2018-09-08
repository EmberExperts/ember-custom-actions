define('ember-ajax/mixins/ajax-support', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Mixin.create({
    /**
     * The AJAX service to send requests through
     *
     * @property {AjaxService} ajaxService
     * @public
     */
    ajaxService: Ember.inject.service('ajax'),

    /**
     * @property {string} host
     * @public
     */
    host: Ember.computed.alias('ajaxService.host'),

    /**
     * @property {string} namespace
     * @public
     */
    namespace: Ember.computed.alias('ajaxService.namespace'),

    /**
     * @property {object} headers
     * @public
     */
    headers: Ember.computed.alias('ajaxService.headers'),

    ajax: function ajax(url) {
      var augmentedOptions = this.ajaxOptions.apply(this, arguments);

      return this.get('ajaxService').request(url, augmentedOptions);
    }
  });
});