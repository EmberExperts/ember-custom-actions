define('ember-initials/utils/store', ['exports', 'ember-initials/utils/hash', 'ember-initials/utils/generators/svg'], function (exports, _hash, _svg) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Object.extend({
    cache: null,

    generator: Ember.computed(function () {
      return new _svg.default();
    }),

    init: function init() {
      this._super.apply(this, arguments);
      this.set('cache', {});
    },
    initialsFor: function initialsFor(properties) {
      var key = (0, _hash.default)(properties);
      return this.get('cache')[key] || this._create(key, properties);
    },
    _create: function _create(key, properties) {
      return this.get('cache')[key] = this.get('generator').generate(properties);
    }
  });
});