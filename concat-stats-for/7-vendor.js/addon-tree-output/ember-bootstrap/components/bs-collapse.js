define('ember-bootstrap/components/bs-collapse', ['exports', 'ember-bootstrap/components/base/bs-collapse'], function (exports, _bsCollapse) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _bsCollapse.default.extend({
    classNameBindings: ['showContent:in']
  });
});