define('@ember-decorators/argument/-debug/helpers/one-of', ['exports', '@ember-decorators/argument/-debug/utils/validators'], function (exports, _validators) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = oneOf;
  function oneOf(...list) {
    (true && !(arguments.length >= 1) && Ember.assert(`The 'oneOf' helper must receive at least one argument`, arguments.length >= 1));
    (true && !(list.every(item => typeof item === 'string')) && Ember.assert(`The 'oneOf' helper must receive arguments of strings, received: ${list}`, list.every(item => typeof item === 'string')));


    return (0, _validators.makeValidator)(`oneOf(${list.join()})`, value => {
      return list.includes(value);
    });
  }
});