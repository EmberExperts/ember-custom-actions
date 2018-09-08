define('@ember-decorators/argument/-debug/utils/validation-decorator', ['exports', '@ember-decorators/argument/-debug/utils/computed', '@ember-decorators/argument/-debug/utils/object', '@ember-decorators/argument/-debug/utils/validations-for', '@ember-decorators/argument/-debug/errors'], function (exports, _computed, _object, _validationsFor, _errors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = validationDecorator;
  /* globals requireModule */
  const notifyPropertyChange = Ember.notifyPropertyChange || Ember.propertyDidChange;

  function guardBind(fn, ...args) {
    if (typeof fn === 'function') {
      return fn.bind(...args);
    }
  }

  class ValidatedProperty {
    constructor({ originalValue, klass, keyName, isImmutable, typeValidators }) {
      this.isDescriptor = true;

      this.klass = klass;
      this.originalValue = originalValue;
      this.isImmutable = isImmutable;
      this.typeValidators = typeValidators;

      runValidators(typeValidators, klass, keyName, originalValue, 'init');
    }

    get(obj, keyName) {
      let {
        klass,
        originalValue,
        isImmutable,
        typeValidators
      } = this;

      let newValue = this._get(obj, keyName);

      if (isImmutable && newValue !== originalValue) {
        throw new _errors.MutabilityError(`Immutable value ${klass.name}#${keyName} changed by underlying computed, original value: ${originalValue}, new value: ${newValue}`);
      }

      if (typeValidators.length > 0) {
        runValidators(typeValidators, klass, keyName, newValue, 'get');
      }

      return newValue;
    }

    set(obj, keyName, value) {
      let {
        klass,
        isImmutable,
        typeValidators
      } = this;

      if (isImmutable) {
        throw new _errors.MutabilityError(`Attempted to set ${klass.name}#${keyName} to the value ${value} but the field is immutable`);
      }

      let newValue = this._set(obj, keyName, value);

      if (typeValidators.length > 0) {
        runValidators(typeValidators, klass, keyName, newValue, 'set');
      }

      return newValue;
    }
  }

  class StandardValidatedProperty extends ValidatedProperty {
    constructor({ originalValue }) {
      super(...arguments);

      this.cachedValue = originalValue;
    }

    _get() {
      return this.cachedValue;
    }

    _set(obj, keyName, value) {
      if (value === this.cachedValue) return value;

      this.cachedValue = value;

      notifyPropertyChange(obj, keyName);

      return this.cachedValue;
    }
  }

  class NativeComputedValidatedProperty extends ValidatedProperty {
    constructor({ desc }) {
      super(...arguments);

      this.desc = desc;
    }

    _get(obj) {
      return this.desc.get.call(obj);
    }

    _set(obj, keyName, value) {
      // By default Ember.get will check to see if the value has changed before setting
      // and calling propertyDidChange. In order to not change behavior, we must do the same
      let currentValue = this._get(obj);

      if (value === currentValue) return value;

      this.desc.set.call(obj, value);

      notifyPropertyChange(obj, keyName);

      return this._get(obj);
    }
  }

  class ComputedValidatedProperty extends ValidatedProperty {
    constructor({ desc }) {
      super(...arguments);

      this.desc = desc;

      this.setup = guardBind(desc.setup, desc);
      this.teardown = guardBind(desc.teardown, desc);
      this.willChange = guardBind(desc.willChange, desc);
      this.didChange = guardBind(desc.didChange, desc);
      this.willWatch = guardBind(desc.willWatch, desc);
      this.didUnwatch = guardBind(desc.didUnwatch, desc);
    }

    _get(obj, keyName) {
      return this.desc.get(obj, keyName);
    }

    _set(obj, keyName, value) {
      if (true) {
        return this.desc.set(obj, keyName, value);
      }

      this.desc.set(obj, keyName, value);

      let { cache } = Ember.meta(obj);

      return typeof cache === 'object' ? cache[keyName] : value;
    }
  }

  function runValidators(validators, klass, key, value, phase) {
    validators.forEach(validator => {
      if (validator(value) === false) {
        let formattedValue = typeof value === 'string' ? `'${value}'` : value;
        throw new _errors.TypeError(`${klass.name}#${key} expected value of type ${validator} during '${phase}', but received: ${formattedValue}`);
      }
    });
  }

  function wrapField(klass, instance, validations, keyName) {
    const {
      isImmutable,
      isRequired,
      typeValidators,
      typeRequired
    } = validations[keyName];

    if (isRequired && instance[keyName] === undefined && !instance.hasOwnProperty(keyName)) {
      throw new _errors.RequiredFieldError(`${klass.name}#${keyName} is a required value, but was not provided. You can provide it as an argument, as a class field, or in the constructor`);
    }

    // opt out early if no further validations
    if (!isImmutable && typeValidators.length === 0) {
      if (typeValidators.length === 0 && typeRequired) {
        throw new _errors.TypeError(`${klass.name}#${keyName} requires a type, add one using the @type decorator`);
      }

      return;
    }

    let originalValue = instance[keyName];
    let meta = Ember.meta(instance);

    if (true) {
      let possibleDesc = meta.peekDescriptors(keyName);

      if (possibleDesc !== undefined) {
        originalValue = possibleDesc;
      }
    }

    if ((0, _computed.isDescriptorTrap)(originalValue)) {
      originalValue = originalValue.__DESCRIPTOR__;
    }

    let validatedProperty;

    if ((0, _computed.isDescriptor)(originalValue)) {
      let desc = originalValue;

      originalValue = desc.get(instance, keyName);

      validatedProperty = new ComputedValidatedProperty({
        desc, isImmutable, keyName, klass, originalValue, typeValidators
      });
    } else {
      let desc = (0, _object.getPropertyDescriptor)(instance, keyName);

      if ((typeof desc.get === 'function' || typeof desc.set === 'function') && !(0, _computed.isMandatorySetter)(desc.set)) {
        validatedProperty = new NativeComputedValidatedProperty({
          desc, isImmutable, keyName, klass, originalValue, typeValidators
        });
      } else {
        validatedProperty = new StandardValidatedProperty({
          isImmutable, keyName, klass, originalValue, typeValidators
        });
      }
    }

    if (true) {
      // We're trying to fly under the radar here, so don't use Ember.defineProperty.
      // Ember should think the property is completely unchanged.
      Object.defineProperty(instance, keyName, {
        configurable: true,
        enumerable: true,
        get() {
          return validatedProperty.get(this, keyName);
        }
      });

      meta.writeDescriptors(keyName, validatedProperty);
    } else {
      // We're trying to fly under the radar here, so don't use Ember.defineProperty.
      // Ember should think the property is completely unchanged.
      Object.defineProperty(instance, keyName, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: validatedProperty
      });
    }
  }

  const ValidatingCreateMixin = Ember.Mixin.create({
    create() {
      const instance = this._super.apply(this, arguments);

      const klass = this;
      const prototype = Object.getPrototypeOf(instance);
      const validations = (0, _validationsFor.getValidationsFor)(prototype);

      if (!validations) {
        return instance;
      }

      for (let key in validations) {
        wrapField(klass, instance, validations, key);
      }

      return instance;
    }
  });

  Ember.Object.reopenClass(ValidatingCreateMixin);

  // Reopening a parent class does not apply the mixin to existing child classes,
  // so we need to apply it directly
  ValidatingCreateMixin.apply(Ember.Component);
  ValidatingCreateMixin.apply(Ember.Service);
  ValidatingCreateMixin.apply(Ember.Controller);

  if (requireModule.has('ember-data')) {
    let DS = requireModule('ember-data').default;

    if (DS.Model) {
      ValidatingCreateMixin.apply(DS.Model);
    }
  }

  function validationDecorator(fn) {
    return function (target, key, desc, options) {
      const validations = (0, _validationsFor.getValidationsForKey)(target, key);

      fn(target, key, desc, options, validations);

      if (!desc.get && !desc.set) {
        // always ensure the property is writeable, doesn't make sense otherwise (babel bug?)
        desc.writable = true;
        desc.configurable = true;
      }

      if (desc.initializer === null) {
        desc.initializer = undefined;
      }
    };
  }
});