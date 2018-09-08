define('@ember-decorators/utils/decorator', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.decoratorWithParams = decoratorWithParams;
  exports.decoratorWithRequiredParams = decoratorWithRequiredParams;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function isDescriptor(possibleDesc) {
    if (possibleDesc.length === 3) {
      var _possibleDesc = _slicedToArray(possibleDesc, 3),
          target = _possibleDesc[0],
          key = _possibleDesc[1],
          desc = _possibleDesc[2];

      return (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target !== null && typeof key === 'string' && ((typeof desc === 'undefined' ? 'undefined' : _typeof(desc)) === 'object' && desc !== null && 'enumerable' in desc && 'configurable' in desc || desc === undefined // TS compatibility
      );
    }

    return false;
  }

  /**
   * A macro that takes a decorator function and allows it to optionally
   * receive parameters
   *
   * ```js
   * let foo = decoratorWithParams((target, desc, key, params) => {
   *   console.log(params);
   * });
   *
   * class {
   *   @foo bar; // undefined
   *   @foo('bar') baz; // ['bar']
   * }
   * ```
   *
   * @param {Function} fn - decorator function
   */
  function decoratorWithParams(fn) {
    return function () {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      // determine if user called as @computed('blah', 'blah') or @computed
      if (isDescriptor(params)) {
        return fn.apply(undefined, params.concat([[]]));
      } else {
        return function (target, key, desc) {
          return fn(target, key, desc, params);
        };
      }
    };
  }

  /**
   * A macro that takes a decorator function and requires it to receive
   * parameters:
   *
   * ```js
   * let foo = decoratorWithRequiredParams((target, desc, key, params) => {
   *   console.log(params);
   * });
   *
   * class {
   *   @foo('bar') baz; // ['bar']
   *   @foo bar; // Error
   * }
   * ```
   *
   * @param {Function} fn - decorator function
   */
  function decoratorWithRequiredParams(fn) {
    return function () {
      for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        params[_key2] = arguments[_key2];
      }

      (false && !(!isDescriptor(params)) && Ember.assert('Cannot decorate member \'' + params[1] + '\' without parameters', !isDescriptor(params)));


      return function (target, key, desc) {
        (false && !(params.length > 0) && Ember.assert('Cannot decorate member \'' + key + '\' without parameters', params.length > 0));


        return fn(target, key, desc, params);
      };
    };
  }
});