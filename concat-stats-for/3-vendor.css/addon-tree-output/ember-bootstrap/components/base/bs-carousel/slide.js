define('ember-bootstrap/components/base/bs-carousel/slide', ['exports', 'ember-bootstrap/mixins/component-child', 'ember-bootstrap/templates/components/bs-carousel/slide'], function (exports, _componentChild, _slide) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_componentChild.default, {
    classNameBindings: ['active'],
    layout: _slide.default,

    /**
     * Defines slide visibility.
     *
     * @property active
     * @type boolean
     * @private
     */
    active: Ember.computed('isCurrentSlide', 'presentationState', function () {
      return this.get('isCurrentSlide') && this.get('presentationState') === null;
    }),

    /**
     * @private
     * @property isCurrentSlide
     * @type boolean
     */
    isCurrentSlide: Ember.computed('currentSlide', function () {
      return this.get('currentSlide') === this;
    }).readOnly(),

    /**
     * @private
     * @property isFollowingSlide
     * @type boolean
     */
    isFollowingSlide: Ember.computed('followingSlide', function () {
      return this.get('followingSlide') === this;
    }).readOnly(),

    /**
     * Slide is moving to the left.
     *
     * @property left
     * @type boolean
     * @private
     */
    left: false,

    /**
     * Next to appear in a left sliding.
     *
     * @property next
     * @type boolean
     * @private
     */
    next: false,

    /**
     * Next to appear in a right sliding.
     *
     * @property prev
     * @type boolean
     * @private
     */
    prev: false,

    /**
     * Slide is moving to the right.
     *
     * @property right
     * @type boolean
     * @private
     */
    right: false,

    /**
     * Coordinates the execution of a presentation.
     *
     * @method presentationStateObserver
     * @private
     */
    presentationStateObserver: Ember.observer('presentationState', function () {
      var presentationState = this.get('presentationState');
      if (this.get('isCurrentSlide')) {
        switch (presentationState) {
          case 'didTransition':
            this.currentSlideDidTransition();
            break;
          case 'willTransit':
            this.currentSlideWillTransit();
            break;
        }
      }
      if (this.get('isFollowingSlide')) {
        switch (presentationState) {
          case 'didTransition':
            this.followingSlideDidTransition();
            break;
          case 'willTransit':
            this.followingSlideWillTransit();
            break;
        }
      }
    }),

    /**
     * @method currentSlideDidTransition
     * @private
     */
    currentSlideDidTransition: function currentSlideDidTransition() {
      this.set(this.get('directionalClassName'), false);
      this.set('active', false);
    },


    /**
     * @method currentSlideWillTransit
     * @private
     */
    currentSlideWillTransit: function currentSlideWillTransit() {
      this.set('active', true);
      Ember.run.next(this, function () {
        this.set(this.get('directionalClassName'), true);
      });
    },


    /**
     * @method followingSlideDidTransition
     * @private
     */
    followingSlideDidTransition: function followingSlideDidTransition() {
      this.set('active', true);
      this.set(this.get('directionalClassName'), false);
      this.set(this.get('orderClassName'), false);
    },


    /**
     * @method followingSlideWillTransit
     * @private
     */
    followingSlideWillTransit: function followingSlideWillTransit() {
      this.set(this.get('orderClassName'), true);
      Ember.run.next(this, function () {
        this.reflow();
        this.set(this.get('directionalClassName'), true);
      });
    },


    /**
     * Makes things more stable, especially when fast changing.
     */
    reflow: function reflow() {
      this.element.offsetHeight;
    }
  });
});