define('ember-custom-actions/serializers/json-api', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var JSONAPISerializer = _emberData.default.JSONAPISerializer;
  exports.default = JSONAPISerializer.extend({
    init: function init() {
      this._super.apply(this, arguments);

      Ember.deprecate('Using ember-custom-actions `JSONAPISerializer` is no longer required and this class will be removed.', false, {
        id: 'ember-custom-actions.deprecate-jsonapi-serializer',
        until: '3.0.0'
      });
    }
  });
});