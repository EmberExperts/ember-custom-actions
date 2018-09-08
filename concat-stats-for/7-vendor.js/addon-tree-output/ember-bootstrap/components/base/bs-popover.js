define('ember-bootstrap/components/base/bs-popover', ['exports', 'ember-bootstrap/components/base/bs-contextual-help', 'ember-bootstrap/templates/components/bs-popover'], function (exports, _bsContextualHelp, _bsPopover) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _bsContextualHelp.default.extend({
    layout: _bsPopover.default,

    /**
     * @property placement
     * @type string
     * @default 'right'
     * @public
     */
    placement: 'right',

    /**
     * @property triggerEvents
     * @type array|string
     * @default 'click'
     * @public
     */
    triggerEvents: 'click',

    /**
     * The DOm element of the arrow element.
     *
     * @property arrowElement
     * @type object
     * @readonly
     * @private
     */
    arrowElement: Ember.computed('overlayElement', function () {
      return this.get('overlayElement').querySelector('.arrow');
    }).volatile()
  });
});