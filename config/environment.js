/* eslint-env node */
'use strict';

module.exports = function(environment, appConfig) {
  appConfig.emberCustomActions = {
    method: 'POST',
    data: {},
    headers: {},
    ajaxOptions: {},
    adapterOptions: {},
    pushToStore: false,
    responseType: null,
    normalizeOperation: ''
  };
};
