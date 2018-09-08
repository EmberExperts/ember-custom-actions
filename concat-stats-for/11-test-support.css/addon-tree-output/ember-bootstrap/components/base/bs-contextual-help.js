define('ember-bootstrap/components/base/bs-contextual-help', ['exports', 'ember-bootstrap/mixins/transition-support', 'ember-bootstrap/utils/get-parent', 'ember-bootstrap/utils/transition-end'], function (exports, _transitionSupport, _getParent, _transitionEnd) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const InState = Ember.Object.extend({
    hover: false,
    focus: false,
    click: false,
    showHelp: Ember.computed.or('hover', 'focus', 'click')
  });

  function noop() {}

  /**
  
   @class Components.ContextualHelp
   @namespace Components
   @extends Ember.Component
   @uses Mixins.TransitionSupport
   @private
   */
  exports.default = Ember.Component.extend(_transitionSupport.default, {
    tagName: '',

    /**
     * @property title
     * @type string
     * @public
     */
    title: null,

    /**
     * How to position the tooltip/popover - top | bottom | left | right
     *
     * @property title
     * @type string
     * @default 'top'
     * @public
     */
    placement: 'top',

    /**
     * By default it will dynamically reorient the tooltip/popover based on the available space in the viewport. For
     * example, if `placement` is "left", the tooltip/popover will display to the left when possible, otherwise it will
     * display right. Set to `false` to force placement according to the `placement` property
     *
     * @property autoPlacement
     * @type boolean
     * @default true
     * @public
     */
    autoPlacement: true,

    /**
     * You can programmatically show the tooltip/popover by setting this to `true`
     *
     * @property visible
     * @type boolean
     * @default false
     * @public
     */
    visible: false,

    /**
     * @property inDom
     * @type boolean
     * @private
     */
    inDom: Ember.computed.and('visible', 'triggerTargetElement'),

    /**
     * Set to false to disable fade animations.
     *
     * @property fade
     * @type boolean
     * @default true
     * @public
     */
    fade: true,

    /**
     * Used to apply Bootstrap's visibility class
     *
     * @property showHelp
     * @type boolean
     * @default false
     * @private
     */
    showHelp: Ember.computed.reads('visible'),

    /**
     * Delay showing and hiding the tooltip/popover (ms). Individual delays for showing and hiding can be specified by using the
     * `delayShow` and `delayHide` properties.
     *
     * @property delay
     * @type number
     * @default 0
     * @public
     */
    delay: 0,

    /**
     * Delay showing the tooltip/popover. This property overrides the general delay set with the `delay` property.
     *
     * @property delayShow
     * @type number
     * @default 0
     * @public
     */
    delayShow: Ember.computed.reads('delay'),

    /**
     * Delay hiding the tooltip/popover. This property overrides the general delay set with the `delay` property.
     *
     * @property delayHide
     * @type number
     * @default 0
     * @public
     */
    delayHide: Ember.computed.reads('delay'),

    hasDelayShow: Ember.computed.gt('delayShow', 0),
    hasDelayHide: Ember.computed.gt('delayHide', 0),

    /**
     * The duration of the fade transition
     *
     * @property transitionDuration
     * @type number
     * @default 150
     * @public
     */
    transitionDuration: 150,

    /**
     * Keeps the tooltip/popover within the bounds of this element when `autoPlacement` is true. Can be any valid CSS selector.
     *
     * @property viewportSelector
     * @type string
     * @default 'body'
     * @see viewportPadding
     * @see autoPlacement
     * @public
     */
    viewportSelector: 'body',

    /**
     * Take a padding into account for keeping the tooltip/popover within the bounds of the element given by `viewportSelector`.
     *
     * @property viewportPadding
     * @type number
     * @default 0
     * @see viewportSelector
     * @see autoPlacement
     * @public
     */
    viewportPadding: 0,

    /**
     * The id of the overlay element.
     *
     * @property overlayId
     * @type string
     * @readonly
     * @private
     */
    overlayId: Ember.computed(function () {
      return `overlay-${Ember.guidFor(this)}`;
    }),

    /**
     * The DOM element of the overlay element.
     *
     * @property overlayElement
     * @type object
     * @readonly
     * @private
     */
    overlayElement: Ember.computed('overlayId', function () {
      return document.getElementById(this.get('overlayId'));
    }).volatile(),

    /**
     * The DOM element of the arrow element.
     *
     * @property arrowElement
     * @type object
     * @readonly
     * @private
     */
    arrowElement: null,

    /**
     * The DOM element of the viewport element.
     *
     * @property viewportElement
     * @type object
     * @readonly
     * @private
     */
    viewportElement: Ember.computed('viewportSelector', function () {
      return document.querySelector(this.get('viewportSelector'));
    }),

    /**
     * The DOM element that triggers the tooltip/popover. By default it is the parent element of this component.
     * You can set this to any CSS selector to have any other element trigger the tooltip/popover.
     * With the special value of "parentView" you can attach the tooltip/popover to the parent component's element.
     *
     * @property triggerElement
     * @type string
     * @public
     */
    triggerElement: null,

    /**
     * @property triggerTargetElement
     * @type {object}
     * @private
     */
    triggerTargetElement: Ember.computed('triggerElement', function () {
      let triggerElement = this.get('triggerElement');
      let el;

      if (Ember.isBlank(triggerElement)) {
        try {
          el = (0, _getParent.default)(this);
        } catch (e) {
          return null;
        }
      } else if (triggerElement === 'parentView') {
        el = this.get('parentView.element');
      } else {
        el = document.querySelector(triggerElement);
      }
      return el;
    }).volatile(),

    /**
     * The event(s) that should trigger the tooltip/popover - click | hover | focus.
     * You can set this to a single event or multiple events, given as an array or a string separated by spaces.
     *
     * @property triggerEvents
     * @type array|string
     * @default 'hover focus'
     * @public
     */
    triggerEvents: 'hover focus',

    _triggerEvents: Ember.computed('triggerEvents', function () {
      let events = this.get('triggerEvents');
      if (!Ember.isArray(events)) {
        events = events.split(' ');
      }

      return events.map(event => {
        switch (event) {
          case 'hover':
            return ['mouseenter', 'mouseleave'];
          case 'focus':
            return ['focusin', 'focusout'];
          default:
            return event;
        }
      });
    }),

    /**
     * If true component will render in place, rather than be wormholed.
     *
     * @property renderInPlace
     * @type boolean
     * @default false
     * @public
     */
    renderInPlace: false,

    /**
     * @property _renderInPlace
     * @type boolean
     * @private
     */
    _renderInPlace: Ember.computed('renderInPlace', function () {
      return this.get('renderInPlace') || typeof document === 'undefined' || !document.getElementById('ember-bootstrap-wormhole');
    }),

    /**
     * Current hover state, 'in', 'out' or null
     *
     * @property hoverState
     * @type string
     * @private
     */
    hoverState: null,

    /**
     * Current state for events
     *
     * @property inState
     * @type {InState}
     * @private
     */
    inState: Ember.computed(function () {
      return InState.create();
    }),

    /**
     * Ember.run timer
     *
     * @property timer
     * @private
     */
    timer: null,

    /**
     * This action is called immediately when the tooltip/popover is about to be shown.
     *
     * @event onShow
     * @public
     */
    onShow() {},

    /**
     * This action will be called when the tooltip/popover has been made visible to the user (will wait for CSS transitions to complete).
     *
     * @event onShown
     * @public
     */
    onShown() {},

    /**
     * This action is called immediately when the tooltip/popover is about to be hidden.
     *
     * @event onHide
     * @public
     */
    onHide() {},

    /**
     * This action is called when the tooltip/popover has finished being hidden from the user (will wait for CSS transitions to complete).
     *
     * @event onHidden
     * @public
     */
    onHidden() {},

    /**
     * Called when a show event has been received
     *
     * @method enter
     * @param e
     * @private
     */
    enter(e) {
      if (e) {
        let eventType = e.type === 'focusin' ? 'focus' : 'hover';
        this.get('inState').set(eventType, true);
      }

      if (this.get('showHelp') || this.get('hoverState') === 'in') {
        this.set('hoverState', 'in');
        return;
      }

      Ember.run.cancel(this.timer);

      this.set('hoverState', 'in');

      if (!this.get('hasDelayShow')) {
        return this.show();
      }

      this.timer = Ember.run.later(this, function () {
        if (this.get('hoverState') === 'in') {
          this.show();
        }
      }, this.get('delayShow'));
    },

    /**
     * Called when a hide event has been received
     *
     * @method leave
     * @param e
     * @private
     */
    leave(e) {
      if (e) {
        let eventType = e.type === 'focusout' ? 'focus' : 'hover';
        this.get('inState').set(eventType, false);
      }

      if (this.get('inState.showHelp')) {
        return;
      }

      Ember.run.cancel(this.timer);

      this.set('hoverState', 'out');

      if (!this.get('hasDelayHide')) {
        return this.hide();
      }

      this.timer = Ember.run.later(this, function () {
        if (this.get('hoverState') === 'out') {
          this.hide();
        }
      }, this.get('delayHide'));
    },

    /**
     * Called for a click event
     *
     * @method toggle
     * @param e
     * @private
     */
    toggle(e) {
      if (e) {
        this.get('inState').toggleProperty('click');
        if (this.get('inState.showHelp')) {
          this.enter();
        } else {
          this.leave();
        }
      } else {
        if (this.get('showHelp')) {
          this.leave();
        } else {
          this.enter();
        }
      }
    },

    /**
     * Show the tooltip/popover
     *
     * @method show
     * @private
     */
    show() {
      if (this.get('isDestroyed') || this.get('isDestroying')) {
        return;
      }

      if (false === this.get('onShow')(this)) {
        return;
      }

      // this waits for the tooltip/popover element to be created. when animating a wormholed tooltip/popover we need to wait until
      // ember-wormhole has moved things in the DOM for the animation to be correct, so use Ember.run.next in this case
      let delayFn = !this.get('_renderInPlace') && this.get('fade') ? Ember.run.next : function (target, fn) {
        Ember.run.schedule('afterRender', target, fn);
      };

      this.set('inDom', true);
      delayFn(this, this._show);
    },

    _show(skipTransition = false) {
      this.set('showHelp', true);

      // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

      // See https://github.com/twbs/bootstrap/pull/22481
      if ('ontouchstart' in document.documentElement) {
        let { children } = document.body;
        for (let i = 0; i < children.length; i++) {
          children[i].addEventListener('mouseover', noop);
        }
      }

      let tooltipShowComplete = () => {
        if (this.get('isDestroyed')) {
          return;
        }
        let prevHoverState = this.get('hoverState');

        this.get('onShown')(this);
        this.set('hoverState', null);

        if (prevHoverState === 'out') {
          this.leave();
        }
      };

      if (skipTransition === false && this.get('usesTransition')) {
        (0, _transitionEnd.default)(this.get('overlayElement'), this.get('transitionDuration')).then(tooltipShowComplete);
      } else {
        tooltipShowComplete();
      }
    },

    /**
     * Position the tooltip/popover's arrow
     *
     * @method replaceArrow
     * @param delta
     * @param dimension
     * @param isVertical
     * @private
     */
    replaceArrow(delta, dimension, isVertical) {
      let el = this.get('arrowElement');
      el.style[isVertical ? 'left' : 'top'] = `${50 * (1 - delta / dimension)}%`;
      el.style[isVertical ? 'top' : 'left'] = null;
    },

    /**
     * Hide the tooltip/popover
     *
     * @method hide
     * @private
     */
    hide() {
      if (this.get('isDestroyed')) {
        return;
      }

      if (false === this.get('onHide')(this)) {
        return;
      }

      let tooltipHideComplete = () => {
        if (this.get('isDestroyed')) {
          return;
        }
        if (this.get('hoverState') !== 'in') {
          this.set('inDom', false);
        }
        this.get('onHidden')(this);
      };

      this.set('showHelp', false);

      // if this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        let { children } = document.body;
        for (let i = 0; i < children.length; i++) {
          children[i].removeEventListener('mouseover', noop);
        }
      }

      if (this.get('usesTransition')) {
        (0, _transitionEnd.default)(this.get('overlayElement'), this.get('transitionDuration')).then(tooltipHideComplete);
      } else {
        tooltipHideComplete();
      }

      this.set('hoverState', null);
    },

    /**
     * @method addListeners
     * @private
     */
    addListeners() {
      let target = this.get('triggerTargetElement');

      this.get('_triggerEvents').forEach(event => {
        if (Ember.isArray(event)) {
          let [inEvent, outEvent] = event;
          target.addEventListener(inEvent, this._handleEnter);
          target.addEventListener(outEvent, this._handleLeave);
        } else {
          target.addEventListener(event, this._handleToggle);
        }
      });
    },

    /**
     * @method removeListeners
     * @private
     */
    removeListeners() {
      try {
        let target = this.get('triggerTargetElement');
        this.get('_triggerEvents').forEach(event => {
          if (Ember.isArray(event)) {
            let [inEvent, outEvent] = event;
            target.removeEventListener(inEvent, this._handleEnter);
            target.removeEventListener(outEvent, this._handleLeave);
          } else {
            target.removeEventListener(event, this._handleToggle);
          }
        });
      } catch (e) {} // eslint-disable-line no-empty
    },

    actions: {
      close() {
        this.hide();
      }
    },

    init() {
      this._super(...arguments);
      this._handleEnter = Ember.run.bind(this, this.enter);
      this._handleLeave = Ember.run.bind(this, this.leave);
      this._handleToggle = Ember.run.bind(this, this.toggle);
    },

    didInsertElement() {
      this._super(...arguments);
      this.addListeners();
      if (this.get('visible')) {
        Ember.run.next(this, this.show, true);
      }
    },

    willDestroyElement() {
      this._super(...arguments);
      this.removeListeners();
    },

    _watchVisible: Ember.observer('visible', function () {
      if (this.get('visible')) {
        this.show();
      } else {
        this.hide();
      }
    })

  });
});