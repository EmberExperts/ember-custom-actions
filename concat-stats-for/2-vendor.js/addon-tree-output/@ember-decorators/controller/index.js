define('@ember-decorators/controller/index', ['exports', '@ember-decorators/utils/computed'], function (exports, _computed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.controller = undefined;

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
    Decorator that injects a controller into a controller as the decorated
    property
  
     ```javascript
    export default class IndexController extends Controller {
      @controller application;
    }
    ```
  
    @function
    @param {string} controllerName? - The name of the controller to inject. If not provided, the property name will be used
    @return {Controller}
  */
  var controller = exports.controller = (0, _computed.computedDecoratorWithParams)(function (target, key, desc, params) {
    return params.length > 0 ? Ember.inject.controller.apply(undefined, _toConsumableArray(params)) : Ember.inject.controller(key);
  });
});