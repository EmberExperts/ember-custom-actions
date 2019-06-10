import { assert } from '@ember/debug';
import { isArray } from '@ember/array';
import { camelize } from '@ember/string';
import ArrayProxy from '@ember/array/proxy';
import ObjectProxy from '@ember/object/proxy';
import { getOwner } from '@ember/application';
import { readOnly } from '@ember/object/computed';
import { typeOf as emberTypeOf } from '@ember/utils';
import EmberObject, { computed } from '@ember/object';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';

import { reject } from 'rsvp';
import deepMerge from 'lodash.merge';
import normalizePayload from 'ember-custom-actions/utils/normalize-payload';
import urlBuilder from 'ember-custom-actions/utils/url-builder';

const promiseProxies = {
  array: ArrayProxy.extend(PromiseProxyMixin),
  object: ObjectProxy.extend(PromiseProxyMixin)
};

export default EmberObject.extend({
  id: '',
  model: null,
  instance: false,
  integrated: false,

  init() {
    this._super(...arguments);
    assert('Custom actions require model property to be passed!', this.get('model'));
    assert('Custom action model has to be persisted!', !(this.get('instance') && !this.get('model.id')));
  },

  /**
    @private
    @return {DS.Store}
  */
  store: readOnly('model.store'),

  /**
    @public
    @return {Object}
  */
  options: computed(function() {
    return {};
  }),

  /**
    @private
    @return {String}
  */
  modelName: computed('model', function() {
    let { constructor } = this.get('model');
    return constructor.modelName || constructor.typeKey;
  }).readOnly(),

  /**
    @private
    @return {DS.Adapter}
  */
  adapter: computed('modelName', 'store', function() {
    return this.get('store').adapterFor(this.get('modelName'));
  }).readOnly(),

  /**
    @private
    @return {DS.Serializer}
  */
  serializer: computed('modelName', 'store', function() {
    return this.get('store').serializerFor(this.get('modelName'));
  }).readOnly(),

  /**
    @private
    @return {Ember.Object}
  */
  config: computed('options', 'model', function() {
    let model = this.get('model');
    let appConfig = model ? (getOwner(model).resolveRegistration('config:environment').emberCustomActions || {}) : {};
    let mergedConfig = deepMerge({}, appConfig, this.get('options'));

    return EmberObject.create(mergedConfig);
  }).readOnly(),

  /**
    @public
    @method callAction
    @return {Promise}
  */
  callAction() {
    let promise = this._promise();
    let responseType = camelize(this.get('config.responseType') || '');
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

    assert('Custom action queryParams option has to be an object',  emberTypeOf(queryParams) === 'object');
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

    assert('Custom action headers option has to be an object',  emberTypeOf(headers) === 'object');
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

    assert('Custom action payload has to be an object',  emberTypeOf(data) === 'object');

    return normalizePayload(data, this.get('config.normalizeOperation'));
  },

  /**
    @private
    @method ajaxOptions
    @return {Object}
  */
  ajaxOptions() {
    return deepMerge({}, this.get('config.ajaxOptions'), {
      data: this.requestData(),
      headers: this.requestHeaders()
    });
  },

  // Internals

  _promise() {
    return this.get('adapter')
      .ajax(this.requestUrl(), this.requestMethod(), this.ajaxOptions())
      .then(this._onSuccess.bind(this), this._onError.bind(this));
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
    if (this.get('config.pushToStore') && isArray(error.errors)) {
      let id = this.get('model.id');
      let typeClass = this.get('model').constructor;

      error.serializedErrors = this.get('serializer').extractErrors(this.get('store'), typeClass, error, id);
    }

    return reject(error);
  },

  _validResponse(object) {
    return emberTypeOf(object) === 'object' && Object.keys(object).length > 0;
  },

  _urlFromBuilder() {
    let path = this.get('id');
    let queryParams = this.queryParams();
    let modelName = this.get('modelName');
    let id = this.get('instance') ? this.get('model.id') : null;
    let url = this.get('adapter')._buildURL(modelName, id);

    return urlBuilder(url, path, queryParams);
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
    let model = this.get('model');

    return this.get('adapter').dataForCustomAction({ data, actionId, modelId, model });
  }
});
