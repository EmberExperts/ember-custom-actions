define('ember-data/transforms/boolean', ['exports', 'ember-data/transforms/transform'], function (exports, _transform) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _transform.default.extend({
    deserialize(serialized, options) {
      if (Ember.isNone(serialized) && options.allowNull === true) {
        return null;
      }

      var type = typeof serialized;
      if (type === 'boolean') {
        return serialized;
      } else if (type === 'string') {
        return (/^(true|t|1)$/i.test(serialized)
        );
      } else if (type === 'number') {
        return serialized === 1;
      } else {
        return false;
      }
    },

    serialize(deserialized, options) {
      if (Ember.isNone(deserialized) && options.allowNull === true) {
        return null;
      }

      return Boolean(deserialized);
    }
  });
});