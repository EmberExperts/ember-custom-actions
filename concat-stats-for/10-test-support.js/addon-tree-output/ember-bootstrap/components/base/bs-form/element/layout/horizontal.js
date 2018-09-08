define('ember-bootstrap/components/base/bs-form/element/layout/horizontal', ['exports', 'ember-bootstrap/components/base/bs-form/element/layout', 'ember-bootstrap/templates/components/bs-form/element/layout/horizontal'], function (exports, _layout, _horizontal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _layout.default.extend({
    layout: _horizontal.default,

    /**
     * The Bootstrap grid class for form labels within a horizontal layout form.
     *
     * @property horizontalLabelGridClass
     * @type string
     * @public
     */
    horizontalLabelGridClass: null,

    /**
     * Computed property that specifies the Bootstrap grid class for form controls within a horizontal layout form.
     *
     * @property horizontalInputGridClass
     * @type string
     * @readonly
     * @private
     */
    horizontalInputGridClass: Ember.computed('horizontalLabelGridClass', function () {
      if (Ember.isBlank(this.get('horizontalLabelGridClass'))) {
        return;
      }
      let parts = this.get('horizontalLabelGridClass').split('-');
      (true && !(parts.length === 3) && Ember.assert('horizontalInputGridClass must match format bootstrap grid column class', parts.length === 3));

      parts[2] = 12 - parts[2];
      return parts.join('-');
    }).readOnly(),

    /**
     * Computed property that specifies the Bootstrap offset grid class for form controls within a horizontal layout
     * form, that have no label.
     *
     * @property horizontalInputOffsetGridClass
     * @type string
     * @readonly
     * @private
     */
    horizontalInputOffsetGridClass: Ember.computed('horizontalLabelGridClass', function () {
      if (Ember.isBlank(this.get('horizontalLabelGridClass'))) {
        return;
      }
      let parts = this.get('horizontalLabelGridClass').split('-');
      parts.splice(2, 0, 'offset');
      return parts.join('-');
    })

  });
});