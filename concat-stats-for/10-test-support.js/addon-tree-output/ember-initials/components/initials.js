define('ember-initials/components/initials', ['exports', 'ember-initials/mixins/initials'], function (exports, _initials) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_initials.default);
});