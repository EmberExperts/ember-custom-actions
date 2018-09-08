define('ember-concurrency/-helpers', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.taskHelperClosure = taskHelperClosure;
  function taskHelperClosure(helperName, taskMethod, _args, hash) {
    let task = _args[0];
    let outerArgs = _args.slice(1);

    return Ember.run.bind(null, function (...innerArgs) {
      if (!task || typeof task[taskMethod] !== 'function') {
        (true && !(false) && Ember.assert(`The first argument passed to the \`${helperName}\` helper should be a Task object (without quotes); you passed ${task}`, false));

        return;
      }

      if (hash && hash.value) {
        let event = innerArgs.pop();
        innerArgs.push(Ember.get(event, hash.value));
      }

      return task[taskMethod](...outerArgs, ...innerArgs);
    });
  }
});