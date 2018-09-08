define('ember-bootstrap/components/bs-form/element/errors', ['exports', 'ember-bootstrap/components/base/bs-form/element/errors'], function (exports, _errors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _errors.default.extend({
    feedbackClass: 'help-block'
  });
});