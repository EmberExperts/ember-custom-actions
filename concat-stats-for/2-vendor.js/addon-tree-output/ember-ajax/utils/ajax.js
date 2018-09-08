define('ember-ajax/utils/ajax', ['exports', 'ember-ajax/-private/utils/is-fastboot'], function (exports, _isFastboot) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _isFastboot.default ? najax : Ember.$.ajax;
});