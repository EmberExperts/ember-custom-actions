define('@ember-decorators/component/index', ['exports', '@ember-decorators/utils/collapse-proto', '@ember-decorators/utils/decorator'], function (exports, _collapseProto, _decorator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.className = exports.attribute = undefined;
  exports.classNames = classNames;
  exports.tagName = tagName;
  exports.layout = layout;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  /**
    Decorator which indicates that the field or computed should be bound
    to an attribute value on the component. This replaces `attributeBindings`
    by directly allowing you to specify which properties should be bound.
  
    ```js
    export default class AttributeDemoComponent extends Component {
      @attribute role = 'button';
  
      // With provided attribute name
      @attribute('data-foo') foo = 'lol';
  
      @attribute
      @computed
      get id() {
        // return generated id
      }
    }
    ```
  
    @function
    @param {string} name? - The name of the attribute to bind the value to if it is truthy
  */
  var attribute = exports.attribute = (0, _decorator.decoratorWithParams)(function (target, key, desc, params) {
    (false && !(params.length <= 1) && Ember.assert('The @attribute decorator may take up to one parameter, the bound attribute name. Received: ' + params.length, params.length <= 1));
    (false && !(params.every(function (s) {
      return typeof s === 'string';
    })) && Ember.assert('The @attribute decorator may only receive strings as parameters. Received: ' + params, params.every(function (s) {
      return typeof s === 'string';
    })));


    (0, _collapseProto.default)(target);

    if (!target.hasOwnProperty('attributeBindings')) {
      var parentValue = target.attributeBindings;
      target.attributeBindings = Array.isArray(parentValue) ? parentValue.slice() : [];
    }

    var binding = params[0] ? key + ':' + params[0] : key;

    target.attributeBindings.push(binding);

    if (desc) {
      // Decorated fields are currently not configurable in Babel for some reason, so ensure
      // that the field becomes configurable (else it messes with things)
      desc.configurable = true;
    }

    return desc;
  });

  /**
    Decorator which indicates that the field or computed should be bound to
    the component class names. This replaces `classNameBindings` by directly
    allowing you to specify which properties should be bound.
  
    ```js
    export default class ClassNameDemoComponent extends Component {
      @className boundField = 'default-class';
  
      // With provided true/false class names
      @className('active', 'inactive') isActive = true;
  
      @className
      @computed
      get boundComputed() {
        // return generated class
      }
    }
    ```
  
    @function
    @param {string} truthyName? - The class to be applied if the value the field
                                  is truthy, defaults to the name of the field.
    @param {string} falsyName? - The class to be applied if the value of the field
                                 is falsy.
  */
  var className = exports.className = (0, _decorator.decoratorWithParams)(function (target, key, desc, params) {
    (false && !(params.length <= 2) && Ember.assert('The @className decorator may take up to two parameters, the truthy class and falsy class for the class binding. Received: ' + params.length, params.length <= 2));
    (false && !(params.every(function (s) {
      return typeof s === 'string';
    })) && Ember.assert('The @className decorator may only receive strings as parameters. Received: ' + params, params.every(function (s) {
      return typeof s === 'string';
    })));


    (0, _collapseProto.default)(target);

    if (!target.hasOwnProperty('classNameBindings')) {
      var parentValue = target.classNameBindings;
      target.classNameBindings = Array.isArray(parentValue) ? parentValue.slice() : [];
    }

    var binding = params.length > 0 ? key + ':' + params.join(':') : key;

    target.classNameBindings.push(binding);

    if (desc) {
      // Decorated fields are currently not configurable in Babel for some reason, so ensure
      // that the field becomes configurable (else it messes with things)
      desc.configurable = true;
    }

    return desc;
  });

  /**
    Class decorator which specifies the class names to be applied to a component.
    This replaces the `classNames` property on components in the traditional Ember
    object model.
  
    ```js
    @classNames('a-static-class', 'another-static-class')
    export default class ClassNamesDemoComponent extends Component {}
    ```
  
    @param {...string} classNames - The list of classes to be applied to the component
  */
  function classNames() {
    for (var _len = arguments.length, classNames = Array(_len), _key = 0; _key < _len; _key++) {
      classNames[_key] = arguments[_key];
    }

    (false && !(classNames.reduce(function (allStrings, name) {
      return allStrings && typeof name === 'string';
    }, true)) && Ember.assert('The @classNames decorator must be provided strings, received: ' + classNames, classNames.reduce(function (allStrings, name) {
      return allStrings && typeof name === 'string';
    }, true)));


    return function (klass) {
      var prototype = klass.prototype;


      (0, _collapseProto.default)(prototype);

      if ('classNames' in prototype) {
        var parentClasses = prototype.classNames;
        classNames.unshift.apply(classNames, _toConsumableArray(parentClasses));
      }

      prototype.classNames = classNames;

      return klass;
    };
  }

  /**
    Class decorator which specifies the tag name of the component. This replaces
    the `tagName` property on components in the traditional Ember object model.
  
    ```js
    @tagName('button')
    export default class TagNameDemoComponent extends Component {}
    ```
  
    @param {string} tagName - The HTML tag to be used for the component
  */
  function tagName(tagName) {
    (false && !(arguments.length === 1) && Ember.assert('The @tagName decorator must be provided exactly one argument, received: ' + tagName, arguments.length === 1));
    (false && !(typeof tagName === 'string') && Ember.assert('The @tagName decorator must be provided a string, received: ' + tagName, typeof tagName === 'string'));


    return function (klass) {
      klass.prototype.tagName = tagName;
      return klass;
    };
  }

  /**
    Class decorator which specifies the layout for the component. This replaces
    the `layout` property on components in the traditional Ember object model.
  
    ```js
    import template from '../templates/components/x-foo';
  
    @layout(template)
    export default class TagNameDemoComponent extends Component {}
    ```
  
    ```js
    import hbs from 'htmlbars-inline-precompile';
  
    @layout(hbs`<h1>Hello {{ name }}</h1>`)
    export default class TagNameDemoComponent extends Component {
      constructor() {
        super(...arguments);
        this.set('name', 'Tomster');
      }
    }
    ```
  
    @param {TemplateFactory} template - The compiled template to be used for the component
  */
  function layout(template) {
    (false && !(arguments.length === 1) && Ember.assert('The @layout decorator must be provided exactly one argument, received: ' + template, arguments.length === 1));
    (false && !(typeof template !== 'string') && Ember.assert('The @layout decorator must be provided a template, received: ' + template + '. If you want to compile strings to templates, be sure to use \'htmlbars-inline-precompile\'', typeof template !== 'string'));
    (false && !(function () {
      return (typeof template === 'undefined' ? 'undefined' : _typeof(template)) === 'object' && typeof template.indexOf === 'undefined';
    }()) && Ember.assert('The @layout decorator must be provided a template, received: ' + template, function () {
      return (typeof template === 'undefined' ? 'undefined' : _typeof(template)) === 'object' && typeof template.indexOf === 'undefined';
    }()));


    return function (klass) {
      klass.prototype.layout = template;
      return klass;
    };
  }
});