define('dummy/services/server', ['exports', 'pretender'], function (exports, _pretender) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    init: function init() {
      this._super.apply(this, arguments);
      this.set('server', new _pretender.default());
    }
  });
});