define('ember-raf-scheduler/test-support/register-waiter', ['exports', 'ember-raf-scheduler'], function (exports, _emberRafScheduler) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = registerWaiter;
  function registerWaiter() {
    // We can't rely on the importable Ember since shims are no
    // longer included by default, so use the global instance.
    // eslint-disable-next-line
    Ember.Test.registerWaiter(function () {
      return _emberRafScheduler.default.jobs === 0;
    });
  }
});