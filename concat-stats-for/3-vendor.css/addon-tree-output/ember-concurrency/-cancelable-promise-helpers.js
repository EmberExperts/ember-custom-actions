define('ember-concurrency/-cancelable-promise-helpers', ['exports', 'ember-concurrency/-task-instance', 'ember-concurrency/utils'], function (exports, _taskInstance, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.hash = exports.race = exports.allSettled = exports.all = undefined;

  var _marked = regeneratorRuntime.mark(resolver);

  var asyncAll = taskAwareVariantOf(Ember.RSVP.Promise, 'all', identity);

  function resolver(value) {
    return regeneratorRuntime.wrap(function resolver$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', value);

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _marked, this);
  }

  /**
   * A cancelation-aware variant of [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all).
   * The normal version of a `Promise.all` just returns a regular, uncancelable
   * Promise. The `ember-concurrency` variant of `all()` has the following
   * additional behavior:
   *
   * - if the task that `yield`ed `all()` is canceled, any of the
   *   {@linkcode TaskInstance}s passed in to `all` will be canceled
   * - if any of the {@linkcode TaskInstance}s (or regular promises) passed in reject (or
   *   are canceled), all of the other unfinished `TaskInstance`s will
   *   be automatically canceled.
   *
   * [Check out the "Awaiting Multiple Child Tasks example"](/#/docs/examples/joining-tasks)
   */
  var all = exports.all = function all(things) {
    if (things.length === 0) {
      return things;
    }

    for (var i = 0; i < things.length; ++i) {
      var t = things[i];
      if (!(t && t[_utils.yieldableSymbol])) {
        return asyncAll(things);
      }
    }

    var isAsync = false;
    var taskInstances = things.map(function (thing) {
      var ti = _taskInstance.default.create({
        // TODO: consider simpler iterator than full on generator fn?
        fn: resolver,
        args: [thing]
      })._start();

      if (ti._completionState !== 1) {
        isAsync = true;
      }
      return ti;
    });

    if (isAsync) {
      return asyncAll(taskInstances);
    } else {
      return taskInstances.map(function (ti) {
        return ti.value;
      });
    }
  };

  /**
   * A cancelation-aware variant of [RSVP.allSettled](http://emberjs.com/api/classes/RSVP.html#method_allSettled).
   * The normal version of a `RSVP.allSettled` just returns a regular, uncancelable
   * Promise. The `ember-concurrency` variant of `allSettled()` has the following
   * additional behavior:
   *
   * - if the task that `yield`ed `allSettled()` is canceled, any of the
   *   {@linkcode TaskInstance}s passed in to `allSettled` will be canceled
   */
  var allSettled = exports.allSettled = taskAwareVariantOf(Ember.RSVP, 'allSettled', identity);

  /**
   * A cancelation-aware variant of [Promise.race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race).
   * The normal version of a `Promise.race` just returns a regular, uncancelable
   * Promise. The `ember-concurrency` variant of `race()` has the following
   * additional behavior:
   *
   * - if the task that `yield`ed `race()` is canceled, any of the
   *   {@linkcode TaskInstance}s passed in to `race` will be canceled
   * - once any of the tasks/promises passed in complete (either success, failure,
   *   or cancelation), any of the {@linkcode TaskInstance}s passed in will be canceled
   *
   * [Check out the "Awaiting Multiple Child Tasks example"](/#/docs/examples/joining-tasks)
   */
  var race = exports.race = taskAwareVariantOf(Ember.RSVP.Promise, 'race', identity);

  /**
   * A cancelation-aware variant of [RSVP.hash](http://emberjs.com/api/classes/RSVP.html#hash).
   * The normal version of a `RSVP.hash` just returns a regular, uncancelable
   * Promise. The `ember-concurrency` variant of `hash()` has the following
   * additional behavior:
   *
   * - if the task that `yield`ed `hash()` is canceled, any of the
   *   {@linkcode TaskInstance}s passed in to `allSettled` will be canceled
   * - if any of the items rejects/cancels, all other cancelable items
   *   (e.g. {@linkcode TaskInstance}s) will be canceled
   */
  var hash = exports.hash = taskAwareVariantOf(Ember.RSVP, 'hash', getValues);

  function identity(obj) {
    return obj;
  }

  function getValues(obj) {
    return Object.keys(obj).map(function (k) {
      return obj[k];
    });
  }

  function taskAwareVariantOf(obj, method, getItems) {
    return function (thing) {
      var items = getItems(thing);
      var defer = Ember.RSVP.defer();

      obj[method](thing).then(defer.resolve, defer.reject);

      var hasCancelled = false;
      var cancelAll = function cancelAll() {
        if (hasCancelled) {
          return;
        }
        hasCancelled = true;
        items.forEach(function (it) {
          if (it) {
            if (it instanceof _taskInstance.default) {
              it.cancel();
            } else if (typeof it.__ec_cancel__ === 'function') {
              it.__ec_cancel__();
            }
          }
        });
      };

      var promise = defer.promise.finally(cancelAll);
      promise.__ec_cancel__ = cancelAll;
      return promise;
    };
  }
});