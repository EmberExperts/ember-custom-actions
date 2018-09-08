define('@ember/test-helpers/dom/trigger-event', ['exports', '@ember/test-helpers/dom/-get-element', '@ember/test-helpers/dom/fire-event', '@ember/test-helpers/settled', '@ember/test-helpers/-utils'], function (exports, _getElement, _fireEvent, _settled, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = triggerEvent;


  /**
    Triggers an event on the specified target.
  
    @public
    @param {string|Element} target the element or selector to trigger the event on
    @param {string} eventType the type of event to trigger
    @param {Object} options additional properties to be set on the event
    @return {Promise<void>} resolves when the application is settled
  */
  function triggerEvent(target, eventType, options) {
    return (0, _utils.nextTickPromise)().then(function () {
      if (!target) {
        throw new Error('Must pass an element or selector to `triggerEvent`.');
      }

      var element = (0, _getElement.default)(target);
      if (!element) {
        throw new Error('Element not found when calling `triggerEvent(\'' + target + '\', ...)`.');
      }

      if (!eventType) {
        throw new Error('Must provide an `eventType` to `triggerEvent`');
      }

      (0, _fireEvent.default)(element, eventType, options);

      return (0, _settled.default)();
    });
  }
});