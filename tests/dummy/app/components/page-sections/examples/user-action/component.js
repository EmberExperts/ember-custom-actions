import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { observer, computed } from '@ember/object';
import Faker from 'npm:faker';

export default Component.extend({
  tagName: 'tr',
  classNames: 'action',
  store: service(),
  server: service(),

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
