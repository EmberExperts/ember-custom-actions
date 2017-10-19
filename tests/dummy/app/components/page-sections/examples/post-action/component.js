import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { observer, computed } from '@ember/object';

export default Component.extend({
  tagName: 'tr',
  classNames: 'action',
  store: service(),
  server: service(),

  init() {
    this._super(...arguments);

    this.get('server').server.put('/posts/:id/publish', (request) => {
      let post = this.get('store').peekRecord('post', request.params.id);
      let data = post.serialize({ includeId: true });
      data.data.attributes.published = true;

      return [200, { }, JSON.stringify(data)];
    });
  },

  post: computed('store', function() {
    return this.get('store').createRecord('post', { id: 1 });
  }),

  publishedObserver: observer('post.published', function() {
    if (this.get('post.published') == true) {
      run.later(() => {
        this.get('store').push({
          data: {
            id: '1',
            type: 'post',
            attributes: {
              published: false
            }
          }
        });
      }, 3000);
    }
  }),

  actions: {
    publish(post) {
      this.set('pending', true);

      run.later(() => {
        post.publish().then(() => {
          this.set('pending', false);
        });
      }, 500);
    }
  }
});
