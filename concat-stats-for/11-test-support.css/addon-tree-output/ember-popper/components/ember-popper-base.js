define('ember-popper/components/ember-popper-base', ['exports', '@ember-decorators/argument/-debug/validated-component', 'ember-popper/templates/components/ember-popper', '@ember-decorators/argument/types', '@ember-decorators/object', '@ember-decorators/argument', 'ember-raf-scheduler', '@ember-decorators/component', '@ember-decorators/argument/type'], function (exports, _validatedComponent, _emberPopper, _types, _object, _argument, _emberRafScheduler, _component, _type) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9;

  const Selector = (0, _type.unionOf)('string', _types.Element);

  let EmberPopperBase = (_dec = (0, _component.tagName)(''), _dec2 = (0, _argument.argument)({ defaultIfUndefined: true }), _dec3 = (0, _type.type)('boolean'), _dec4 = (0, _argument.argument)({ defaultIfUndefined: false }), _dec5 = (0, _type.type)('boolean'), _dec6 = (0, _type.type)((0, _type.optional)('object')), _dec7 = (0, _type.type)((0, _type.optional)(Function)), _dec8 = (0, _type.type)((0, _type.optional)(Function)), _dec9 = (0, _argument.argument)({ defaultIfUndefined: true }), _dec10 = (0, _type.type)('string'), _dec11 = (0, _argument.argument)({ defaultIfUndefined: true }), _dec12 = (0, _type.type)(Selector), _dec13 = (0, _type.type)((0, _type.optional)(_types.Action)), _dec14 = (0, _argument.argument)({ defaultIfUndefined: true }), _dec15 = (0, _type.type)('boolean'), _dec16 = (0, _object.computed)('_renderInPlace', 'popperContainer'), _dec17 = (0, _object.computed)('renderInPlace'), _dec(_class = (_class2 = class EmberPopperBase extends _validatedComponent.default {
    constructor(...args) {
      var _temp;

      return _temp = super(...args), this.layout = _emberPopper.default, _initDefineProp(this, 'eventsEnabled', _descriptor, this), _initDefineProp(this, 'hidden', _descriptor2, this), _initDefineProp(this, 'modifiers', _descriptor3, this), _initDefineProp(this, 'onCreate', _descriptor4, this), _initDefineProp(this, 'onUpdate', _descriptor5, this), _initDefineProp(this, 'placement', _descriptor6, this), _initDefineProp(this, 'popperContainer', _descriptor7, this), _initDefineProp(this, 'registerAPI', _descriptor8, this), _initDefineProp(this, 'renderInPlace', _descriptor9, this), this._didRenderInPlace = false, this._eventsEnabled = null, this._initialParentNode = null, this._modifiers = null, this._onCreate = null, this._onUpdate = null, this._placement = null, this._popper = null, this._popperTarget = null, this._publicAPI = null, this._updateRAF = null, _temp;
    }

    // ================== PUBLIC CONFIG OPTIONS ==================

    /**
     * Whether event listeners, resize and scroll, for repositioning the popper are initially enabled.
     */


    /**
     * Whether the Popper element should be hidden. Use this and CSS for `[hidden]` instead of
     * an `{{if}}` if you want to animate the Popper's entry and/or exit.
     */


    /**
     * Modifiers that will be merged into the Popper instance's options hash.
     * https://popper.js.org/popper-documentation.html#Popper.DEFAULTS
     */


    /**
     * onCreate callback merged (if present) into the Popper instance's options hash.
     * https://popper.js.org/popper-documentation.html#Popper.Defaults.onCreate
     */


    /**
     * onUpdate callback merged (if present) into the Popper instance's options hash.
     * https://popper.js.org/popper-documentation.html#Popper.Defaults.onUpdate
     */


    /**
     * Placement of the popper. One of ['top', 'right', 'bottom', 'left'].
     */


    /**
     * The popper element needs to be moved higher in the DOM tree to avoid z-index issues.
     * See the block-comment in the template for more details. `.ember-application` is applied
     * to the root element of the ember app by default, so we move it up to there.
     */


    /**
     * An optional function to be called when a new target is located.
     * The target is passed in as an argument to the function.
     */


    /**
     * If `true`, the popper element will not be moved to popperContainer. WARNING: This can cause
     * z-index issues where your popper will be overlapped by DOM elements that aren't nested as
     * deeply in the DOM tree.
     */


    // ================== PRIVATE PROPERTIES ==================

    /**
     * Tracks current/previous state of `_renderInPlace`.
     */


    /**
     * Tracks current/previous value of `eventsEnabled` option
     */


    /**
     * Parent of the element on didInsertElement, before it may have been moved
     */


    /**
     * Tracks current/previous value of `modifiers` option
     */


    /**
     * Tracks current/previous value of `onCreate` callback
     */


    /**
     * Tracks current/previous value of `onUpdate` callback
     */


    /**
     * Tracks current/previous value of `placement` option
     */


    /**
     * Set in didInsertElement() once the Popper is initialized.
     * Passed to consumers via a named yield.
     */


    /**
     * Tracks current/previous value of popper target
     */


    /**
     * Public API of the popper sent to external components in `registerAPI`
     */


    /**
     * ID for the requestAnimationFrame used for updates, used to cancel
     * the RAF on component destruction
     */


    // ================== LIFECYCLE HOOKS ==================

    didRender() {
      this._updatePopper();
    }

    willDestroyElement() {
      super.willDestroyElement(...arguments);

      this._popper.destroy();
      _emberRafScheduler.scheduler.forget(this._updateRAF);
    }

    /**
     * ================== ACTIONS ==================
     */

    update() {
      this._popper.update();
    }

    scheduleUpdate() {
      if (this._updateRAF !== null) {
        return;
      }

      this._updateRAF = _emberRafScheduler.scheduler.schedule('affect', () => {
        this._updateRAF = null;
        this._popper.update();
      });
    }

    enableEventListeners() {
      this._popper.enableEventListeners();
    }

    disableEventListeners() {
      this._popper.disableEventListeners();
    }

    // ================== PRIVATE IMPLEMENTATION DETAILS ==================

    _updatePopper() {
      if (this.isDestroying || this.isDestroyed) {
        return;
      }

      const eventsEnabled = this.get('eventsEnabled');
      const modifiers = this.get('modifiers');
      const onCreate = this.get('onCreate');
      const onUpdate = this.get('onUpdate');
      const placement = this.get('placement');
      const popperTarget = this._getPopperTarget();
      const renderInPlace = this.get('_renderInPlace');

      // Compare against previous values to see if anything has changed
      const didChange = renderInPlace !== this._didRenderInPlace || popperTarget !== this._popperTarget || eventsEnabled !== this._eventsEnabled || modifiers !== this._modifiers || placement !== this._placement || onCreate !== this._onCreate || onUpdate !== this._onUpdate;

      if (didChange === true) {
        if (this._popper !== null) {
          this._popper.destroy();
        }

        const popperElement = this._getPopperElement();

        // Store current values to check against on updates
        this._didRenderInPlace = renderInPlace;
        this._eventsEnabled = eventsEnabled;
        this._modifiers = modifiers;
        this._onCreate = onCreate;
        this._onUpdate = onUpdate;
        this._placement = placement;
        this._popperTarget = popperTarget;

        const options = {
          eventsEnabled,
          modifiers,
          placement
        };

        if (onCreate) {
          (true && !(typeof onCreate === 'function') && Ember.assert('onCreate of ember-popper must be a function', typeof onCreate === 'function'));

          options.onCreate = onCreate;
        }

        if (onUpdate) {
          (true && !(typeof onUpdate === 'function') && Ember.assert('onUpdate of ember-popper must be a function', typeof onUpdate === 'function'));

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

    /**
     * Used to get the popper element
     */
    _getPopperElement() {
      return self.document.getElementById(this.id);
    }

    _getPopperTarget() {
      return this.get('popperTarget');
    }

    _getPublicAPI() {
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

    get _popperContainer() {
      const renderInPlace = this.get('_renderInPlace');
      const maybeContainer = this.get('popperContainer');

      let popperContainer;

      if (renderInPlace) {
        popperContainer = this._initialParentNode;
      } else if (maybeContainer instanceof _types.Element) {
        popperContainer = maybeContainer;
      } else if (typeof maybeContainer === 'string') {
        const selector = maybeContainer;
        const possibleContainers = self.document.querySelectorAll(selector);

        (true && !(possibleContainers.length === 1) && Ember.assert(`ember-popper with popperContainer selector "${selector}" found ` + `${possibleContainers.length} possible containers when there should be exactly 1`, possibleContainers.length === 1));


        popperContainer = possibleContainers[0];
      }

      return popperContainer;
    }

    get _renderInPlace() {
      // self.document is undefined in Fastboot, so we have to render in
      // place for the popper to show up at all.
      return self.document ? !!this.get('renderInPlace') : true;
    }
  }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'eventsEnabled', [_dec2, _dec3], {
    enumerable: true,
    initializer: function () {
      return true;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'hidden', [_dec4, _dec5], {
    enumerable: true,
    initializer: function () {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'modifiers', [_argument.argument, _dec6], {
    enumerable: true,
    initializer: function () {
      return null;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'onCreate', [_argument.argument, _dec7], {
    enumerable: true,
    initializer: function () {
      return null;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'onUpdate', [_argument.argument, _dec8], {
    enumerable: true,
    initializer: function () {
      return null;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'placement', [_dec9, _dec10], {
    enumerable: true,
    initializer: function () {
      return 'bottom';
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'popperContainer', [_dec11, _dec12], {
    enumerable: true,
    initializer: function () {
      return '.ember-application';
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'registerAPI', [_argument.argument, _dec13], {
    enumerable: true,
    initializer: function () {
      return null;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'renderInPlace', [_dec14, _dec15], {
    enumerable: true,
    initializer: function () {
      return false;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, 'update', [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'update'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'scheduleUpdate', [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'scheduleUpdate'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'enableEventListeners', [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'enableEventListeners'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'disableEventListeners', [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'disableEventListeners'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_popperContainer', [_dec16], Object.getOwnPropertyDescriptor(_class2.prototype, '_popperContainer'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_renderInPlace', [_dec17], Object.getOwnPropertyDescriptor(_class2.prototype, '_renderInPlace'), _class2.prototype)), _class2)) || _class);
  exports.default = EmberPopperBase;
});