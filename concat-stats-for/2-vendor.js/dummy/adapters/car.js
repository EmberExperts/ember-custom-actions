define('dummy/adapters/car', ['exports', 'ember-data/adapters/json-api', 'ember-custom-actions'], function (exports, _jsonApi, _emberCustomActions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _jsonApi.default.extend(_emberCustomActions.AdapterMixin, {
    urlForCustomAction: function urlForCustomAction(modelName, id, snapshot, requestType) {
      var suffix = snapshot.adapterOptions.suffix;

      suffix = suffix || '';

      if (requestType === 'clean') {
        var baseUrl = this.buildURL(modelName, id, snapshot, requestType);
        return baseUrl + '/custom-clean';
      } else if (requestType === 'fix') {
        return '/custom-cars/' + id + '/custom-fix' + suffix;
      } else if (requestType === 'clean-all') {
        var _baseUrl = this.buildURL(modelName, id, snapshot, requestType);
        return _baseUrl + '/custom-clean-all';
      } else if (requestType === 'fixAll') {
        return '/custom-cars/custom-fix-all' + suffix;
      }

      return this._super.apply(this, arguments);
    },
    methodForCustomAction: function methodForCustomAction(_ref) {
      var actionId = _ref.actionId;

      if (actionId === 'clean') {
        return 'PATCH';
      }

      return this._super.apply(this, arguments);
    },
    headersForCustomAction: function headersForCustomAction(_ref2) {
      var actionId = _ref2.actionId;

      if (actionId === 'clean') {
        return {
          myHeader: 'custom header'
        };
      }

      return this._super.apply(this, arguments);
    },
    dataForCustomAction: function dataForCustomAction(_ref3) {
      var actionId = _ref3.actionId;

      if (actionId === 'clean') {
        return {
          customParam: 'custom param'
        };
      }

      return this._super.apply(this, arguments);
    }
  });
});