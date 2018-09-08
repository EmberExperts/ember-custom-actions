define("ember-initials/utils/color-index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (seedText, colorsLength) {
    var code = hashCode(seedText);
    return Math.abs(Math.floor(code % colorsLength));
  };

  // Private

  function hashCode(string) {
    var hash = 0;

    if (string && string.length > 0) {
      for (var i = 0; i < string.length; i++) {
        var char = string.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
      }
    }

    return hash & hash;
  }
});