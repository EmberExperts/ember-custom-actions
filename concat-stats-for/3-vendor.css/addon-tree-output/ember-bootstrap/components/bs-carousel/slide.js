define('ember-bootstrap/components/bs-carousel/slide', ['exports', 'ember-bootstrap/components/base/bs-carousel/slide'], function (exports, _slide) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _slide.default.extend({
    classNameBindings: ['left', 'next', 'prev', 'right'],
    classNames: ['item']
  });
});