import { readOnly } from '@ember/object/computed';
import RSVP from 'rsvp';
import { assert } from '@ember/debug';
import { isArray } from '@ember/array';
import { getOwner } from '@ember/application';
import ArrayProxy from '@ember/array/proxy';
import ObjectProxy from '@ember/object/proxy';
import { camelize } from '@ember/string';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import EmberObject, { computed } from '@ember/object';
import { typeOf as emberTypeOf } from '@ember/utils';
import deepMerge from 'lodash/merge';
import normalizePayload from '../utils/normalize-payload';
import urlBuilder from 'ember-custom-actions/utils/url-builder';

const promiseProxies = {
  array: ArrayProxy.extend(PromiseProxyMixin),
  object: ObjectProxy.extend(PromiseProxyMixin)
};

export default EmberObject.extend({
  id: '',
  model: null,
  options: {},
  instance: false,
  integrated: false,

  init() {
    this._super(...arguments);
    assert('Custom actions require model property to be passed!', this.get('model'));
    assert('Custom action model has to be persisted!', !(this.get('instance') && !this.get('model.id')));
  },

  /**
    @return {Object}
  */
  payload: computed('config.normalizeOperation', {
    set(key, value) {
      let payload = value || {};
      assert('Custom action payload has to be an object',  emberTypeOf(payload) === 'object');

      return payload;
    }
  }),

  /**
    @return {DS.Store}
  */
  store: readOnly('model.store'),

  /**
    @return {String}
  */
  modelName: computed('model', function() {
    let { constructor } = this.get('model');
    return constructor.modelName || constructor.typeKey;
  }).readOnly(),

  /**
    @return {DS.Adapter}
  */
  adapter: computed('modelName', 'store', function() {
    return this.get('store').adapterFor(this.get('modelName'));
  }).readOnly(),

  /**
    @return {DS.Serializer}
  */
  serializer: computed('modelName', 'store', function() {
    return this.get('store').serializerFor(this.get('modelName'));
  }).readOnly(),

  /**
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
    let queryParams = emberTypeOf(this.get('config.queryParams')) === 'object' ? this.get('config.queryParams') : {};
    return this.get('adapter').sortQueryParams(queryParams);
  },

  /**
    @private
    @method requestMethod
    @return {String}
  */
  requestMethod() {
    return this.get('config.method').toUpperCase();
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
    @method requestData
    @return {Object}
  */
  requestData() {
    let data = normalizePayload(this.get('payload'), this.get('config.normalizeOperation'));
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
  },

  _urlFromBuilder() {
    let path = this.get('id');
    let queryParams = this.queryParams();
    let modelName = this.get('modelName');
    let id = this.get('instance') ? this.get('model.id') : null;
    let url = this.get('adapter')._buildURL(modelName, id);

    return urlBuilder(url, path, queryParams);
  },

  _urlForCustomAction() {
    let id = this.get('model.id');
    let actionId = this.get('id');
    let queryParams = this.queryParams();
    let modelName = this.get('modelName');
    let adapterOptions = this.get('config.adapterOptions');
    let snapshot = this.get('model')._internalModel.createSnapshot({ adapterOptions });

    return this.get('adapter').urlForCustomAction(modelName, id, snapshot, actionId, queryParams);
  }
});
