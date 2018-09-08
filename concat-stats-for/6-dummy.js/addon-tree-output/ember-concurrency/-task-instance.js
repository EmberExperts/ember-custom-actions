define('ember-concurrency/-task-instance', ['exports', 'ember-concurrency/utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.PERFORM_TYPE_LINKED = exports.PERFORM_TYPE_UNLINKED = exports.PERFORM_TYPE_DEFAULT = undefined;
  exports.getRunningInstance = getRunningInstance;
  exports.didCancel = didCancel;
  exports.go = go;
  exports.wrap = wrap;


  const TASK_CANCELATION_NAME = 'TaskCancelation';

  const COMPLETION_PENDING = 0;
  const COMPLETION_SUCCESS = 1;
  const COMPLETION_ERROR = 2;
  const COMPLETION_CANCEL = 3;

  const GENERATOR_STATE_BEFORE_CREATE = "BEFORE_CREATE";
  const GENERATOR_STATE_HAS_MORE_VALUES = "HAS_MORE_VALUES";
  const GENERATOR_STATE_DONE = "DONE";
  const GENERATOR_STATE_ERRORED = "ERRORED";

  const PERFORM_TYPE_DEFAULT = exports.PERFORM_TYPE_DEFAULT = "PERFORM_TYPE_DEFAULT";
  const PERFORM_TYPE_UNLINKED = exports.PERFORM_TYPE_UNLINKED = "PERFORM_TYPE_UNLINKED";
  const PERFORM_TYPE_LINKED = exports.PERFORM_TYPE_LINKED = "PERFORM_TYPE_LINKED";

  let TASK_INSTANCE_STACK = [];

  function getRunningInstance() {
    return TASK_INSTANCE_STACK[TASK_INSTANCE_STACK.length - 1];
  }

  function handleYieldedUnknownThenable(thenable, taskInstance, resumeIndex) {
    thenable.then(value => {
      taskInstance.proceed(resumeIndex, _utils.YIELDABLE_CONTINUE, value);
    }, error => {
      taskInstance.proceed(resumeIndex, _utils.YIELDABLE_THROW, error);
    });
  }

  /**
   * Returns true if the object passed to it is a TaskCancelation error.
   * If you call `someTask.perform().catch(...)` or otherwise treat
   * a {@linkcode TaskInstance} like a promise, you may need to
   * handle the cancelation of a TaskInstance differently from
   * other kinds of errors it might throw, and you can use this
   * convenience function to distinguish cancelation from errors.
   *
   * ```js
   * click() {
   *   this.get('myTask').perform().catch(e => {
   *     if (!didCancel(e)) { throw e; }
   *   });
   * }
   * ```
   *
   * @param {Object} error the caught error, which might be a TaskCancelation
   * @returns {Boolean}
   */
  function didCancel(e) {
    return e && e.name === TASK_CANCELATION_NAME;
  }

  function forwardToInternalPromise(method) {
    return function (...args) {
      this._hasSubscribed = true;
      return this.get('_promise')[method](...args);
    };
  }

  function spliceSlice(str, index, count, add) {
    return str.slice(0, index) + (add || "") + str.slice(index + count);
  }

  /**
    A `TaskInstance` represent a single execution of a
    {@linkcode Task}. Every call to {@linkcode Task#perform} returns
    a `TaskInstance`.
  
    `TaskInstance`s are cancelable, either explicitly
    via {@linkcode TaskInstance#cancel} or {@linkcode Task#cancelAll},
    or automatically due to the host object being destroyed, or
    because concurrency policy enforced by a
    {@linkcode TaskProperty Task Modifier} canceled the task instance.
  
    <style>
      .ignore-this--this-is-here-to-hide-constructor,
      #TaskInstance { display: none }
    </style>
  
    @class TaskInstance
  */
  let taskInstanceAttrs = {
    iterator: null,
    _disposer: null,
    _completionState: COMPLETION_PENDING,
    task: null,
    args: [],
    _hasSubscribed: false,
    _runLoop: true,
    _debug: false,
    _hasEnabledEvents: false,
    cancelReason: null,
    _performType: PERFORM_TYPE_DEFAULT,
    _expectsLinkedYield: false,

    /**
     * If this TaskInstance runs to completion by returning a property
     * other than a rejecting promise, this property will be set
     * with that value.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    value: null,

    /**
     * If this TaskInstance is canceled or throws an error (or yields
     * a promise that rejects), this property will be set with that error.
     * Otherwise, it is null.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    error: null,

    /**
     * True if the task instance is fulfilled.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    isSuccessful: false,

    /**
     * True if the task instance resolves to a rejection.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    isError: false,

    /**
     * True if the task instance was canceled before it could run to completion.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    isCanceled: Ember.computed.and('isCanceling', 'isFinished'),
    isCanceling: false,

    /**
     * True if the task instance has started, else false.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    hasStarted: false,

    /**
     * True if the task has run to completion.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    isFinished: false,

    /**
     * True if the task is still running.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    isRunning: Ember.computed.not('isFinished'),

    /**
     * Describes the state that the task instance is in. Can be used for debugging,
     * or potentially driving some UI state. Possible values are:
     *
     * - `"dropped"`: task instance was canceled before it started
     * - `"canceled"`: task instance was canceled before it could finish
     * - `"finished"`: task instance ran to completion (even if an exception was thrown)
     * - `"running"`: task instance is currently running (returns true even if
     *     is paused on a yielded promise)
     * - `"waiting"`: task instance hasn't begun running yet (usually
     *     because the task is using the {@linkcode TaskProperty#enqueue .enqueue()}
     *     task modifier)
     *
     * The animated timeline examples on the [Task Concurrency](/#/docs/task-concurrency)
     * docs page make use of this property.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    state: Ember.computed('isDropped', 'isCanceling', 'hasStarted', 'isFinished', function () {
      if (Ember.get(this, 'isDropped')) {
        return 'dropped';
      } else if (Ember.get(this, 'isCanceling')) {
        return 'canceled';
      } else if (Ember.get(this, 'isFinished')) {
        return 'finished';
      } else if (Ember.get(this, 'hasStarted')) {
        return 'running';
      } else {
        return 'waiting';
      }
    }),

    /**
     * True if the TaskInstance was canceled before it could
     * ever start running. For example, calling
     * {@linkcode Task#perform .perform()} twice on a
     * task with the {@linkcode TaskProperty#drop .drop()} modifier applied
     * will result in the second task instance being dropped.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    isDropped: Ember.computed('isCanceling', 'hasStarted', function () {
      return Ember.get(this, 'isCanceling') && !Ember.get(this, 'hasStarted');
    }),

    /**
     * Event emitted when a new {@linkcode TaskInstance} starts executing.
     *
     * `on` from `@ember/object/evented` may be used to create a binding on the host object to the event.
     *
     * ```js
     * export default Ember.Component.extend({
     *   doSomething: task(function * () {
     *     // ... does something
     *   }),
     *
     *   onDoSomethingStarted: on('doSomething:started', function (taskInstance) {
     *     // ...
     *   })
     * });
     * ```
     *
     * @event TaskInstance#TASK_NAME:started
     * @param {TaskInstance} taskInstance - Task instance that was started
     */

    /**
     * Event emitted when a {@linkcode TaskInstance} succeeds.
     *
     * `on` from `@ember/object/evented` may be used to create a binding on the host object to the event.
     *
     * ```js
     * export default Ember.Component.extend({
     *   doSomething: task(function * () {
     *     // ... does something
     *   }),
     *
     *   onDoSomethingSucceeded: on('doSomething:succeeded', function (taskInstance) {
     *     // ...
     *   })
     * });
     * ```
     *
     * @event TaskInstance#TASK_NAME:succeeded
     * @param {TaskInstance} taskInstance - Task instance that was succeeded
     */

    /**
     * Event emitted when a {@linkcode TaskInstance} throws an an error that is
     * not handled within the task itself.
     *
     * `on` from `@ember/object/evented` may be used to create a binding on the host object to the event.
     *
     * ```js
     * export default Ember.Component.extend({
     *   doSomething: task(function * () {
     *     // ... does something
     *   }),
     *
     *   onDoSomethingErrored: on('doSomething:errored', function (taskInstance, error) {
     *     // ...
     *   })
     * });
     * ```
     *
     * @event TaskInstance#TASK_NAME:errored
     * @param {TaskInstance} taskInstance - Task instance that was started
     * @param {Error} error - Error that was thrown by the task instance
     */

    /**
     * Event emitted when a {@linkcode TaskInstance} is canceled.
     *
     * `on` from `@ember/object/evented` may be used to create a binding on the host object to the event.
     *
     * ```js
     * export default Ember.Component.extend({
     *   doSomething: task(function * () {
     *     // ... does something
     *   }),
     *
     *   onDoSomethingCanceled: on('doSomething:canceled', function (taskInstance, cancelationReason) {
     *     // ...
     *   })
     * });
     * ```
     *
     * @event TaskInstance#TASK_NAME:canceled
     * @param {TaskInstance} taskInstance - Task instance that was started
     * @param {string} cancelationReason - Cancelation reason that was was provided to {@linkcode TaskInstance#cancel}
     */

    _index: 1,

    _start() {
      if (this.hasStarted || this.isCanceling) {
        return this;
      }
      Ember.set(this, 'hasStarted', true);
      this._scheduleProceed(_utils.YIELDABLE_CONTINUE, undefined);
      this._triggerEvent('started', this);
      return this;
    },

    toString() {
      let taskString = "" + this.task;
      return spliceSlice(taskString, -1, 0, `.perform()`);
    },

    /**
     * Cancels the task instance. Has no effect if the task instance has
     * already been canceled or has already finished running.
     *
     * @method cancel
     * @memberof TaskInstance
     * @instance
     */
    cancel(cancelReason = ".cancel() was explicitly called") {
      if (this.isCanceling || Ember.get(this, 'isFinished')) {
        return;
      }
      Ember.set(this, 'isCanceling', true);

      let name = Ember.get(this, 'task._propertyName') || "<unknown>";
      Ember.set(this, 'cancelReason', `TaskInstance '${name}' was canceled because ${cancelReason}. For more information, see: http://ember-concurrency.com/docs/task-cancelation-help`);

      if (this.hasStarted) {
        this._proceedSoon(_utils.YIELDABLE_CANCEL, null);
      } else {
        this._finalize(null, COMPLETION_CANCEL);
      }
    },

    _defer: null,
    _promise: Ember.computed(function () {
      this._defer = Ember.RSVP.defer();
      this._maybeResolveDefer();
      return this._defer.promise;
    }),

    _maybeResolveDefer() {
      if (!this._defer || !this._completionState) {
        return;
      }

      if (this._completionState === COMPLETION_SUCCESS) {
        this._defer.resolve(this.value);
      } else {
        this._defer.reject(this.error);
      }
    },

    /**
     * Returns a promise that resolves with the value returned
     * from the task's (generator) function, or rejects with
     * either the exception thrown from the task function, or
     * an error with a `.name` property with value `"TaskCancelation"`.
     *
     * @method then
     * @memberof TaskInstance
     * @instance
     * @return {Promise}
     */
    then: forwardToInternalPromise('then'),

    /**
     * @method catch
     * @memberof TaskInstance
     * @instance
     * @return {Promise}
     */
    catch: forwardToInternalPromise('catch'),

    /**
     * @method finally
     * @memberof TaskInstance
     * @instance
     * @return {Promise}
     */
    finally: forwardToInternalPromise('finally'),

    _finalize(_value, _completionState) {
      let completionState = _completionState;
      let value = _value;
      this._index++;

      if (this.isCanceling) {
        completionState = COMPLETION_CANCEL;
        value = new Error(this.cancelReason);

        if (this._debug || Ember.ENV.DEBUG_TASKS) {
          Ember.Logger.log(this.cancelReason);
        }

        value.name = TASK_CANCELATION_NAME;
        value.taskInstance = this;
      }

      Ember.set(this, '_completionState', completionState);
      Ember.set(this, '_result', value);

      if (completionState === COMPLETION_SUCCESS) {
        Ember.set(this, 'isSuccessful', true);
        Ember.set(this, 'value', value);
      } else if (completionState === COMPLETION_ERROR) {
        Ember.set(this, 'isError', true);
        Ember.set(this, 'error', value);
      } else if (completionState === COMPLETION_CANCEL) {
        Ember.set(this, 'error', value);
      }

      Ember.set(this, 'isFinished', true);

      this._dispose();
      this._runFinalizeCallbacks();
      this._dispatchFinalizeEvents();
    },

    _finalizeCallbacks: null,
    _onFinalize(callback) {
      if (!this._finalizeCallbacks) {
        this._finalizeCallbacks = [];
      }
      this._finalizeCallbacks.push(callback);

      if (this._completionState) {
        this._runFinalizeCallbacks();
      }
    },

    _runFinalizeCallbacks() {
      this._maybeResolveDefer();
      if (this._finalizeCallbacks) {
        for (let i = 0, l = this._finalizeCallbacks.length; i < l; ++i) {
          this._finalizeCallbacks[i]();
        }
        this._finalizeCallbacks = null;
      }

      this._maybeThrowUnhandledTaskErrorLater();
    },

    _maybeThrowUnhandledTaskErrorLater() {
      // this backports the Ember 2.0+ RSVP _onError 'after' microtask behavior to Ember < 2.0
      if (!this._hasSubscribed && this._completionState === COMPLETION_ERROR) {
        Ember.run.schedule(Ember.run.backburner.queueNames[Ember.run.backburner.queueNames.length - 1], () => {
          if (!this._hasSubscribed && !didCancel(this.error)) {
            Ember.RSVP.reject(this.error);
          }
        });
      }
    },

    _dispatchFinalizeEvents() {
      switch (this._completionState) {
        case COMPLETION_SUCCESS:
          this._triggerEvent('succeeded', this);
          break;
        case COMPLETION_ERROR:
          this._triggerEvent('errored', this, Ember.get(this, 'error'));
          break;
        case COMPLETION_CANCEL:
          this._triggerEvent('canceled', this, Ember.get(this, 'cancelReason'));
          break;
      }
    },

    /**
     * Runs any disposers attached to the task's most recent `yield`.
     * For instance, when a task yields a TaskInstance, it registers that
     * child TaskInstance's disposer, so that if the parent task is canceled,
     * _dispose() will run that disposer and cancel the child TaskInstance.
     *
     * @private
     */
    _dispose() {
      if (this._disposer) {
        let disposer = this._disposer;
        this._disposer = null;

        // TODO: test erroring disposer
        disposer();
      }
    },

    _isGeneratorDone() {
      let state = this._generatorState;
      return state === GENERATOR_STATE_DONE || state === GENERATOR_STATE_ERRORED;
    },

    /**
     * Calls .next()/.throw()/.return() on the task's generator function iterator,
     * essentially taking a single step of execution on the task function.
     *
     * @private
     */
    _resumeGenerator(nextValue, iteratorMethod) {
      (true && !(!this._isGeneratorDone()) && Ember.assert("The task generator function has already run to completion. This is probably an ember-concurrency bug.", !this._isGeneratorDone()));


      try {
        TASK_INSTANCE_STACK.push(this);

        let iterator = this._getIterator();
        let result = iterator[iteratorMethod](nextValue);

        this._generatorValue = result.value;
        if (result.done) {
          this._generatorState = GENERATOR_STATE_DONE;
        } else {
          this._generatorState = GENERATOR_STATE_HAS_MORE_VALUES;
        }
      } catch (e) {
        this._generatorValue = e;
        this._generatorState = GENERATOR_STATE_ERRORED;
      } finally {
        if (this._expectsLinkedYield) {
          if (!this._generatorValue || this._generatorValue._performType !== PERFORM_TYPE_LINKED) {
            Ember.Logger.warn("You performed a .linked() task without immediately yielding/returning it. This is currently unsupported (but might be supported in future version of ember-concurrency).");
          }
          this._expectsLinkedYield = false;
        }

        TASK_INSTANCE_STACK.pop();
      }
    },

    _getIterator() {
      if (!this.iterator) {
        this.iterator = this._makeIterator();
      }
      return this.iterator;
    },

    /**
     * Returns a generator function iterator (the object with
     * .next()/.throw()/.return() methods) using the task function
     * supplied to `task(...)`. It uses `apply` so that the `this`
     * context is the host object the task lives on, and passes
     * the args passed to `perform(...args)` through to the generator
     * function.
     *
     * `_makeIterator` is overridden in EncapsulatedTask to produce
     * an iterator based on the `*perform()` function on the
     * EncapsulatedTask definition.
     *
     * @private
     */
    _makeIterator() {
      return this.fn.apply(this.context, this.args);
    },

    /**
     * The TaskInstance internally tracks an index/sequence number
     * (the `_index` property) which gets incremented every time the
     * task generator function iterator takes a step. When a task
     * function is paused at a `yield`, there are two events that
     * cause the TaskInstance to take a step: 1) the yielded value
     * "resolves", thus resuming the TaskInstance's execution, or
     * 2) the TaskInstance is canceled. We need some mechanism to prevent
     * stale yielded value resolutions from resuming the TaskFunction
     * after the TaskInstance has already moved on (either because
     * the TaskInstance has since been canceled or because an
     * implementation of the Yieldable API tried to resume the
     * TaskInstance more than once). The `_index` serves as
     * that simple mechanism: anyone resuming a TaskInstance
     * needs to pass in the `index` they were provided that acts
     * as a ticket to resume the TaskInstance that expires once
     * the TaskInstance has moved on.
     *
     * @private
     */
    _advanceIndex(index) {
      if (this._index === index) {
        return ++this._index;
      }
    },

    _proceedSoon(yieldResumeType, value) {
      this._advanceIndex(this._index);
      if (this._runLoop) {
        Ember.run.join(() => {
          Ember.run.schedule('actions', this, this._proceed, yieldResumeType, value);
        });
      } else {
        setTimeout(() => this._proceed(yieldResumeType, value), 1);
      }
    },

    proceed(index, yieldResumeType, value) {
      if (this._completionState) {
        return;
      }
      if (!this._advanceIndex(index)) {
        return;
      }
      this._proceedSoon(yieldResumeType, value);
    },

    _scheduleProceed(yieldResumeType, value) {
      if (this._completionState) {
        return;
      }

      if (this._runLoop && !Ember.run.currentRunLoop) {
        Ember.run(this, this._proceed, yieldResumeType, value);
        return;
      } else if (!this._runLoop && Ember.run.currentRunLoop) {
        setTimeout(() => this._proceed(yieldResumeType, value), 1);
        return;
      } else {
        this._proceed(yieldResumeType, value);
      }
    },

    _proceed(yieldResumeType, value) {
      if (this._completionState) {
        return;
      }

      if (this._generatorState === GENERATOR_STATE_DONE) {
        this._handleResolvedReturnedValue(yieldResumeType, value);
      } else {
        this._handleResolvedContinueValue(yieldResumeType, value);
      }
    },

    _handleResolvedReturnedValue(yieldResumeType, value) {
      (true && !(this._completionState === COMPLETION_PENDING) && Ember.assert("expected completion state to be pending", this._completionState === COMPLETION_PENDING));
      (true && !(this._generatorState === GENERATOR_STATE_DONE) && Ember.assert("expected generator to be done", this._generatorState === GENERATOR_STATE_DONE));


      switch (yieldResumeType) {
        case _utils.YIELDABLE_CONTINUE:
        case _utils.YIELDABLE_RETURN:
          this._finalize(value, COMPLETION_SUCCESS);
          break;
        case _utils.YIELDABLE_THROW:
          this._finalize(value, COMPLETION_ERROR);
          break;
        case _utils.YIELDABLE_CANCEL:
          Ember.set(this, 'isCanceling', true);
          this._finalize(null, COMPLETION_CANCEL);
          break;
      }
    },

    _generatorState: GENERATOR_STATE_BEFORE_CREATE,
    _generatorValue: null,
    _handleResolvedContinueValue(_yieldResumeType, resumeValue) {
      let iteratorMethod = _yieldResumeType;
      if (iteratorMethod === _utils.YIELDABLE_CANCEL) {
        Ember.set(this, 'isCanceling', true);
        iteratorMethod = _utils.YIELDABLE_RETURN;
      }

      this._dispose();

      let beforeIndex = this._index;
      this._resumeGenerator(resumeValue, iteratorMethod);

      if (!this._advanceIndex(beforeIndex)) {
        return;
      }

      if (this._generatorState === GENERATOR_STATE_ERRORED) {
        this._finalize(this._generatorValue, COMPLETION_ERROR);
        return;
      }

      this._handleYieldedValue();
    },

    _handleYieldedValue() {
      let yieldedValue = this._generatorValue;
      if (!yieldedValue) {
        this._proceedWithSimpleValue(yieldedValue);
        return;
      }

      if (yieldedValue instanceof _utils.RawValue) {
        this._proceedWithSimpleValue(yieldedValue.value);
        return;
      }

      this._addDisposer(yieldedValue.__ec_cancel__);

      if (yieldedValue[_utils.yieldableSymbol]) {
        this._invokeYieldable(yieldedValue);
      } else if (typeof yieldedValue.then === 'function') {
        handleYieldedUnknownThenable(yieldedValue, this, this._index);
      } else {
        this._proceedWithSimpleValue(yieldedValue);
      }
    },

    _proceedWithSimpleValue(yieldedValue) {
      this.proceed(this._index, _utils.YIELDABLE_CONTINUE, yieldedValue);
    },

    _addDisposer(maybeDisposer) {
      if (typeof maybeDisposer === 'function') {
        let priorDisposer = this._disposer;
        if (priorDisposer) {
          this._disposer = () => {
            priorDisposer();
            maybeDisposer();
          };
        } else {
          this._disposer = maybeDisposer;
        }
      }
    },

    _invokeYieldable(yieldedValue) {
      try {
        let maybeDisposer = yieldedValue[_utils.yieldableSymbol](this, this._index);
        this._addDisposer(maybeDisposer);
      } catch (e) {
        // TODO: handle erroneous yieldable implementation
      }
    },

    _triggerEvent(eventType, ...args) {
      if (!this._hasEnabledEvents) {
        return;
      }

      let host = Ember.get(this, 'task.context');
      let eventNamespace = Ember.get(this, 'task._propertyName');

      if (host && host.trigger && eventNamespace) {
        host.trigger(`${eventNamespace}:${eventType}`, ...args);
      }
    }
  };

  taskInstanceAttrs[_utils.yieldableSymbol] = function handleYieldedTaskInstance(parentTaskInstance, resumeIndex) {
    let yieldedTaskInstance = this;
    yieldedTaskInstance._hasSubscribed = true;

    yieldedTaskInstance._onFinalize(() => {
      let state = yieldedTaskInstance._completionState;
      if (state === COMPLETION_SUCCESS) {
        parentTaskInstance.proceed(resumeIndex, _utils.YIELDABLE_CONTINUE, yieldedTaskInstance.value);
      } else if (state === COMPLETION_ERROR) {
        parentTaskInstance.proceed(resumeIndex, _utils.YIELDABLE_THROW, yieldedTaskInstance.error);
      } else if (state === COMPLETION_CANCEL) {
        parentTaskInstance.proceed(resumeIndex, _utils.YIELDABLE_CANCEL, null);
      }
    });

    return function disposeYieldedTaskInstance() {
      if (yieldedTaskInstance._performType !== PERFORM_TYPE_UNLINKED) {
        if (yieldedTaskInstance._performType === PERFORM_TYPE_DEFAULT) {
          let parentObj = Ember.get(parentTaskInstance, 'task.context');
          let childObj = Ember.get(yieldedTaskInstance, 'task.context');
          if (parentObj && childObj && parentObj !== childObj && parentObj.isDestroying && Ember.get(yieldedTaskInstance, 'isRunning')) {
            let parentName = `\`${parentTaskInstance.task._propertyName}\``;
            let childName = `\`${yieldedTaskInstance.task._propertyName}\``;
            Ember.Logger.warn(`ember-concurrency detected a potentially hazardous "self-cancel loop" between parent task ${parentName} and child task ${childName}. If you want child task ${childName} to be canceled when parent task ${parentName} is canceled, please change \`.perform()\` to \`.linked().perform()\`. If you want child task ${childName} to keep running after parent task ${parentName} is canceled, change it to \`.unlinked().perform()\``);
          }
        }
        yieldedTaskInstance.cancel();
      }
    };
  };

  let TaskInstance = Ember.Object.extend(taskInstanceAttrs);

  function go(args, fn, attrs = {}) {
    return TaskInstance.create(Object.assign({ args, fn, context: this }, attrs))._start();
  }

  function wrap(fn, attrs = {}) {
    return function wrappedRunnerFunction(...args) {
      return go.call(this, args, fn, attrs);
    };
  }

  exports.default = TaskInstance;
});