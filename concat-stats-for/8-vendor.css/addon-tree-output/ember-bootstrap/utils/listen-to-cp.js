define('ember-bootstrap/utils/listen-to-cp', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (dependentKey, defaultValue = null) {
    return Ember.computed(dependentKey, {
      get() {
        return Ember.getWithDefault(this, dependentKey, defaultValue);
      },
      set(key, value) {
        // eslint-disable-line no-unused-vars
        return value;
      }
    });
  };
});