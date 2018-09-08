define('ember-inflector/lib/helpers/pluralize', ['exports', 'ember-inflector', 'ember-inflector/lib/utils/make-helper'], function (exports, _emberInflector, _makeHelper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _makeHelper.default)(function (params, hash) {
    let fullParams = new Array(...params);

    if (fullParams.length === 2) {
      fullParams.push({ withoutCount: hash["without-count"] });
    }

    return (0, _emberInflector.pluralize)(...fullParams);
  });
});