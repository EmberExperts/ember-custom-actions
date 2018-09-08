define('ember-bootstrap/components/base/bs-carousel', ['exports', 'ember-bootstrap/components/bs-carousel/slide', 'ember-bootstrap/mixins/component-parent', 'ember-bootstrap/templates/components/bs-carousel', 'ember-concurrency'], function (exports, _slide, _componentParent, _bsCarousel, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  exports.default = Ember.Component.extend(_componentParent.default, {
    attributeBindings: ['tabindex'],
    classNames: ['carousel', 'slide'],
    layout: _bsCarousel.default,
    tabindex: '1',

    /**
     * If a slide can turn to left, including corners.
     *
     * @private
     * @property canTurnToLeft
     */
    canTurnToLeft: Ember.computed('wrap', 'currentIndex', function () {
      return this.get('wrap') || this.get('currentIndex') > 0;
    }),

    /**
     * If a slide can turn to right, including corners.
     *
     * @private
     * @property canTurnToRight
     */
    canTurnToRight: Ember.computed('childSlides.length', 'wrap', 'currentIndex', function () {
      return this.get('wrap') || this.get('currentIndex') < this.get('childSlides.length') - 1;
    }),

    /**
     * All `CarouselSlide` child components.
     *
     * @private
     * @property childSlides
     * @readonly
     * @type array
     */
    childSlides: Ember.computed.filter('children', function (view) {
      return view instanceof _slide.default;
    }).readOnly(),

    /**
     * This observer is the entry point for real time insertion and removing of slides.
     *
     * @private
     * @property childSlidesObserver
     */
    childSlidesObserver: Ember.observer('childSlides.[]', 'autoPlay', function () {
      var _this = this;

      Ember.run.scheduleOnce('actions', function () {
        var childSlides = _this.get('childSlides');
        if (childSlides.length === 0) {
          return;
        }
        // Sets new current index
        var currentIndex = _this.get('currentIndex');
        if (currentIndex >= childSlides.length) {
          currentIndex = childSlides.length - 1;
          _this.set('currentIndex', currentIndex);
        }
        // Automatic sliding
        if (_this.get('autoPlay')) {
          _this.get('waitIntervalToInitCycle').perform();
        }
        // Initial slide state
        _this.set('presentationState', null);
      });
    }),

    /**
     * Indicates the current index of the current slide.
     *
     * @property currentIndex
     * @private
     */
    currentIndex: null,

    /**
     * The current slide object that is going to be used by the nested slides components.
     *
     * @property currentSlide
     * @private
     *
     */
    currentSlide: Ember.computed('childSlides', 'currentIndex', function () {
      return this.get('childSlides').objectAt(this.get('currentIndex'));
    }).readOnly(),

    /**
     * Bootstrap style to indicate that a given slide should be moving to left/right.
     *
     * @property directionalClassName
     * @private
     * @type string
     */
    directionalClassName: null,

    /**
     * Indicates the next slide index to move into.
     *
     * @property followingIndex
     * @private
     * @type number
     */
    followingIndex: null,

    /**
     * The following slide object that is going to be used by the nested slides components.
     *
     * @property followingIndex
     * @private
     */
    followingSlide: Ember.computed('childSlides', 'followingIndex', function () {
      return this.get('childSlides').objectAt(this.get('followingIndex'));
    }).readOnly(),

    /**
     * @private
     * @property hasInterval
     * @type boolean
     */
    hasInterval: Ember.computed.gt('interval', 0).readOnly(),

    /**
     * This observer is the entry point for programmatically slide changing.
     *
     * @property indexObserver
     * @private
     */
    indexObserver: Ember.observer('index', function () {
      this.send('toSlide', this.get('index'));
    }),

    /**
     * @property indicators
     * @private
     */
    indicators: Ember.computed('childSlides.length', function () {
      return [].concat(_toConsumableArray(Array(this.get('childSlides.length'))));
    }),

    /**
     * If user is hovering its cursor on component.
     * This property is only manipulated when 'pauseOnMouseEnter' is true.
     *
     * @property isMouseHovering
     * @private
     * @type boolean
     */
    isMouseHovering: false,

    /**
     * The class name to append to the next control link element.
     *
     * @property nextControlClassName
     * @type string
     * @private
     */
    nextControlClassName: null,

    /**
     * Bootstrap style to indicate the next/previous slide.
     *
     * @property orderClassName
     * @private
     * @type string
     */
    orderClassName: null,

    /**
     * The current state of the current presentation, can be either "didTransition"
     * or "willTransit".
     *
     * @private
     * @property presentationState
     * @type string
     */
    presentationState: null,

    /**
     * The class name to append to the previous control link element.
     *
     * @property prevControlClassName
     * @type string
     * @private
     */
    prevControlClassName: null,

    /**
     * @private
     * @property shouldNotDoPresentation
     * @type boolean
     */
    shouldNotDoPresentation: Ember.computed.lte('childSlides.length', 1),

    /**
     * @private
     * @property shouldRunAutomatically
     * @type boolean
     */
    shouldRunAutomatically: Ember.computed.readOnly('hasInterval'),

    /**
     * Starts automatic sliding on page load.
     * This parameter has no effect if interval is less than or equal to zero.
     *
     * @default false
     * @property autoPlay
     * @public
     * @type boolean
     */
    autoPlay: false,

    /**
     * If false will hard stop on corners, i.e., first slide won't make a transition to the
     * last slide and vice versa.
     *
     * @default true
     * @property wrap
     * @public
     * @type boolean
     */
    wrap: true,

    /**
     * Index of starting slide.
     *
     * @default 0
     * @property index
     * @public
     * @type number
     */
    index: 0,

    /**
     * Waiting time before automatically show another slide.
     * Automatic sliding is canceled if interval is less than or equal to zero.
     *
     * @default 5000
     * @property interval
     * @public
     * @type number
     */
    interval: 5000,

    /**
     * Should bind keyboard events into sliding.
     *
     * @default true
     * @property keyboard
     * @public
     * @type boolean
     */
    keyboard: true,

    /**
     * If automatic sliding should be left-to-right or right-to-left.
     * This parameter has no effect if interval is less than or equal to zero.
     *
     * @default true
     * @property ltr
     * @public
     * @type boolean
     */
    ltr: true,

    /**
     * The next control icon to be displayed.
     *
     * @default null
     * @property nextControlIcon
     * @type string
     * @public
     */
    nextControlIcon: null,

    /**
     * Label for screen readers, defaults to 'Next'.
     *
     * @default 'Next'
     * @property nextControlLabel
     * @type string
     * @public
     */
    nextControlLabel: 'Next',

    /**
     * Pauses automatic sliding if mouse cursor is hovering the component.
     * This parameter has no effect if interval is less than or equal to zero.
     *
     * @default true
     * @property pauseOnMouseEnter
     * @public
     * @type boolean
     */
    pauseOnMouseEnter: true,

    /**
     * The previous control icon to be displayed.
     *
     * @default null
     * @property prevControlIcon
     * @type string
     * @public
     */
    prevControlIcon: null,

    /**
     * Label for screen readers, defaults to 'Previous'.
     *
     * @default 'Previous'
     * @property prevControlLabel
     * @type string
     * @public
     */
    prevControlLabel: 'Previous',

    /**
     * Show or hide controls.
     *
     * @default true
     * @property showControls
     * @public
     * @type boolean
     */
    showControls: true,

    /**
     * Show or hide indicators.
     *
     * @default true
     * @property showIndicators
     * @public
     * @type boolean
     */
    showIndicators: true,

    /**
     * The duration of the slide transition.
     * You should also change this parameter in Bootstrap CSS file.
     *
     * @default 600
     * @property transitionDuration
     * @public
     * @type number
     */
    transitionDuration: 600,

    /**
     * The type slide transition to perform.
     * Options are 'fade' or 'slide'. Note: BS4 only
     *
     * @default 'slide'
     * @property transition
     * @public
     * @type string
     */
    transition: 'slide',

    /**
     * Do a presentation and calls itself to perform a cycle.
     *
     * @method cycle
     * @private
     */
    cycle: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.get('transitioner').perform();

            case 2:
              _context.next = 4;
              return (0, _emberConcurrency.timeout)(this.get('interval'));

            case 4:
              this.toAppropriateSlide();

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).restartable(),

    /**
     * @method transitioner
     * @private
     */
    transitioner: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var _this2 = this;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this.set('presentationState', 'willTransit');
              _context2.next = 3;
              return (0, _emberConcurrency.timeout)(this.get('transitionDuration'));

            case 3:
              this.set('presentationState', 'didTransition');
              // Must change current index after execution of 'presentationStateObserver' method
              // from child components.
              _context2.next = 6;
              return new Ember.RSVP.Promise(function (resolve) {
                Ember.run.schedule('afterRender', _this2, function () {
                  this.set('currentIndex', this.get('followingIndex'));
                  resolve();
                });
              });

            case 6:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })).drop(),

    /**
     * Waits an interval time to start a cycle.
     *
     * @method waitIntervalToInitCycle
     * @private
     */
    waitIntervalToInitCycle: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(this.get('shouldRunAutomatically') === false)) {
                _context3.next = 2;
                break;
              }

              return _context3.abrupt('return');

            case 2:
              _context3.next = 4;
              return (0, _emberConcurrency.timeout)(this.get('interval'));

            case 4:
              this.toAppropriateSlide();

            case 5:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    })).restartable(),

    actions: {
      toSlide: function toSlide(toIndex) {
        if (this.get('currentIndex') === toIndex || this.get('shouldNotDoPresentation')) {
          return;
        }
        this.assignClassNameControls(toIndex);
        this.setFollowingIndex(toIndex);
        if (this.get('shouldRunAutomatically') === false || this.get('isMouseHovering')) {
          this.get('transitioner').perform();
        } else {
          this.get('cycle').perform();
        }
      },
      toNextSlide: function toNextSlide() {
        if (this.get('canTurnToRight')) {
          this.send('toSlide', this.get('currentIndex') + 1);
        }
      },
      toPrevSlide: function toPrevSlide() {
        if (this.get('canTurnToLeft')) {
          this.send('toSlide', this.get('currentIndex') - 1);
        }
      }
    },

    /**
     * Indicates what class names should be applicable to the current transition slides.
     *
     * @method assignClassNameControls
     * @private
     */
    assignClassNameControls: function assignClassNameControls(toIndex) {
      if (toIndex < this.get('currentIndex')) {
        this.set('directionalClassName', 'right');
        this.set('orderClassName', 'prev');
      } else {
        this.set('directionalClassName', 'left');
        this.set('orderClassName', 'next');
      }
    },


    /**
     * Initial page loading configuration.
     */
    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);
      this.registerEvents();
      this.set('currentIndex', this.get('index'));
      this.triggerChildSlidesObserver();
    },


    /**
     * mouseEnter() and mouseLeave() doesn't work with ember-native-dom-event-dispatcher.
     *
     * @method registerEvents
     * @private
     */
    registerEvents: function registerEvents() {
      var self = this;
      this.element.addEventListener('mouseenter', function () {
        if (self.get('pauseOnMouseEnter')) {
          self.set('isMouseHovering', true);
          self.get('cycle').cancelAll();
          self.get('waitIntervalToInitCycle').cancelAll();
        }
      });
      this.element.addEventListener('mouseleave', function () {
        if (self.get('pauseOnMouseEnter') && (self.get('transitioner.last') !== null || self.get('waitIntervalToInitCycle.last') !== null)) {
          self.set('isMouseHovering', false);
          self.get('waitIntervalToInitCycle').perform();
        }
      });
    },


    keyDown: function keyDown(e) {
      var code = e.keyCode || e.which;
      if (this.get('keyboard') === false || /input|textarea/i.test(e.target.tagName)) {
        return;
      }
      switch (code) {
        case 37:
          this.send('toPrevSlide');
          break;
        case 39:
          this.send('toNextSlide');
          break;
        default:
          break;
      }
    },

    /**
     * Sets the following slide index within the lower and upper bounds.
     *
     * @method setFollowingIndex
     * @private
     */
    setFollowingIndex: function setFollowingIndex(toIndex) {
      var slidesLengthMinusOne = this.get('childSlides').length - 1;
      if (toIndex > slidesLengthMinusOne) {
        this.set('followingIndex', 0);
      } else if (toIndex < 0) {
        this.set('followingIndex', slidesLengthMinusOne);
      } else {
        this.set('followingIndex', toIndex);
      }
    },


    /**
     * Coordinates the correct slide movement direction.
     *
     * @method toAppropriateSlide
     * @private
     */
    toAppropriateSlide: function toAppropriateSlide() {
      if (this.get('ltr')) {
        this.send('toNextSlide');
      } else {
        this.send('toPrevSlide');
      }
    },


    /**
     * @method triggerChildSlidesObserver
     * @private
     */
    triggerChildSlidesObserver: function triggerChildSlidesObserver() {
      this.get('childSlides');
    }
  });
});