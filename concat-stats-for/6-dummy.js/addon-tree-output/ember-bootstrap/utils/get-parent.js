define('ember-bootstrap/utils/get-parent', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getParent;
  function getParent(view) {
    if (Ember.get(view, 'tagName') === '') {
      // Beware: use of private API! :(
      if (Ember.ViewUtils && Ember.ViewUtils.getViewBounds) {
        return Ember.ViewUtils.getViewBounds(view).parentElement;
      } else {
        return view._renderNode.contextualElement;
      }
    } else {
      return Ember.get(view, 'element').parentNode;
    }
  }
});