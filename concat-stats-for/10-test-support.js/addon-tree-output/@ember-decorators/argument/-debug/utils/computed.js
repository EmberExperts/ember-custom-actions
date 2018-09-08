define('@ember-decorators/argument/-debug/utils/computed', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isMandatorySetter = isMandatorySetter;
  exports.isDescriptor = isDescriptor;
  exports.isDescriptorTrap = isDescriptorTrap;
  function isMandatorySetter(setter) {
    return setter && setter.toString().match('You must use .*set()') !== null;
  }

  function isDescriptor(maybeDesc) {
    return maybeDesc !== null && typeof maybeDesc === 'object' && maybeDesc.isDescriptor;
  }

  function isDescriptorTrap(maybeDesc) {
    return maybeDesc !== null && typeof maybeDesc === 'object' && !!maybeDesc.__DESCRIPTOR__;
  }
});