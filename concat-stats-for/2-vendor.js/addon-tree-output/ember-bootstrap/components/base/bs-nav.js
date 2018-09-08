define('ember-bootstrap/components/base/bs-nav', ['exports', 'ember-bootstrap/templates/components/bs-nav'], function (exports, _bsNav) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _bsNav.default,

    tagName: 'ul',
    classNames: ['nav'],

    classNameBindings: ['typeClass', 'justified:nav-justified'],

    typeClass: Ember.computed('type', function () {
      var type = this.get('type');
      if (Ember.isPresent(type)) {
        return 'nav-' + type;
      }
    }),

    /**
     * Special type of nav, either "pills" or "tabs"
     *
     * @property type
     * @type String
     * @default null
     * @public
     */
    type: null,

    /**
     * Make the nav justified, see [bootstrap docs](http://getbootstrap.com/components/#nav-justified)
     *
     * @property justified
     * @type boolean
     * @default false
     * @public
     */
    justified: false,

    /**
     * Make the nav pills stacked, see [bootstrap docs](http://getbootstrap.com/components/#nav-pills)
     *
     * @property stacked
     * @type boolean
     * @default false
     * @public
     */
    stacked: false,

    /**
     * @property itemComponent
     * @type {String}
     * @private
     */
    itemComponent: 'bs-nav/item',

    /**
     * @property linkToComponent
     * @type {String}
     * @private
     */
    linkToComponent: 'bs-nav/link-to',

    /**
     * @property dropdownComponent
     * @type {String}
     * @private
     */
    dropdownComponent: 'bs-dropdown'
  });
});