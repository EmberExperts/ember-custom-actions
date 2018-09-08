define('ember-popper/components/ember-popper-targeting-parent', ['exports', 'ember-popper/components/ember-popper-base', 'ember-popper/templates/components/ember-popper-targeting-parent'], function (exports, _emberPopperBase, _emberPopperTargetingParent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  let EmberPopperTargetingParent = class EmberPopperTargetingParent extends _emberPopperBase.default {
    constructor(...args) {
      var _temp;

      return _temp = super(...args), this.layout = _emberPopperTargetingParent.default, _temp;
    }

    // ================== LIFECYCLE HOOKS ==================

    init() {
      this.id = this.id || `${Ember.guidFor(this)}-popper`;
      this._parentFinder = self.document ? self.document.createTextNode('') : '';

      super.init(...arguments);
    }

    didInsertElement() {
      this._initialParentNode = this._parentFinder.parentNode;

      super.didInsertElement(...arguments);
    }

    /**
     * Used to get the popper target whenever updating the Popper
     */
    _getPopperTarget() {
      return this._initialParentNode;
    }
  };
  exports.default = EmberPopperTargetingParent;
});