import RSVP from 'rsvp';
import ArrayProxy from '@ember/array/proxy';
import ObjectProxy from '@ember/object/proxy';
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
  assert.expect(3);

  this.server.post('/posts/:id/publish', (request) => {
    let data = JSON.parse(request.requestBody);
    assert.deepEqual(data, { myParam: 'My first param' });
    assert.equal(request.url, '/posts/1/publish');

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
  assert.expect(5);

  this.server.post('/posts/:id/publish', (request) => {
    let data = JSON.parse(request.requestBody);
    assert.deepEqual(data, { myParam: 'My first param' });
    assert.equal(request.url, '/posts/1/publish');

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
  assert.expect(3);

  this.server.post('/posts/list', (request) => {
    let data = JSON.parse(request.requestBody);
    assert.deepEqual(data, { myParam: 'My first param' });
    assert.equal(request.url, '/posts/list');

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

test('resource action with params in GET', function(assert) {
  assert.expect(4);

  this.server.get('/posts/search', (request) => {
    assert.equal(request.url, '/posts/search?showAll=true&my-param=My%20first%20param');
    assert.equal(request.requestHeaders.test, 'Custom header');
    assert.deepEqual(request.queryParams, {
      'my-param': 'My first param',
      'showAll': 'true'
    });

    return [200, { }, 'true'];
  });

  let done = assert.async();
  let payload = { myParam: 'My first param' };

  let model = this.subject();
  model.set('id', 1);
  model.search(payload, { ajaxOptions: { headers: { test: 'Custom header' } } }).then((response) => {
    assert.ok(response, true);
    done();
  });
});

test('resource action pushes to store', function(assert) {
  assert.expect(5);

  this.server.post('/posts/list', (request) => {
    let data = JSON.parse(request.requestBody);
    assert.deepEqual(data, { myParam: 'My first param' });
    assert.equal(request.url, '/posts/list');

    return [200, {}, '{"data": [{"id": "2", "type": "post"},{"id": "3", "type": "post"}]}'];
  });

  let done = assert.async();
  let payload = { myParam: 'My first param' };
  let store = this.store();
  let model = this.subject();

  model.set('id', 1);
  assert.equal(store.peekAll('post').get('length'), 1);

  model.list(payload).then((response) => {
    assert.equal(response.length, 2);
    assert.equal(store.peekAll('post').get('length'), 3);
    done();
  });
});

test('responseTypes', function(assert) {
  assert.expect(6);

  this.server.post('/posts/list', (request) => {
    assert.equal(request.url, '/posts/list');

    return [200, {}, '{"data": [{"id": "2", "type": "post"},{"id": "3", "type": "post"}]}'];
  });

  let model = this.subject();

  let promise = model.list();
  let promiseArray = model.list(null, { responseType: 'array' });
  let promiseObject = model.list(null, { responseType: 'object' });

  assert.equal(promise.constructor, RSVP.Promise);
  assert.equal(promiseArray.constructor.superclass, ArrayProxy);
  assert.equal(promiseObject.constructor.superclass, ObjectProxy);
});

test('model action set serialized errors in error object', function(assert) {
  assert.expect(1);

  let done = assert.async();
  let errorText = 'This name is taken';
  let error = { detail: errorText, source: { pointer: 'data/attributes/name' } };

  this.server.post('/posts/:id/publish', () => {
    let payload = JSON.stringify({ errors: [error] });
    return [422, {}, payload];
  });

  let model = this.subject({
    id: 1,
    name: 'Mikael'
  });

  model.publish({ name: 'new-name' }).catch((error) => {
    assert.deepEqual(error.serializedErrors, { name: [errorText] });
    done();
  });
});
