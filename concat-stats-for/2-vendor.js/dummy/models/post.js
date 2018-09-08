define('dummy/models/post', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-custom-actions'], function (exports, _model, _attr, _emberCustomActions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    name: (0, _attr.default)(),
    published: (0, _attr.default)('boolean', { defaultValue: false }),

    publish: (0, _emberCustomActions.modelAction)('publish', { responseType: 'object' }),
    list: (0, _emberCustomActions.resourceAction)('list'),
    search: (0, _emberCustomActions.resourceAction)('search', {
      method: 'GET',
      normalizeOperation: 'dasherize',
      queryParams: { showAll: true },
      headers: { testHeader: 'ok' }
    })
  });
});