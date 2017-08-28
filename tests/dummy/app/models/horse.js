import Model from 'ember-data/model';
import { modelAction, resourceAction } from 'ember-custom-actions';
import attr from 'ember-data/attr';

export default Model.extend({
  etag: attr(),

  ride: modelAction('ride'),

  feed: resourceAction('feed')
});
