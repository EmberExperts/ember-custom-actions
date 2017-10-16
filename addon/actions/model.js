import Action from './action';
import deepMerge from 'lodash/merge';

export default function(path, options = {}) {
  return function(payload = {}, customOptions = {}) {
    return Action.create({
      payload,
      id: path,
      model: this,
      instance: true,
      options: deepMerge({}, options, customOptions)
    }).callAction();
  };
}
