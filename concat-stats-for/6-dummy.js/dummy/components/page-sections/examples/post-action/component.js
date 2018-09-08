define('dummy/components/page-sections/examples/post-action/component', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    tagName: 'tr',
    classNames: 'action',
    store: Ember.inject.service(),
    server: Ember.inject.service(),

    init() {
      this._super(...arguments);

      this.get('server').server.post('/posts/:id/publish', request => {
        let post = this.get('store').peekRecord('post', request.params.id);
        let data = post.serialize({ includeId: true });
        data.data.attributes.published = true;

        return [200, {}, JSON.stringify(data)];
      });
    },

    post: Ember.computed('store', function () {
      return this.get('store').createRecord('post', { id: 1 });
    }),

    publishedObserver: Ember.observer('post.published', function () {
      if (this.get('post.published') == true) {
        Ember.run.later(() => {
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

        Ember.run.later(() => {
          post.publish().then(() => {
            this.set('pending', false);
          });
        }, 500);
      }
    }
  });
});