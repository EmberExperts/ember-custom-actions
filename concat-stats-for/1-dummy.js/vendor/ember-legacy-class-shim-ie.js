/* globals Ember, DS */
(function() {
  function _possibleConstructorReturn(self, call) {
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });

    if (superClass) {
      Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }
  }

  var ExtendOverrideMixin = Ember.Mixin.create({
    extend: function() {
      if (Object.getPrototypeOf(this) === Function.prototype) {
        // The class we're extending is a base class, does not have anything
        // else in the prototype chain, so continue as normal
        return this._super.apply(this, arguments);
      }

      // Create a simple wrapper class to defer to the rest of the prototype chain
      // for native classes and classes that extend from native classes. This is the
      // output for creating classes from Babel, so it should be crosscompatible.
      var Class = function (_ref) {
        _inherits(Class, _ref);

        function Class() {
          return _possibleConstructorReturn(this, (Class.__proto__ || Object.getPrototypeOf(Class)).apply(this, arguments));
        }

        return Class;
      }(this);

      try {
        // Assign the name of the parent class for better logging and debugging
        Object.defineProperty(Class, 'name', { value: this.name || this.toString(), writable: true, configurable: true });
      } catch (e) {
        // If you create an Ember component using the `class extends Component` syntax
        // you might end up trying to create the property name twice on the same class
        console.warn('Unable to update property \'name\'. This might happen on old browsers (for instance Safari 9)');
      }

      for (var i = 0; i < arguments.length; i++) {
        Object.assign(Class.prototype, arguments[i]);
      }

      return Class;
    }
  });

  // reopen Ember.Object directly to pass in the extends so it and all subclasses get it
  Ember.Object.reopenClass(ExtendOverrideMixin);

  // class methods like 'extend' are finalized on the class when the class is first
  // defined (via extend) so we need to manually apply the "mixin". This is not a
  // problem with classes that extend further down the chain.
  ExtendOverrideMixin.apply(Ember.Component);
  ExtendOverrideMixin.apply(Ember.Service);
  ExtendOverrideMixin.apply(Ember.Controller);

  if (window.DS !== undefined && DS.Model !== undefined) {
    ExtendOverrideMixin.apply(DS.Model);
  }
})();
