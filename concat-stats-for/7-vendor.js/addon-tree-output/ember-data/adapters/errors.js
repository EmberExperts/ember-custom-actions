define('ember-data/adapters/errors', ['exports', 'ember-data/-private'], function (exports, _private) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'AdapterError', {
    enumerable: true,
    get: function () {
      return _private.AdapterError;
    }
  });
  Object.defineProperty(exports, 'InvalidError', {
    enumerable: true,
    get: function () {
      return _private.InvalidError;
    }
  });
  Object.defineProperty(exports, 'UnauthorizedError', {
    enumerable: true,
    get: function () {
      return _private.UnauthorizedError;
    }
  });
  Object.defineProperty(exports, 'ForbiddenError', {
    enumerable: true,
    get: function () {
      return _private.ForbiddenError;
    }
  });
  Object.defineProperty(exports, 'NotFoundError', {
    enumerable: true,
    get: function () {
      return _private.NotFoundError;
    }
  });
  Object.defineProperty(exports, 'ConflictError', {
    enumerable: true,
    get: function () {
      return _private.ConflictError;
    }
  });
  Object.defineProperty(exports, 'ServerError', {
    enumerable: true,
    get: function () {
      return _private.ServerError;
    }
  });
  Object.defineProperty(exports, 'TimeoutError', {
    enumerable: true,
    get: function () {
      return _private.TimeoutError;
    }
  });
  Object.defineProperty(exports, 'AbortError', {
    enumerable: true,
    get: function () {
      return _private.AbortError;
    }
  });
  Object.defineProperty(exports, 'errorsHashToArray', {
    enumerable: true,
    get: function () {
      return _private.errorsHashToArray;
    }
  });
  Object.defineProperty(exports, 'errorsArrayToHash', {
    enumerable: true,
    get: function () {
      return _private.errorsArrayToHash;
    }
  });
});