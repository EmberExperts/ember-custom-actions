define('ember-bootstrap/components/base/bs-dropdown/menu', ['exports', 'ember-bootstrap/templates/components/bs-dropdown/menu'], function (exports, _menu) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _menu.default,

    /**
     * Defaults to a `<ul>` tag in BS3 and a `<div>` tag in BS4. Change for other types of dropdown menus.
     *
     * @property tagName
     * @type string
     * @default ul
     * @public
     */
    tagName: '',

    /**
     * @property ariaRole
     * @default menu
     * @type string
     * @protected
     */
    ariaRole: 'menu',

    /**
     * Alignment of the menu, either "left" or "right"
     *
     * @property align
     * @type string
     * @default left
     * @public
     */
    align: 'left',

    /**
     * @property direction
     * @default 'down'
     * @type string
     * @private
     */
    direction: 'down',

    /**
     * @property inNav
     * @type {boolean}
     * @private
     */
    inNav: false,

    /**
     * By default the menu is rendered in the same place the dropdown. If you experience clipping
     * issues, you can set this to false to render the menu in a wormhole at the top of the DOM.
     *
     * @property renderInPlace
     * @type boolean
     * @default true
     * @public
     */
    renderInPlace: true,

    /**
     * @property _renderInPlace
     * @type boolean
     * @private
     */
    _renderInPlace: Ember.computed('renderInPlace', function () {
      return this.get('renderInPlace') || typeof document === 'undefined' || !document.getElementById('ember-bootstrap-wormhole');
    }),

    alignClass: Ember.computed('align', function () {
      if (this.get('align') !== 'left') {
        return 'dropdown-menu-' + this.get('align');
      }
    }),

    isOpen: Ember.computed({
      get: function get() {
        return false;
      },
      set: function set(key, value) {
        var update = this.get('_popperApi.update');
        update && update();
        return value;
      }
    }),

    flip: true,

    _popperApi: null,

    popperPlacement: Ember.computed('direction', 'align', function () {
      var placement = 'bottom-start';

      var _getProperties = this.getProperties('direction', 'align'),
          direction = _getProperties.direction,
          align = _getProperties.align;

      if (direction === 'up') {
        placement = 'top-start';
        if (align === 'right') {
          placement = 'top-end';
        }
      } else if (direction === 'left') {
        placement = 'left-start';
      } else if (direction === 'right') {
        placement = 'right-start';
      } else if (align === 'right') {
        placement = 'bottom-end';
      }
      return placement;
    }),

    popperModifiers: Ember.computed('inNav', 'flip', function () {
      return {
        // @todo add offset config
        applyStyle: {
          enabled: !this.get('inNav')
        },
        flip: {
          enabled: this.get('flip')
        }
      };
    }),

    actions: {
      registerPopperApi: function registerPopperApi(api) {
        this.set('_popperApi', api);
      }
    }
  });
});