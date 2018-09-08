define('@ember/test-helpers/dom/get-root-element', ['exports', '@ember/test-helpers/setup-context'], function (exports, _setupContext) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getRootElement;


  /**
    Get the root element of the application under test (usually `#ember-testing`)
  
    @public
    @returns {Element} the root element
  */
  function getRootElement() {
    var context = (0, _setupContext.getContext)();
    var owner = context && context.owner;

    if (!owner) {
      throw new Error('Must setup rendering context before attempting to interact with elements.');
    }

    var rootElementSelector = void 0;
    // When the host app uses `setApplication` (instead of `setResolver`) the owner has
    // a `rootElement` set on it with the element id to be used
    if (owner && owner._emberTestHelpersMockOwner === undefined) {
      rootElementSelector = owner.rootElement;
    } else {
      rootElementSelector = '#ember-testing';
    }

    var rootElement = document.querySelector(rootElementSelector);

    return rootElement;
  }
});