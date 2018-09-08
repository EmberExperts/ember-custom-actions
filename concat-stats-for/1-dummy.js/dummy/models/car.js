define('dummy/models/car', ['exports', 'ember-data/model', 'ember-custom-actions'], function (exports, _model, _emberCustomActions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    drive: (0, _emberCustomActions.customAction)('drive'),
    clean: (0, _emberCustomActions.customAction)('clean'),
    fix: (0, _emberCustomActions.customAction)('fix'),

    moveAll: (0, _emberCustomActions.customAction)('move-all'),
    cleanAll: (0, _emberCustomActions.customAction)('clean-all'),
    fixAll: (0, _emberCustomActions.customAction)('fixAll')
  });
});