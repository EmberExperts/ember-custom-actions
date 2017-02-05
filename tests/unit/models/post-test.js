import { moduleForModel, test } from 'ember-qunit';
import Pretender from 'pretender';

moduleForModel('post', 'Unit | Model | post', {
  needs: ['config:environment', 'serializer:application'],

  beforeEach() {
    this.server = new Pretender();
  },

  afterEach() {
    this.server.shutdown();
  }
});

test('model action', function(assert) {
  this.server.put('/posts/:id/publish', () => {
    return [200, { }, 'true'];
  });

  let done = assert.async();
  let payload = { myParam: 'My first param' };

  let model = this.subject();
  model.set('id', 1);

  model.publish(payload).then((response) => {
    assert.ok(response, true);
    done();
  });
});

test('model action pushes to store', function(assert) {
  assert.expect(3);

  this.server.put('/posts/:id/publish', () => {
    return [200, {}, '{"data": {"id": 2, "type": "Post"}}'];
  });

  let done = assert.async();
  let payload = { myParam: 'My first param' };
  let store = this.store();
  let model = this.subject();

  model.set('id', 1);
  assert.equal(store.peekAll('post').get('length'), 1);

  model.publish(payload).then((response) => {
    assert.equal(response.get('id'), 2);
    assert.equal(store.peekAll('post').get('length'), 2);
    done();
  });
});

test('resource action', function(assert) {
  this.server.put('/posts/list', () => {
    return [200, { }, 'true'];
  });

  let done = assert.async();
  let payload = { myParam: 'My first param' };

  let model = this.subject();
  model.set('id', 1);

  model.list(payload).then((response) => {
    assert.ok(response, true);
    done();
  });
});

test('resource action pushes to store', function(assert) {
  assert.expect(3);

  this.server.put('/posts/list', () => {
    return [200, {}, '{"data": [{"id": "2", "type": "post"},{"id": "3", "type": "post"}]}'];
  });

  let done = assert.async();
  let payload = { myParam: 'My first param' };
  let store = this.store();
  let model = this.subject();

  model.set('id', 1);
  assert.equal(store.peekAll('post').get('length'), 1);

  model.list(payload).then((response) => {
    assert.equal(response.get('length'), 2);
    assert.equal(store.peekAll('post').get('length'), 3);
    done();
  });
});
