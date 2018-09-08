define('ember-bootstrap/components/base/bs-collapse', ['exports', 'ember-bootstrap/utils/transition-end'], function (exports, _transitionEnd) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({

    classNameBindings: ['collapse', 'collapsing'],
    attributeBindings: ['style'],

    /**
     * Collapsed/expanded state
     *
     * @property collapsed
     * @type boolean
     * @default true
     * @public
     */
    collapsed: true,

    /**
     * True if this item is expanded
     *
     * @property active
     * @private
     */
    active: false,

    collapse: Ember.computed.not('transitioning'),
    collapsing: Ember.computed.alias('transitioning'),
    showContent: Ember.computed.and('collapse', 'active'),

    /**
     * true if the component is currently transitioning
     *
     * @property transitioning
     * @type boolean
     * @private
     */
    transitioning: false,

    /**
     * @property collapseSize
     * @type number
     * @private
     */
    collapseSize: null,

    /**
     * The size of the element when collapsed. Defaults to 0.
     *
     * @property collapsedSize
     * @type number
     * @default 0
     * @public
     */
    collapsedSize: 0,

    /**
     * The size of the element when expanded. When null the value is calculated automatically to fit the containing elements.
     *
     * @property expandedSize
     * @type number
     * @default null
     * @public
     */
    expandedSize: null,

    /**
     * Usually the size (height) of the element is only set while transitioning, and reseted afterwards. Set to true to always set a size.
     *
     * @property resetSizeWhenNotCollapsing
     * @type boolean
     * @default true
     * @private
     */
    resetSizeWhenNotCollapsing: true,

    /**
     * The direction (height/width) of the collapse animation.
     * When setting this to 'width' you should also define custom CSS transitions for the width property, as the Bootstrap
     * CSS does only support collapsible elements for the height direction.
     *
     * @property collapseDimension
     * @type string
     * @default 'height'
     * @public
     */
    collapseDimension: 'height',

    /**
     * The duration of the fade transition
     *
     * @property transitionDuration
     * @type number
     * @default 350
     * @public
     */
    transitionDuration: 350,

    style: Ember.computed('collapseSize', function () {
      let size = this.get('collapseSize');
      let dimension = this.get('collapseDimension');
      if (Ember.isEmpty(size)) {
        return Ember.String.htmlSafe('');
      }
      return Ember.String.htmlSafe(`${dimension}: ${size}px`);
    }),

    /**
     * The action to be sent when the element is about to be hidden.
     *
     * @event onHide
     * @public
     */
    onHide() {},

    /**
     * The action to be sent after the element has been completely hidden (including the CSS transition).
     *
     * @event onHidden
     * @public
     */
    onHidden() {},

    /**
     * The action to be sent when the element is about to be shown.
     *
     * @event onShow
     * @public
     */
    onShow() {},

    /**
     * The action to be sent after the element has been completely shown (including the CSS transition).
     *
     * @event onShown
     * @public
     */
    onShown() {},

    /**
     * Triggers the show transition
     *
     * @method show
     * @protected
     */
    show() {
      this.get('onShow')();

      this.setProperties({
        transitioning: true,
        collapseSize: this.get('collapsedSize'),
        active: true
      });

      (0, _transitionEnd.default)(this.get('element'), this.get('transitionDuration')).then(() => {
        if (this.get('isDestroyed')) {
          return;
        }
        this.set('transitioning', false);
        if (this.get('resetSizeWhenNotCollapsing')) {
          this.set('collapseSize', null);
        }
        this.get('onShown')();
      });

      Ember.run.next(this, function () {
        if (!this.get('isDestroyed')) {
          this.set('collapseSize', this.getExpandedSize('show'));
        }
      });
    },

    /**
     * Get the size of the element when expanded
     *
     * @method getExpandedSize
     * @param action
     * @return {Number}
     * @private
     */
    getExpandedSize(action) {
      let expandedSize = this.get('expandedSize');
      if (Ember.isPresent(expandedSize)) {
        return expandedSize;
      }

      let collapseElement = this.get('element');
      let prefix = action === 'show' ? 'scroll' : 'offset';
      let measureProperty = Ember.String.camelize(`${prefix}-${this.get('collapseDimension')}`);
      return collapseElement[measureProperty];
    },

    /**
     * Triggers the hide transition
     *
     * @method hide
     * @protected
     */
    hide() {
      this.get('onHide')();

      this.setProperties({
        transitioning: true,
        collapseSize: this.getExpandedSize('hide'),
        active: false
      });

      (0, _transitionEnd.default)(this.get('element'), this.get('transitionDuration')).then(() => {
        if (this.get('isDestroyed')) {
          return;
        }
        this.set('transitioning', false);
        if (this.get('resetSizeWhenNotCollapsing')) {
          this.set('collapseSize', null);
        }
        this.get('onHidden')();
      });

      Ember.run.next(this, function () {
        if (!this.get('isDestroyed')) {
          this.set('collapseSize', this.get('collapsedSize'));
        }
      });
    },

    _onCollapsedChange: Ember.observer('collapsed', function () {
      let collapsed = this.get('collapsed');
      let active = this.get('active');
      if (collapsed !== active) {
        return;
      }
      if (collapsed === false) {
        this.show();
      } else {
        this.hide();
      }
    }),

    init() {
      this._super(...arguments);
      this.set('active', !this.get('collapsed'));
    },

    _updateCollapsedSize: Ember.observer('collapsedSize', function () {
      if (!this.get('resetSizeWhenNotCollapsing') && this.get('collapsed') && !this.get('collapsing')) {
        this.set('collapseSize', this.get('collapsedSize'));
      }
    }),

    _updateExpandedSize: Ember.observer('expandedSize', function () {
      if (!this.get('resetSizeWhenNotCollapsing') && !this.get('collapsed') && !this.get('collapsing')) {
        this.set('collapseSize', this.get('expandedSize'));
      }
    })
  });
});