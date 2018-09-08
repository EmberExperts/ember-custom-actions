import Service from '@ember/service';
import Pretender from 'pretender';

export default Service.extend({
  init() {
    this._super(...arguments);
    this.set('server', new Pretender());
  }
});
