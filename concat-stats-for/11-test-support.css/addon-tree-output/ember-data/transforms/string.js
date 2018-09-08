define('ember-data/transforms/string', ['exports', 'ember-data/transforms/transform'], function (exports, _transform) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _transform.default.extend({
    deserialize(serialized) {
      return Ember.isNone(serialized) ? null : String(serialized);
    },
    serialize(deserialized) {
      return Ember.isNone(deserialized) ? null : String(deserialized);
    }
  });
});