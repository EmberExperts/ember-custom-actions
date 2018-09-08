define('ember-bootstrap/components/bs-alert', ['exports', 'ember-bootstrap/components/base/bs-alert'], function (exports, _bsAlert) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _bsAlert.default.extend({
    classNameBindings: ['showAlert:in']
  });
});