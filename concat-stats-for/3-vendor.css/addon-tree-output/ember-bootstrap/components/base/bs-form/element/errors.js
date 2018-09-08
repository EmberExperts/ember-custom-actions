define('ember-bootstrap/components/base/bs-form/element/errors', ['exports', 'ember-bootstrap/templates/components/bs-form/element/errors'], function (exports, _errors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _errors.default,
    tagName: '',

    /**
     * @property show
     * @type {Boolean}
     * @public
     */
    show: false,

    /**
     * @property messages
     * @type {Ember.Array}
     * @public
     */
    messages: null,

    /**
     * Whether or not should display several errors at the same time.
     *
     * @default false
     * @property showMultipleErrors
     * @public
     * @type {Boolean}
     */
    showMultipleErrors: false
  });
});