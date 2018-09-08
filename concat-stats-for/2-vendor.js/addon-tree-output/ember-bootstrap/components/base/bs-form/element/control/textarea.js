define('ember-bootstrap/components/base/bs-form/element/control/textarea', ['exports', 'ember-bootstrap/components/base/bs-form/element/control', 'ember-bootstrap/mixins/control-attributes'], function (exports, _control, _controlAttributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _control.default.extend(_controlAttributes.default, {
    attributeBindings: ['value', 'placeholder', 'minlength', 'maxlength', 'autocomplete', 'spellcheck', 'rows', 'cols', 'wrap'],
    tagName: 'textarea',
    classNames: ['form-control'],

    change: function change(event) {
      this.get('onChange')(event.target.value);
    },
    input: function input(event) {
      this.get('onChange')(event.target.value);
    }
  });
});