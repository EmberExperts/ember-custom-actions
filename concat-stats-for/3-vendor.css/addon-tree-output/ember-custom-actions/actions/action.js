define('ember-custom-actions/actions/action', ['exports', 'lodash.merge', 'ember-custom-actions/utils/normalize-payload', 'ember-custom-actions/utils/url-builder'], function (exports, _lodash, _normalizePayload, _urlBuilder) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var promiseProxies = {
    array: Ember.ArrayProxy.extend(Ember.PromiseProxyMixin),
    object: Ember.ObjectProxy.extend(Ember.PromiseProxyMixin)
  };

  exports.default = Ember.Object.extend({
    id: '',
    model: null,
    instance: false,
    integrated: false,

    init: function init() {
      this._super.apply(this, arguments);
      (false && !(this.get('model')) && Ember.assert('Custom actions require model property to be passed!', this.get('model')));
      (false && !(!(this.get('instance') && !this.get('model.id'))) && Ember.assert('Custom action model has to be persisted!', !(this.get('instance') && !this.get('model.id'))));
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
      var _get = this.get('model'),
          constructor = _get.constructor;

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
      var model = this.get('model');
      var appConfig = model ? Ember.getOwner(model).resolveRegistration('config:environment').emberCustomActions || {} : {};
      var mergedConfig = (0, _lodash.default)({}, appConfig, this.get('options'));

      return Ember.Object.create(mergedConfig);
    }).readOnly(),

    /**
      @public
      @method callAction
      @return {Promise}
    */
    callAction: function callAction() {
      var promise = this._promise();
      var responseType = Ember.String.camelize(this.get('config.responseType') || '');
      var promiseProxy = promiseProxies[responseType];

      return promiseProxy ? promiseProxy.create({ promise: promise }) : promise;
    },


    /**
      @private
      @method queryParams
      @return {Object}
    */
    queryParams: function queryParams() {
      var queryParams = this.get('config.queryParams');

      (false && !(Ember.typeOf(queryParams) === 'object') && Ember.assert('Custom action queryParams option has to be an object', Ember.typeOf(queryParams) === 'object'));

      return this.get('adapter').sortQueryParams(queryParams);
    },


    /**
      @private
      @method requestMethod
      @return {String}
    */
    requestMethod: function requestMethod() {
      var integrated = this.get('integrated') && this.get('adapter').methodForCustomAction;
      var method = this.get('config.method').toUpperCase();

      return integrated ? this._methodForCustomAction(method) : method;
    },


    /**
      @private
      @method requestUrl
      @return {String}
    */
    requestUrl: function requestUrl() {
      var integrated = this.get('integrated') && this.get('adapter').urlForCustomAction;
      return integrated ? this._urlForCustomAction() : this._urlFromBuilder();
    },


    /**
      @private
      @method requestHeaders
      @return {String}
    */
    requestHeaders: function requestHeaders() {
      var integrated = this.get('integrated') && this.get('adapter').headersForCustomAction;
      var configHeaders = this.get('config.headers');
      var headers = integrated ? this._headersForCustomAction(configHeaders) : configHeaders;

      (false && !(Ember.typeOf(headers) === 'object') && Ember.assert('Custom action headers option has to be an object', Ember.typeOf(headers) === 'object'));

      return headers;
    },


    /**
      @private
      @method requestData
      @return {Object}
    */
    requestData: function requestData() {
      var integrated = this.get('integrated') && this.get('adapter').dataForCustomAction;
      var payload = this.get('config.data');
      var data = (integrated ? this._dataForCustomAction(payload) : payload) || {};

      (false && !(Ember.typeOf(data) === 'object') && Ember.assert('Custom action payload has to be an object', Ember.typeOf(data) === 'object'));


      return (0, _normalizePayload.default)(data, this.get('config.normalizeOperation'));
    },


    /**
      @private
      @method ajaxOptions
      @return {Object}
    */
    ajaxOptions: function ajaxOptions() {
      return (0, _lodash.default)({}, this.get('config.ajaxOptions'), {
        data: this.requestData(),
        headers: this.requestHeaders()
      });
    },


    // Internals

    _promise: function _promise() {
      return this.get('adapter').ajax(this.requestUrl(), this.requestMethod(), this.ajaxOptions()).then(this._onSuccess.bind(this), this._onError.bind(this));
    },
    _onSuccess: function _onSuccess(response) {
      if (this.get('config.pushToStore') && this._validResponse(response)) {
        var store = this.get('store');
        var modelClass = this.get('model.constructor');
        var modelId = this.get('model.id');
        var actionId = this.get('id');

        var documentHash = this.get('serializer').normalizeArrayResponse(store, modelClass, response, modelId, actionId);
        return this.get('store').push(documentHash);
      }

      return response;
    },
    _onError: function _onError(error) {
      if (this.get('config.pushToStore') && Ember.isArray(error.errors)) {
        var id = this.get('model.id');
        var typeClass = this.get('model').constructor;

        error.serializedErrors = this.get('serializer').extractErrors(this.get('store'), typeClass, error, id);
      }

      return Ember.RSVP.reject(error);
    },
    _validResponse: function _validResponse(object) {
      return Ember.typeOf(object) === 'object' && Object.keys(object).length > 0;
    },
    _urlFromBuilder: function _urlFromBuilder() {
      var path = this.get('id');
      var queryParams = this.queryParams();
      var modelName = this.get('modelName');
      var id = this.get('instance') ? this.get('model.id') : null;
      var url = this.get('adapter')._buildURL(modelName, id);

      return (0, _urlBuilder.default)(url, path, queryParams);
    },


    // Adapter integration API

    _urlForCustomAction: function _urlForCustomAction() {
      var id = this.get('model.id');
      var actionId = this.get('id');
      var queryParams = this.queryParams();
      var modelName = this.get('modelName');
      var adapterOptions = this.get('config.adapterOptions');
      var snapshot = this.get('model')._internalModel.createSnapshot({ adapterOptions: adapterOptions });

      return this.get('adapter').urlForCustomAction(modelName, id, snapshot, actionId, queryParams);
    },
    _methodForCustomAction: function _methodForCustomAction(method) {
      var actionId = this.get('id');
      var modelId = this.get('model.id');

      return this.get('adapter').methodForCustomAction({ method: method, actionId: actionId, modelId: modelId });
    },
    _headersForCustomAction: function _headersForCustomAction(headers) {
      var actionId = this.get('id');
      var modelId = this.get('model.id');

      return this.get('adapter').headersForCustomAction({ headers: headers, actionId: actionId, modelId: modelId });
    },
    _dataForCustomAction: function _dataForCustomAction(data) {
      var actionId = this.get('id');
      var modelId = this.get('model.id');

      return this.get('adapter').dataForCustomAction({ data: data, actionId: actionId, modelId: modelId });
    }
  });
});