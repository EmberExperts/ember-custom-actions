import Model from 'ember-data/model';
import { modelAction, resourceAction } from 'ember-custom-actions';

export default Model.extend({
  drive: modelAction('drive'),
  clean: modelAction('clean'),
  fix: modelAction('fix'),

  moveAll: resourceAction('move-all'),
  cleanAll: resourceAction('clean-all'),
  fixAll: resourceAction('fix-all')
});
