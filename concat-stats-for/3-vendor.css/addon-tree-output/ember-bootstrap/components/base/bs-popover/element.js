define('ember-bootstrap/components/base/bs-popover/element', ['exports', 'ember-bootstrap/components/base/bs-contextual-help/element', 'ember-bootstrap/templates/components/bs-popover/element'], function (exports, _element, _element2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _element.default.extend({
    layout: _element2.default,

    /**
     * @property title
     * @type string
     * @public
     */
    title: undefined,

    /**
     * @property hasTitle
     * @type boolean
     * @private
     */
    hasTitle: Ember.computed.notEmpty('title')
  });
});