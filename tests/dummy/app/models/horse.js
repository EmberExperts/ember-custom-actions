import Model from 'ember-data/model';
import { modelAction, resourceAction } from 'ember-custom-actions';

export default Model.extend({
  ride: modelAction('ride'),

  feed: resourceAction('feed')
});
