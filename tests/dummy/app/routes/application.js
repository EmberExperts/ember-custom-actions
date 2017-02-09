import Ember from 'ember';
import Pretender from 'pretender';

const { Route } = Ember;

export default Route.extend({
  init() {
    this._super(...arguments);
    this.server = new Pretender();
    this.mockServer();
  },

  mockServer() {
    this.server.put('/posts/:id/publish', (request) => {
      return [200, {}, `{"data": {"id": ${request.params.id}, "type": "Post", "attributes": {"published": true}}}`];
    });
  }
});
