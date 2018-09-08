define('ember-initials/mixins/initials', ['exports', 'ember-initials/mixins/avatar', 'ember-initials/utils/color-index', 'ember-initials/utils/initials', 'ember-initials/utils/store'], function (exports, _avatar, _colorIndex, _initials, _store) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Mixin.create(_avatar.default, {
    image: null,

    defaultName: '?',
    defaultBackground: '#dd6a58',

    fontSize: 50,
    fontWeight: 200,
    textColor: 'white',
    fontFamily: 'Helvetica Neue Light, Arial, sans-serif',

    name: Ember.computed.reads('defaultName'),
    seedText: Ember.computed.reads('name'),

    textStyles: Ember.computed(function () {
      return {};
    }),

    backgroundStyles: Ember.computed(function () {
      return {};
    }),

    colors: Ember.computed(function () {
      return ['#1abc9c', '#16a085', '#f1c40f', '#f39c12', '#2ecc71', '#27ae60', '#e67e22', '#d35400', '#3498db', '#2980b9', '#e74c3c', '#c0392b', '#9b59b6', '#8e44ad', '#bdc3c7', '#34495e', '#2c3e50', '#95a5a6', '#7f8c8d', '#ec87bf', '#d870ad', '#f69785', '#9ba37e', '#b49255', '#b49255', '#a94136', '#5461b4'];
    }),

    src: Ember.computed('fastboot.isFastBoot', 'image', function () {
      let image = this.get('image');

      if (image) return image;
      return this.get('fastboot.isFastBoot') ? '' : this.createInitials();
    }),

    initialsObserver: Ember.observer('name', 'seedText', 'fontSize', 'fontWeight', 'fontFamily', 'textColor', 'defaultName', function () {
      this.notifyPropertyChange('src');
    }),

    backgroundColor: Ember.computed('colors.length', 'seedText', 'defaultName', 'defaultBackground', function () {
      if (this.get('seedText') === this.get('defaultName')) {
        return this.get('defaultBackground');
      } else {
        let index = (0, _colorIndex.default)(this.get('seedText'), this.get('colors.length'));
        return this.get('colors')[index];
      }
    }),

    cacheStore: Ember.computed(function () {
      return this._lookupForCacheStore() || this._registerCacheStore();
    }),

    onError: Ember.computed('image', function () {
      if (this.get('image')) {
        return this._assignInitialsSrc.bind(this);
      }
    }),

    createInitials() {
      return this.get('cacheStore').initialsFor(this.initialsProperties());
    },

    initialsProperties() {
      return {
        width: 100,
        height: 100,
        initials: (0, _initials.default)(this.get('name') || this.get('defaultName')),
        initialsColor: this.get('textColor'),
        textStyles: Ember.assign({}, this._textStyles(), this.get('textStyles')),
        backgroundStyles: Ember.assign({}, this._backgroundStyles(), this.get('backgroundStyles'))
      };
    },

    _textStyles() {
      return {
        'font-family': this.get('fontFamily'),
        'font-weight': this.get('fontWeight'),
        'font-size': `${this.get('fontSize')}px`
      };
    },

    _backgroundStyles() {
      return {
        'background-color': this.get('backgroundColor')
      };
    },

    _assignInitialsSrc(e) {
      e.srcElement.src = this.createInitials();
    },

    _lookupForCacheStore() {
      return Ember.getOwner(this).lookup('store:ember-initials');
    },

    _registerCacheStore() {
      Ember.getOwner(this).register('store:ember-initials', _store.default);
      return this._lookupForCacheStore();
    }
  });
});