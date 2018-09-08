define('ember-bootstrap/components/base/bs-navbar/content', ['exports', 'ember-bootstrap/templates/components/bs-navbar/content', 'ember-bootstrap/components/bs-collapse'], function (exports, _content, _bsCollapse) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _bsCollapse.default.extend({
    layout: _content.default,

    classNames: ['navbar-collapse']
  });
});