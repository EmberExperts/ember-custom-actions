define('@ember-decorators/utils/compatibility', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  let computed;

  if (true) {
    exports.computed = computed = Ember.computed;
  } else {
    exports.computed = computed = function (...params) {
      let desc = params.pop();

      if (typeof desc === 'function') {
        return Ember.computed(...params, desc);
      } else if ('set' in desc) {
        const { get, set } = desc;

        return Ember.computed(...params, function (key, value) {
          if (arguments.length > 1) {
            return set.call(this, key, value);
          }

          return get.call(this);
        });
      } else {
        return Ember.computed(...params, desc.get);
      }
    };
  }

  exports.computed = computed;
});