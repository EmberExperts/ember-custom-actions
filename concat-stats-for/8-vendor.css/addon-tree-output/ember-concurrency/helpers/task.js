define('ember-concurrency/helpers/task', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  function taskHelper([task, ...args]) {
    return task._curry(...args);
  }

  exports.default = Ember.Helper.helper(taskHelper);
});