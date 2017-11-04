import Service from '@ember/service';
import Pretender from 'npm:pretender';

export default Service.extend({
  init() {
    this._super(...arguments);
    this.set('server', new Pretender());
  }
});
