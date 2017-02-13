import Ember from 'ember';
import Faker from 'npm:faker';

const { Component, computed, inject, run, observer } = Ember;

export default Component.extend({
  tagName: 'tr',
  classNames: 'action',
  store: inject.service(),
  server: inject.service(),

  init() {
    this._super(...arguments);

    this.get('server').server.get('/users/:id/profile', (request) => {
      let user = this.get('store').peekRecord('user', request.params.id);
      let data = user.serialize({ includeId: true });
      data.data.attributes.name = Faker.name.findName();
      // debugger;
      return [200, { }, JSON.stringify(data)];
    });
  },

  user: computed('store', function() {
    return this.get('store').createRecord('user', { id: 1 });
  }),

  nameObserver: observer('user.name', function() {
    if (this.get('user.name')) {
      run.later(() => {
        this.get('store').push({
          data: {
            id: '1',
            type: 'user',
            attributes: {
              name: null
            }
          }
        });
      }, 3000);
    }
  }),

  actions: {
    generate(user) {
      this.set('pending', true);

      run.later(() => {
        user.profile().then(() => {
          this.set('pending', false);
        });
      }, 500);
    }
  }
});
