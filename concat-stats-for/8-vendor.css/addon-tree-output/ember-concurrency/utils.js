define('ember-concurrency/utils', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isEventedObject = isEventedObject;
  exports.Arguments = Arguments;
  exports._cleanupOnDestroy = _cleanupOnDestroy;
  exports.timeout = timeout;
  exports.RawValue = RawValue;
  exports.raw = raw;
  exports.rawTimeout = rawTimeout;
  exports.yieldableToPromise = yieldableToPromise;
  function isEventedObject(c) {
    return c && (typeof c.one === 'function' && typeof c.off === 'function' || typeof c.addEventListener === 'function' && typeof c.removeEventListener === 'function');
  }

  function Arguments(args, defer) {
    this.args = args;
    this.defer = defer;
  }

  Arguments.prototype.resolve = function (value) {
    if (this.defer) {
      this.defer.resolve(value);
    }
  };

  let objectAssign = exports.objectAssign = Object.assign || function objectAssign(target) {
    'use strict';

    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };

  function _cleanupOnDestroy(owner, object, cleanupMethodName, ...args) {
    // TODO: find a non-mutate-y, non-hacky way of doing this.

    if (!owner.willDestroy) {
      // we're running in non Ember object (possibly in a test mock)
      return;
    }

    if (!owner.willDestroy.__ember_processes_destroyers__) {
      let oldWillDestroy = owner.willDestroy;
      let disposers = [];

      owner.willDestroy = function () {
        for (let i = 0, l = disposers.length; i < l; i++) {
          disposers[i]();
        }
        oldWillDestroy.apply(owner, arguments);
      };
      owner.willDestroy.__ember_processes_destroyers__ = disposers;
    }

    owner.willDestroy.__ember_processes_destroyers__.push(() => {
      object[cleanupMethodName](...args);
    });
  }

  let INVOKE = exports.INVOKE = "__invoke_symbol__";

  let locations = ['ember-glimmer/helpers/action', 'ember-routing-htmlbars/keywords/closure-action', 'ember-routing/keywords/closure-action'];

  for (let i = 0; i < locations.length; i++) {
    if (locations[i] in Ember.__loader.registry) {
      exports.INVOKE = INVOKE = Ember.__loader.require(locations[i])['INVOKE'];
      break;
    }
  }

  // TODO: Symbol polyfill?
  const yieldableSymbol = exports.yieldableSymbol = "__ec_yieldable__";
  const YIELDABLE_CONTINUE = exports.YIELDABLE_CONTINUE = "next";
  const YIELDABLE_THROW = exports.YIELDABLE_THROW = "throw";
  const YIELDABLE_RETURN = exports.YIELDABLE_RETURN = "return";
  const YIELDABLE_CANCEL = exports.YIELDABLE_CANCEL = "cancel";

  const _ComputedProperty = exports._ComputedProperty = Ember.ComputedProperty;

  /**
   *
   * Yielding `timeout(ms)` will pause a task for the duration
   * of time passed in, in milliseconds.
   *
   * The task below, when performed, will print a message to the
   * console every second.
   *
   * ```js
   * export default Component.extend({
   *   myTask: task(function * () {
   *     while (true) {
   *       console.log("Hello!");
   *       yield timeout(1000);
   *     }
   *   })
   * });
   * ```
   *
   * @param {number} ms - the amount of time to sleep before resuming
   *   the task, in milliseconds
   */
  function timeout(ms) {
    let timerId;
    let promise = new Ember.RSVP.Promise(r => {
      timerId = Ember.run.later(r, ms);
    });
    promise.__ec_cancel__ = () => {
      Ember.run.cancel(timerId);
    };
    return promise;
  }

  function RawValue(value) {
    this.value = value;
  }

  function raw(value) {
    return new RawValue(value);
  }

  function rawTimeout(ms) {
    return {
      [yieldableSymbol](taskInstance, resumeIndex) {
        let timerId = setTimeout(() => {
          taskInstance.proceed(resumeIndex, YIELDABLE_CONTINUE, this._result);
        }, ms);
        return () => {
          window.clearInterval(timerId);
        };
      }
    };
  }

  function yieldableToPromise(yieldable) {
    let def = Ember.RSVP.defer();

    def.promise.__ec_cancel__ = yieldable[yieldableSymbol]({
      proceed(_index, resumeType, value) {
        if (resumeType == YIELDABLE_CONTINUE || resumeType == YIELDABLE_RETURN) {
          def.resolve(value);
        } else {
          def.reject(value);
        }
      }
    }, 0);

    return def.promise;
  }
});