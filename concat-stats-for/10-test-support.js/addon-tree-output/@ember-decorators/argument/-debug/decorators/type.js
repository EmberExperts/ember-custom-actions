define('@ember-decorators/argument/-debug/decorators/type', ['exports', '@ember-decorators/argument/-debug/utils/validation-decorator', '@ember-decorators/argument/-debug/utils/validators'], function (exports, _validationDecorator, _validators) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = type;
  function type(type) {
    (true && !(arguments.length === 1) && Ember.assert(`The @type decorator can only receive one type, but instead received ${arguments.length}. Use the 'unionOf' helper to create a union type.`, arguments.length === 1));


    const validator = (0, _validators.resolveValidator)(type);

    return (0, _validationDecorator.default)(function (target, key, desc, options, validations) {
      validations.typeValidators.push(validator);
    });
  }
});