define('ember-initials/utils/generators/svg', ['exports', 'ember-initials/utils/generators/base'], function (exports, _base) {
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

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

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

  var _class = function (_Base) {
    _inherits(_class, _Base);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'revoke',
      value: function revoke(url) {
        URL.revokeObjectURL(url);
      }
    }, {
      key: 'generate',
      value: function generate(properties) {
        var textElement = this._generateTextElement(properties.initials, properties.initialsColor, properties.textStyles);
        var svgElement = this._generateSvgElement(textElement, properties.width, properties.height, properties.backgroundStyles);
        var blob = new Blob([svgElement], { type: "image/svg+xml" });

        return URL.createObjectURL(blob);
      }
    }, {
      key: '_generateTextElement',
      value: function _generateTextElement(text, color) {
        var styles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        return this._generateElement('text', text, styles, {
          y: '50%',
          x: '50%',
          dy: '0.35em',
          'text-anchor': 'middle',
          'pointer-events': 'auto',
          fill: color
        });
      }
    }, {
      key: '_generateSvgElement',
      value: function _generateSvgElement(text, width, height) {
        var styles = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        return this._generateElement('svg', text, styles, {
          width: width,
          height: height,
          xmlns: 'http://www.w3.org/2000/svg',
          'pointer-events': 'none',
          'viewBox': '0 0 100 100'
        });
      }
    }, {
      key: '_generateElement',
      value: function _generateElement(name) {
        var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var styles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var attrs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        var attrsString = this._transformObject(attrs, function (key) {
          return key + '="' + attrs[key] + '"';
        });
        var stylesString = this._transformObject(styles, function (key) {
          return key + ': ' + styles[key] + ';';
        });

        return '<' + name + ' ' + attrsString + ' style="' + stylesString + '">' + content + '</' + name + '>';
      }
    }, {
      key: '_transformObject',
      value: function _transformObject(object) {
        var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

        return Object.keys(object).map(function (key) {
          return transform(key);
        }).join(' ');
      }
    }]);

    return _class;
  }(_base.default);

  exports.default = _class;
});