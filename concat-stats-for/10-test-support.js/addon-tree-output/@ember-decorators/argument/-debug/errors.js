define("@ember-decorators/argument/-debug/errors", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  class MutabilityError extends Error {}

  exports.MutabilityError = MutabilityError;
  class RequiredFieldError extends Error {}

  exports.RequiredFieldError = RequiredFieldError;
  class TypeError extends Error {}
  exports.TypeError = TypeError;
});