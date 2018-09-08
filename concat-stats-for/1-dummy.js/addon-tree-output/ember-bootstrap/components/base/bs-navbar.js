define('ember-bootstrap/components/base/bs-navbar', ['exports', 'ember-bootstrap/mixins/type-class', 'ember-bootstrap/templates/components/bs-navbar', 'ember-bootstrap/utils/listen-to-cp'], function (exports, _typeClass, _bsNavbar, _listenToCp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_typeClass.default, {
    layout: _bsNavbar.default,

    tagName: 'nav',
    classNames: ['navbar'],
    classNameBindings: ['positionClass'],

    classTypePrefix: 'navbar',

    /**
     * Manages the state for the responsive menu between the toggle and the content.
     *
     * @property collapsed
     * @type boolean
     * @default true
     * @public
     */
    collapsed: true,

    /**
     * @property _collapsed
     * @private
     */
    _collapsed: (0, _listenToCp.default)('collapsed'),

    /**
     * Controls whether the wrapping div is a fluid container or not.
     *
     * @property fluid
     * @type boolean
     * @default true
     * @public
     */
    fluid: true,

    /**
     * Specifies the position classes for the navbar, currently supporting none, "fixed-top", "fixed-bottom", and
     * either "static-top" (BS3) or "sticky-top" (BS4).
     * See the [bootstrap docs](http://getbootstrap.com/components/#navbar-fixed-top) for details.
     *
     * @property position
     * @type String
     * @default null
     * @public
     */
    position: null,

    positionClass: Ember.computed('position', function () {
      var position = this.get('position');
      var validPositions = this.get('_validPositions');
      var positionPrefix = this.get('_positionPrefix');

      if (validPositions.indexOf(position) === -1) {
        return null;
      }

      return '' + positionPrefix + position;
    }),

    /**
     * The action to be sent when the navbar is about to be collapsed.
     *
     * You can return false to prevent collapsing the navbar automatically, and do that in your action by
     * setting `collapsed` to true.
     *
     * @event onCollapse
     * @public
     */
    onCollapse: function onCollapse() {},


    /**
     * The action to be sent after the navbar has been collapsed (including the CSS transition).
     *
     * @event onCollapsed
     * @public
     */
    onCollapsed: function onCollapsed() {},


    /**
     * The action to be sent when the navbar is about to be expanded.
     *
     * You can return false to prevent expanding the navbar automatically, and do that in your action by
     * setting `collapsed` to false.
     *
     * @event onExpand
     * @public
     */
    onExpand: function onExpand() {},


    /**
     * The action to be sent after the navbar has been expanded (including the CSS transition).
     *
     * @event onExpanded
     * @public
     */
    onExpanded: function onExpanded() {},


    _onCollapsedChange: Ember.observer('_collapsed', function () {
      var collapsed = this.get('_collapsed');
      var active = this.get('active');
      if (collapsed !== active) {
        return;
      }
      if (collapsed === false) {
        this.show();
      } else {
        this.hide();
      }
    }),

    /**
     * @method expand
     * @private
     */
    expand: function expand() {
      if (this.onExpand() !== false) {
        this.set('_collapsed', false);
      }
    },


    /**
     * @method collapse
     * @private
     */
    collapse: function collapse() {
      if (this.onCollapse() !== false) {
        this.set('_collapsed', true);
      }
    },


    actions: {
      expand: function expand() {
        this.expand();
      },
      collapse: function collapse() {
        this.collapse();
      },
      toggleNavbar: function toggleNavbar() {
        if (this.get('_collapsed')) {
          this.expand();
        } else {
          this.collapse();
        }
      }
    }

    /**
     * Bootstrap 4 Only: Defines the responsive toggle breakpoint size. Options are the standard
     * two character Bootstrap size abbreviations. Used to set the `navbar-expand-*`
     * class. Set to `null` to disable collapsing.
     *
     * @property toggleBreakpoint
     * @type String
     * @default 'lg'
     * @public
     */

    /**
     * Bootstrap 4 Only: Sets the background color for the navbar. Can be any color
     * in the set that composes the `bg-*` classes and can be extended by creating your
     * own `bg-*` classes.
     *
     * @property backgroundColor
     * @type String
     * @default 'light'
     * @public
     */
  });
});