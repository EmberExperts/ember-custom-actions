define('ember-custom-actions/serializers/rest', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const { RESTSerializer } = _emberData.default;

  exports.default = RESTSerializer.extend({
    init() {
      this._super(...arguments);

      Ember.deprecate('Using ember-custom-actions `RestSerializer` is no longer required and this class will be removed.', false, {
        id: 'ember-custom-actions.deprecate-jsonapi-serializer',
        until: '3.0.0'
      });
    }
  });
});