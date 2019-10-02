import { module, test } from 'qunit';
// tests for integration with adapter - url customization
import { setupTest } from 'ember-qunit';
import Pretender from 'pretender';

import { run } from '@ember/runloop';

module('Unit | Model | car', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.server = new Pretender();
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('creates default url for model action', function(assert) {
    assert.expect(3);

    this.server.post('/cars/:id/drive', (request) => {
      assert.deepEqual(request.queryParams, { include: 'owner' });
      assert.equal(request.url, '/cars/1/drive?include=owner');

      return [200, {}, 'true'];
    });

    let done = assert.async();
    let model = run(() => this.owner.lookup('service:store').createRecord('car'));
    model.set('id', 1);

    model.drive({}, { queryParams: { include: 'owner' } }).then((response) => {
      assert.ok(response, true);
      done();
    });
  });

  test('creates custom url with base url and custom request method for model action', function(assert) {
    assert.expect(2);

    this.server.patch('/cars/:id/custom-clean', () => {
      assert.ok(true);
      return [200, {}, 'true'];
    });

    let done = assert.async();
    let model = run(() => this.owner.lookup('service:store').createRecord('car'));
    model.set('id', 1);

    model.clean().then((response) => {
      assert.ok(response, true);
      done();
    });
  });

  test('custom headers', function(assert) {
    assert.expect(2);

    this.server.patch('/cars/:id/custom-clean', (request) => {
      assert.equal(request.requestHeaders.myHeader, 'custom header');
      return [200, {}, 'true'];
    });

    let done = assert.async();
    let model = run(() => this.owner.lookup('service:store').createRecord('car'));
    model.set('id', 1);

    model.clean().then((response) => {
      assert.ok(response, true);
      done();
    });
  });

  test('creates custom url for model action', function(assert) {
    assert.expect(2);

    this.server.post('/custom-cars/:id/custom-fix', () => {
      assert.ok(true);

      return [200, {}, 'true'];
    });

    let done = assert.async();
    let model = run(() => this.owner.lookup('service:store').createRecord('car'));
    model.set('id', 1);

    model.fix().then((response) => {
      assert.ok(response, true);
      done();
    });
  });

  test('creates custom url for model action and passes adapterOptions', function(assert) {
    assert.expect(2);

    this.server.post('/custom-cars/:id/custom-fix/with-hammer', () => {
      assert.ok(true);
      return [200, {}, 'true'];
    });

    let done = assert.async();
    let model = run(() => this.owner.lookup('service:store').createRecord('car'));
    model.set('id', 1);

    let adapterOptions = { suffix: '/with-hammer' };

    model.fix({}, { adapterOptions }).then((response) => {
      assert.ok(response, true);
      done();
    });
  });

  test('creates default url for resource action', function(assert) {
    assert.expect(3);

    this.server.post('/cars/move-all', (request) => {
      assert.deepEqual(request.queryParams, { include: 'owner' });
      assert.equal(request.url, '/cars/move-all?include=owner');

      return [200, {}, 'true'];
    });

    let done = assert.async();
    let model = run(() => this.owner.lookup('service:store').createRecord('car'));

    model.moveAll({}, { queryParams: { include: 'owner' } }).then((response) => {
      assert.ok(response, true);
      done();
    });
  });

  test('creates custom url with base url for resource action', function(assert) {
    assert.expect(2);

    this.server.post('/cars/custom-clean-all', () => {
      assert.ok(true);
      return [200, {}, 'true'];
    });

    let done = assert.async();
    let model = run(() => this.owner.lookup('service:store').createRecord('car'));

    model.cleanAll().then((response) => {
      assert.ok(response, true);
      done();
    });
  });

  test('creates custom url for resource action', function(assert) {
    assert.expect(2);

    this.server.post('/custom-cars/custom-fix-all', () => {
      assert.ok(true);

      return [200, {}, 'true'];
    });

    let done = assert.async();
    let model = run(() => this.owner.lookup('service:store').createRecord('car'));

    model.fixAll().then((response) => {
      assert.ok(response, true);
      done();
    });
  });

  test('creates custom url for resource action and passes adapterOptions', function(assert) {
    assert.expect(2);

    this.server.post('/custom-cars/custom-fix-all/with-hammer', () => {
      assert.ok(true);

      return [200, {}, 'true'];
    });

    let done = assert.async();
    let model = run(() => this.owner.lookup('service:store').createRecord('car'));
    let adapterOptions = { suffix: '/with-hammer' };

    model.fixAll({}, { adapterOptions }).then((response) => {
      assert.ok(response, true);
      done();
    });
  });

  test('custom data from adapter', function(assert) {
    assert.expect(2);

    this.server.patch('/cars/:id/custom-clean', (request) => {
      let data = JSON.parse(request.requestBody);

      assert.deepEqual(data, { 'custom-param': 'custom param' });
      return [200, {}, 'true'];
    });

    let done = assert.async();
    let model = run(() => this.owner.lookup('service:store').createRecord('car'));
    model.set('id', 1);

    model.clean({}, { normalizeOperation: 'dasherize' }).then((response) => {
      assert.ok(response, true);
      done();
    });
  });
});
