define("@ember-decorators/argument/-debug/utils/object", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getPropertyDescriptor = getPropertyDescriptor;
  function getPropertyDescriptor(object, key) {
    if (object === undefined) return;

    return Object.getOwnPropertyDescriptor(object, key) || getPropertyDescriptor(Object.getPrototypeOf(object), key);
  }
});