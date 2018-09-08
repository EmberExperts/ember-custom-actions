define('ember-bootstrap/components/base/bs-form/element/feedback-icon', ['exports', 'ember-bootstrap/templates/components/bs-form/element/feedback-icon'], function (exports, _feedbackIcon) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _feedbackIcon.default,
    tagName: '',

    /**
     * @property show
     * @type {Boolean}
     * @public
     */
    show: false,

    /**
     * @property iconName
     * @type {String}
     * @public
     */
    iconName: null
  });
});