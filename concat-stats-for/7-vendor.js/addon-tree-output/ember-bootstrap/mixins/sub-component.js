define('ember-bootstrap/mixins/sub-component', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Mixin.create({
    targetObject: Ember.computed.alias('parentView')
  });
});