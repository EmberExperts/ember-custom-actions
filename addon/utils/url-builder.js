import Ember from 'ember';

const { assert, computed, Object: EmberObject, $ } = Ember;

export default EmberObject.extend({
  params: {},

  modelName: computed('model', function() {
    let { constructor } = this.get('model');
    return constructor.modelName || constructor.typeKey;
  }),

  snapshot: computed('model', function() {
    return this.get('model')._createSnapshot();
  }),

  build() {
    assert('You must provide a path for model action!', this.get('path'));
    assert('Model has to be persisted!', !(this.get('instance') && !this.get('model.id')));

    let id = this.get('instance') ? this.get('model.id') : null;
    return this._makeUrl(this._buildUrl(id));
  },

  _buildUrl(id) {
    let query = this.get('params');
    let snapshot = this.get('snapshot');
    let modelName = this.get('modelName');
    let requestType = this.get('urlType');

    return this.get('adapter').buildURL(modelName, id, snapshot, requestType, query);
  },

  _makeUrl(url) {
    let pathUrl = '';
    let query = $.param(this.get('params'));

    if (url.charAt(url.length - 1) === '/') {
      pathUrl = `${url}${this.get('path')}`;
    } else {
      pathUrl = `${url}/${this.get('path')}`;
    }

    if (query) {
      return `${pathUrl}?${query}`;
    } else {
      return pathUrl;
    }
  }
});
