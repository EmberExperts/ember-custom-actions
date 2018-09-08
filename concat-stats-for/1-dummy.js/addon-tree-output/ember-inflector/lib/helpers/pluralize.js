define('ember-inflector/lib/helpers/pluralize', ['exports', 'ember-inflector', 'ember-inflector/lib/utils/make-helper'], function (exports, _emberInflector, _makeHelper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  exports.default = (0, _makeHelper.default)(function (params, hash) {
    var fullParams = new (Function.prototype.bind.apply(Array, [null].concat(_toConsumableArray(params))))();

    if (fullParams.length === 2) {
      fullParams.push({ withoutCount: hash["without-count"] });
    }

    return _emberInflector.pluralize.apply(undefined, _toConsumableArray(fullParams));
  });
});