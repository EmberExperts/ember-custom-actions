define('@ember-decorators/service/index', ['exports', '@ember-decorators/utils/computed'], function (exports, _computed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.service = undefined;

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  /**
    Decorator that injects a service into the object as the decorated property
  
     ```javascript
    import Component from '@ember/component';
    import { service } from '@ember-decorators/service';
  
    export default class StoreInjectedComponent extends Component
      @service store;
    }
    ```
  
    @function
    @param {string} serviceName? - The name of the service to inject. If not provided, the property name will be used
    @return {Service}
  */
  var service = exports.service = (0, _computed.computedDecoratorWithParams)(function (target, key, desc, params) {
    return params.length > 0 ? Ember.inject.service.apply(undefined, _toConsumableArray(params)) : Ember.inject.service(key);
  });
});