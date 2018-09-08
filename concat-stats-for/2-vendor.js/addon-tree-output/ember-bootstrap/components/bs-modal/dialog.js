define('ember-bootstrap/components/bs-modal/dialog', ['exports', 'ember-bootstrap/components/base/bs-modal/dialog'], function (exports, _dialog) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _dialog.default.extend({
    classNameBindings: ['showModal:in']
  });
});