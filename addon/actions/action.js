import Ember from 'ember';
import normalizePayload from '../utils/normalize-payload';
import urlBuilder from 'ember-custom-actions/utils/url-builder';
import deepMerge from 'lodash/merge';

const {
  getOwner,
  computed,
  Object: EmberObject,
  ObjectProxy,
  ArrayProxy,
  PromiseProxyMixin,
  typeOf: emberTypeOf,
  isArray,
  RSVP,
  assert,
  String: EmberString
} = Ember;

const promiseProxies = {
  array: ArrayProxy.extend(PromiseProxyMixin),
  object: ObjectProxy.extend(PromiseProxyMixin)
};

export default EmberObject.extend({
  path: '',
  model: null,
  options: {},
  payload: {},
  instance: false,

  init() {
    this._super(...arguments);
    assert('Model has to be persisted!', !(this.get('instance') && !this.get('model.id')));
  },

  /**
   * @return {DS.Store}
   */
  store: computed.readOnly('model.store'),

  /**
   * @return {String}
   */
  modelName: computed('model', function() {
    let { constructor } = this.get('model');
    return constructor.modelName || constructor.typeKey;
  }).readOnly(),

  /**
   * @return {DS.Adapter}
   */
  adapter: computed('modelName', 'store', function() {
    return this.get('store').adapterFor(this.get('modelName'));
  }).readOnly(),

  /**
   * @return {DS.Serializer}
   */
  serializer: computed('modelName', 'store', function() {
    return this.get('store').serializerFor(this.get('modelName'));
  }).readOnly(),

  /**
   * @return {Ember.Object}
   */
  config: computed('options', function() {
    let appConfig = getOwner(this.get('model')).resolveRegistration('config:environment').emberCustomActions || {};
    let mergedConfig = deepMerge({}, appConfig, this.get('options'));

    return EmberObject.create(mergedConfig);
  }).readOnly(),

  /**
   * @public
   * @method callAction
   * @return {Promise}
   */
  callAction() {
    let promise = this._promise();
    let responseType = EmberString.camelize(this.get('config.responseType') || '');
    let promiseProxy = promiseProxies[responseType];

    return promiseProxy ? promiseProxy.create({ promise }) : promise;
  },

  /**
   * @private
   * @method queryParams
   * @return {Object}
   */
  queryParams() {
    let queryParams = emberTypeOf(this.get('config.queryParams')) === 'object' ? this.get('config.queryParams') : {};
    return this.get('adapter').sortQueryParams(queryParams);
  },

  /**
   * @private
   * @method requestMethod
   * @return {String}
   */
  requestMethod() {
    return this.get('config.method').toUpperCase();
  },

  /**
   * @private
   * @method requestUrl
   * @return {String}
   */
  requestUrl() {
    let modelName = this.get('modelName');
    let id = this.get('instance') ? this.get('model.id') : null;
    let snapshot = this.get('model')._createSnapshot(this.get('config.adapterOptions'));
    let requestType = this.get('path');
    let query = this.queryParams();

    if (this.get('adapter').urlForCustomAction) {
      return this.get('adapter').urlForCustomAction(modelName, id, snapshot, requestType, query);
    } else {
      let url = this.get('adapter')._buildURL(modelName, id);
      return urlBuilder(url, requestType, query);
    }
  },

  /**
   * @private
   * @method requestData
   * @return {Object}
   */
  requestData() {
    let payload = emberTypeOf(this.get('payload')) === 'object' ? this.get('payload') : {};
    let data = normalizePayload(payload, this.get('config.normalizeOperation'));

    return deepMerge({}, this.get('config.ajaxOptions'), { data });
  },

  // Internals

  _promise() {
    return this.get('adapter')
      .ajax(this.requestUrl(), this.requestMethod(), this.requestData())
      .then(this._onSuccess.bind(this), this._onError.bind(this));
  },

  _onSuccess(response) {
    if (this.get('config.pushToStore') && this._validResponse(response)) {
      return this.get('serializer').pushPayload(this.get('store'), response);
    }

    return response;
  },

  _onError(error) {
    if (this.get('config.pushToStore') && isArray(error.errors)) {
      let id = this.get('model.id');
      let typeClass = this.get('model').constructor;
      error.serializedErrors = this.get('serializer').extractErrors(this.get('store'), typeClass, error, id);
    }

    return RSVP.reject(error);
  },

  _validResponse(object) {
    return emberTypeOf(object) === 'object' && Object.keys(object).length > 0;
  }
});
