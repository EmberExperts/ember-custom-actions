define('@ember/test-helpers/dom/wait-for', ['exports', '@ember/test-helpers/wait-until', '@ember/test-helpers/dom/-get-element', '@ember/test-helpers/dom/-get-elements', '@ember/test-helpers/dom/-to-array', '@ember/test-helpers/-utils'], function (exports, _waitUntil, _getElement, _getElements, _toArray, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = waitFor;


  /**
    Used to wait for a particular selector to appear in the DOM. Due to the fact
    that it does not wait for general settledness, this is quite useful for testing
    interim DOM states (e.g. loading states, pending promises, etc).
  
    @param {string} selector the selector to wait for
    @param {Object} [options] the options to be used
    @param {number} [options.timeout=1000] the time to wait (in ms) for a match
    @param {number} [options.count=null] the number of elements that should match the provided selector (null means one or more)
    @returns {Element|Array<Element>} the element (or array of elements) that were being waited upon
  */
  function waitFor(selector) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === undefined ? 1000 : _ref$timeout,
        _ref$count = _ref.count,
        count = _ref$count === undefined ? null : _ref$count,
        _ref$timeoutMessage = _ref.timeoutMessage,
        timeoutMessage = _ref$timeoutMessage === undefined ? 'waitFor timed out' : _ref$timeoutMessage;

    return (0, _utils.nextTickPromise)().then(function () {
      if (!selector) {
        throw new Error('Must pass a selector to `waitFor`.');
      }

      var callback = void 0;
      if (count !== null) {
        callback = function callback() {
          var elements = (0, _getElements.default)(selector);
          if (elements.length === count) {
            return (0, _toArray.default)(elements);
          }
        };
      } else {
        callback = function callback() {
          return (0, _getElement.default)(selector);
        };
      }
      return (0, _waitUntil.default)(callback, { timeout: timeout, timeoutMessage: timeoutMessage });
    });
  }
});