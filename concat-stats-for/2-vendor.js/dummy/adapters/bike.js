define('dummy/adapters/bike', ['exports', 'ember-data/adapters/json-api', 'ember-custom-actions'], function (exports, _jsonApi, _emberCustomActions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _jsonApi.default.extend(_emberCustomActions.AdapterMixin);
});