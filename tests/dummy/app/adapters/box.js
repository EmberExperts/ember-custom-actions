import RESTAdapter from 'ember-data/adapters/rest';

export default RESTAdapter.extend({
  methodForModelAction(params) {
    let { actionName } = params;
    if (actionName === 'fix') {
      return 'PATCH';
    }
  },

  methodForResourceAction(params) {
    let { actionName } = params;
    if (actionName === 'clean') {
      return 'PATCH';
    }
  }
});
