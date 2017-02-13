import Ember from 'ember';
import Pretender from 'pretender';

const { Service } = Ember;

export default Service.extend({
  init() {
    this._super(...arguments);
    this.set('server', new Pretender());
  }
});
