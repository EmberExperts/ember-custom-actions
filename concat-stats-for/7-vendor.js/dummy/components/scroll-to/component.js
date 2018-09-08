define('dummy/components/scroll-to/component', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    tagName: 'a',
    offset: -65,

    click() {
      Ember.run.next(() => {
        let element = document.querySelector(this.get('href'));
        let position = element.offsetTop + this.get('offset');

        window.scroll({ top: position, behavior: 'smooth' });
      });
    }
  });
});