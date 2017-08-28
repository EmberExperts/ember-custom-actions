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
    // return this._makeUrl(this._buildUrl(id));

    let query = this.get('params');
    let snapshot = this.get('snapshot');
    let modelName = this.get('modelName');
    let requestType = this.get('urlType');
    let adapter = this.get('adapter');
    let actionName = this.get('path');
    let urlFromAdapter = null;
    let instance = this.get('instance');

    if (instance) {
      urlFromAdapter = adapter.urlForModelAction && adapter.urlForModelAction({ actionName, snapshot });
    } else {
      urlFromAdapter = adapter.urlForResourceAction && adapter.urlForResourceAction({ actionName });
    }

    if (urlFromAdapter) {
      let parameterisedQuery = $.param(this.get('params'));

      if (parameterisedQuery) {
        return `${urlFromAdapter}?${parameterisedQuery}`;
      } else {
        return urlFromAdapter;
      }
    } else {
      let url = adapter.buildURL(modelName, id, snapshot, requestType, query);
      let pathUrl = '';
      let parameterisedQuery = $.param(this.get('params'));

      if (url.charAt(url.length - 1) === '/') {
        pathUrl = `${url}${this.get('path')}`;
      } else {
        pathUrl = `${url}/${this.get('path')}`;
      }

      if (parameterisedQuery) {
        return `${pathUrl}?${parameterisedQuery}`;
      } else {
        return pathUrl;
      }
    }
  }

  // _buildUrl(id) {
  // },

  // _makeUrl(url) {
  // }
});
