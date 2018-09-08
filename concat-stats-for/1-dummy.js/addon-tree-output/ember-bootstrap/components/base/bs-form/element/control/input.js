define('ember-bootstrap/components/base/bs-form/element/control/input', ['exports', 'ember-bootstrap/components/base/bs-form/element/control', 'ember-bootstrap/mixins/control-attributes'], function (exports, _control, _controlAttributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _control.default.extend(_controlAttributes.default, {
    attributeBindings: ['value', 'type', 'placeholder', 'controlSize:size', 'minlength', 'maxlength', 'min', 'max', 'pattern', 'accept', 'autocomplete', 'autosave', 'inputmode', 'multiple', 'step', 'spellcheck'],
    classNames: ['form-control'],

    /**
     * @property type
     * @type {String}
     * @public
     */
    type: 'text',

    change: function change(event) {
      this.get('onChange')(event.target.value);
    },
    input: function input(event) {
      this.get('onChange')(event.target.value);
    }
  });
});