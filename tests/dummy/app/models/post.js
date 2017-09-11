import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { modelAction, resourceAction } from 'ember-custom-actions';

export default Model.extend({
  name: attr(),
  published: attr('boolean', { defaultValue: false }),

  publish: modelAction('publish', { responseType: 'object' }),
  list: resourceAction('list'),
  search: resourceAction('search', {
    method: 'GET',
    normalizeOperation: 'dasherize',
    queryParams: { showAll: true }
  })
});
