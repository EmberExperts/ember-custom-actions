// Box model is organised in such way, that this file
// is a test for ability to specify method used for action
// in action definition and adapter

import { moduleForModel, test } from 'ember-qunit';
import Pretender from 'pretender';

moduleForModel('box', 'Unit | Model | box', {
  needs: ['config:environment'],

  beforeEach() {
    this.server = new Pretender();
  },

  afterEach() {
    this.server.shutdown();
  }
});

test("model action sends 'PUT' request by default", function(assert){
  assert.expect(1);

  this.server.put('/boxes/:id/paint', (request) => {
    return [200, { }, 'true'];
  });

  let done = assert.async();

  let model = this.subject();
  model.set('id', 1);

  model.paint().then((response) => {
    assert.ok(response, true);
    done();
  });
})

test("model action uses type specified in action definition, if provided", function(assert){
  assert.expect(1);

  this.server.post('/boxes/:id/fill', (request) => {
    return [200, { }, 'true'];
  });

  let done = assert.async();

  let model = this.subject();
  model.set('id', 1);

  model.fill().then((response) => {
    assert.ok(response, true);
    done();
  });
})

test("model action uses type from adapter, if provided", function(assert){
  assert.expect(1);

  this.server.patch('/boxes/:id/fix', (request) => {
    return [200, { }, 'true'];
  });

  let done = assert.async();

  let model = this.subject();
  model.set('id', 1);

  model.fix().then((response) => {
    assert.ok(response, true);
    done();
  });
})






// test('model action', function(assert) {
//   assert.expect(4);

//   this.server.put('/bikes/:id/ride', (request) => {
//     let data = JSON.parse(request.requestBody);

//     assert.deepEqual(data, { myParam: 'My first param' });
//     assert.deepEqual(request.queryParams, { enduro: 'true', include: 'owner' });
//     assert.equal(request.url, '/bikes/1/ride?enduro=true&include=owner');

//     return [200, { }, 'true'];
//   });

//   let done = assert.async();
//   let payload = { myParam: 'My first param' };

//   let model = this.subject();
//   model.set('id', 1);

//   model.ride(payload, { params: { enduro: true, include: 'owner' } }).then((response) => {
//     assert.ok(response, true);
//     done();
//   });
// });

// test('model action pushes to store', function(assert) {
//   assert.expect(5);

//   this.server.put('/bikes/:id/ride', (request) => {
//     let data = JSON.parse(request.requestBody);
//     assert.deepEqual(data, { myParam: 'My first param' });
//     assert.equal(request.url, '/bikes/1/ride');

//     return [200, {}, '{ "bikes": { "id": 2 } }'];
//   });

//   let done = assert.async();
//   let payload = { myParam: 'My first param' };
//   let store = this.store();
//   let model = this.subject();

//   model.set('id', 1);
//   assert.equal(store.peekAll('bike').get('length'), 1);

//   model.ride(payload).then((response) => {
//     assert.equal(response[0].get('id'), 2);
//     assert.equal(store.peekAll('bike').get('length'), 2);
//     done();
//   });
// });

// test('model action set serialized errors in error object', function(assert) {
//   assert.expect(1);

//   let done = assert.async();
//   let errorText = 'This name is taken';
//   let error = { detail: errorText, source: { pointer: 'data/attributes/name' } };

//   this.server.put('/bikes/:id/ride', () => {
//     let payload = JSON.stringify({ errors: [error] });
//     return [422, {}, payload];
//   });

//   let model = this.subject({
//     id: 1,
//     name: 'Mikael'
//   });

//   model.ride({ name: 'new-name' }).catch((error) => {
//     assert.deepEqual(error.serializedErrors, { name: [errorText] });
//     done();
//   });
// });
