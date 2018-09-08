define('ember-bootstrap/components/bs-tab/pane', ['exports', 'ember-bootstrap/components/base/bs-tab/pane'], function (exports, _pane) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pane.default.extend({
    classNameBindings: ['showContent:in']
  });
});