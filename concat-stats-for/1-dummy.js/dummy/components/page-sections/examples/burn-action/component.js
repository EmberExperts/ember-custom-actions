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

    init: function init() {
      this._super.apply(this, arguments);

      this.get('server').server.get('/bridges/burn', function () {
        return [200, {}, 'true'];
      });
    },


    bridge: Ember.computed('store', function () {
      return this.get('store').createRecord('bridge');
    }),

    burnedObserver: Ember.observer('burned', function () {
      var _this = this;

      if (this.get('burned') == true) {
        Ember.run.later(function () {
          _this.set('burned', false);
        }, 3000);
      }
    }),

    actions: {
      burn: function burn() {
        var _this2 = this;

        this.set('pending', true);

        Ember.run.later(function () {
          _this2.get('bridge').burnAll().then(function () {
            _this2.set('burned', true);
            _this2.set('pending', false);
          });
        }, 500);
      }
    }
  });
});