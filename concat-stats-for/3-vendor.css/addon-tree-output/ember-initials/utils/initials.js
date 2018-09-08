define('ember-initials/utils/initials', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var initials = name ? name.trim() : '';
    var letters = initials.split(' ');

    if (letters.length > 1) {
      var first = capitalizedFirstLetter(letters.shift());
      var last = capitalizedFirstLetter(letters.pop());
      initials = first + last;
    } else if (letters.length === 1) {
      initials = capitalizedFirstLetter(letters.shift());
    }

    return initials;
  };

  // Private

  function capitalizedFirstLetter(word) {
    return word ? word[0].toUpperCase() : '';
  }
});