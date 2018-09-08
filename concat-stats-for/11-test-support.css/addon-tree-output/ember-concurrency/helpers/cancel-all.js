define('ember-concurrency/helpers/cancel-all', ['exports', 'ember-concurrency/-helpers'], function (exports, _helpers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.cancelHelper = cancelHelper;


  const CANCEL_REASON = "the 'cancel-all' template helper was invoked";

  function cancelHelper(args) {
    let cancelable = args[0];
    if (!cancelable || typeof cancelable.cancelAll !== 'function') {
      (true && !(false) && Ember.assert(`The first argument passed to the \`cancel-all\` helper should be a Task or TaskGroup (without quotes); you passed ${cancelable}`, false));
    }

    return (0, _helpers.taskHelperClosure)('cancel-all', 'cancelAll', [cancelable, CANCEL_REASON]);
  }

  exports.default = Ember.Helper.helper(cancelHelper);
});