define('ember-bootstrap/mixins/control-attributes', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Mixin.create({
    attributeBindings: ['name', 'autofocus', 'disabled', 'readonly', 'required', 'tabindex', 'form', 'title', 'ariaDescribedBy:aria-describedby'],
    tagName: 'input'
  });
});