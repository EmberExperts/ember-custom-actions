import Action from 'ember-custom-actions/actions/action';
import deepMerge from 'lodash/merge';

export default function(id, options = {}) {
  return function(payload = {}, customOptions = {}) {
    return Action.create({
      id,
      payload,
      model: this,
      integrated: true,
      options: deepMerge({}, options, customOptions)
    }).callAction();
  };
}
