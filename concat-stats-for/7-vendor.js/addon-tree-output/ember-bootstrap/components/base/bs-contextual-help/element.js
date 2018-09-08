define('ember-bootstrap/components/base/bs-contextual-help/element', ['exports', 'ember-bootstrap/templates/components/bs-tooltip/element'], function (exports, _element) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _element.default,
    tagName: '',
    ariaRole: 'tooltip',

    /**
     * @property placement
     * @type string
     * @default 'top'
     * @public
     */
    placement: 'top',

    actualPlacement: Ember.computed.reads('placement'),

    /**
     * @property fade
     * @type boolean
     * @default true
     * @public
     */
    fade: true,

    /**
     * @property showHelp
     * @type boolean
     * @default false
     * @public
     */
    showHelp: false,

    /**
     * If true component will render in place, rather than be wormholed.
     *
     * @property renderInPlace
     * @type boolean
     * @default true
     * @public
     */
    renderInPlace: true,

    /**
     * Which element to align to
     *
     * @property popperTarget
     * @type {string|HTMLElement}
     * @public
     */
    popperTarget: null,

    /**
     * @property autoPlacement
     * @type boolean
     * @default true
     * @public
     */
    autoPlacement: true,

    /**
     * The DOM element of the viewport element.
     *
     * @property viewportElement
     * @type object
     * @public
     */
    viewportElement: null,

    /**
     * Take a padding into account for keeping the tooltip/popover within the bounds of the element given by `viewportElement`.
     *
     * @property viewportPadding
     * @type number
     * @default 0
     * @public
     */
    viewportPadding: 0,

    /**
     * @property arrowClass
     * @private
     */
    arrowClass: 'arrow',

    /**
     * @property popperClassNames
     * @type {array}
     * @private
     */
    popperClassNames: null,

    /**
     * @property popperClass
     * @type {string}
     * @private
     */
    popperClass: Ember.computed('popperClassNames.[]', 'class', function () {
      let classes = this.get('popperClassNames');
      let classProperty = this.get('class');
      if (typeof classProperty === 'string') {
        classes = classes.concat(classProperty.split(' '));
      }
      return classes.join(' ');
    }),

    /**
     * popper.js modifier config
     *
     * @property popperModifiers
     * @type {object}
     * @private
     */
    popperModifiers: Ember.computed('arrowClass', 'autoPlacement', 'viewportElement', 'viewportPadding', function () {
      let self = this;
      return {
        arrow: {
          element: `.${this.get('arrowClass')}`
        },
        offset: {
          fn(data) {
            let tip = document.getElementById(self.get('id'));
            (true && !(tip) && Ember.assert('Contextual help element needs existing popper element', tip));

            // manually read margins because getBoundingClientRect includes difference

            let marginTop = parseInt(window.getComputedStyle(tip).marginTop, 10);
            let marginLeft = parseInt(window.getComputedStyle(tip).marginLeft, 10);

            // we must check for NaN for ie 8/9
            if (isNaN(marginTop) || marginTop > 0) {
              marginTop = 0;
            }
            if (isNaN(marginLeft) || marginLeft > 0) {
              marginLeft = 0;
            }

            data.offsets.popper.top += marginTop;
            data.offsets.popper.left += marginLeft;

            return window.Popper.Defaults.modifiers.offset.fn.apply(this, arguments);
          }
        },
        preventOverflow: {
          enabled: this.get('autoPlacement'),
          boundariesElement: this.get('viewportElement'),
          padding: this.get('viewportPadding')
        },
        hide: {
          enabled: this.get('autoPlacement')
        },
        flip: {
          enabled: this.get('autoPlacement')
        }
      };
    }),

    didReceiveAttrs() {
      (true && !(this.get('id')) && Ember.assert('Contextual help element needs id for popper element', this.get('id')));
    },

    actions: {
      updatePlacement(popperDataObject) {
        if (this.get('actualPlacement') === popperDataObject.placement) {
          return;
        }
        this.set('actualPlacement', popperDataObject.placement);
        Ember.run.scheduleOnce('afterRender', popperDataObject.instance, popperDataObject.instance.scheduleUpdate);
      }
    }
  });
});