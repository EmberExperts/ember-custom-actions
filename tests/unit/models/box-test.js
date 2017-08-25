// Box model is organised in such way, that this file
// is a test for ability to specify method used for action
// in action definition and adapter

import { moduleForModel, test } from 'ember-qunit';
import Pretender from 'pretender';

moduleForModel('box', 'Unit | Model | box', {
  needs: ['config:environment', 'adapter:box'],

  beforeEach() {
    this.server = new Pretender();
  },

  afterEach() {
    this.server.shutdown();
  }
});

test('model action sends \'PUT\' request by default', function(assert) {
  assert.expect(1);

  this.server.put('/boxes/:id/paint', () => {
    return [200, { }, 'true'];
  });

  let done = assert.async();

  let model = this.subject();
  model.set('id', 1);

  model.paint().then((response) => {
    assert.ok(response, true);
    done();
  });
});

test('model action uses type specified in action definition, if provided', function(assert) {
  assert.expect(1);

  this.server.post('/boxes/:id/fill', () => {
    return [200, { }, 'true'];
  });

  let done = assert.async();

  let model = this.subject();
  model.set('id', 1);

  model.fill().then((response) => {
    assert.ok(response, true);
    done();
  });
});

test('model action uses type from adapter, if provided', function(assert) {
  assert.expect(1);

  this.server.patch('/boxes/:id/fix', () => {
    return [200, { }, 'true'];
  });

  let done = assert.async();

  let model = this.subject();
  model.set('id', 1);

  model.fix().then((response) => {
    assert.ok(response, true);
    done();
  });
});
