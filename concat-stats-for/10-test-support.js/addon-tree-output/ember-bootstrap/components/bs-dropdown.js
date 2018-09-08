define('ember-bootstrap/components/bs-dropdown', ['exports', 'ember-bootstrap/components/base/bs-dropdown'], function (exports, _bsDropdown) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _bsDropdown.default.extend({
    classNameBindings: ['isOpen:open']
  });
});