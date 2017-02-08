import Model from 'ember-data/model';
import { modelAction, resourceAction } from 'ember-custom-actions';

export default Model.extend({
  publish: modelAction('publish'),
  list: resourceAction('list'),
  search: resourceAction('search', { type: 'GET', normalizeOperation: 'dasherize' })
});
