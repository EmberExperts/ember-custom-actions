import Ember from 'ember';
import urlBuilder from 'ember-custom-actions/utils/url-builder';

const { Mixin } = Ember;

export default Mixin.create({
  urlForCustomAction(modelName, id, snapshot, requestType, query) {
    let url = this._buildURL(modelName, id);

    return urlBuilder(url, requestType, query);
  }
});
