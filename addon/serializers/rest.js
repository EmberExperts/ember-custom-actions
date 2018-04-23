import { deprecate } from '@ember/application/deprecations';

import DS from 'ember-data';

const { RESTSerializer } = DS;

export default RESTSerializer.extend({
  init() {
    this._super(...arguments);

    deprecate('Using ember-custom-actions `RestSerializer` is no longer required and this class will be removed in the next version.', false, {
      id: 'ember-custom-actions.deprecate-jsonapi-serializer',
      until: '2.2.0'
    });
  },
});
