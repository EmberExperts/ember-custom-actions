define('ember-custom-actions/index', ['exports', 'ember-custom-actions/actions/resource', 'ember-custom-actions/actions/model', 'ember-custom-actions/actions/custom', 'ember-custom-actions/serializers/json-api', 'ember-custom-actions/serializers/rest', 'ember-custom-actions/mixins/adapter'], function (exports, _resource, _model, _custom, _jsonApi, _rest, _adapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.JSONAPISerializer = exports.RESTSerializer = exports.AdapterMixin = exports.resourceAction = exports.customAction = exports.modelAction = undefined;
  exports.modelAction = _model.default;
  exports.customAction = _custom.default;
  exports.resourceAction = _resource.default;
  exports.AdapterMixin = _adapter.default;
  exports.RESTSerializer = _rest.default;
  exports.JSONAPISerializer = _jsonApi.default;
});