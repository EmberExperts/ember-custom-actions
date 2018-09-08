define('ember-initials/utils/generators/base', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = class {
    constructor() {
      this._implement(this.revoke, 'revoke');
      this._implement(this.generate, 'generate');
    }

    _implement(fn, name) {
      if (typeof fn !== "function" || fn.length !== 1) {
        throw `Base Generator: '${name}' function has to be implemented with exactly one argument!`;
      }
    }
  };
});