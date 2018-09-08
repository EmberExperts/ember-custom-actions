define('ember-font-awesome/components/fa-stack', ['exports', 'ember-font-awesome/utils/try-match', 'ember-font-awesome/templates/components/fa-stack'], function (exports, _tryMatch, _faStack) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed,
      get = Ember.get;
  exports.default = Ember.Component.extend({
    layout: _faStack.default,

    tagName: 'span',
    classNames: 'fa-stack',
    classNameBindings: ['sizeCssClass'],

    sizeCssClass: computed('size', function () {
      var size = get(this, 'size');
      if (!size) {
        return;
      }

      if ((0, _tryMatch.default)(size, /^fa-/)) {
        return size;
      } else if ((0, _tryMatch.default)(size, /(?:lg|x)$/)) {
        return 'fa-' + size;
      } else {
        return 'fa-' + size + 'x';
      }
    })
  });
});