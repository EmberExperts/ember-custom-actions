define('ember-resolver/utils/make-dictionary', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = makeDictionary;
  function makeDictionary() {
    let cache = Object.create(null);
    cache['_dict'] = null;
    delete cache['_dict'];
    return cache;
  }
});