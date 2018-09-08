define('ember-bootstrap/utils/transition-end', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = waitForTransitionEnd;
  function waitForTransitionEnd(node) {
    var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (!node) {
      return Ember.RSVP.reject();
    }
    var backup = void 0;

    if (Ember.testing) {
      duration = 0;
    }

    return new Ember.RSVP.Promise(function (resolve) {
      var done = function done() {
        if (backup) {
          Ember.run.cancel(backup);
          backup = null;
        }
        node.removeEventListener('transitionend', done);
        resolve();
      };

      node.addEventListener('transitionend', done, false);
      backup = Ember.run.later(this, done, duration);
    });
  }
});