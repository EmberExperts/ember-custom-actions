define('ember-data/index', ['exports', 'ember-data/-private', 'ember-data/setup-container', 'ember-data/initialize-store-service', 'ember-data/transforms/transform', 'ember-data/transforms/number', 'ember-data/transforms/date', 'ember-data/transforms/string', 'ember-data/transforms/boolean', 'ember-data/adapter', 'ember-data/adapters/json-api', 'ember-data/adapters/rest', 'ember-data/serializer', 'ember-data/serializers/json-api', 'ember-data/serializers/json', 'ember-data/serializers/rest', 'ember-data/serializers/embedded-records-mixin', 'ember-data/attr', 'ember-inflector'], function (exports, _private, _setupContainer, _initializeStoreService, _transform, _number, _date, _string, _boolean, _adapter, _jsonApi, _rest, _serializer, _jsonApi2, _json, _rest2, _embeddedRecordsMixin, _attr) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
    Ember Data
    @module ember-data
    @main ember-data
  */

  if (Ember.VERSION.match(/^1\.([0-9]|1[0-2])\./)) {
    throw new Ember.Error('Ember Data requires at least Ember 1.13.0, but you have ' + Ember.VERSION + '. Please upgrade your version of Ember, then upgrade Ember Data.');
  }

  _private.DS.Store = _private.Store;
  _private.DS.PromiseArray = _private.PromiseArray;
  _private.DS.PromiseObject = _private.PromiseObject;

  _private.DS.PromiseManyArray = _private.PromiseManyArray;

  _private.DS.Model = _private.Model;
  _private.DS.RootState = _private.RootState;
  _private.DS.attr = _attr.default;
  _private.DS.Errors = _private.Errors;

  _private.DS.InternalModel = _private.InternalModel;
  _private.DS.Snapshot = _private.Snapshot;

  _private.DS.Adapter = _adapter.default;

  _private.DS.AdapterError = _private.AdapterError;
  _private.DS.InvalidError = _private.InvalidError;
  _private.DS.TimeoutError = _private.TimeoutError;
  _private.DS.AbortError = _private.AbortError;

  _private.DS.UnauthorizedError = _private.UnauthorizedError;
  _private.DS.ForbiddenError = _private.ForbiddenError;
  _private.DS.NotFoundError = _private.NotFoundError;
  _private.DS.ConflictError = _private.ConflictError;
  _private.DS.ServerError = _private.ServerError;

  _private.DS.errorsHashToArray = _private.errorsHashToArray;
  _private.DS.errorsArrayToHash = _private.errorsArrayToHash;

  _private.DS.Serializer = _serializer.default;

  _private.DS.DebugAdapter = _private.DebugAdapter;

  _private.DS.RecordArray = _private.RecordArray;
  _private.DS.AdapterPopulatedRecordArray = _private.AdapterPopulatedRecordArray;
  _private.DS.ManyArray = _private.ManyArray;

  _private.DS.RecordArrayManager = _private.RecordArrayManager;

  _private.DS.RESTAdapter = _rest.default;
  _private.DS.BuildURLMixin = _private.BuildURLMixin;

  _private.DS.RESTSerializer = _rest2.default;
  _private.DS.JSONSerializer = _json.default;

  _private.DS.JSONAPIAdapter = _jsonApi.default;
  _private.DS.JSONAPISerializer = _jsonApi2.default;

  _private.DS.Transform = _transform.default;
  _private.DS.DateTransform = _date.default;
  _private.DS.StringTransform = _string.default;
  _private.DS.NumberTransform = _number.default;
  _private.DS.BooleanTransform = _boolean.default;

  _private.DS.EmbeddedRecordsMixin = _embeddedRecordsMixin.default;

  _private.DS.belongsTo = _private.belongsTo;
  _private.DS.hasMany = _private.hasMany;

  _private.DS.Relationship = _private.Relationship;

  _private.DS._setupContainer = _setupContainer.default;
  _private.DS._initializeStoreService = _initializeStoreService.default;

  Object.defineProperty(_private.DS, 'normalizeModelName', {
    enumerable: true,
    writable: false,
    configurable: false,
    value: _private.normalizeModelName
  });

  exports.default = _private.DS;
});