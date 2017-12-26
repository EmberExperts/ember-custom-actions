import Component from '@ember/component';
import jQuery from 'jquery';
import { next } from '@ember/runloop';

export default Component.extend({
  tagName: 'a',
  offset: 0,

  click() {
    next(() => {
      jQuery('html, body').animate({
        scrollTop: jQuery(this.get('href')).offset().top + this.get('offset')
      }, 1000);
    });
  }
});
