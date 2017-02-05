import Action from './action';

export default function(path, options = {}) {
  return function(payload = {}) {
    return Action.create({
      model: this,
      instance: true,
      options,
      payload,
      path
    }).callAction();
  };
}
