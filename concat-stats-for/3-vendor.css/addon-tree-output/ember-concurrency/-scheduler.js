define('ember-concurrency/-scheduler', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var SEEN_INDEX = 0;

  var Scheduler = Ember.Object.extend({
    lastPerformed: null,
    lastStarted: null,
    lastRunning: null,
    lastSuccessful: null,
    lastComplete: null,
    lastErrored: null,
    lastCanceled: null,
    lastIncomplete: null,
    performCount: 0,

    boundHandleFulfill: null,
    boundHandleReject: null,

    init: function init() {
      this._super.apply(this, arguments);
      this.activeTaskInstances = [];
      this.queuedTaskInstances = [];
    },
    cancelAll: function cancelAll(reason) {
      var seen = [];
      this.spliceTaskInstances(reason, this.activeTaskInstances, 0, this.activeTaskInstances.length, seen);
      this.spliceTaskInstances(reason, this.queuedTaskInstances, 0, this.queuedTaskInstances.length, seen);
      flushTaskCounts(seen);
    },
    spliceTaskInstances: function spliceTaskInstances(cancelReason, taskInstances, index, count, seen) {
      for (var i = index; i < index + count; ++i) {
        var taskInstance = taskInstances[i];

        if (!taskInstance.hasStarted) {
          // This tracking logic is kinda spread all over the place...
          // maybe TaskInstances themselves could notify
          // some delegate of queued state changes upon cancelation?
          taskInstance.task.decrementProperty('numQueued');
        }

        taskInstance.cancel(cancelReason);
        if (seen) {
          seen.push(taskInstance.task);
        }
      }
      taskInstances.splice(index, count);
    },
    schedule: function schedule(taskInstance) {
      Ember.set(this, 'lastPerformed', taskInstance);
      this.incrementProperty('performCount');
      taskInstance.task.incrementProperty('numQueued');
      this.queuedTaskInstances.push(taskInstance);
      this._flushQueues();
    },
    _flushQueues: function _flushQueues() {
      var seen = [];

      for (var i = 0; i < this.activeTaskInstances.length; ++i) {
        seen.push(this.activeTaskInstances[i].task);
      }

      this.activeTaskInstances = filterFinished(this.activeTaskInstances);

      this.bufferPolicy.schedule(this);

      var lastStarted = null;
      for (var _i = 0; _i < this.activeTaskInstances.length; ++_i) {
        var taskInstance = this.activeTaskInstances[_i];
        if (!taskInstance.hasStarted) {
          this._startTaskInstance(taskInstance);
          lastStarted = taskInstance;
        }
        seen.push(taskInstance.task);
      }

      if (lastStarted) {
        Ember.set(this, 'lastStarted', lastStarted);
      }
      Ember.set(this, 'lastRunning', lastStarted);

      for (var _i2 = 0; _i2 < this.queuedTaskInstances.length; ++_i2) {
        seen.push(this.queuedTaskInstances[_i2].task);
      }

      flushTaskCounts(seen);
      Ember.set(this, 'concurrency', this.activeTaskInstances.length);
    },
    _startTaskInstance: function _startTaskInstance(taskInstance) {
      var _this = this;

      var task = taskInstance.task;
      task.decrementProperty('numQueued');
      task.incrementProperty('numRunning');

      taskInstance._start()._onFinalize(function () {
        task.decrementProperty('numRunning');
        var state = taskInstance._completionState;
        Ember.set(_this, 'lastComplete', taskInstance);
        if (state === 1) {
          Ember.set(_this, 'lastSuccessful', taskInstance);
        } else {
          if (state === 2) {
            Ember.set(_this, 'lastErrored', taskInstance);
          } else if (state === 3) {
            Ember.set(_this, 'lastCanceled', taskInstance);
          }
          Ember.set(_this, 'lastIncomplete', taskInstance);
        }
        Ember.run.once(_this, _this._flushQueues);
      });
    }
  });

  function flushTaskCounts(tasks) {
    SEEN_INDEX++;
    for (var i = 0, l = tasks.length; i < l; ++i) {
      var task = tasks[i];
      if (task._seenIndex < SEEN_INDEX) {
        task._seenIndex = SEEN_INDEX;
        updateTaskChainCounts(task);
      }
    }
  }

  function updateTaskChainCounts(task) {
    var numRunning = task.numRunning;
    var numQueued = task.numQueued;
    var taskGroup = task.get('group');

    while (taskGroup) {
      Ember.set(taskGroup, 'numRunning', numRunning);
      Ember.set(taskGroup, 'numQueued', numQueued);
      taskGroup = taskGroup.get('group');
    }
  }

  function filterFinished(taskInstances) {
    var ret = [];
    for (var i = 0, l = taskInstances.length; i < l; ++i) {
      var taskInstance = taskInstances[i];
      if (Ember.get(taskInstance, 'isFinished') === false) {
        ret.push(taskInstance);
      }
    }
    return ret;
  }

  exports.default = Scheduler;
});