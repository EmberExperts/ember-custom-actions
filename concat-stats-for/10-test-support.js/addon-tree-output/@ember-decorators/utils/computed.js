define('@ember-decorators/utils/computed', ['exports', '@ember-decorators/utils/decorator', '@ember-decorators/utils/-private'], function (exports, _decorator, _private) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.computedDecorator = computedDecorator;
  exports.computedDecoratorWithParams = computedDecoratorWithParams;
  exports.computedDecoratorWithRequiredParams = computedDecoratorWithRequiredParams;


  /**
   * A macro that receives a decorator function which returns a ComputedProperty,
   * and defines that property using `Ember.defineProperty`. Conceptually, CPs
   * are custom property descriptors that require Ember's intervention to apply
   * correctly. In the future, we will use finishers to define the CPs rather than
   * directly defining them in the decorator function.
   *
   * @param {Function} fn - decorator function
   */
  function computedDecorator(fn) {
    return function (target, key, desc, params) {
      let previousDesc = (0, _private.computedDescriptorFor)(target, key) || desc;
      let computedDesc = fn(target, key, previousDesc, params);

      (true && !((0, _private.isComputedDescriptor)(computedDesc)) && Ember.assert(`computed decorators must return an instance of an Ember ComputedProperty descriptor, received ${computedDesc}`, (0, _private.isComputedDescriptor)(computedDesc)));


      if (!true) {
        // Until recent versions of Ember, computed properties would be defined
        // by just setting them. We need to blow away any predefined properties
        // (getters/setters, etc.) to allow Ember.defineProperty to work correctly.
        Object.defineProperty(target, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: undefined
        });
      }

      Ember.defineProperty(target, key, computedDesc);

      // There's currently no way to disable redefining the property when decorators
      // are run, so return the property descriptor we just assigned
      return Object.getOwnPropertyDescriptor(target, key);
    };
  }

  function computedDecoratorWithParams(fn) {
    return (0, _decorator.decoratorWithParams)(computedDecorator(fn));
  }

  function computedDecoratorWithRequiredParams(fn) {
    return (0, _decorator.decoratorWithRequiredParams)(computedDecorator(fn));
  }
});