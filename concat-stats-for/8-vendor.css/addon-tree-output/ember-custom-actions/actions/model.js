define('ember-custom-actions/actions/model', ['exports', 'ember-custom-actions/actions/action', 'lodash.merge'], function (exports, _action, _lodash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (path, options = {}) {
    return function (payload = {}, actionOptions = {}) {
      actionOptions.data = payload;

      return _action.default.create({
        id: path,
        model: this,
        instance: true,
        options: (0, _lodash.default)({}, options, actionOptions)
      }).callAction();
    };
  };
});