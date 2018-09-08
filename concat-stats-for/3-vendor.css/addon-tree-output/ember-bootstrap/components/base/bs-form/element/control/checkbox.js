define('ember-bootstrap/components/base/bs-form/element/control/checkbox', ['exports', 'ember-bootstrap/components/base/bs-form/element/control', 'ember-bootstrap/mixins/control-attributes'], function (exports, _control, _controlAttributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _control.default.extend(_controlAttributes.default, {
    attributeBindings: ['value:checked', 'type'],

    /**
     * @property type
     * @type {String}
     * @readonly
     * @private
     */
    type: 'checkbox',

    click: function click(event) {
      this.get('onChange')(event.target.checked);
    }
  });
});