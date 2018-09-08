define('ember-cli-app-version/initializer-factory', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = initializerFactory;


  const {
    libraries
  } = Ember;

  function initializerFactory(name, version) {
    let registered = false;

    return function () {
      if (!registered && name && version) {
        let appName = Ember.String.classify(name);
        libraries.register(appName, version);
        registered = true;
      }
    };
  }
});