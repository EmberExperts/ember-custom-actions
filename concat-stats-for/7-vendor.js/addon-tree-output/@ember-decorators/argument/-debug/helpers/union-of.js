define('@ember-decorators/argument/-debug/helpers/union-of', ['exports', '@ember-decorators/argument/-debug/utils/validators'], function (exports, _validators) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = unionOf;
  function unionOf(...types) {
    (true && !(arguments.length > 1) && Ember.assert(`The 'unionOf' helper must receive more than one type`, arguments.length > 1));


    const validators = types.map(_validators.resolveValidator);

    return (0, _validators.makeValidator)(`unionOf(${validators.join()})`, value => {
      return validators.some(validator => validator(value));
    });
  }
});