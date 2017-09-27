import JSONAPIAdapter from 'ember-data/adapters/json-api';
import { AdapterMixin } from 'ember-custom-actions';

export default JSONAPIAdapter.extend(AdapterMixin, {
  urlForCustomAction(modelName, id, snapshot, requestType) {
    let { adapterOptions: { suffix } } = snapshot;
    suffix = suffix || '';

    if (requestType === 'clean') {
      let baseUrl = this._buildURL(modelName, id);
      return `${baseUrl}/custom-clean`;
    } else if (requestType === 'fix') {
      return `/custom-cars/${id}/custom-fix${suffix}`;
    } else if (requestType === 'clean-all') {
      let baseUrl = this._buildURL(modelName, id);
      return `${baseUrl}/custom-clean-all`;
    } else if (requestType === 'fix-all') {
      return `/custom-cars/custom-fix-all${suffix}`;
    }

    return this._super(...arguments);
  }
});