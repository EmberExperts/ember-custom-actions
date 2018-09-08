define('ember-bootstrap/components/base/bs-alert', ['exports', 'ember-bootstrap/mixins/transition-support', 'ember-bootstrap/templates/components/bs-alert', 'ember-bootstrap/mixins/type-class', 'ember-bootstrap/utils/listen-to-cp'], function (exports, _transitionSupport, _bsAlert, _typeClass, _listenToCp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_typeClass.default, _transitionSupport.default, {
    layout: _bsAlert.default,
    classNameBindings: ['alert', 'fade', 'dismissible:alert-dismissible'],

    /**
     * A dismissible alert will have a close button in the upper right corner, that the user can click to dismiss
     * the alert.
     *
     * @property dismissible
     * @type boolean
     * @default true
     * @public
     */
    dismissible: true,

    /**
     * If true the alert is completely hidden. Will be set when the fade animation has finished.
     *
     * @property hidden
     * @type boolean
     * @default false
     * @readonly
     * @private
     */
    hidden: false,

    /**
     * This property controls if the alert should be visible. If false it might still be in the DOM until the fade animation
     * has completed.
     *
     * When the alert is dismissed by user interaction this property will not update by using two-way bindings in order
     * to follow DDAU best practices. If you want to react to such changes, subscribe to the `onDismiss` action
     *
     * @property visible
     * @type boolean
     * @default true
     * @public
     */
    visible: true,

    /**
     * @property _visible
     * @private
     */
    _visible: (0, _listenToCp.default)('visible'),

    /**
     * @property notVisible
     * @private
     */
    notVisible: Ember.computed.not('_visible'),

    /**
     * Set to false to disable the fade out animation when hiding the alert.
     *
     * @property fade
     * @type boolean
     * @default true
     * @public
     */
    fade: true,

    /**
     * Computed property to set the alert class to the component div. Will be false when dismissed to have the component
     * div (which cannot be removed form DOM by the component itself) without any markup.
     *
     * @property alert
     * @type boolean
     * @private
     */
    alert: Ember.computed.not('hidden'),
    showAlert: Ember.computed.and('_visible', 'fade'),

    /**
     * @property classTypePrefix
     * @type String
     * @default 'alert'
     * @private
     */
    classTypePrefix: 'alert',

    /**
     * The duration of the fade out animation
     *
     * @property fadeDuration
     * @type number
     * @default 150
     * @public
     */
    fadeDuration: 150,

    /**
     * The action to be sent after the alert has been dismissed (including the CSS transition).
     *
     * @event onDismissed
     * @public
     */
    onDismissed: function onDismissed() {},


    /**
     * The action is called when the close button is clicked.
     *
     * You can return false to prevent closing the alert automatically, and do that in your action by
     * setting `visible` to false.
     *
     * @event onDismiss
     * @public
     */
    onDismiss: function onDismiss() {},


    actions: {
      dismiss: function dismiss() {
        if (this.get('onDismiss')() !== false) {
          this.set('_visible', false);
        }
      }
    },

    /**
     * Call to make the alert visible again after it has been hidden
     *
     * @method show
     * @private
     */
    show: function show() {
      this.set('hidden', false);
    },


    /**
     * Call to hide the alert. If the `fade` property is true, this will fade out the alert before being finally
     * dismissed.
     *
     * @method hide
     * @private
     */
    hide: function hide() {
      if (this.get('usesTransition')) {
        Ember.run.later(this, function () {
          if (!this.get('isDestroyed')) {
            this.set('hidden', true);
            this.get('onDismissed')();
          }
        }, this.get('fadeDuration'));
      } else {
        this.set('hidden', true);
        this.get('onDismissed')();
      }
    },
    init: function init() {
      this._super.apply(this, arguments);
      this.set('hidden', !this.get('_visible'));
    },


    _observeIsVisible: Ember.observer('_visible', function () {
      if (this.get('_visible')) {
        this.show();
      } else {
        this.hide();
      }
    })
  });
});