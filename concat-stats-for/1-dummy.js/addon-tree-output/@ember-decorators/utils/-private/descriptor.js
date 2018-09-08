define('@ember-decorators/utils/-private/descriptor', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isComputedDescriptor = isComputedDescriptor;
  exports.computedDescriptorFor = computedDescriptorFor;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var DESCRIPTOR = '__DESCRIPTOR__';

  function isCPGetter(getter) {
    // Hack for descriptor traps, we want to be able to tell if the function
    // is a descriptor trap before we call it at all
    return getter !== null && typeof getter === 'function' && getter.toString().indexOf('CPGETTER_FUNCTION') !== -1;
  }

  function isDescriptorTrap(possibleDesc) {
    if (false && false) {
      return possibleDesc !== null && (typeof possibleDesc === 'undefined' ? 'undefined' : _typeof(possibleDesc)) === 'object' && possibleDesc[DESCRIPTOR] !== undefined;
    } else {
      throw new Error('Cannot call `isDescriptorTrap` in production');
    }
  }

  function isComputedDescriptor(possibleDesc) {
    return possibleDesc !== null && (typeof possibleDesc === 'undefined' ? 'undefined' : _typeof(possibleDesc)) === 'object' && possibleDesc.isDescriptor;
  }

  function computedDescriptorFor(obj, keyName) {
    (false && !(obj !== null) && Ember.assert('Cannot call `descriptorFor` on null', obj !== null));
    (false && !(obj !== undefined) && Ember.assert('Cannot call `descriptorFor` on undefined', obj !== undefined));
    (false && !((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function') && Ember.assert('Cannot call `descriptorFor` on ' + (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)), (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function'));


    if (true) {
      var meta = Ember.meta(obj);

      if (meta !== undefined && _typeof(meta._descriptors) === 'object') {
        // TODO: Just return the standard descriptor
        return meta._descriptors[keyName];
      }
    } else if (Object.hasOwnProperty.call(obj, keyName)) {
      var _Object$getOwnPropert = Object.getOwnPropertyDescriptor(obj, keyName),
          possibleDesc = _Object$getOwnPropert.value,
          possibleCPGetter = _Object$getOwnPropert.get;

      if (false && false && isCPGetter(possibleCPGetter)) {
        possibleDesc = possibleCPGetter.call(obj);

        if (isDescriptorTrap(possibleDesc)) {
          return possibleDesc[DESCRIPTOR];
        }
      }

      return isComputedDescriptor(possibleDesc) ? possibleDesc : undefined;
    }
  }
});