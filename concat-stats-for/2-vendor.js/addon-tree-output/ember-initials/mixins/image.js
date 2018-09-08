define('ember-initials/mixins/image', ['exports', 'ember-initials/mixins/avatar'], function (exports, _avatar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Mixin.create(_avatar.default, {
    image: '',

    src: Ember.computed.or('image', 'defaultImage'),
    defaultImage: Ember.computed.reads('config.image.defaultImageUrl')
  });
});