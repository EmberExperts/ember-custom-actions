define('ember-custom-actions/actions/custom', ['exports', 'ember-custom-actions/actions/action', 'lodash.merge'], function (exports, _action, _lodash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (id) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return function () {
      var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var actionOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      actionOptions.data = payload;

      return _action.default.create({
        id: id,
        model: this,
        integrated: true,
        options: (0, _lodash.default)({}, options, actionOptions)
      }).callAction();
    };
  };
});