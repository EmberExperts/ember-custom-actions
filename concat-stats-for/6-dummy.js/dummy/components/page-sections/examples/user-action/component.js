define('dummy/components/page-sections/examples/user-action/component', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    tagName: 'tr',
    classNames: 'action',
    store: Ember.inject.service(),
    server: Ember.inject.service(),

    init() {
      this._super(...arguments);

      this.get('server').server.get('/users/:id/profile', request => {
        let user = this.get('store').peekRecord('user', request.params.id);
        let data = user.serialize({ includeId: true });
        data.data.attributes.name = "Ember Custom Actions";
        return [200, {}, JSON.stringify(data)];
      });
    },

    user: Ember.computed('store', function () {
      return this.get('store').createRecord('user', { id: 1 });
    }),

    nameObserver: Ember.observer('user.name', function () {
      if (this.get('user.name')) {
        Ember.run.later(() => {
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

        Ember.run.later(() => {
          user.profile().then(() => {
            this.set('pending', false);
          });
        }, 500);
      }
    }
  });
});