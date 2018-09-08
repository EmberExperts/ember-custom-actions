define('ember-custom-actions/actions/resource', ['exports', 'ember-custom-actions/actions/action', 'lodash.merge'], function (exports, _action, _lodash) {
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
        options: (0, _lodash.default)({}, options, actionOptions)
      }).callAction();
    };
  };
});