define('dummy/components/scroll-to/component', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    tagName: 'a',
    offset: -65,

    click: function click() {
      var _this = this;

      Ember.run.next(function () {
        var element = document.querySelector(_this.get('href'));
        var position = element.offsetTop + _this.get('offset');

        window.scroll({ top: position, behavior: 'smooth' });
      });
    }
  });
});