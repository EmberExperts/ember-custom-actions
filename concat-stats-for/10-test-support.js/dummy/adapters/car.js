import JSONAPIAdapter from 'ember-data/adapters/json-api';
import { AdapterMixin } from 'ember-custom-actions';

export default JSONAPIAdapter.extend(AdapterMixin, {
  urlForCustomAction(modelName, id, snapshot, requestType) {
    let { adapterOptions: { suffix } } = snapshot;
    suffix = suffix || '';

    if (requestType === 'clean') {
      let baseUrl = this.buildURL(modelName, id, snapshot, requestType);
      return `${baseUrl}/custom-clean`;
    } else if (requestType === 'fix') {
      return `/custom-cars/${id}/custom-fix${suffix}`;
    } else if (requestType === 'clean-all') {
      let baseUrl = this.buildURL(modelName, id, snapshot, requestType);
      return `${baseUrl}/custom-clean-all`;
    } else if (requestType === 'fixAll') {
      return `/custom-cars/custom-fix-all${suffix}`;
    }

    return this._super(...arguments);
  },

  methodForCustomAction({ actionId }) {
    if (actionId === 'clean') {
      return 'PATCH';
    }

    return this._super(...arguments);
  },

  headersForCustomAction({ actionId }) {
    if (actionId === 'clean') {
      return {
        myHeader: 'custom header'
      };
    }

    return this._super(...arguments);
  },

  dataForCustomAction({ actionId }) {
    if (actionId === 'clean') {
      return {
        customParam: 'custom param'
      };
    }

    return this._super(...arguments);
  }
});
