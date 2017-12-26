import { moduleForModel, test } from 'ember-qunit';
import Pretender from 'pretender';

moduleForModel('bike', 'Unit | Model | bike', {
  needs: ['config:environment', 'serializer:bike', 'adapter:bike'],

  beforeEach() {
    this.server = new Pretender();
  },

  afterEach() {
    this.server.shutdown();
  }
});

test('model action with default and custom data', function(assert) {
  assert.expect(4);

  this.server.put('/bikes/:id/ride', (request) => {
    let data = JSON.parse(request.requestBody);

    assert.deepEqual(data, { myParam: 'My first param', defaultParam: 'ok' });
    assert.deepEqual(request.queryParams, { enduro: 'true', include: 'owner' });
    assert.equal(request.url, '/bikes/1/ride?enduro=true&include=owner');

    return [200, { }, 'true'];
  });

  let done = assert.async();
  let payload = { myParam: 'My first param' };

  let model = this.subject();
  model.set('id', 1);

  model.ride(payload, { queryParams: { enduro: true, include: 'owner' } }).then((response) => {
    assert.ok(response, true);
    done();
  });
});

test('model action pushes to store', function(assert) {
  assert.expect(5);

  this.server.put('/bikes/:id/ride', (request) => {
    let data = JSON.parse(request.requestBody);
    assert.deepEqual(data, { myParam: 'My first param', defaultParam: 'ok' });
    assert.equal(request.url, '/bikes/1/ride');

    return [200, {}, '{ "bikes": { "id": 2 } }'];
  });

  let done = assert.async();
  let payload = { myParam: 'My first param' };
  let store = this.store();
  let model = this.subject();

  model.set('id', 1);
  assert.equal(store.peekAll('bike').get('length'), 1);

  model.ride(payload).then((response) => {
    assert.equal(response[0].get('id'), 2);
    assert.equal(store.peekAll('bike').get('length'), 2);
    done();
  });
});

test('model action set serialized errors in error object', function(assert) {
  assert.expect(1);

  let done = assert.async();
  let errorText = 'This name is taken';
  let error = { detail: errorText, source: { pointer: 'data/attributes/name' } };

  this.server.put('/bikes/:id/ride', () => {
    let payload = JSON.stringify({ errors: [error] });
    return [422, {}, payload];
  });

  let model = this.subject({
    id: 1,
    name: 'Mikael'
  });

  model.ride({ name: 'new-name' }).catch((error) => {
    assert.deepEqual(error.serializedErrors, { name: [errorText] });
    done();
  });
});
