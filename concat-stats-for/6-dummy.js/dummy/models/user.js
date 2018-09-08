define('dummy/models/user', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-custom-actions'], function (exports, _model, _attr, _emberCustomActions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    name: (0, _attr.default)(),

    profile: (0, _emberCustomActions.modelAction)('profile', { responseType: 'object', method: 'get' })
  });
});