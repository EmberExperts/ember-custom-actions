define('ember-popper/components/ember-popper-targeting-parent', ['exports', 'ember-popper/components/ember-popper-base', 'ember-popper/templates/components/ember-popper-targeting-parent'], function (exports, _emberPopperBase, _emberPopperTargetingParent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

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

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var EmberPopperTargetingParent = function (_EmberPopperBase) {
    _inherits(EmberPopperTargetingParent, _EmberPopperBase);

    function EmberPopperTargetingParent() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, EmberPopperTargetingParent);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = EmberPopperTargetingParent.__proto__ || Object.getPrototypeOf(EmberPopperTargetingParent)).call.apply(_ref, [this].concat(args))), _this), _this.layout = _emberPopperTargetingParent.default, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(EmberPopperTargetingParent, [{
      key: 'init',
      value: function init() {
        this.id = this.id || Ember.guidFor(this) + '-popper';
        this._parentFinder = self.document ? self.document.createTextNode('') : '';

        _get(EmberPopperTargetingParent.prototype.__proto__ || Object.getPrototypeOf(EmberPopperTargetingParent.prototype), 'init', this).apply(this, arguments);
      }
    }, {
      key: 'didInsertElement',
      value: function didInsertElement() {
        this._initialParentNode = this._parentFinder.parentNode;

        _get(EmberPopperTargetingParent.prototype.__proto__ || Object.getPrototypeOf(EmberPopperTargetingParent.prototype), 'didInsertElement', this).apply(this, arguments);
      }
    }, {
      key: '_getPopperTarget',
      value: function _getPopperTarget() {
        return this._initialParentNode;
      }
    }]);

    return EmberPopperTargetingParent;
  }(_emberPopperBase.default);

  exports.default = EmberPopperTargetingParent;
});