define('ember-bootstrap/components/bs-form', ['exports', 'ember-bootstrap/components/base/bs-form'], function (exports, _bsForm) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _bsForm.default.extend({
    layoutClass: Ember.computed('formLayout', function () {
      var layout = this.get('formLayout');
      var supportedTypes = ['vertical', 'horizontal', 'inline'];
      (false && !(supportedTypes.indexOf(layout) >= 0) && Ember.assert('must provide a valid `formLayout` attribute.', supportedTypes.indexOf(layout) >= 0));

      return layout === 'vertical' ? 'form' : 'form-' + layout;
    }).readOnly()
  });
});