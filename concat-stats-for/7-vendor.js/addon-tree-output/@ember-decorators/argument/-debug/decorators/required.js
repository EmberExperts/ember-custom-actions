define('@ember-decorators/argument/-debug/decorators/required', ['exports', '@ember-decorators/argument/-debug/utils/validation-decorator'], function (exports, _validationDecorator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const required = (0, _validationDecorator.default)(function (target, key, desc, options, validations) {
    validations.isRequired = true;
  });

  exports.default = required;
});