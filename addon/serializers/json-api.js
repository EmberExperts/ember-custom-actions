import DS from 'ember-data';

const { JSONAPISerializer } = DS;

export default JSONAPISerializer.extend({
  pushPayload(store, payload) {
    let normalizedPayload = this._normalizeDocumentHelper(payload);
    return store.push(normalizedPayload);
  }
});
