define('ember-bootstrap/utils/transition-end', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = waitForTransitionEnd;
  function waitForTransitionEnd(node, duration = 0) {
    if (!node) {
      return Ember.RSVP.reject();
    }
    let backup;

    if (Ember.testing) {
      duration = 0;
    }

    return new Ember.RSVP.Promise(function (resolve) {
      let done = function () {
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