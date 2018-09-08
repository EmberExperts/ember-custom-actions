define('ember-ajax/raw', ['exports', 'ember-ajax/ajax-request'], function (exports, _ajaxRequest) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = raw;


  /**
   * Same as `request` except it resolves an object with
   *
   *   {response, textStatus, jqXHR}
   *
   * Useful if you need access to the jqXHR object for headers, etc.
   *
   * @public
   */
  function raw() {
    var ajax = new _ajaxRequest.default();
    return ajax.raw.apply(ajax, arguments);
  }
});