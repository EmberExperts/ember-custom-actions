import Mixin from '@ember/object/mixin';
import urlBuilder from 'ember-custom-actions/utils/url-builder';

export default Mixin.create({
  /**
    @public
    @method urlForCustomAction
    @param {type} modelName
    @param {(String|Null)} id single id null
    @param {DS.Snapshot} snapshot single snapshot
    @param {String} actionId name or relative path of the action
    @param {Object} queryParams object of query parameters to send for query requests
    @return {String} Full URL of custom action
  */
  urlForCustomAction(modelName, id, snapshot, actionId, queryParams) {
    let url = this._buildURL(modelName, id);

    return urlBuilder(url, actionId, queryParams);
  }
});
