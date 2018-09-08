define('dummy/components/model-action/component', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    store: Ember.inject.service(),

    post: Ember.computed('property', function () {
      return this.get('store').createRecord('post', { id: 1 });
    }),

    status: Ember.computed('post', function () {
      return this.get('post').publish();
    })
  });
});