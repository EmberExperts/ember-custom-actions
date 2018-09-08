define('ember-inflector/index', ['exports', 'ember-inflector/lib/system', 'ember-inflector/lib/ext/string'], function (exports, _system) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.defaultRules = exports.singularize = exports.pluralize = undefined;


  _system.Inflector.defaultRules = _system.defaultRules;

  Object.defineProperty(Ember, 'Inflector', {
    get: function get() {
      Ember.deprecate('Ember.Inflector is deprecated. Please explicitly: import Inflector from \'ember-inflector\';', false, {
        id: 'ember-inflector.globals',
        until: '3.0.0'
      });

      return _system.Inflector;
    }
  });

  Object.defineProperty(Ember.String, 'singularize', {
    get: function get() {
      Ember.deprecate('Ember.String.singularize() is deprecated. Please explicitly: import { singularize } from \'ember-inflector\';', false, {
        id: 'ember-inflector.globals',
        until: '3.0.0'
      });

      return _system.singularize;
    }
  });

  Object.defineProperty(Ember.String, 'pluralize', {
    get: function get() {
      Ember.deprecate('Ember.String.pluralize() is deprecated. Please explicitly: import { pluralize } from \'ember-inflector\';', false, {
        id: 'ember-inflector.globals',
        until: '3.0.0'
      });

      return _system.pluralize;
    }
  });

  exports.default = _system.Inflector;
  exports.pluralize = _system.pluralize;
  exports.singularize = _system.singularize;
  exports.defaultRules = _system.defaultRules;
});