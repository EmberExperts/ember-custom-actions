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

    init: function init() {
      var _this = this;

      this._super.apply(this, arguments);

      this.get('server').server.get('/users/:id/profile', function (request) {
        var user = _this.get('store').peekRecord('user', request.params.id);
        var data = user.serialize({ includeId: true });
        data.data.attributes.name = "Ember Custom Actions";
        return [200, {}, JSON.stringify(data)];
      });
    },


    user: Ember.computed('store', function () {
      return this.get('store').createRecord('user', { id: 1 });
    }),

    nameObserver: Ember.observer('user.name', function () {
      var _this2 = this;

      if (this.get('user.name')) {
        Ember.run.later(function () {
          _this2.get('store').push({
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
      generate: function generate(user) {
        var _this3 = this;

        this.set('pending', true);

        Ember.run.later(function () {
          user.profile().then(function () {
            _this3.set('pending', false);
          });
        }, 500);
      }
    }
  });
});