import Ember from 'ember';
import UrlBuilder from '../utils/url-builder';
import normalizePayload from '../utils/normalize-payload';
import defaultConfig from '../config';

const {
  assign,
  getOwner,
  computed,
  Object: EmberObject,
  ObjectProxy,
  ArrayProxy,
  PromiseProxyMixin,
  typeOf: emberTypeOf,
  isArray,
  RSVP
} = Ember;

const promiseTypes = {
  array: ArrayProxy.extend(PromiseProxyMixin),
  object: ObjectProxy.extend(PromiseProxyMixin)
};

export default EmberObject.extend({
  model: null,
  options: {},
  payload: {},
  instance: false,

  store: computed.reads('model.store'),

  params: computed('config.params', 'adapter', function() {
    let params = emberTypeOf(this.get('config.params')) === 'object' ? this.get('config.params') : {};
    return this.get('adapter').sortQueryParams(params);
  }),

  modelName: computed('model', function() {
    let { constructor } = this.get('model');
    return constructor.modelName || constructor.typeKey;
  }),

  adapter: computed('modelName', 'store', function() {
    return this.get('store').adapterFor(this.get('modelName'));
  }),

  serializer: computed('modelName', 'store', function() {
    return this.get('store').serializerFor(this.get('modelName'));
  }),

  appConfig: computed('model', function() {
    let config = getOwner(this.get('model')).resolveRegistration('config:environment').emberCustomActions || {};
    return EmberObject.create(config);
  }),

  defaultConfig: computed(function() {
    return EmberObject.create(defaultConfig);
  }),

  config: computed('defaultConfig', 'options', 'appConfig', function() {
    return EmberObject.create(assign({}, this.get('defaultConfig'), this.get('appConfig'), this.get('options')));
  }),

  requestType: computed('config.type', 'adapter', 'path', function() {
    let adapter = this.get('adapter');
    let actionName = this.get('path');
    let instance = this.get('instance');
    let adapterType = null;
    if (instance) {
      adapterType = adapter.methodForModelAction && adapter.methodForModelAction({ actionName });
    } else {
      adapterType = adapter.methodForResourceAction && adapter.methodForResourceAction({ actionName });
    }
    let type = adapterType || this.get('config.type');
    return type.toUpperCase();
  }),

  urlType: computed.or('config.urlType', 'requestType'),

  url: computed('model', 'path', 'urlType', 'instance', 'adapter', function() {
    return UrlBuilder.create({
      path: this.get('path'),
      adapter: this.get('adapter'),
      urlType: this.get('urlType'),
      instance: this.get('instance'),
      model: this.get('model'),
      params: this.get('params')
    }).build();
  }),

  data: computed('config.{normalizeOperation,ajaxOptions}', 'payload', 'adapter', 'model', 'actionName', function() {
    let payload = emberTypeOf(this.get('payload')) === 'object' ? this.get('payload') : {};
    let data = normalizePayload(payload, this.get('config.normalizeOperation'));
    let options = assign({}, this.get('config.ajaxOptions'), { data });
    let adapter = this.get('adapter');
    let snapshot = this.get('model')._createSnapshot();
    let actionName = this.get('path');
    let adapterHeaders = adapter.headersForModelAction && adapter.headersForModelAction({ actionName, snapshot });

    if (!options.headers) {
      options.headers = {};
    }

    assign(options.headers, adapterHeaders);

    return options;
  }),

  promiseType: computed('config.promiseType', function() {
    return promiseTypes[this.get('config.promiseType')];
  }),

  callAction() {
    let promise = this._promise();
    return this.get('promiseType') ? this.get('promiseType').create({ promise }) : promise;
  },

  _promise() {
    return this.get('adapter')
      .ajax(this.get('url'), this.get('requestType'), this.get('data'))
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
