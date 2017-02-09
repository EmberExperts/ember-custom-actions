import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { modelAction, resourceAction } from 'ember-custom-actions';

export default Model.extend({
  name: attr(),
  published: attr(),

  publish: modelAction('publish', { promiseType: 'object' }),
  list: resourceAction('list'),
  search: resourceAction('search', { type: 'GET', normalizeOperation: 'dasherize' })
});
