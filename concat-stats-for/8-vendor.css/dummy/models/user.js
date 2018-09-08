import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { modelAction } from 'ember-custom-actions';

export default Model.extend({
  name: attr(),

  profile: modelAction('profile', { responseType: 'object', method: 'get' })
});
