define('dummy/services/server', ['exports', 'pretender'], function (exports, _pretender) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    init() {
      this._super(...arguments);
      this.set('server', new _pretender.default());
    }
  });
});