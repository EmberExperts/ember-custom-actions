define('@ember-decorators/service/index', ['exports', '@ember-decorators/utils/computed'], function (exports, _computed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.service = undefined;


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
  const service = exports.service = (0, _computed.computedDecoratorWithParams)((target, key, desc, params) => {
    return params.length > 0 ? Ember.inject.service(...params) : Ember.inject.service(key);
  });
});