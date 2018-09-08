define('ember-initials/mixins/gravatar', ['exports', 'ember-initials/mixins/avatar', 'md5'], function (exports, _avatar, _md) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Mixin.create(_avatar.default, {
    email: null,
    image: null,
    relativeUrl: false,

    defaultImage: Ember.computed(function () {
      return this.get('config.gravatar.defaultImage');
    }),

    src: Ember.computed('email', 'size', 'image', 'defaultImage', function () {
      return this.get('image') ? this.get('image') : this.generateGravatarUrl();
    }),

    generateGravatarUrl: function generateGravatarUrl() {
      var hash = (0, _md.default)(this.get('email'));
      var size = this.get('size');
      var defaultImage = this.defaultImageUrl();
      var image = defaultImage ? '&default=' + defaultImage : '';

      return '//www.gravatar.com/avatar/' + hash + '?size=' + size + image;
    },
    defaultImageUrl: function defaultImageUrl() {
      var defaultImage = this.get('defaultImage');
      return this.get('relativeUrl') && defaultImage ? this._absoluteImageSrc(defaultImage) : defaultImage;
    },
    _absoluteImageSrc: function _absoluteImageSrc(relativePath) {
      return window.location.origin + '/' + relativePath;
    }
  });
});