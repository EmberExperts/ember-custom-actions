define('ember-concurrency/-task-group', ['exports', 'ember-concurrency/utils', 'ember-concurrency/-task-state-mixin', 'ember-concurrency/-property-modifiers-mixin'], function (exports, _utils, _taskStateMixin, _propertyModifiersMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TaskGroup = undefined;
  exports.TaskGroupProperty = TaskGroupProperty;
  const TaskGroup = exports.TaskGroup = Ember.Object.extend(_taskStateMixin.default, {
    isTaskGroup: true,

    toString() {
      return `<TaskGroup:${this._propertyName}>`;
    },

    _numRunningOrNumQueued: Ember.computed.or('numRunning', 'numQueued'),
    isRunning: Ember.computed.bool('_numRunningOrNumQueued'),
    isQueued: false
  });

  function TaskGroupProperty(...decorators) {
    let taskFn = decorators.pop();
    let tp = this;
    _utils._ComputedProperty.call(this, function (_propertyName) {
      return TaskGroup.create({
        fn: taskFn,
        context: this,
        _origin: this,
        _taskGroupPath: tp._taskGroupPath,
        _scheduler: (0, _propertyModifiersMixin.resolveScheduler)(tp, this, TaskGroup),
        _propertyName
      });
    });
  }

  TaskGroupProperty.prototype = Object.create(_utils._ComputedProperty.prototype);
  (0, _utils.objectAssign)(TaskGroupProperty.prototype, _propertyModifiersMixin.propertyModifiers, {
    constructor: TaskGroupProperty
  });
});