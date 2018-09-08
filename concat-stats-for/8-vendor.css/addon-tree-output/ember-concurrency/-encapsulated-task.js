define('ember-concurrency/-encapsulated-task', ['exports', 'ember-concurrency/-task-instance'], function (exports, _taskInstance) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _taskInstance.default.extend({
    _makeIterator() {
      let perform = this.get('perform');
      (true && !(typeof perform === 'function') && Ember.assert("The object passed to `task()` must define a `perform` generator function, e.g. `perform: function * (a,b,c) {...}`, or better yet `*perform(a,b,c) {...}`", typeof perform === 'function'));

      return perform.apply(this, this.args);
    },

    perform: null
  });
});