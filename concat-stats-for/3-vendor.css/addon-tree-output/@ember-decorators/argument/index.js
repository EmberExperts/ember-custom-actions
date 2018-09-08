define('@ember-decorators/argument/index', ['exports', 'ember-get-config', '@ember-decorators/argument/utils/make-computed'], function (exports, _emberGetConfig, _makeComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.argument = argument;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var valueMap = new WeakMap();

  function valuesFor(obj) {
    if (!valueMap.has(obj)) {
      valueMap.set(obj, Object.create(null));
    }

    return valueMap.get(obj);
  }

  var internalArgumentDecorator = function internalArgumentDecorator(target, key, desc, options) {
    if (false) {}

    // always ensure the property is writeable, doesn't make sense otherwise (babel bug?)
    desc.writable = true;
    desc.configurable = true;

    if (desc.initializer === null || desc.initializer === undefined) {
      desc.initializer = undefined;
      return;
    }

    var initializer = desc.initializer;

    var get = function get() {
      var values = valuesFor(this);

      if (!Object.hasOwnProperty.call(values, key)) {
        values[key] = initializer.call(this);
      }

      return values[key];
    };

    if (options.defaultIfNullish === true || options.defaultIfUndefined === true) {
      var defaultIf = void 0;

      if (options.defaultIfNullish === true) {
        defaultIf = function defaultIf(v) {
          return v === undefined || v === null;
        };
      } else {
        defaultIf = function defaultIf(v) {
          return v === undefined;
        };
      }

      if (true) {
        return {
          get: get,
          set: function set(value) {
            if (defaultIf(value)) {
              valuesFor(this)[key] = initializer.call(this);
            } else {
              valuesFor(this)[key] = value;
            }
          }
        };
      }

      var descriptor = (0, _makeComputed.default)({
        get: get,
        set: function set(keyName, value) {
          if (defaultIf(value)) {
            return valuesFor(this)[key] = initializer.call(this);
          } else {
            return valuesFor(this)[key] = value;
          }
        }
      });

      // Decorators spec doesn't allow us to make a computed directly on
      // the prototype, so we need to wrap the descriptor in a getter
      return {
        get: function get() {
          return descriptor;
        }
      };
    } else {
      return {
        get: get,
        set: function set(value) {
          valuesFor(this)[key] = value;
        }
      };
    }
  };

  function argument(maybeOptions, maybeKey, maybeDesc) {
    if (typeof maybeKey === 'string' && (typeof maybeDesc === 'undefined' ? 'undefined' : _typeof(maybeDesc)) === 'object') {
      return internalArgumentDecorator(maybeOptions, maybeKey, maybeDesc, { defaultIfUndefined: false });
    }

    return function (target, key, desc) {
      return internalArgumentDecorator(target, key, desc, maybeOptions);
    };
  }
});