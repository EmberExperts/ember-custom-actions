define('@ember-decorators/utils/compatibility', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var computed = void 0;

  if (true) {
    exports.computed = computed = Ember.computed;
  } else {
    exports.computed = computed = function computed() {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      var desc = params.pop();

      if (typeof desc === 'function') {
        return Ember.computed.apply(undefined, params.concat([desc]));
      } else if ('set' in desc) {
        var get = desc.get,
            set = desc.set;


        return Ember.computed.apply(undefined, params.concat([function (key, value) {
          if (arguments.length > 1) {
            return set.call(this, key, value);
          }

          return get.call(this);
        }]));
      } else {
        return Ember.computed.apply(undefined, params.concat([desc.get]));
      }
    };
  }

  exports.computed = computed;
});