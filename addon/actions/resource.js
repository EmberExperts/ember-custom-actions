import Action from './action';

export default function(path, options = {}) {
  return function(payload = {}) {
    return Action.create({
      model: this,
      path,
      options,
      payload
    }).callAction();
  };
}
