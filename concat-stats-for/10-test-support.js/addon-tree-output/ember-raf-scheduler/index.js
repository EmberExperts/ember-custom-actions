define('ember-raf-scheduler/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  class Token {
    constructor(parent) {
      this._parent = parent;
      this._cancelled = false;

      if (true) {
        Object.seal(this);
      }
    }

    get cancelled() {
      return this._cancelled || (this._cancelled = this._parent ? this._parent.cancelled : false);
    }

    cancel() {
      this._cancelled = true;
    }
  }

  exports.Token = Token;
  function job(cb, token) {
    return function execJob() {
      if (token.cancelled === false) {
        cb();
      }
    };
  }

  class Scheduler {
    constructor() {
      this.sync = [];
      this.layout = [];
      this.measure = [];
      this.affect = [];
      this.jobs = 0;
      this._nextFlush = null;
      this.ticks = 0;

      if (true) {
        Object.seal(this);
      }
    }

    schedule(queueName, cb, parent) {
      (true && !(queueName in this) && Ember.assert(`Attempted to schedule to unknown queue: ${queueName}`, queueName in this));


      this.jobs++;
      let token = new Token(parent);

      this[queueName].push(job(cb, token));
      this._flush();

      return token;
    }

    forget(token) {
      // TODO add explicit test
      if (token) {
        token.cancel();
      }
    }

    _flush() {
      if (this._nextFlush !== null) {
        return;
      }

      this._nextFlush = requestAnimationFrame(() => {
        this.flush();
      });
    }

    flush() {
      let i, q;
      this.jobs = 0;

      if (this.sync.length > 0) {
        Ember.run.begin();
        q = this.sync;
        this.sync = [];

        for (i = 0; i < q.length; i++) {
          q[i]();
        }
        Ember.run.end();
      }

      if (this.layout.length > 0) {
        q = this.layout;
        this.layout = [];

        for (i = 0; i < q.length; i++) {
          q[i]();
        }
      }

      if (this.measure.length > 0) {
        q = this.measure;
        this.measure = [];

        for (i = 0; i < q.length; i++) {
          q[i]();
        }
      }

      if (this.affect.length > 0) {
        q = this.affect;
        this.affect = [];

        for (i = 0; i < q.length; i++) {
          q[i]();
        }
      }

      this._nextFlush = null;
      if (this.jobs > 0) {
        this._flush();
      }
    }
  }

  exports.Scheduler = Scheduler;
  const scheduler = exports.scheduler = new Scheduler();

  exports.default = scheduler;
});