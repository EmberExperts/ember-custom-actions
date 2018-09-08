define('ember-bootstrap/mixins/control-validation', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Mixin.create({
    classNameBindings: ['formFeedbackClass'],

    validationType: null,

    formFeedbackClass: Ember.computed('validationType', function () {
      var validationType = this.get('validationType');
      switch (validationType) {
        case 'error':
          return 'is-invalid';
        case 'success':
          return 'is-valid';
        case 'warning':
          return 'is-warning'; // not officially supported in BS4 :(
      }
    })
  });
});