define('ember-bootstrap/components/base/bs-modal/body', ['exports', 'ember-bootstrap/templates/components/bs-modal/body'], function (exports, _body) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _body.default,
    classNames: ['modal-body']
  });
});