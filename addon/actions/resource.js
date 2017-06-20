import Ember from 'ember';
import Action from './action';

const { assign } = Ember;

export default function(path, options = {}) {
  return function(payload = {}, customOptions = {}) {
    return Action.create({
      model: this,
      options: assign({}, options, customOptions),
      path,
      payload
    }).callAction();
  };
}
