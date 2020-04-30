'use strict';

module.exports = {
  name: require('./package').name,

  importTransforms: require('ember-cli-cjs-transform').importTransforms,

  included() {
    this._super.included.apply(this, arguments);

    this.import('node_modules/lodash.merge/index.js', {
      using: [
        { transformation: 'cjs', as: 'lodash.merge' }
      ]
    });
  },
};
