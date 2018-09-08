define('@ember-decorators/argument/index', ['exports', 'ember-get-config', '@ember-decorators/argument/utils/make-computed', '@ember-decorators/argument/-debug'], function (exports, _emberGetConfig, _makeComputed, _debug) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.argument = argument;


  let valueMap = new WeakMap();

  function valuesFor(obj) {
    if (!valueMap.has(obj)) {
      valueMap.set(obj, Object.create(null));
    }

    return valueMap.get(obj);
  }

  let internalArgumentDecorator = function (target, key, desc, options) {
    if (true) {
      let validations = (0, _debug.getValidationsForKey)(target, key);
      validations.isArgument = true;
      validations.typeRequired = Ember.getWithDefault(_emberGetConfig.default, '@ember-decorators/argument.typeRequired', false);
    }

    // always ensure the property is writeable, doesn't make sense otherwise (babel bug?)
    desc.writable = true;
    desc.configurable = true;

    if (desc.initializer === null || desc.initializer === undefined) {
      desc.initializer = undefined;
      return;
    }

    let initializer = desc.initializer;

    let get = function () {
      let values = valuesFor(this);

      if (!Object.hasOwnProperty.call(values, key)) {
        values[key] = initializer.call(this);
      }

      return values[key];
    };

    if (options.defaultIfNullish === true || options.defaultIfUndefined === true) {
      let defaultIf;

      if (options.defaultIfNullish === true) {
        defaultIf = v => v === undefined || v === null;
      } else {
        defaultIf = v => v === undefined;
      }

      if (true) {
        return {
          get,
          set(value) {
            if (defaultIf(value)) {
              valuesFor(this)[key] = initializer.call(this);
            } else {
              valuesFor(this)[key] = value;
            }
          }
        };
      }

      let descriptor = (0, _makeComputed.default)({
        get,
        set(keyName, value) {
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
        get() {
          return descriptor;
        }
      };
    } else {
      return {
        get,
        set(value) {
          valuesFor(this)[key] = value;
        }
      };
    }
  };

  function argument(maybeOptions, maybeKey, maybeDesc) {
    if (typeof maybeKey === 'string' && typeof maybeDesc === 'object') {
      return internalArgumentDecorator(maybeOptions, maybeKey, maybeDesc, { defaultIfUndefined: false });
    }

    return function (target, key, desc) {
      return internalArgumentDecorator(target, key, desc, maybeOptions);
    };
  }
});