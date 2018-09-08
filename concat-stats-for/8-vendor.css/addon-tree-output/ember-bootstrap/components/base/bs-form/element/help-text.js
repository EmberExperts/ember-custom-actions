define('ember-bootstrap/components/base/bs-form/element/help-text', ['exports', 'ember-bootstrap/templates/components/bs-form/element/help-text'], function (exports, _helpText) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _helpText.default,

    /**
     * @property text
     * @type {string}
     * @public
     */
    text: null
  });
});