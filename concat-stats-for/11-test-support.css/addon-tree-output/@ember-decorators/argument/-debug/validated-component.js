define('@ember-decorators/argument/-debug/validated-component', ['exports', 'ember-get-config', '@ember-decorators/argument/-debug/utils/validations-for', '@ember-decorators/argument/-debug/utils/validation-decorator'], function (exports, _emberGetConfig, _validationsFor) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  let validatedComponent;

  const whitelist = {
    ariaRole: true,
    class: true,
    classNames: true,
    id: true,
    isVisible: true,
    tagName: true,
    __ANGLE_ATTRS__: true
  };

  if (true) {
    validatedComponent = Ember.Component.extend();

    validatedComponent.reopenClass({
      create(props) {
        // First create the instance to realize any dynamically added bindings or fields
        const instance = this._super(...arguments);

        const prototype = Object.getPrototypeOf(instance);
        const validations = (0, _validationsFor.getValidationsFor)(prototype) || {};
        if (Ember.getWithDefault(_emberGetConfig.default, '@ember-decorators/argument.ignoreComponentsWithoutValidations', false) && Object.keys(validations).length === 0) {
          return instance;
        }

        const attributes = instance.attributeBindings || [];
        const classNames = (instance.classNameBindings || []).map(binding => binding.split(':')[0]);

        for (let key in props.attrs) {
          const isValidArgOrAttr = key in validations && validations[key].isArgument || key in whitelist || attributes.indexOf(key) !== -1 || classNames.indexOf(key) !== -1;

          (true && !(isValidArgOrAttr) && Ember.assert(`Attempted to assign the argument '${key}' on an instance of ${this.name || this}, but no argument was defined for that key. Use the @argument helper on the class field to define an argument for that class.`, isValidArgOrAttr));
        }

        return instance;
      }
    });
  } else {
    validatedComponent = Ember.Component;
  }

  exports.default = validatedComponent;
});