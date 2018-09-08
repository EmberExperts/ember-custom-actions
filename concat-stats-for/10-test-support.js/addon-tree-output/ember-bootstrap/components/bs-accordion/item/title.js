define('ember-bootstrap/components/bs-accordion/item/title', ['exports', 'ember-bootstrap/components/base/bs-accordion/item/title'], function (exports, _title) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _title.default.extend({
    classNames: ['panel-heading']
  });
});