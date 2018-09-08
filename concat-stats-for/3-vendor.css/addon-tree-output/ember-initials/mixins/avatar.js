define('ember-initials/mixins/avatar', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Mixin.create({
    tagName: 'img',
    attributeBindings: ['width', 'height', 'src', 'alt', 'title', 'onError'],

    src: '',
    size: 30,
    alt: 'User Avatar',
    title: 'User Avatar',

    height: Ember.computed.reads('size'),
    width: Ember.computed.reads('size'),

    config: Ember.computed(function () {
      return Ember.getOwner(this).resolveRegistration('config:environment').emberInitials;
    }),

    fastboot: Ember.computed(function () {
      return Ember.getOwner(this).lookup('service:fastboot');
    }),

    onError: function onError() {}
  });
});