import RESTAdapter from 'ember-data/adapters/rest';

export default RESTAdapter.extend({
  urlForModelAction(params) {
    let { actionName, snapshot } = params;
    if (actionName === 'ride') {
      let id = snapshot.id;
      return `/secret-horses/${id}/custom-ride`;
    }
  }
});
