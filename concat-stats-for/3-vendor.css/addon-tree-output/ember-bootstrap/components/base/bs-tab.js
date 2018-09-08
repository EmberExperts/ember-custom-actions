define('ember-bootstrap/components/base/bs-tab', ['exports', 'ember-bootstrap/templates/components/bs-tab', 'ember-bootstrap/mixins/component-parent', 'ember-bootstrap/components/bs-tab/pane', 'ember-bootstrap/utils/listen-to-cp'], function (exports, _bsTab, _componentParent, _pane, _listenToCp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_componentParent.default, {
    layout: _bsTab.default,

    /**
     * Type of nav, either "pills" or "tabs"
     *
     * @property type
     * @type String
     * @default 'tabs'
     * @public
     */
    type: 'tabs',

    /**
     * By default the tabs will be automatically generated using the available [TabPane](Components.TabPane.html)
     * components. If set to true, you can deactivate this and setup the tabs manually. See the example above.
     *
     * @property customTabs
     * @type boolean
     * @default false
     * @public
     */
    customTabs: false,

    /**
     * The id (`elementId`) of the active [TabPane](Components.TabPane.html).
     * By default the first tab will be active, but this can be changed by setting this property
     *
     * ```hbs
     * {{#bs-tab activeId="pane2"}}
     *   {{#tab.pane id="pane1" title="Tab 1"}}
     *      ...
     *   {{/tab.pane}}
     *   {{#tab.pane id="pane1" title="Tab 1"}}
     *     ...
     *   {{/tab.pane}}
     * {{/bs-tab}}
     * ```
     *
     * When the selection is changed by user interaction this property will not update by using two-way bindings in order
     * to follow DDAU best practices. If you want to react to such changes, subscribe to the `onChange` action
     *
     * @property activeId
     * @type string
     * @public
     */
    activeId: Ember.computed.oneWay('childPanes.firstObject.elementId'),

    /**
     * @property isActiveId
     * @private
     */
    isActiveId: (0, _listenToCp.default)('activeId'),

    /**
     * Set to false to disable the fade animation when switching tabs.
     *
     * @property fade
     * @type boolean
     * @default true
     * @public
     */
    fade: true,

    /**
     * The duration of the fade animation
     *
     * @property fadeDuration
     * @type integer
     * @default 150
     * @public
     */
    fadeDuration: 150,

    /**
     * This action is called when switching the active tab, with the new and previous pane id
     *
     * You can return false to prevent changing the active tab automatically, and do that in your action by
     * setting `activeId`.
     *
     * @event onChange
     * @public
     */
    onChange: function onChange() {},


    /**
     * All `TabPane` child components
     *
     * @property childPanes
     * @type array
     * @readonly
     * @private
     */
    childPanes: Ember.computed.filter('children', function (view) {
      return view instanceof _pane.default;
    }),

    /**
     * Array of objects that define the tab structure
     *
     * @property navItems
     * @type array
     * @readonly
     * @private
     */
    navItems: Ember.computed('childPanes.@each.{elementId,title,group}', function () {
      var items = Ember.A();
      this.get('childPanes').forEach(function (pane) {
        var groupTitle = pane.get('groupTitle');
        var item = pane.getProperties('elementId', 'title');
        if (Ember.isPresent(groupTitle)) {
          var group = items.findBy('groupTitle', groupTitle);
          if (group) {
            group.children.push(item);
            group.childIds.push(item.elementId);
          } else {
            items.push({
              isGroup: true,
              groupTitle: groupTitle,
              children: Ember.A([item]),
              childIds: Ember.A([item.elementId])
            });
          }
        } else {
          items.push(item);
        }
      });
      return items;
    }),

    actions: {
      select: function select(id) {
        var previous = this.get('isActiveId');
        if (this.get('onChange')(id, previous) !== false) {
          // change active tab when `onChange` does not return false
          this.set('isActiveId', id);
        }
      }
    }
  });
});