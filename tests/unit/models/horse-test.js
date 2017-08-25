// Horse model is organised in such way, that this file
// is a test for ability to specify url used for action
// in action definition and adapter

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
