/* eslint-env node */
'use strict';

module.exports = function(environment, appConfig) {
  appConfig.emberCustomActions = {
    method: 'POST',
    ajaxOptions: {},
    adapterOptions: {},
    pushToStore: false,
    normalizeOperation: '',
    responseType: null
  };
};
