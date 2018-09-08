define('ember-custom-actions/actions/action', ['exports', 'lodash.merge', 'ember-custom-actions/utils/normalize-payload', 'ember-custom-actions/utils/url-builder'], function (exports, _lodash, _normalizePayload, _urlBuilder) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const promiseProxies = {
    array: Ember.ArrayProxy.extend(Ember.PromiseProxyMixin),
    object: Ember.ObjectProxy.extend(Ember.PromiseProxyMixin)
  };

  exports.default = Ember.Object.extend({
    id: '',
    model: null,
    instance: false,
    integrated: false,

    init() {
      this._super(...arguments);
      (true && !(this.get('model')) && Ember.assert('Custom actions require model property to be passed!', this.get('model')));
      (true && !(!(this.get('instance') && !this.get('model.id'))) && Ember.assert('Custom action model has to be persisted!', !(this.get('instance') && !this.get('model.id'))));
    },

    /**
      @private
      @return {DS.Store}
    */
    store: Ember.computed.readOnly('model.store'),

    /**
      @public
      @return {Object}
    */
    options: Ember.computed(function () {
      return {};
    }),

    /**
      @private
      @return {String}
    */
    modelName: Ember.computed('model', function () {
      let { constructor } = this.get('model');
      return constructor.modelName || constructor.typeKey;
    }).readOnly(),

    /**
      @private
      @return {DS.Adapter}
    */
    adapter: Ember.computed('modelName', 'store', function () {
      return this.get('store').adapterFor(this.get('modelName'));
    }).readOnly(),

    /**
      @private
      @return {DS.Serializer}
    */
    serializer: Ember.computed('modelName', 'store', function () {
      return this.get('store').serializerFor(this.get('modelName'));
    }).readOnly(),

    /**
      @private
      @return {Ember.Object}
    */
    config: Ember.computed('options', 'model', function () {
      let model = this.get('model');
      let appConfig = model ? Ember.getOwner(model).resolveRegistration('config:environment').emberCustomActions || {} : {};
      let mergedConfig = (0, _lodash.default)({}, appConfig, this.get('options'));

      return Ember.Object.create(mergedConfig);
    }).readOnly(),

    /**
      @public
      @method callAction
      @return {Promise}
    */
    callAction() {
      let promise = this._promise();
      let responseType = Ember.String.camelize(this.get('config.responseType') || '');
      let promiseProxy = promiseProxies[responseType];

      return promiseProxy ? promiseProxy.create({ promise }) : promise;
    },

    /**
      @private
      @method queryParams
      @return {Object}
    */
    queryParams() {
      let queryParams = this.get('config.queryParams');

      (true && !(Ember.typeOf(queryParams) === 'object') && Ember.assert('Custom action queryParams option has to be an object', Ember.typeOf(queryParams) === 'object'));

      return this.get('adapter').sortQueryParams(queryParams);
    },

    /**
      @private
      @method requestMethod
      @return {String}
    */
    requestMethod() {
      let integrated = this.get('integrated') && this.get('adapter').methodForCustomAction;
      let method = this.get('config.method').toUpperCase();

      return integrated ? this._methodForCustomAction(method) : method;
    },

    /**
      @private
      @method requestUrl
      @return {String}
    */
    requestUrl() {
      let integrated = this.get('integrated') && this.get('adapter').urlForCustomAction;
      return integrated ? this._urlForCustomAction() : this._urlFromBuilder();
    },

    /**
      @private
      @method requestHeaders
      @return {String}
    */
    requestHeaders() {
      let integrated = this.get('integrated') && this.get('adapter').headersForCustomAction;
      let configHeaders = this.get('config.headers');
      let headers = integrated ? this._headersForCustomAction(configHeaders) : configHeaders;

      (true && !(Ember.typeOf(headers) === 'object') && Ember.assert('Custom action headers option has to be an object', Ember.typeOf(headers) === 'object'));

      return headers;
    },

    /**
      @private
      @method requestData
      @return {Object}
    */
    requestData() {
      let integrated = this.get('integrated') && this.get('adapter').dataForCustomAction;
      let payload = this.get('config.data');
      let data = (integrated ? this._dataForCustomAction(payload) : payload) || {};

      (true && !(Ember.typeOf(data) === 'object') && Ember.assert('Custom action payload has to be an object', Ember.typeOf(data) === 'object'));


      return (0, _normalizePayload.default)(data, this.get('config.normalizeOperation'));
    },

    /**
      @private
      @method ajaxOptions
      @return {Object}
    */
    ajaxOptions() {
      return (0, _lodash.default)({}, this.get('config.ajaxOptions'), {
        data: this.requestData(),
        headers: this.requestHeaders()
      });
    },

    // Internals

    _promise() {
      return this.get('adapter').ajax(this.requestUrl(), this.requestMethod(), this.ajaxOptions()).then(this._onSuccess.bind(this), this._onError.bind(this));
    },

    _onSuccess(response) {
      if (this.get('config.pushToStore') && this._validResponse(response)) {
        let store = this.get('store');
        let modelClass = this.get('model.constructor');
        let modelId = this.get('model.id');
        let actionId = this.get('id');

        let documentHash = this.get('serializer').normalizeArrayResponse(store, modelClass, response, modelId, actionId);
        return this.get('store').push(documentHash);
      }

      return response;
    },

    _onError(error) {
      if (this.get('config.pushToStore') && Ember.isArray(error.errors)) {
        let id = this.get('model.id');
        let typeClass = this.get('model').constructor;

        error.serializedErrors = this.get('serializer').extractErrors(this.get('store'), typeClass, error, id);
      }

      return Ember.RSVP.reject(error);
    },

    _validResponse(object) {
      return Ember.typeOf(object) === 'object' && Object.keys(object).length > 0;
    },

    _urlFromBuilder() {
      let path = this.get('id');
      let queryParams = this.queryParams();
      let modelName = this.get('modelName');
      let id = this.get('instance') ? this.get('model.id') : null;
      let url = this.get('adapter')._buildURL(modelName, id);

      return (0, _urlBuilder.default)(url, path, queryParams);
    },

    // Adapter integration API

    _urlForCustomAction() {
      let id = this.get('model.id');
      let actionId = this.get('id');
      let queryParams = this.queryParams();
      let modelName = this.get('modelName');
      let adapterOptions = this.get('config.adapterOptions');
      let snapshot = this.get('model')._internalModel.createSnapshot({ adapterOptions });

      return this.get('adapter').urlForCustomAction(modelName, id, snapshot, actionId, queryParams);
    },

    _methodForCustomAction(method) {
      let actionId = this.get('id');
      let modelId = this.get('model.id');

      return this.get('adapter').methodForCustomAction({ method, actionId, modelId });
    },

    _headersForCustomAction(headers) {
      let actionId = this.get('id');
      let modelId = this.get('model.id');

      return this.get('adapter').headersForCustomAction({ headers, actionId, modelId });
    },

    _dataForCustomAction(data) {
      let actionId = this.get('id');
      let modelId = this.get('model.id');

      return this.get('adapter').dataForCustomAction({ data, actionId, modelId });
    }
  });
});