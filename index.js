'use strict';

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);

    this.import('node_modules/lodash.merge/index.js', {
      using: [
        { transformation: 'cjs', as: 'lodash.merge' }
      ]
    });

    this.import('node_modules/jquery-param/jquery-param.js', {
      using: [
        { transformation: 'amd', as: 'jquery-param' }
      ]
    });
  },
};
