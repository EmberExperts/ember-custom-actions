import Model from 'ember-data/model';
import { modelAction, resourceAction } from 'ember-custom-actions';

export default Model.extend({
  paint: modelAction('paint'),
  fill: modelAction('fill', { type: 'POST' }),
  fix: modelAction('fix'),

  stack: resourceAction('stack'),
  rearrange: resourceAction('rearrange', { type: 'POST' }),
  clean: resourceAction('clean')
});
