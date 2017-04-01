// Please Remove this serializer when feature flag 'ds-pushpayload-return' will be enabled by default
// https://github.com/emberjs/data/pull/4110

import DS from 'ember-data';

const { JSONAPISerializer } = DS;

export default JSONAPISerializer.extend({
  pushPayload(store, payload) {
    let normalizedPayload = this._normalizeDocumentHelper(payload);
    return store.push(normalizedPayload);
  }
});
