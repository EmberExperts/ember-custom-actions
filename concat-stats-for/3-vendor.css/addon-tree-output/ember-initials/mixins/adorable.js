define('ember-initials/mixins/adorable', ['exports', 'ember-initials/mixins/avatar'], function (exports, _avatar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Mixin.create(_avatar.default, {
    email: '',
    image: '',

    src: Ember.computed('image', 'email', 'size', function () {
      return this.get('image') || this._adorableSrc(this.get('email'), this.get('size'));
    }),

    _adorableSrc: function _adorableSrc(email, size) {
      return 'https://api.adorable.io/avatars/' + size + '/' + email;
    }
  });
});