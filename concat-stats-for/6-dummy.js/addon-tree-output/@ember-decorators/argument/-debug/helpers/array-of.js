define('@ember-decorators/argument/-debug/helpers/array-of', ['exports', '@ember-decorators/argument/-debug/utils/validators'], function (exports, _validators) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = arrayOf;
  function arrayOf(type) {
    (true && !(arguments.length === 1) && Ember.assert(`The 'arrayOf' helper must receive exactly one type. Use the 'unionOf' helper to create a union type.`, arguments.length === 1));


    const validator = (0, _validators.resolveValidator)(type);

    return (0, _validators.makeValidator)(`arrayOf(${validator})`, value => {
      return Ember.isArray(value) && value.every(validator);
    });
  }
});