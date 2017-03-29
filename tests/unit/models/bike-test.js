import { moduleForModel, test } from 'ember-qunit';
import Pretender from 'pretender';

moduleForModel('bike', 'Unit | Model | bike', {
  needs: ['config:environment', 'serializer:bike'],

  beforeEach() {
    this.server = new Pretender();
  },

  afterEach() {
    this.server.shutdown();
  }
});

test('model action', function(assert) {
  assert.expect(3);

  this.server.put('/bikes/:id/ride', (request) => {
    let data = JSON.parse(request.requestBody);
    assert.deepEqual(data, { myParam: 'My first param' });
    assert.equal(request.url, '/bikes/1/ride');

    return [200, { }, 'true'];
  });

  let done = assert.async();
  let payload = { myParam: 'My first param' };

  let model = this.subject();
  model.set('id', 1);

  model.ride(payload).then((response) => {
    assert.ok(response, true);
    done();
  });
});

test('model action pushes to store', function(assert) {
  assert.expect(5);

  this.server.put('/bikes/:id/ride', (request) => {
    let data = JSON.parse(request.requestBody);
    assert.deepEqual(data, { myParam: 'My first param' });
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

test('model action set errors on the model', function(assert) {
  assert.expect(4);

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

  model.ride({ name: 'new-name' }).catch((reason) => {
    // errors are set on the model
    assert.notOk(model.get('isValid'));
    assert.ok(model.get('errors.length'));
    assert.equal(model.get('errors.name.firstObject.message'), errorText);
    // error object is properly thrown
    assert.deepEqual(reason.errors, [error]);
    done();
  });
});
