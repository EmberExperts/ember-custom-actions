define('ember-custom-actions/utils/url-builder', ['exports', 'jquery-param'], function (exports, _jqueryParam) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (url, path, queryParams) {
    var query = (0, _jqueryParam.default)(queryParams);
    var pathUrl = url.charAt(url.length - 1) === '/' ? '' + url + path : url + '/' + path;

    return query ? pathUrl + '?' + query : pathUrl;
  };
});