define('ember-bootstrap/components/bs-progress/bar', ['exports', 'ember-bootstrap/components/base/bs-progress/bar'], function (exports, _bar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _bar.default.extend({
    classNameBindings: ['progressBarAnimate:active'],

    /**
     * @property classTypePrefix
     * @type String
     * @default 'progress-bar'
     * @protected
     */
    classTypePrefix: 'progress-bar'
  });
});