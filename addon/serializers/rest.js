import { deprecate } from '@ember/debug';

import DS from 'ember-data';

const { RESTSerializer } = DS;

export default RESTSerializer.extend({
  init() {
    this._super(...arguments);

    deprecate('Using ember-custom-actions `RestSerializer` is no longer required and this class will be removed.', false, {
      id: 'ember-custom-actions.deprecate-jsonapi-serializer',
      until: '3.0.0'
    });
  },
});
