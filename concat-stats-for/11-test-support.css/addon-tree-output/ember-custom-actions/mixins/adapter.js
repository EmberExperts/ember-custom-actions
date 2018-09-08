define('ember-custom-actions/mixins/adapter', ['exports', 'ember-custom-actions/utils/url-builder'], function (exports, _urlBuilder) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Mixin.create({
    /**
      @public
      @method urlForCustomAction
      @param {String} modelName
      @param {(String|Null)} id single id null
      @param {DS.Snapshot} snapshot single snapshot
      @param {String} actionId name or relative path of the action
      @param {Object} queryParams object of query parameters to send for query requests
      @return {String} Full URL of custom action
    */
    urlForCustomAction(modelName, id, snapshot, actionId, queryParams) {
      let url = this._buildURL(modelName, id);

      return (0, _urlBuilder.default)(url, actionId, queryParams);
    },

    /**
      @public
      @method methodForCustomAction
      @param {Object} params Contains method, modelId, actionId
      @return {String} Full URL of custom action
    */
    methodForCustomAction({ method }) {
      return method;
    },

    /**
      @public
      @method headersForCustomAction
      @param {Object} params Contains headers, modelId, actionId
      @return {Object} Custom action headers
    */
    headersForCustomAction({ headers }) {
      return headers;
    },

    /**
      @public
      @method dataForCustomAction
      @param {Object} params Contains data, modelId, actionId
      @return {Object} Payload for custom action
    */
    dataForCustomAction({ data }) {
      return data;
    },

    /**
      @public
      @method customRequest
      @param {String} method Method of the request, eg: 'GET', 'POST' etc
      @param {String} path Path of the request, eg. 'my/custom/endpoint'
      @return {Promise} Response promise of the request
    */
    customRequest(method, path, options = {}) {
      let queryParams = options.queryParams || {};
      let ajaxOptions = options.ajaxOptions || {};

      let url = (0, _urlBuilder.default)(this._buildURL(), path, queryParams);
      return this.ajax(url, method, ajaxOptions);
    }
  });
});