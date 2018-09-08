define('ember-data/setup-container', ['exports', 'ember-data/-private', 'ember-data/serializers/json-api', 'ember-data/serializers/json', 'ember-data/serializers/rest', 'ember-data/adapters/json-api', 'ember-data/adapters/rest', 'ember-data/transforms/number', 'ember-data/transforms/date', 'ember-data/transforms/string', 'ember-data/transforms/boolean'], function (exports, _private, _jsonApi, _json, _rest, _jsonApi2, _rest2, _number, _date, _string, _boolean) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = setupContainer;


  function has(applicationOrRegistry, fullName) {
    if (applicationOrRegistry.has) {
      // < 2.1.0
      return applicationOrRegistry.has(fullName);
    } else {
      // 2.1.0+
      return applicationOrRegistry.hasRegistration(fullName);
    }
  }

  /*
   Configures a registry for use with an Ember-Data
   store. Accepts an optional namespace argument.
  
   @method initializeStore
   @param {Ember.Registry} registry
   */
  function initializeStore(registry) {
    var registerOptionsForType = registry.registerOptionsForType || registry.optionsForType;
    registerOptionsForType.call(registry, 'serializer', { singleton: false });
    registerOptionsForType.call(registry, 'adapter', { singleton: false });
    registry.register('serializer:-default', _json.default);
    registry.register('serializer:-rest', _rest.default);
    registry.register('adapter:-rest', _rest2.default);

    registry.register('adapter:-json-api', _jsonApi2.default);
    registry.register('serializer:-json-api', _jsonApi.default);

    if (!has(registry, 'service:store')) {
      registry.register('service:store', _private.Store);
    }
  }

  /*
   Configures a registry with injections on Ember applications
   for the Ember-Data store. Accepts an optional namespace argument.
  
   @method initializeDebugAdapter
   @param {Ember.Registry} registry
   */
  function initializeDataAdapter(registry) {
    registry.register('data-adapter:main', _private.DebugAdapter);
  }

  /*
   Configures a registry with injections on Ember applications
   for the Ember-Data store. Accepts an optional namespace argument.
  
   @method initializeStoreInjections
   @param {Ember.Registry} registry
   */
  function initializeStoreInjections(registry) {
    // registry.injection for Ember < 2.1.0
    // application.inject for Ember 2.1.0+
    var inject = registry.inject || registry.injection;
    inject.call(registry, 'controller', 'store', 'service:store');
    inject.call(registry, 'route', 'store', 'service:store');
    inject.call(registry, 'data-adapter', 'store', 'service:store');
  }

  /*
   Configures a registry for use with Ember-Data
   transforms.
  
   @method initializeTransforms
   @param {Ember.Registry} registry
   */
  function initializeTransforms(registry) {
    registry.register('transform:boolean', _boolean.default);
    registry.register('transform:date', _date.default);
    registry.register('transform:number', _number.default);
    registry.register('transform:string', _string.default);
  }

  function setupContainer(application) {
    initializeDataAdapter(application);
    initializeTransforms(application);
    initializeStoreInjections(application);
    initializeStore(application);
  }
});