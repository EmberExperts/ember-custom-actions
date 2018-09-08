define('ember-concurrency/-wait-for', ['exports', 'ember-concurrency/utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.waitForQueue = waitForQueue;
  exports.waitForEvent = waitForEvent;
  exports.waitForProperty = waitForProperty;

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var WaitFor = function () {
    function WaitFor() {
      _classCallCheck(this, WaitFor);
    }

    _createClass(WaitFor, [{
      key: 'then',
      value: function then() {
        var _yieldableToPromise;

        return (_yieldableToPromise = (0, _utils.yieldableToPromise)(this)).then.apply(_yieldableToPromise, arguments);
      }
    }]);

    return WaitFor;
  }();

  var WaitForQueueYieldable = function (_WaitFor) {
    _inherits(WaitForQueueYieldable, _WaitFor);

    function WaitForQueueYieldable(queueName) {
      _classCallCheck(this, WaitForQueueYieldable);

      var _this = _possibleConstructorReturn(this, (WaitForQueueYieldable.__proto__ || Object.getPrototypeOf(WaitForQueueYieldable)).call(this));

      _this.queueName = queueName;
      return _this;
    }

    _createClass(WaitForQueueYieldable, [{
      key: _utils.yieldableSymbol,
      value: function value(taskInstance, resumeIndex) {
        Ember.run.schedule(this.queueName, function () {
          taskInstance.proceed(resumeIndex, _utils.YIELDABLE_CONTINUE, null);
        });
      }
    }]);

    return WaitForQueueYieldable;
  }(WaitFor);

  var WaitForEventYieldable = function (_WaitFor2) {
    _inherits(WaitForEventYieldable, _WaitFor2);

    function WaitForEventYieldable(object, eventName) {
      _classCallCheck(this, WaitForEventYieldable);

      var _this2 = _possibleConstructorReturn(this, (WaitForEventYieldable.__proto__ || Object.getPrototypeOf(WaitForEventYieldable)).call(this));

      _this2.object = object;
      _this2.eventName = eventName;
      return _this2;
    }

    _createClass(WaitForEventYieldable, [{
      key: _utils.yieldableSymbol,
      value: function value(taskInstance, resumeIndex) {
        var _this3 = this;

        var unbind = function unbind() {};
        var fn = function fn(event) {
          unbind();
          taskInstance.proceed(resumeIndex, _utils.YIELDABLE_CONTINUE, event);
        };

        if (typeof this.object.addEventListener === 'function') {
          // assume that we're dealing with a DOM `EventTarget`.
          this.object.addEventListener(this.eventName, fn);

          // unfortunately this is required, because IE 11 does not support the
          // `once` option: https://caniuse.com/#feat=once-event-listener
          unbind = function unbind() {
            _this3.object.removeEventListener(_this3.eventName, fn);
          };

          return unbind;
        } else {
          // assume that we're dealing with either `Ember.Evented` or a compatible
          // interface, like jQuery.
          this.object.one(this.eventName, fn);

          return function () {
            _this3.object.off(_this3.eventName, fn);
          };
        }
      }
    }]);

    return WaitForEventYieldable;
  }(WaitFor);

  var WaitForPropertyYieldable = function (_WaitFor3) {
    _inherits(WaitForPropertyYieldable, _WaitFor3);

    function WaitForPropertyYieldable(object, key) {
      var predicateCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Boolean;

      _classCallCheck(this, WaitForPropertyYieldable);

      var _this4 = _possibleConstructorReturn(this, (WaitForPropertyYieldable.__proto__ || Object.getPrototypeOf(WaitForPropertyYieldable)).call(this));

      _this4.object = object;
      _this4.key = key;

      if (typeof predicateCallback === 'function') {
        _this4.predicateCallback = predicateCallback;
      } else {
        _this4.predicateCallback = function (v) {
          return v === predicateCallback;
        };
      }
      return _this4;
    }

    _createClass(WaitForPropertyYieldable, [{
      key: _utils.yieldableSymbol,
      value: function value(taskInstance, resumeIndex) {
        var _this5 = this;

        var observerFn = function observerFn() {
          var value = Ember.get(_this5.object, _this5.key);
          var predicateValue = _this5.predicateCallback(value);
          if (predicateValue) {
            taskInstance.proceed(resumeIndex, _utils.YIELDABLE_CONTINUE, value);
            return true;
          }
        };

        if (!observerFn()) {
          this.object.addObserver(this.key, null, observerFn);
          return function () {
            _this5.object.removeObserver(_this5.key, null, observerFn);
          };
        }
      }
    }]);

    return WaitForPropertyYieldable;
  }(WaitFor);

  /**
   * Use `waitForQueue` to pause the task until a certain run loop queue is reached.
   *
   * ```js
   * import { task, waitForQueue } from 'ember-concurrency';
   * export default Component.extend({
   *   myTask: task(function * () {
   *     yield waitForQueue('afterRender');
   *     console.log("now we're in the afterRender queue");
   *   })
   * });
   * ```
   *
   * @param {string} queueName the name of the Ember run loop queue
   */
  function waitForQueue(queueName) {
    return new WaitForQueueYieldable(queueName);
  }

  /**
   * Use `waitForEvent` to pause the task until an event is fired. The event
   * can either be a jQuery event or an Ember.Evented event (or any event system
   * where the object supports `.on()` `.one()` and `.off()`).
   *
   * ```js
   * import { task, waitForEvent } from 'ember-concurrency';
   * export default Component.extend({
   *   myTask: task(function * () {
   *     console.log("Please click anywhere..");
   *     let clickEvent = yield waitForEvent($('body'), 'click');
   *     console.log("Got event", clickEvent);
   *
   *     let emberEvent = yield waitForEvent(this, 'foo');
   *     console.log("Got foo event", emberEvent);
   *
   *     // somewhere else: component.trigger('foo', { value: 123 });
   *   })
   * });
   * ```
   *
   * @param {object} object the Ember Object or jQuery selector (with ,on(), .one(), and .off())
   *                 that the event fires from
   * @param {function} eventName the name of the event to wait for
   */
  function waitForEvent(object, eventName) {
    (false && !((0, _utils.isEventedObject)(object)) && Ember.assert(object + ' must include Ember.Evented (or support `.one()` and `.off()`) or DOM EventTarget (or support `addEventListener` and  `removeEventListener`) to be able to use `waitForEvent`', (0, _utils.isEventedObject)(object)));

    return new WaitForEventYieldable(object, eventName);
  }

  /**
   * Use `waitForProperty` to pause the task until a property on an object
   * changes to some expected value. This can be used for a variety of use
   * cases, including synchronizing with another task by waiting for it
   * to become idle, or change state in some other way. If you omit the
   * callback, `waitForProperty` will resume execution when the observed
   * property becomes truthy. If you provide a callback, it'll be called
   * immediately with the observed property's current value, and multiple
   * times thereafter whenever the property changes, until you return
   * a truthy value from the callback, or the current task is canceled.
   * You can also pass in a non-Function value in place of the callback,
   * in which case the task will continue executing when the property's
   * value becomes the value that you passed in.
   *
   * ```js
   * import { task, waitForProperty } from 'ember-concurrency';
   * export default Component.extend({
   *   foo: 0,
   *
   *   myTask: task(function * () {
   *     console.log("Waiting for `foo` to become 5");
   *
   *     yield waitForProperty(this, 'foo', v => v === 5);
   *     // alternatively: yield waitForProperty(this, 'foo', 5);
   *
   *     // somewhere else: this.set('foo', 5)
   *
   *     console.log("`foo` is 5!");
   *
   *     // wait for another task to be idle before running:
   *     yield waitForProperty(this, 'otherTask.isIdle');
   *     console.log("otherTask is idle!");
   *   })
   * });
   * ```
   *
   * @param {object} object an object (most likely an Ember Object)
   * @param {string} key the property name that is observed for changes
   * @param {function} callbackOrValue a Function that should return a truthy value
   *                                   when the task should continue executing, or
   *                                   a non-Function value that the watched property
   *                                   needs to equal before the task will continue running
   */
  function waitForProperty(object, key, predicateCallback) {
    return new WaitForPropertyYieldable(object, key, predicateCallback);
  }
});