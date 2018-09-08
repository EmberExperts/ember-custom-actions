define('@ember-decorators/argument/-debug/utils/validators', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.makeValidator = makeValidator;
  exports.resolveValidator = resolveValidator;


  function instanceOf(type) {
    return makeValidator(type.toString(), value => value instanceof type);
  }

  const primitiveTypeValidators = {
    any: makeValidator('any', () => true),
    object: makeValidator('object', value => {
      return typeof value !== 'boolean' && typeof value !== 'number' && typeof value !== 'string' && typeof value !== 'symbol' && value !== null && value !== undefined;
    }),

    boolean: makeValidator('boolean', value => typeof value === 'boolean'),
    number: makeValidator('number', value => typeof value === 'number'),
    string: makeValidator('string', value => typeof value === 'string'),
    symbol: makeValidator('symbol', value => typeof value === 'symbol'),

    null: makeValidator('null', value => value === null),
    undefined: makeValidator('undefined', value => value === undefined)
  };

  function makeValidator(desc, fn) {
    fn.isValidator = true;
    fn.toString = () => desc;
    return fn;
  }

  function resolveValidator(type) {
    if (type === null || type === undefined) {
      return type === null ? primitiveTypeValidators.null : primitiveTypeValidators.undefined;
    } else if (type.isValidator === true) {
      return type;
    } else if (typeof type === 'function' || typeof type === 'object') {
      // We allow objects for certain classes in IE, like Element, which have typeof 'object' for some reason
      return instanceOf(type);
    } else if (typeof type === 'string') {
      (true && !(primitiveTypeValidators[type] !== undefined) && Ember.assert(`Unknown primitive type received: ${type}`, primitiveTypeValidators[type] !== undefined));


      return primitiveTypeValidators[type];
    } else {
      (true && !(false) && Ember.assert(`Types must either be a primitive type string, class, validator, or null or undefined, received: ${type}`, false));
    }
  }
});