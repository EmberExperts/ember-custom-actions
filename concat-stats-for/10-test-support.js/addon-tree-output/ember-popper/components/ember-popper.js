define('ember-popper/components/ember-popper', ['exports', 'ember-popper/components/ember-popper-base', '@ember-decorators/argument/types', '@ember-decorators/argument', '@ember-decorators/argument/type'], function (exports, _emberPopperBase, _types, _argument, _type) {
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

  var _dec, _desc, _value, _class, _descriptor;

  let EmberPopper = (_dec = (0, _type.type)(_types.Element), (_class = class EmberPopper extends _emberPopperBase.default {
    constructor(...args) {
      var _temp;

      return _temp = super(...args), _initDefineProp(this, 'popperTarget', _descriptor, this), _temp;
    }

    // ================== LIFECYCLE HOOKS ==================

    init() {
      this.id = this.id || `${Ember.guidFor(this)}-popper`;

      super.init(...arguments);
    }
  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'popperTarget', [_argument.argument, _dec], {
    enumerable: true,
    initializer: function () {
      return null;
    }
  })), _class));
  exports.default = EmberPopper;
});