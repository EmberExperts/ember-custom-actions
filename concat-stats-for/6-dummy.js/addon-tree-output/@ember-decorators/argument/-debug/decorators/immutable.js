define('@ember-decorators/argument/-debug/decorators/immutable', ['exports', '@ember-decorators/argument/-debug/utils/validation-decorator'], function (exports, _validationDecorator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const immutable = (0, _validationDecorator.default)(function (target, key, desc, options, validations) {
    validations.isImmutable = true;
  });

  exports.default = immutable;
});