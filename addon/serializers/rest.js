// Please Remove this serializer when feature flag 'ds-pushpayload-return' will be enabled by default
// https://github.com/emberjs/data/pull/4110

import { makeArray } from '@ember/array';

import { warn } from '@ember/debug';
import DS from 'ember-data';

const { RESTSerializer } = DS;

export default RESTSerializer.extend({
  pushPayload(store, payload) {
    let documentHash = {
      data: [],
      included: []
    };

    for (let prop in payload) {
      let modelName = this.modelNameFromPayloadKey(prop);
      if (!store.modelFactoryFor(modelName)) {
        warn(this.warnMessageNoModelForKey(prop, modelName), false, {
          id: 'ds.serializer.model-for-key-missing'
        });
        continue;
      }
      let type = store.modelFor(modelName);
      let typeSerializer = store.serializerFor(type.modelName);

      makeArray(payload[prop]).forEach((hash) => {
        let { data, included } = typeSerializer.normalize(type, hash, prop);
        documentHash.data.push(data);
        if (included) {
          documentHash.included.push(...included);
        }
      });
    }

    return store.push(documentHash);
  }
});
