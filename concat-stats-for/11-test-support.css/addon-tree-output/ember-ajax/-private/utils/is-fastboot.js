define('ember-ajax/-private/utils/is-fastboot', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /* global FastBoot */
  const isFastBoot = typeof FastBoot !== 'undefined';
  exports.default = isFastBoot;
});