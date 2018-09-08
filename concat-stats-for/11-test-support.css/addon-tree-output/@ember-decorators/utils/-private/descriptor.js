define('@ember-decorators/utils/-private/descriptor', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isComputedDescriptor = isComputedDescriptor;
  exports.computedDescriptorFor = computedDescriptorFor;


  const DESCRIPTOR = '__DESCRIPTOR__';

  function isCPGetter(getter) {
    // Hack for descriptor traps, we want to be able to tell if the function
    // is a descriptor trap before we call it at all
    return getter !== null && typeof getter === 'function' && getter.toString().indexOf('CPGETTER_FUNCTION') !== -1;
  }

  function isDescriptorTrap(possibleDesc) {
    if (false && true) {
      return possibleDesc !== null && typeof possibleDesc === 'object' && possibleDesc[DESCRIPTOR] !== undefined;
    } else {
      throw new Error('Cannot call `isDescriptorTrap` in production');
    }
  }

  function isComputedDescriptor(possibleDesc) {
    return possibleDesc !== null && typeof possibleDesc === 'object' && possibleDesc.isDescriptor;
  }

  function computedDescriptorFor(obj, keyName) {
    (true && !(obj !== null) && Ember.assert('Cannot call `descriptorFor` on null', obj !== null));
    (true && !(obj !== undefined) && Ember.assert('Cannot call `descriptorFor` on undefined', obj !== undefined));
    (true && !(typeof obj === 'object' || typeof obj === 'function') && Ember.assert(`Cannot call \`descriptorFor\` on ${typeof obj}`, typeof obj === 'object' || typeof obj === 'function'));


    if (true) {
      let meta = Ember.meta(obj);

      if (meta !== undefined && typeof meta._descriptors === 'object') {
        // TODO: Just return the standard descriptor
        return meta._descriptors[keyName];
      }
    } else if (Object.hasOwnProperty.call(obj, keyName)) {
      let { value: possibleDesc, get: possibleCPGetter } = Object.getOwnPropertyDescriptor(obj, keyName);

      if (true && false && isCPGetter(possibleCPGetter)) {
        possibleDesc = possibleCPGetter.call(obj);

        if (isDescriptorTrap(possibleDesc)) {
          return possibleDesc[DESCRIPTOR];
        }
      }

      return isComputedDescriptor(possibleDesc) ? possibleDesc : undefined;
    }
  }
});