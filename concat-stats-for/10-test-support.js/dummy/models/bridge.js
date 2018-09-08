import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { resourceAction } from 'ember-custom-actions';

export default Model.extend({
  name: attr(),
  burnAll: resourceAction('burn', { method: 'GET' })
});
