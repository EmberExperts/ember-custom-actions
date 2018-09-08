define('ember-ajax/-private/utils/url-helpers', ['exports', 'require', 'ember-ajax/-private/utils/is-fastboot'], function (exports, _require2, _isFastboot) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.parseURL = parseURL;
  exports.isFullURL = isFullURL;
  exports.haveSameHost = haveSameHost;
  /* eslint-env browser, node */

  var completeUrlRegex = /^(http|https)/;

  /*
   * Isomorphic URL parsing
   * Borrowed from
   * http://www.sitepoint.com/url-parsing-isomorphic-javascript/
   */
  var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

  var url = function () {
    if (_isFastboot.default) {
      // ember-fastboot-server provides the node url module as URL global
      return URL;
    }

    if (isNode) {
      return (0, _require2.default)('url');
    }

    return document.createElement('a');
  }();

  /**
   * Parse a URL string into an object that defines its structure
   *
   * The returned object will have the following properties:
   *
   *   href: the full URL
   *   protocol: the request protocol
   *   hostname: the target for the request
   *   port: the port for the request
   *   pathname: any URL after the host
   *   search: query parameters
   *   hash: the URL hash
   *
   * @function parseURL
   * @private
   * @param {string} str The string to parse
   * @return {Object} URL structure
   */
  function parseURL(str) {
    var fullObject = void 0;

    if (isNode || _isFastboot.default) {
      fullObject = url.parse(str);
    } else {
      url.href = str;
      fullObject = url;
    }

    var desiredProps = {};
    desiredProps.href = fullObject.href;
    desiredProps.protocol = fullObject.protocol;
    desiredProps.hostname = fullObject.hostname;
    desiredProps.port = fullObject.port;
    desiredProps.pathname = fullObject.pathname;
    desiredProps.search = fullObject.search;
    desiredProps.hash = fullObject.hash;
    return desiredProps;
  }

  function isFullURL(url) {
    return url.match(completeUrlRegex);
  }

  function haveSameHost(a, b) {
    a = parseURL(a);
    b = parseURL(b);

    return a.protocol === b.protocol && a.hostname === b.hostname && a.port === b.port;
  }
});