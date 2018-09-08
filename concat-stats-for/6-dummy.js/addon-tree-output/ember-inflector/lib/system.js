define("ember-inflector/lib/system", ["exports", "ember-inflector/lib/system/inflector", "ember-inflector/lib/system/string", "ember-inflector/lib/system/inflections"], function (exports, _inflector, _string, _inflections) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.defaultRules = exports.pluralize = exports.singularize = exports.Inflector = undefined;


  _inflector.default.inflector = new _inflector.default(_inflections.default);

  exports.Inflector = _inflector.default;
  exports.singularize = _string.singularize;
  exports.pluralize = _string.pluralize;
  exports.defaultRules = _inflections.default;
});