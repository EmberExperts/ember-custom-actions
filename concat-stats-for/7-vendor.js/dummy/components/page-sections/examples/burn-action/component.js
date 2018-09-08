define('dummy/components/page-sections/examples/burn-action/component', ['exports'], function (exports) {
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

      this.get('server').server.get('/bridges/burn', () => {
        return [200, {}, 'true'];
      });
    },

    bridge: Ember.computed('store', function () {
      return this.get('store').createRecord('bridge');
    }),

    burnedObserver: Ember.observer('burned', function () {
      if (this.get('burned') == true) {
        Ember.run.later(() => {
          this.set('burned', false);
        }, 3000);
      }
    }),

    actions: {
      burn() {
        this.set('pending', true);

        Ember.run.later(() => {
          this.get('bridge').burnAll().then(() => {
            this.set('burned', true);
            this.set('pending', false);
          });
        }, 500);
      }
    }
  });
});