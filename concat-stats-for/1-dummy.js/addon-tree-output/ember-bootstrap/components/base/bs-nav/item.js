define('ember-bootstrap/components/base/bs-nav/item', ['exports', 'ember-bootstrap/templates/components/bs-nav/item', 'ember-bootstrap/mixins/component-parent'], function (exports, _item, _componentParent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_componentParent.default, {
    layout: _item.default,
    classNameBindings: ['disabled', 'active'],
    tagName: 'li',
    ariaRole: 'presentation',

    /**
     * Render the nav item as disabled (see [Bootstrap docs](http://getbootstrap.com/components/#nav-disabled-links)).
     * By default it will look at any nested `link-to` components and make itself disabled if there is a disabled link.
     * See the [link-to API](http://emberjs.com/api/classes/Ember.Templates.helpers.html#toc_disabling-the-code-link-to-code-component)
     *
     * @property disabled
     * @type boolean
     * @public
     */
    disabled: Ember.computed.reads('_disabled'),
    _disabled: false,

    /**
     * Render the nav item as active.
     * By default it will look at any nested `link-to` components and make itself active if there is an active link
     * (i.e. the link points to the current route).
     * See the [link-to API](http://emberjs.com/api/classes/Ember.Templates.helpers.html#toc_handling-current-route)
     *
     * @property active
     * @type boolean
     * @public
     */
    active: Ember.computed.reads('_active'),
    _active: false,

    /**
     * Collection of all `Ember.LinkComponent`s that are children
     *
     * @property childLinks
     * @private
     */
    childLinks: Ember.computed.filter('children', function (view) {
      return view instanceof Ember.LinkComponent;
    }),

    activeChildLinks: Ember.computed.filterBy('childLinks', 'active'),
    hasActiveChildLinks: Ember.computed.gt('activeChildLinks.length', 0),

    disabledChildLinks: Ember.computed.filterBy('childLinks', 'disabled'),
    hasDisabledChildLinks: Ember.computed.gt('disabledChildLinks.length', 0),

    /**
     * Called when clicking the nav item
     *
     * @event onClick
     * @public
     */
    onClick: function onClick() {},
    click: function click() {
      this.onClick();
    },
    init: function init() {
      this._super.apply(this, arguments);
      this.get('activeChildLinks');
      this.get('disabledChildLinks');
    },


    _observeActive: Ember.observer('activeChildLinks.[]', function () {
      Ember.run.scheduleOnce('afterRender', this, this._updateActive);
    }),

    _updateActive: function _updateActive() {
      this.set('_active', this.get('hasActiveChildLinks'));
    },


    _observeDisabled: Ember.observer('disabledChildLinks.[]', function () {
      Ember.run.scheduleOnce('afterRender', this, this._updateDisabled);
    }),

    _updateDisabled: function _updateDisabled() {
      this.set('_disabled', this.get('hasDisabledChildLinks'));
    }
  });
});