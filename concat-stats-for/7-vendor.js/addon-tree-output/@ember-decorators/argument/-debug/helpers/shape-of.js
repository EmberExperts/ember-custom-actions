define('@ember-decorators/argument/-debug/helpers/shape-of', ['exports', '@ember-decorators/argument/-debug/utils/validators'], function (exports, _validators) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = shapeOf;
  function shapeOf(shape) {
    (true && !(arguments.length === 1) && Ember.assert(`The 'shapeOf' helper must receive exactly one shape`, arguments.length === 1));
    (true && !(typeof shape === 'object') && Ember.assert(`The 'shapeOf' helper must receive an object to match the shape to, received: ${shape}`, typeof shape === 'object'));
    (true && !(Object.keys(shape).length > 0) && Ember.assert(`The object passed to the 'shapeOf' helper must have at least one key:type pair`, Object.keys(shape).length > 0));


    let typeDesc = [];

    for (let key in shape) {
      shape[key] = (0, _validators.resolveValidator)(shape[key]);

      typeDesc.push(`${key}:${shape[key]}`);
    }

    return (0, _validators.makeValidator)(`shapeOf({${typeDesc.join()}})`, value => {
      for (let key in shape) {
        if (shape[key](Ember.get(value, key)) !== true) {
          return false;
        }
      }

      return true;
    });
  }
});