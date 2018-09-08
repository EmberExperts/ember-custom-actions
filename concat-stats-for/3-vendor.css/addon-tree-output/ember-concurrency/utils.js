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

  var objectAssign = exports.objectAssign = Object.assign || function objectAssign(target) {
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

  function _cleanupOnDestroy(owner, object, cleanupMethodName) {
    for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    // TODO: find a non-mutate-y, non-hacky way of doing this.

    if (!owner.willDestroy) {
      // we're running in non Ember object (possibly in a test mock)
      return;
    }

    if (!owner.willDestroy.__ember_processes_destroyers__) {
      var oldWillDestroy = owner.willDestroy;
      var disposers = [];

      owner.willDestroy = function () {
        for (var i = 0, l = disposers.length; i < l; i++) {
          disposers[i]();
        }
        oldWillDestroy.apply(owner, arguments);
      };
      owner.willDestroy.__ember_processes_destroyers__ = disposers;
    }

    owner.willDestroy.__ember_processes_destroyers__.push(function () {
      object[cleanupMethodName].apply(object, args);
    });
  }

  var INVOKE = exports.INVOKE = "__invoke_symbol__";

  var locations = ['ember-glimmer/helpers/action', 'ember-routing-htmlbars/keywords/closure-action', 'ember-routing/keywords/closure-action'];

  for (var i = 0; i < locations.length; i++) {
    if (locations[i] in Ember.__loader.registry) {
      exports.INVOKE = INVOKE = Ember.__loader.require(locations[i])['INVOKE'];
      break;
    }
  }

  // TODO: Symbol polyfill?
  var yieldableSymbol = exports.yieldableSymbol = "__ec_yieldable__";
  var YIELDABLE_CONTINUE = exports.YIELDABLE_CONTINUE = "next";
  var YIELDABLE_THROW = exports.YIELDABLE_THROW = "throw";
  var YIELDABLE_RETURN = exports.YIELDABLE_RETURN = "return";
  var YIELDABLE_CANCEL = exports.YIELDABLE_CANCEL = "cancel";

  var _ComputedProperty = exports._ComputedProperty = Ember.ComputedProperty;

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
    var timerId = void 0;
    var promise = new Ember.RSVP.Promise(function (r) {
      timerId = Ember.run.later(r, ms);
    });
    promise.__ec_cancel__ = function () {
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
    return _defineProperty({}, yieldableSymbol, function (taskInstance, resumeIndex) {
      var _this = this;

      var timerId = setTimeout(function () {
        taskInstance.proceed(resumeIndex, YIELDABLE_CONTINUE, _this._result);
      }, ms);
      return function () {
        window.clearInterval(timerId);
      };
    });
  }

  function yieldableToPromise(yieldable) {
    var def = Ember.RSVP.defer();

    def.promise.__ec_cancel__ = yieldable[yieldableSymbol]({
      proceed: function proceed(_index, resumeType, value) {
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