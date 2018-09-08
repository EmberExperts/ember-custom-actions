define('ember-data/transforms/date', ['exports', 'ember-data/transforms/transform'], function (exports, _transform) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _transform.default.extend({
    deserialize(serialized) {
      var type = typeof serialized;

      if (type === 'string') {
        var offset = serialized.indexOf('+');

        if (offset !== -1 && serialized.length - 5 === offset) {
          offset += 3;
          return new Date(serialized.slice(0, offset) + ':' + serialized.slice(offset));
        }
        return new Date(serialized);
      } else if (type === 'number') {
        return new Date(serialized);
      } else if (serialized === null || serialized === undefined) {
        // if the value is null return null
        // if the value is not present in the data return undefined
        return serialized;
      } else {
        return null;
      }
    },

    serialize(date) {
      if (date instanceof Date && !isNaN(date)) {
        return date.toISOString();
      } else {
        return null;
      }
    }
  });
});