define('ember-bootstrap/components/base/bs-form/group', ['exports', 'ember-bootstrap/templates/components/bs-form/group'], function (exports, _group) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _group.default,

    /**
     * @property classTypePrefix
     * @type String
     * @default 'form-group' (BS3) or 'form-control' (BS4)
     * @private
     */

    /**
     * Computed property which is true if the form group is in a validation state
     *
     * @property hasValidation
     * @type boolean
     * @private
     * @readonly
     */
    hasValidation: Ember.computed.notEmpty('validation').readOnly(),

    /**
     * Set to a validation state to render the form-group with a validation style (only for BS3).
     * See http://getbootstrap.com/css/#forms-control-validation
     *
     * The default states of "success", "warning" and "error" are supported by Bootstrap out-of-the-box.
     * But you can use custom states as well. This will set a has-<state> class, and (if `useIcons`is true)
     * a feedback whose class is taken from the <state>Icon property
     *
     * @property validation
     * @type string
     * @public
     */
    validation: null
  });
});