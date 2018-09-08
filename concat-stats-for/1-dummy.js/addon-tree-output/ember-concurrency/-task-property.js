define('ember-concurrency/-task-property', ['exports', 'ember-concurrency/-task-instance', 'ember-concurrency/-task-state-mixin', 'ember-concurrency/-task-group', 'ember-concurrency/-property-modifiers-mixin', 'ember-concurrency/utils', 'ember-concurrency/-encapsulated-task'], function (exports, _taskInstance, _taskStateMixin, _taskGroup, _propertyModifiersMixin, _utils, _encapsulatedTask) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Task = undefined;
  exports.TaskProperty = TaskProperty;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var PerformProxy = Ember.Object.extend({
    _task: null,
    _performType: null,
    _linkedObject: null,

    perform: function perform() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this._task._performShared(args, this._performType, this._linkedObject);
    }
  });

  /**
    The `Task` object lives on a host Ember object (e.g.
    a Component, Route, or Controller). You call the
    {@linkcode Task#perform .perform()} method on this object
    to create run individual {@linkcode TaskInstance}s,
    and at any point, you can call the {@linkcode Task#cancelAll .cancelAll()}
    method on this object to cancel all running or enqueued
    {@linkcode TaskInstance}s.
  
  
    <style>
      .ignore-this--this-is-here-to-hide-constructor,
      #Task{ display: none }
    </style>
  
    @class Task
  */
  var Task = exports.Task = Ember.Object.extend(_taskStateMixin.default, _defineProperty({
    /**
     * `true` if any current task instances are running.
     *
     * @memberof Task
     * @member {boolean} isRunning
     * @instance
     * @readOnly
     */

    /**
     * `true` if any future task instances are queued.
     *
     * @memberof Task
     * @member {boolean} isQueued
     * @instance
     * @readOnly
     */

    /**
     * `true` if the task is not in the running or queued state.
     *
     * @memberof Task
     * @member {boolean} isIdle
     * @instance
     * @readOnly
     */

    /**
     * The current state of the task: `"running"`, `"queued"` or `"idle"`.
     *
     * @memberof Task
     * @member {string} state
     * @instance
     * @readOnly
     */

    /**
     * The most recently started task instance.
     *
     * @memberof Task
     * @member {TaskInstance} last
     * @instance
     * @readOnly
     */

    /**
     * The most recent task instance that is currently running.
     *
     * @memberof Task
     * @member {TaskInstance} lastRunning
     * @instance
     * @readOnly
     */

    /**
     * The most recently performed task instance.
     *
     * @memberof Task
     * @member {TaskInstance} lastPerformed
     * @instance
     * @readOnly
     */

    /**
     * The most recent task instance that succeeded.
     *
     * @memberof Task
     * @member {TaskInstance} lastSuccessful
     * @instance
     * @readOnly
     */

    /**
     * The most recently completed task instance.
     *
     * @memberof Task
     * @member {TaskInstance} lastComplete
     * @instance
     * @readOnly
     */

    /**
     * The most recent task instance that errored.
     *
     * @memberof Task
     * @member {TaskInstance} lastErrored
     * @instance
     * @readOnly
     */

    /**
     * The most recently canceled task instance.
     *
     * @memberof Task
     * @member {TaskInstance} lastCanceled
     * @instance
     * @readOnly
     */

    /**
     * The most recent task instance that is incomplete.
     *
     * @memberof Task
     * @member {TaskInstance} lastIncomplete
     * @instance
     * @readOnly
     */

    /**
     * The number of times this task has been performed.
     *
     * @memberof Task
     * @member {number} performCount
     * @instance
     * @readOnly
     */

    fn: null,
    context: null,
    _observes: null,
    _curryArgs: null,
    _linkedObjects: null,

    init: function init() {
      this._super.apply(this, arguments);

      if (_typeof(this.fn) === 'object') {
        var owner = Ember.getOwner(this.context);
        var ownerInjection = owner ? owner.ownerInjection() : {};
        this._taskInstanceFactory = _encapsulatedTask.default.extend(ownerInjection, this.fn);
      }

      (0, _utils._cleanupOnDestroy)(this.context, this, 'cancelAll', 'the object it lives on was destroyed or unrendered');
    },
    _curry: function _curry() {
      var task = this._clone();

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      task._curryArgs = [].concat(_toConsumableArray(this._curryArgs || []), _toConsumableArray(args));
      return task;
    },
    linked: function linked() {
      var taskInstance = (0, _taskInstance.getRunningInstance)();
      if (!taskInstance) {
        throw new Error('You can only call .linked() from within a task.');
      }

      return PerformProxy.create({
        _task: this,
        _performType: _taskInstance.PERFORM_TYPE_LINKED,
        _linkedObject: taskInstance
      });
    },
    unlinked: function unlinked() {
      return PerformProxy.create({
        _task: this,
        _performType: _taskInstance.PERFORM_TYPE_UNLINKED
      });
    },
    _clone: function _clone() {
      return Task.create({
        fn: this.fn,
        context: this.context,
        _origin: this._origin,
        _taskGroupPath: this._taskGroupPath,
        _scheduler: this._scheduler,
        _propertyName: this._propertyName
      });
    },


    /**
     * This property is true if this task is NOT running, i.e. the number
     * of currently running TaskInstances is zero.
     *
     * This property is useful for driving the state/style of buttons
     * and loading UI, among other things.
     *
     * @memberof Task
     * @instance
     * @readOnly
     */

    /**
     * This property is true if this task is running, i.e. the number
     * of currently running TaskInstances is greater than zero.
     *
     * This property is useful for driving the state/style of buttons
     * and loading UI, among other things.
     *
     * @memberof Task
     * @instance
     * @readOnly
     */

    /**
     * EXPERIMENTAL
     *
     * This value describes what would happen to the TaskInstance returned
     * from .perform() if .perform() were called right now.  Returns one of
     * the following values:
     *
     * - `succeed`: new TaskInstance will start running immediately
     * - `drop`: new TaskInstance will be dropped
     * - `enqueue`: new TaskInstance will be enqueued for later execution
     *
     * @memberof Task
     * @instance
     * @private
     * @readOnly
     */

    /**
     * EXPERIMENTAL
     *
     * Returns true if calling .perform() right now would immediately start running
     * the returned TaskInstance.
     *
     * @memberof Task
     * @instance
     * @private
     * @readOnly
     */

    /**
     * EXPERIMENTAL
     *
     * Returns true if calling .perform() right now would immediately cancel (drop)
     * the returned TaskInstance.
     *
     * @memberof Task
     * @instance
     * @private
     * @readOnly
     */

    /**
     * EXPERIMENTAL
     *
     * Returns true if calling .perform() right now would enqueue the TaskInstance
     * rather than execute immediately.
     *
     * @memberof Task
     * @instance
     * @private
     * @readOnly
     */

    /**
     * EXPERIMENTAL
     *
     * Returns true if calling .perform() right now would cause a previous task to be canceled
     *
     * @memberof Task
     * @instance
     * @private
     * @readOnly
     */

    /**
     * The current number of active running task instances. This
     * number will never exceed maxConcurrency.
     *
     * @memberof Task
     * @instance
     * @readOnly
     */

    /**
     * Cancels all running or queued `TaskInstance`s for this Task.
     * If you're trying to cancel a specific TaskInstance (rather
     * than all of the instances running under this task) call
     * `.cancel()` on the specific TaskInstance.
     *
     * @method cancelAll
     * @memberof Task
     * @instance
     */

    toString: function toString() {
      return '<Task:' + this._propertyName + '>';
    },


    _taskInstanceFactory: _taskInstance.default,

    /**
     * Creates a new {@linkcode TaskInstance} and attempts to run it right away.
     * If running this task instance would increase the task's concurrency
     * to a number greater than the task's maxConcurrency, this task
     * instance might be immediately canceled (dropped), or enqueued
     * to run at later time, after the currently running task(s) have finished.
     *
     * @method perform
     * @memberof Task
     * @param {*} arg* - args to pass to the task function
     * @instance
     *
     * @fires TaskInstance#TASK_NAME:started
     * @fires TaskInstance#TASK_NAME:succeeded
     * @fires TaskInstance#TASK_NAME:errored
     * @fires TaskInstance#TASK_NAME:canceled
     *
     */
    perform: function perform() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return this._performShared(args, _taskInstance.PERFORM_TYPE_DEFAULT, null);
    },
    _performShared: function _performShared(args, performType, linkedObject) {
      var fullArgs = this._curryArgs ? [].concat(_toConsumableArray(this._curryArgs), _toConsumableArray(args)) : args;
      var taskInstance = this._taskInstanceFactory.create({
        fn: this.fn,
        args: fullArgs,
        context: this.context,
        owner: this.context,
        task: this,
        _debug: this._debug,
        _hasEnabledEvents: this._hasEnabledEvents,
        _origin: this,
        _performType: performType
      });

      if (performType === _taskInstance.PERFORM_TYPE_LINKED) {
        linkedObject._expectsLinkedYield = true;
      }

      if (this.context.isDestroying) {
        // TODO: express this in terms of lifetimes; a task linked to
        // a dead lifetime should immediately cancel.
        taskInstance.cancel();
      }

      this._scheduler.schedule(taskInstance);
      return taskInstance;
    }
  }, _utils.INVOKE, function () {
    return this.perform.apply(this, arguments);
  }));

  /**
    A {@link TaskProperty} is the Computed Property-like object returned
    from the {@linkcode task} function. You can call Task Modifier methods
    on this object to configure the behavior of the {@link Task}.
  
    See [Managing Task Concurrency](/#/docs/task-concurrency) for an
    overview of all the different task modifiers you can use and how
    they impact automatic cancelation / enqueueing of task instances.
  
    <style>
      .ignore-this--this-is-here-to-hide-constructor,
      #TaskProperty { display: none }
    </style>
  
    @class TaskProperty
  */
  function TaskProperty(taskFn) {
    var tp = this;
    _utils._ComputedProperty.call(this, function (_propertyName) {
      taskFn.displayName = _propertyName + ' (task)';
      return Task.create({
        fn: tp.taskFn,
        context: this,
        _origin: this,
        _taskGroupPath: tp._taskGroupPath,
        _scheduler: (0, _propertyModifiersMixin.resolveScheduler)(tp, this, _taskGroup.TaskGroup),
        _propertyName: _propertyName,
        _debug: tp._debug,
        _hasEnabledEvents: tp._hasEnabledEvents
      });
    });

    this.taskFn = taskFn;
    this.eventNames = null;
    this.cancelEventNames = null;
    this._observes = null;
  }

  TaskProperty.prototype = Object.create(_utils._ComputedProperty.prototype);
  (0, _utils.objectAssign)(TaskProperty.prototype, _propertyModifiersMixin.propertyModifiers, {
    constructor: TaskProperty,

    setup: function setup(proto, taskName) {
      if (this._maxConcurrency !== Infinity && !this._hasSetBufferPolicy) {
        Ember.Logger.warn('The use of maxConcurrency() without a specified task modifier is deprecated and won\'t be supported in future versions of ember-concurrency. Please specify a task modifier instead, e.g. `' + taskName + ': task(...).enqueue().maxConcurrency(' + this._maxConcurrency + ')`');
      }

      registerOnPrototype(Ember.addListener, proto, this.eventNames, taskName, 'perform', false);
      registerOnPrototype(Ember.addListener, proto, this.cancelEventNames, taskName, 'cancelAll', false);
      registerOnPrototype(Ember.addObserver, proto, this._observes, taskName, 'perform', true);
    },
    on: function on() {
      this.eventNames = this.eventNames || [];
      this.eventNames.push.apply(this.eventNames, arguments);
      return this;
    },
    cancelOn: function cancelOn() {
      this.cancelEventNames = this.cancelEventNames || [];
      this.cancelEventNames.push.apply(this.cancelEventNames, arguments);
      return this;
    },
    observes: function observes() {
      for (var _len4 = arguments.length, properties = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        properties[_key4] = arguments[_key4];
      }

      this._observes = properties;
      return this;
    },
    perform: function perform() {
      throw new Error("It looks like you tried to perform a task via `this.nameOfTask.perform()`, which isn't supported. Use `this.get('nameOfTask').perform()` instead.");
    }
  });

  function registerOnPrototype(addListenerOrObserver, proto, names, taskName, taskMethod, once) {
    if (names) {
      for (var i = 0; i < names.length; ++i) {
        var name = names[i];
        addListenerOrObserver(proto, name, null, makeTaskCallback(taskName, taskMethod, once));
      }
    }
  }

  function makeTaskCallback(taskName, method, once) {
    return function () {
      var task = this.get(taskName);

      if (once) {
        Ember.run.scheduleOnce.apply(undefined, ['actions', task, method].concat(Array.prototype.slice.call(arguments)));
      } else {
        task[method].apply(task, arguments);
      }
    };
  }
});