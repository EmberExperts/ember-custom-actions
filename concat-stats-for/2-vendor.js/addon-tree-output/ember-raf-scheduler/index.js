define('ember-raf-scheduler/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Token = exports.Token = function () {
    function Token(parent) {
      _classCallCheck(this, Token);

      this._parent = parent;
      this._cancelled = false;

      if (false /* DEBUG */) {
        Object.seal(this);
      }
    }

    _createClass(Token, [{
      key: 'cancel',
      value: function cancel() {
        this._cancelled = true;
      }
    }, {
      key: 'cancelled',
      get: function get() {
        return this._cancelled || (this._cancelled = this._parent ? this._parent.cancelled : false);
      }
    }]);

    return Token;
  }();

  function job(cb, token) {
    return function execJob() {
      if (token.cancelled === false) {
        cb();
      }
    };
  }

  var Scheduler = exports.Scheduler = function () {
    function Scheduler() {
      _classCallCheck(this, Scheduler);

      this.sync = [];
      this.layout = [];
      this.measure = [];
      this.affect = [];
      this.jobs = 0;
      this._nextFlush = null;
      this.ticks = 0;

      if (false /* DEBUG */) {
        Object.seal(this);
      }
    }

    _createClass(Scheduler, [{
      key: 'schedule',
      value: function schedule(queueName, cb, parent) {
        (false && !(queueName in this) && Ember.assert('Attempted to schedule to unknown queue: ' + queueName, queueName in this));


        this.jobs++;
        var token = new Token(parent);

        this[queueName].push(job(cb, token));
        this._flush();

        return token;
      }
    }, {
      key: 'forget',
      value: function forget(token) {
        // TODO add explicit test
        if (token) {
          token.cancel();
        }
      }
    }, {
      key: '_flush',
      value: function _flush() {
        var _this = this;

        if (this._nextFlush !== null) {
          return;
        }

        this._nextFlush = requestAnimationFrame(function () {
          _this.flush();
        });
      }
    }, {
      key: 'flush',
      value: function flush() {
        var i = void 0,
            q = void 0;
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
    }]);

    return Scheduler;
  }();

  var scheduler = exports.scheduler = new Scheduler();

  exports.default = scheduler;
});