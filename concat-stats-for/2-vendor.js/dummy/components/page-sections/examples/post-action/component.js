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

    init: function init() {
      var _this = this;

      this._super.apply(this, arguments);

      this.get('server').server.post('/posts/:id/publish', function (request) {
        var post = _this.get('store').peekRecord('post', request.params.id);
        var data = post.serialize({ includeId: true });
        data.data.attributes.published = true;

        return [200, {}, JSON.stringify(data)];
      });
    },


    post: Ember.computed('store', function () {
      return this.get('store').createRecord('post', { id: 1 });
    }),

    publishedObserver: Ember.observer('post.published', function () {
      var _this2 = this;

      if (this.get('post.published') == true) {
        Ember.run.later(function () {
          _this2.get('store').push({
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
      publish: function publish(post) {
        var _this3 = this;

        this.set('pending', true);

        Ember.run.later(function () {
          post.publish().then(function () {
            _this3.set('pending', false);
          });
        }, 500);
      }
    }
  });
});