define('ember-bootstrap/components/bs-popover/element', ['exports', 'ember-bootstrap/components/base/bs-popover/element'], function (exports, _element) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _element.default.extend({
    popperClassNames: Ember.computed('fade', 'actualPlacement', 'showHelp', function () {
      var classes = ['popover', 'ember-bootstrap-popover', this.get('actualPlacement')];
      if (this.get('fade')) {
        classes.push('fade');
      }
      if (this.get('showHelp')) {
        classes.push('in');
      }
      return classes;
    }),

    /**
     * @property titleClass
     * @private
     */
    titleClass: 'popover-title',

    /**
     * @property contentClass
     * @private
     */
    contentClass: 'popover-content'
  });
});