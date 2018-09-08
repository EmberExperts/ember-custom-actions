define('ember-concurrency/-buffer-policy', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  const saturateActiveQueue = scheduler => {
    while (scheduler.activeTaskInstances.length < scheduler.maxConcurrency) {
      let taskInstance = scheduler.queuedTaskInstances.shift();
      if (!taskInstance) {
        break;
      }
      scheduler.activeTaskInstances.push(taskInstance);
    }
  };

  function numPerformSlots(scheduler) {
    return scheduler.maxConcurrency - scheduler.queuedTaskInstances.length - scheduler.activeTaskInstances.length;
  }

  const enqueueTasksPolicy = exports.enqueueTasksPolicy = {
    requiresUnboundedConcurrency: true,
    schedule(scheduler) {
      // [a,b,_] [c,d,e,f] becomes
      // [a,b,c] [d,e,f]
      saturateActiveQueue(scheduler);
    },
    getNextPerformStatus(scheduler) {
      return numPerformSlots(scheduler) > 0 ? 'succeed' : 'enqueue';
    }
  };

  const dropQueuedTasksPolicy = exports.dropQueuedTasksPolicy = {
    cancelReason: `it belongs to a 'drop' Task that was already running`,
    schedule(scheduler) {
      // [a,b,_] [c,d,e,f] becomes
      // [a,b,c] []
      saturateActiveQueue(scheduler);
      scheduler.spliceTaskInstances(this.cancelReason, scheduler.queuedTaskInstances, 0, scheduler.queuedTaskInstances.length);
    },
    getNextPerformStatus(scheduler) {
      return numPerformSlots(scheduler) > 0 ? 'succeed' : 'drop';
    }
  };

  const cancelOngoingTasksPolicy = exports.cancelOngoingTasksPolicy = {
    cancelReason: `it belongs to a 'restartable' Task that was .perform()ed again`,
    schedule(scheduler) {
      // [a,b,_] [c,d,e,f] becomes
      // [d,e,f] []
      let activeTaskInstances = scheduler.activeTaskInstances;
      let queuedTaskInstances = scheduler.queuedTaskInstances;
      activeTaskInstances.push(...queuedTaskInstances);
      queuedTaskInstances.length = 0;

      let numToShift = Math.max(0, activeTaskInstances.length - scheduler.maxConcurrency);
      scheduler.spliceTaskInstances(this.cancelReason, activeTaskInstances, 0, numToShift);
    },
    getNextPerformStatus(scheduler) {
      return numPerformSlots(scheduler) > 0 ? 'succeed' : 'cancel_previous';
    }
  };

  const dropButKeepLatestPolicy = exports.dropButKeepLatestPolicy = {
    cancelReason: `it belongs to a 'keepLatest' Task that was already running`,
    schedule(scheduler) {
      // [a,b,_] [c,d,e,f] becomes
      // [d,e,f] []
      saturateActiveQueue(scheduler);
      scheduler.spliceTaskInstances(this.cancelReason, scheduler.queuedTaskInstances, 0, scheduler.queuedTaskInstances.length - 1);
    }
  };
});