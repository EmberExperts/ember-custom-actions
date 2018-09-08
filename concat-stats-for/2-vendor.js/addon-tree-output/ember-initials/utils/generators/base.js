define('ember-initials/utils/generators/base', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _class = function () {
    function _class() {
      _classCallCheck(this, _class);

      this._implement(this.revoke, 'revoke');
      this._implement(this.generate, 'generate');
    }

    _createClass(_class, [{
      key: '_implement',
      value: function _implement(fn, name) {
        if (typeof fn !== "function" || fn.length !== 1) {
          throw 'Base Generator: \'' + name + '\' function has to be implemented with exactly one argument!';
        }
      }
    }]);

    return _class;
  }();

  exports.default = _class;
});