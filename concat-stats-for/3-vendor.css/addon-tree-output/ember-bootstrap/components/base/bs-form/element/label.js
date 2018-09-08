define('ember-bootstrap/components/base/bs-form/element/label', ['exports', 'ember-bootstrap/templates/components/bs-form/element/label'], function (exports, _label) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _label.default,
    tagName: '',

    /**
     * @property label
     * @type string
     * @public
     */
    label: null,

    /**
     * @property invisibleLabel
     * @type boolean
     * @public
     */
    invisibleLabel: false,

    /**
     * @property formElementId
     * @type {String}
     * @public
     */
    formElementId: null,

    /**
     * @property labelClass
     * @type {String}
     * @public
     */
    labelClass: null,

    /**
     * The form layout used for the markup generation (see http://getbootstrap.com/css/#forms):
     *
     * * 'horizontal'
     * * 'vertical'
     * * 'inline'
     *
     * Defaults to the parent `form`'s `formLayout` property.
     *
     * @property formLayout
     * @type string
     * @default 'vertical'
     * @public
     */
    formLayout: 'vertical',

    /**
     * The type of the control widget.
     * Supported types:
     *
     * * 'text'
     * * 'checkbox'
     * * 'textarea'
     * * any other type will use an input tag with the `controlType` value as the type attribute (for e.g. HTML5 input
     * types like 'email'), and the same layout as the 'text' type
     *
     * @property controlType
     * @type string
     * @default 'text'
     * @public
     */
    controlType: 'text',

    /**
     * Indicates whether the type of the control widget equals `checkbox`
     *
     * @property isCheckbox
     * @type boolean
     * @private
     */
    isCheckbox: Ember.computed.equal('controlType', 'checkbox').readOnly(),

    /**
     * Indicates whether the form type equals `horizontal`
     *
     * @property isHorizontal
     * @type boolean
     * @private
     */
    isHorizontal: Ember.computed.equal('formLayout', 'horizontal').readOnly()
  });
});