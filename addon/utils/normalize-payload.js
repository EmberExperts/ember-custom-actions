import { assert } from '@ember/debug';
import { isArray } from '@ember/array';
import Ember from 'ember';

const {
  String
} = Ember;

function transformObject(object, operation) {
  if (object instanceof Object && !isArray(object)) {
    let data = {};

    Object.keys(object).forEach((key) => {
      data[String[operation](key)] = transformObject(object[key], operation);
    });

    return data;
  } else {
    return object;
  }
}

export default function(payload, operation) {
  if (operation) {
    assert("This normalize method of custom action's payload does not exist. Check Ember.String documentation!", !!String[operation]);
    return transformObject(payload, operation);
  } else {
    return payload;
  }
}
