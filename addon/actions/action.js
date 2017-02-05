import Ember from 'ember';
import UrlBuilder from '../utils/url-builder';
import normalizePayload from '../utils/normalize-payload';
import defaultConfig from '../config';

const { assign, getOwner, computed, isArray, ArrayProxy, Object } = Ember;

export default Object.extend({
  model: null,
  options: {},
  payload: {},
  instance: false,

  store: computed('model', function() {
    return this.get('model').store;
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
    return getOwner(this.get('model')).resolveRegistration('config:environment').emberApiActions || {};
  }),

  config: computed('model', 'options', function() {
    return assign(defaultConfig, this.get('appConfig'), this.get('options'));
  }),

  requestType: computed('config', function() {
    return this.get('config').type.toUpperCase();
  }),

  urlType: computed('config', 'requestType', function() {
    return this.get('config').urlType || this.get('requestType');
  }),

  url: computed('model', 'path', 'urlType', 'instance', function() {
    return UrlBuilder.create({
      path: this.get('path'),
      adapter: this.get('adapter'),
      urlType: this.get('urlType'),
      instance: this.get('instance'),
      model: this.get('model')
    }).build();
  }),

  data: computed('config', 'payload', function() {
    let payload = (this.get('payload') instanceof Object) ? this.get('payload') : {};
    let data = normalizePayload(payload, this.get('config').normalizeOperation);
    return assign(this.get('config').ajaxOptions, { data });
  }),

  callAction() {
    return this.get('adapter').ajax(this.get('url'), this.get('requestType'), this.get('data')).then((response) => {
      if (this.get('config').pushToStore && response.data) {
        return this._pushToStore(this.get('serializer').pushPayload(this.get('store'), response));
      } else {
        return response;
      }
    });
  },

  _pushToStore(content) {
    if (isArray(content)) {
      return ArrayProxy.create({ content });
    } else {
      return content;
    }
  }
});
