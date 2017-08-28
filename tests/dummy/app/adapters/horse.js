import RESTAdapter from 'ember-data/adapters/rest';

export default RESTAdapter.extend({
  urlForModelAction(params) {
    let { actionName, snapshot } = params;
    if (actionName === 'ride') {
      let { id } = snapshot;
      return `/secret-horses/${id}/custom-ride`;
    }
  },

  urlForResourceAction(params) {
    let { actionName } = params;
    if (actionName === 'feed') {
      return '/secret-horses/custom-feed';
    }
  },

  headersForModelAction(params) {
    let { actionName, snapshot } = params;
    if (actionName === 'ride') {
      return {
        'If-Match': snapshot.attr('etag')
      };
    }
  }
});
