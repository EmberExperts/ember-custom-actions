define('dummy/models/bridge', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-custom-actions'], function (exports, _model, _attr, _emberCustomActions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    name: (0, _attr.default)(),
    burnAll: (0, _emberCustomActions.resourceAction)('burn', { method: 'GET' })
  });
});