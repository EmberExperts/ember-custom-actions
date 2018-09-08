define('ember-concurrency/-property-modifiers-mixin', ['exports', 'ember-concurrency/-scheduler', 'ember-concurrency/-buffer-policy'], function (exports, _scheduler, _bufferPolicy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.propertyModifiers = undefined;
  exports.resolveScheduler = resolveScheduler;
  var propertyModifiers = exports.propertyModifiers = {
    // by default, task(...) expands to task(...).enqueue().maxConcurrency(Infinity)
    _bufferPolicy: _bufferPolicy.enqueueTasksPolicy,
    _maxConcurrency: Infinity,
    _taskGroupPath: null,
    _hasUsedModifier: false,
    _hasSetBufferPolicy: false,
    _hasEnabledEvents: false,

    restartable: function restartable() {
      return setBufferPolicy(this, _bufferPolicy.cancelOngoingTasksPolicy);
    },
    enqueue: function enqueue() {
      return setBufferPolicy(this, _bufferPolicy.enqueueTasksPolicy);
    },
    drop: function drop() {
      return setBufferPolicy(this, _bufferPolicy.dropQueuedTasksPolicy);
    },
    keepLatest: function keepLatest() {
      return setBufferPolicy(this, _bufferPolicy.dropButKeepLatestPolicy);
    },
    maxConcurrency: function maxConcurrency(n) {
      this._hasUsedModifier = true;
      this._maxConcurrency = n;
      assertModifiersNotMixedWithGroup(this);
      return this;
    },
    group: function group(taskGroupPath) {
      this._taskGroupPath = taskGroupPath;
      assertModifiersNotMixedWithGroup(this);
      return this;
    },
    evented: function evented() {
      this._hasEnabledEvents = true;
      return this;
    },
    debug: function debug() {
      this._debug = true;
      return this;
    }
  };

  function setBufferPolicy(obj, policy) {
    obj._hasSetBufferPolicy = true;
    obj._hasUsedModifier = true;
    obj._bufferPolicy = policy;
    assertModifiersNotMixedWithGroup(obj);

    if (obj._maxConcurrency === Infinity) {
      obj._maxConcurrency = 1;
    }

    return obj;
  }

  function assertModifiersNotMixedWithGroup(obj) {
    (false && !(!obj._hasUsedModifier || !obj._taskGroupPath) && Ember.assert('ember-concurrency does not currently support using both .group() with other task modifiers (e.g. drop(), enqueue(), restartable())', !obj._hasUsedModifier || !obj._taskGroupPath));
  }

  function resolveScheduler(propertyObj, obj, TaskGroup) {
    if (propertyObj._taskGroupPath) {
      var taskGroup = obj.get(propertyObj._taskGroupPath);
      (false && !(taskGroup instanceof TaskGroup) && Ember.assert('Expected path \'' + propertyObj._taskGroupPath + '\' to resolve to a TaskGroup object, but instead was ' + taskGroup, taskGroup instanceof TaskGroup));

      return taskGroup._scheduler;
    } else {
      return _scheduler.default.create({
        bufferPolicy: propertyObj._bufferPolicy,
        maxConcurrency: propertyObj._maxConcurrency
      });
    }
  }
});