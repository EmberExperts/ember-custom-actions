import Ember from 'ember';

const { Component, inject, computed } = Ember;

export default Component.extend({
  store: inject.service(),

  post: computed('property', function() {
    return this.get('store').createRecord('post', { id: 1 });
  }),

  status: computed('post', function() {
    return this.get('post').publish();
  })
});
