// Horse model is organised in such way, that this file
// is a test for ability to specify url and headers used
// in action defined in adapter

import { moduleForModel, test } from 'ember-qunit';
import Pretender from 'pretender';

moduleForModel('horse', 'Unit | Model | horse', {
  needs: ['config:environment', 'adapter:horse'],

  beforeEach() {
    this.server = new Pretender();
  },

  afterEach() {
    this.server.shutdown();
  }
});

test('it uses url specified via adapter#urlForModelAction', function(assert) {
  assert.expect(1);

  this.server.put('/secret-horses/:id/custom-ride', () => {
    return [200, { }, 'true'];
  });

  let done = assert.async();

  let model = this.subject();
  model.set('id', 1);

  model.ride().then((response) => {
    assert.ok(response, true);
    done();
  });
});

test('it uses headers specified via adapter#headersForModelAction', function(assert) {
  assert.expect(2);

  this.server.put('/secret-horses/:id/custom-ride', (request) => {
    let etag = request.requestHeaders['If-Match'];
    assert.equal(etag, 'secret');

    return [200, { }, 'true'];
  });

  let done = assert.async();

  let model = this.subject({
    id: 1,
    etag: 'secret'
  });

  model.ride().then((response) => {
    assert.ok(response, true);
    done();
  });
});

test('it uses url specified via adapter#urlForResourceAction', function(assert) {
  assert.expect(1);

  this.server.put('/secret-horses/custom-feed', () => {
    return [200, { }, 'true'];
  });

  let done = assert.async();

  let model = this.subject();
  model.set('id', 1);

  model.feed().then((response) => {
    assert.ok(response, true);
    done();
  });
});
