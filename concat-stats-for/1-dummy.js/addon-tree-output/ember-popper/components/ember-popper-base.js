define('ember-popper/components/ember-popper-base', ['exports', 'ember-popper/templates/components/ember-popper', '@ember-decorators/object', '@ember-decorators/argument', 'ember-raf-scheduler', '@ember-decorators/component'], function (exports, _emberPopper, _object, _argument, _emberRafScheduler, _component) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

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

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9;

  var EmberPopperBase = (_dec = (0, _component.tagName)(''), _dec2 = (0, _argument.argument)({ defaultIfUndefined: true }), _dec3 = (0, _argument.argument)({ defaultIfUndefined: false }), _dec4 = (0, _argument.argument)({ defaultIfUndefined: true }), _dec5 = (0, _argument.argument)({ defaultIfUndefined: true }), _dec6 = (0, _argument.argument)({ defaultIfUndefined: true }), _dec7 = (0, _object.computed)('_renderInPlace', 'popperContainer'), _dec8 = (0, _object.computed)('renderInPlace'), _dec(_class = (_class2 = function (_EmberComponent) {
    _inherits(EmberPopperBase, _EmberComponent);

    function EmberPopperBase() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, EmberPopperBase);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = EmberPopperBase.__proto__ || Object.getPrototypeOf(EmberPopperBase)).call.apply(_ref, [this].concat(args))), _this), _this.layout = _emberPopper.default, _initDefineProp(_this, 'eventsEnabled', _descriptor, _this), _initDefineProp(_this, 'hidden', _descriptor2, _this), _initDefineProp(_this, 'modifiers', _descriptor3, _this), _initDefineProp(_this, 'onCreate', _descriptor4, _this), _initDefineProp(_this, 'onUpdate', _descriptor5, _this), _initDefineProp(_this, 'placement', _descriptor6, _this), _initDefineProp(_this, 'popperContainer', _descriptor7, _this), _initDefineProp(_this, 'registerAPI', _descriptor8, _this), _initDefineProp(_this, 'renderInPlace', _descriptor9, _this), _this._didRenderInPlace = false, _this._eventsEnabled = null, _this._initialParentNode = null, _this._modifiers = null, _this._onCreate = null, _this._onUpdate = null, _this._placement = null, _this._popper = null, _this._popperTarget = null, _this._publicAPI = null, _this._updateRAF = null, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(EmberPopperBase, [{
      key: 'didRender',
      value: function didRender() {
        this._updatePopper();
      }
    }, {
      key: 'willDestroyElement',
      value: function willDestroyElement() {
        _get(EmberPopperBase.prototype.__proto__ || Object.getPrototypeOf(EmberPopperBase.prototype), 'willDestroyElement', this).apply(this, arguments);

        this._popper.destroy();
        _emberRafScheduler.scheduler.forget(this._updateRAF);
      }
    }, {
      key: 'update',
      value: function update() {
        this._popper.update();
      }
    }, {
      key: 'scheduleUpdate',
      value: function scheduleUpdate() {
        var _this2 = this;

        if (this._updateRAF !== null) {
          return;
        }

        this._updateRAF = _emberRafScheduler.scheduler.schedule('affect', function () {
          _this2._updateRAF = null;
          _this2._popper.update();
        });
      }
    }, {
      key: 'enableEventListeners',
      value: function enableEventListeners() {
        this._popper.enableEventListeners();
      }
    }, {
      key: 'disableEventListeners',
      value: function disableEventListeners() {
        this._popper.disableEventListeners();
      }
    }, {
      key: '_updatePopper',
      value: function _updatePopper() {
        if (this.isDestroying || this.isDestroyed) {
          return;
        }

        var eventsEnabled = this.get('eventsEnabled');
        var modifiers = this.get('modifiers');
        var onCreate = this.get('onCreate');
        var onUpdate = this.get('onUpdate');
        var placement = this.get('placement');
        var popperTarget = this._getPopperTarget();
        var renderInPlace = this.get('_renderInPlace');

        // Compare against previous values to see if anything has changed
        var didChange = renderInPlace !== this._didRenderInPlace || popperTarget !== this._popperTarget || eventsEnabled !== this._eventsEnabled || modifiers !== this._modifiers || placement !== this._placement || onCreate !== this._onCreate || onUpdate !== this._onUpdate;

        if (didChange === true) {
          if (this._popper !== null) {
            this._popper.destroy();
          }

          var popperElement = this._getPopperElement();

          // Store current values to check against on updates
          this._didRenderInPlace = renderInPlace;
          this._eventsEnabled = eventsEnabled;
          this._modifiers = modifiers;
          this._onCreate = onCreate;
          this._onUpdate = onUpdate;
          this._placement = placement;
          this._popperTarget = popperTarget;

          var options = {
            eventsEnabled: eventsEnabled,
            modifiers: modifiers,
            placement: placement
          };

          if (onCreate) {
            (false && !(typeof onCreate === 'function') && Ember.assert('onCreate of ember-popper must be a function', typeof onCreate === 'function'));

            options.onCreate = onCreate;
          }

          if (onUpdate) {
            (false && !(typeof onUpdate === 'function') && Ember.assert('onUpdate of ember-popper must be a function', typeof onUpdate === 'function'));

            options.onUpdate = onUpdate;
          }

          this._popper = new Popper(popperTarget, popperElement, options);

          // Execute the registerAPI hook last to ensure the Popper is initialized on the target
          if (this.get('registerAPI') !== null) {
            /* eslint-disable ember/closure-actions */
            this.sendAction('registerAPI', this._getPublicAPI());
          }
        }
      }
    }, {
      key: '_getPopperElement',
      value: function _getPopperElement() {
        return self.document.getElementById(this.id);
      }
    }, {
      key: '_getPopperTarget',
      value: function _getPopperTarget() {
        return this.get('popperTarget');
      }
    }, {
      key: '_getPublicAPI',
      value: function _getPublicAPI() {
        if (this._publicAPI === null) {
          // bootstrap the public API with fields that are guaranteed to be static,
          // such as imperative actions
          this._publicAPI = {
            disableEventListeners: this.disableEventListeners.bind(this),
            enableEventListeners: this.enableEventListeners.bind(this),
            scheduleUpdate: this.scheduleUpdate.bind(this),
            update: this.update.bind(this)
          };
        }

        this._publicAPI.popperElement = this._getPopperElement();
        this._publicAPI.popperTarget = this._popperTarget;

        return this._publicAPI;
      }
    }, {
      key: '_popperContainer',
      get: function get() {
        var renderInPlace = this.get('_renderInPlace');
        var maybeContainer = this.get('popperContainer');

        var popperContainer = void 0;

        if (renderInPlace) {
          popperContainer = this._initialParentNode;
        } else if (maybeContainer instanceof Element) {
          popperContainer = maybeContainer;
        } else if (typeof maybeContainer === 'string') {
          var selector = maybeContainer;
          var possibleContainers = self.document.querySelectorAll(selector);

          (false && !(possibleContainers.length === 1) && Ember.assert('ember-popper with popperContainer selector "' + selector + '" found ' + (possibleContainers.length + ' possible containers when there should be exactly 1'), possibleContainers.length === 1));


          popperContainer = possibleContainers[0];
        }

        return popperContainer;
      }
    }, {
      key: '_renderInPlace',
      get: function get() {
        // self.document is undefined in Fastboot, so we have to render in
        // place for the popper to show up at all.
        return self.document ? !!this.get('renderInPlace') : true;
      }
    }]);

    return EmberPopperBase;
  }(Ember.Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'eventsEnabled', [_dec2], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'hidden', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'modifiers', [_argument.argument], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'onCreate', [_argument.argument], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'onUpdate', [_argument.argument], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'placement', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return 'bottom';
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'popperContainer', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return '.ember-application';
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'registerAPI', [_argument.argument], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'renderInPlace', [_dec6], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, 'update', [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'update'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'scheduleUpdate', [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'scheduleUpdate'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'enableEventListeners', [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'enableEventListeners'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'disableEventListeners', [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'disableEventListeners'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_popperContainer', [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, '_popperContainer'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_renderInPlace', [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, '_renderInPlace'), _class2.prototype)), _class2)) || _class);
  exports.default = EmberPopperBase;
});