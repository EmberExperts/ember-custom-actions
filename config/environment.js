'use strict';

module.exports = function(environment, appConfig) {
  appConfig.emberCustomActions = {
    method: 'POST',
    data: {},
    headers: {},
    queryParams: {},
    ajaxOptions: {},
    adapterOptions: {},
    pushToStore: false,
    responseType: null,
    normalizeOperation: ''
  };
};
