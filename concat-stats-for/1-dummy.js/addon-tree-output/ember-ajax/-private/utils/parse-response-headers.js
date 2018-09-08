define('ember-ajax/-private/utils/parse-response-headers', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = parseResponseHeaders;

  function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  }

  var CRLF = exports.CRLF = '\r\n';

  function parseResponseHeaders(headersString) {
    var headers = {};

    if (!headersString) {
      return headers;
    }

    return headersString.split(CRLF).reduce(function (hash, header) {
      var _header$split = header.split(':'),
          _header$split2 = _toArray(_header$split),
          field = _header$split2[0],
          value = _header$split2.slice(1);

      field = field.trim();
      value = value.join(':').trim();

      if (value) {
        hash[field] = value;
      }

      return hash;
    }, headers);
  }
});