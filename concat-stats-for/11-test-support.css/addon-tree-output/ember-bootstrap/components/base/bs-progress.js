define('ember-bootstrap/components/base/bs-progress', ['exports', 'ember-bootstrap/templates/components/bs-progress'], function (exports, _bsProgress) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _bsProgress.default,
    classNames: ['progress']
  });
});