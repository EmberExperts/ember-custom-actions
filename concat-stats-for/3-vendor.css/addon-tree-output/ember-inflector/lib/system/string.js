define('ember-inflector/lib/system/string', ['exports', 'ember-inflector/lib/system/inflector'], function (exports, _inflector) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.singularize = exports.pluralize = undefined;


  function pluralize() {
    var _Inflector$inflector;

    return (_Inflector$inflector = _inflector.default.inflector).pluralize.apply(_Inflector$inflector, arguments);
  }

  function singularize(word) {
    return _inflector.default.inflector.singularize(word);
  }

  exports.pluralize = pluralize;
  exports.singularize = singularize;
});