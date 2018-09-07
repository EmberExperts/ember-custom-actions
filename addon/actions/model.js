import Action from 'ember-custom-actions/actions/action';
import deepMerge from 'lodash.merge';

export default function(path, options = {}) {
  return function(payload = {}, actionOptions = {}) {
    actionOptions.data = payload;

    return Action.create({
      id: path,
      model: this,
      instance: true,
      options: deepMerge({}, options, actionOptions)
    }).callAction();
  };
}
