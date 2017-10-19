import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  store: service(),

  post: computed('property', function() {
    return this.get('store').createRecord('post', { id: 1 });
  }),

  status: computed('post', function() {
    return this.get('post').publish();
  })
});
