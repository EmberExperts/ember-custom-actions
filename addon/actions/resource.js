import Action from 'ember-custom-actions/actions/action';
import deepMerge from 'lodash/merge';

export default function(path, options = {}) {
  return function(payload = {}, customOptions = {}) {
    return Action.create({
      payload,
      id: path,
      model: this,
      options: deepMerge({}, options, customOptions)
    }).callAction();
  };
}
