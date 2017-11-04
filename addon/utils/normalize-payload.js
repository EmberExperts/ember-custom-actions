import { assert } from '@ember/debug';
import { isArray } from '@ember/array';
import {
  camelize,
  capitalize,
  classify,
  dasherize,
  decamelize,
  underscore
} from '@ember/string';

const transformFunctions = {
  camelize,
  capitalize,
  classify,
  dasherize,
  decamelize,
  underscore
};

function transformObject(object, operation) {
  if (object instanceof Object && !isArray(object)) {
    let data = {};

    Object.keys(object).forEach((key) => {
      let transform = transformFunctions[operation];
      data[transform(key)] = transformObject(object[key], operation);
    });

    return data;
  } else {
    return object;
  }
}

export default function(payload, operation) {
  if (operation) {
    assert("This normalize method of custom action's payload does not exist. Check Ember.String documentation!", !!transformFunctions[operation]);
    return transformObject(payload, operation);
  } else {
    return payload;
  }
}
