define('ember-font-awesome/components/fa-list', ['exports', 'ember-font-awesome/templates/components/fa-list'], function (exports, _faList) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _faList.default,
    tagName: 'ul',
    classNames: 'fa-ul'
  });
});