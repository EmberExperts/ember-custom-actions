import Ember from 'ember';

const { Component, computed, inject, run, observer } = Ember;

export default Component.extend({
  tagName: 'tr',
  classNames: 'action',
  store: inject.service(),
  server: inject.service(),

  init() {
    this._super(...arguments);

    this.get('server').server.get('/bridges/burn', () => {
      return [200, { }, 'true'];
    });
  },

  bridge: computed('store', function() {
    return this.get('store').createRecord('bridge');
  }),

  burnedObserver: observer('burned', function() {
    if (this.get('burned') == true) {
      run.later(() => {
        this.set('burned', false);
      }, 3000);
    }
  }),

  actions: {
    burn() {
      this.set('pending', true);

      run.later(() => {
        this.get('bridge').burnAll().then(() => {
          this.set('burned', true);
          this.set('pending', false);
        });
      }, 500);
    }
  }
});
