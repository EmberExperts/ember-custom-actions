define('@ember-decorators/argument/utils/make-computed', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = makeComputed;
  function makeComputed(desc) {
    if (true) {
      return Ember.computed(desc);
    } else {
      const { get, set } = desc;

      return Ember.computed(function (key, value) {
        if (arguments.length > 1) {
          return set.call(this, key, value);
        }

        return get.call(this);
      });
    }
  }
});