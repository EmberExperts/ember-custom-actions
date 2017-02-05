import Ember from 'ember';

const { assert, computed, Object } = Ember;

export default Object.extend({
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
    return this.get('adapter').buildURL(this.get('modelName'), id, this.get('snapshot'), this.get('urlType'));
  },

  _makeUrl(url) {
    if (url.charAt(url.length - 1) === '/') {
      return `${url}${this.get('path')}`;
    } else {
      return `${url}/${this.get('path')}`;
    }
  }
});
