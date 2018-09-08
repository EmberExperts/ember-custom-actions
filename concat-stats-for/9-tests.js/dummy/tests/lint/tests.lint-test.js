define('dummy/tests/lint/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/bike-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/bike-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/car-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/car-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/post-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/post-test.js should pass ESLint\n\n');
  });
});