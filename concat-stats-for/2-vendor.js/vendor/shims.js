(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function() {
  function makeShim(name, globalName) {
    define(name, ['exports'], function(exports) {
      'use strict';

      exports.__esModule = true;
      var globalParts = globalName.split('.');
      var globalValue = window[globalParts[0]];

      for (var i = 1; i < globalParts.length; i++) {
        globalValue = globalValue[globalParts[i]];
      }

        exports.default = globalValue;
    });
  }

  makeShim('ember-computed', 'Ember.computed');
  makeShim('ember-metal/get', 'Ember.get');
})();
