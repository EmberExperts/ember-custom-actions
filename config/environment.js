/* eslint-env node */
'use strict';

module.exports = function(environment, appConfig) {
  appConfig.emberCustomActions = {
    method: 'POST',
    headers: {},
    ajaxOptions: {},
    adapterOptions: {},
    pushToStore: false,
    responseType: null,
    normalizeOperation: ''
  };
};
