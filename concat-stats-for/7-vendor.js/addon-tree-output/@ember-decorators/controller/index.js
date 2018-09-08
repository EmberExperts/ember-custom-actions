define('@ember-decorators/controller/index', ['exports', '@ember-decorators/utils/computed'], function (exports, _computed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.controller = undefined;


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
  const controller = exports.controller = (0, _computed.computedDecoratorWithParams)((target, key, desc, params) => {
    return params.length > 0 ? Ember.inject.controller(...params) : Ember.inject.controller(key);
  });
});