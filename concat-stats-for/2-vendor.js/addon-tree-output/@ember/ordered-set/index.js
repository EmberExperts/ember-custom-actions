define('@ember/ordered-set/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var NEEDS_CUSTOM_ORDERED_SET = false;

  var OrderedSet = void 0;

  if (NEEDS_CUSTOM_ORDERED_SET) {
    /**
    @class OrderedSet
    @constructor
    */
    OrderedSet = function () {
      function OrderedSet() {
        _classCallCheck(this, OrderedSet);

        this.clear();
      }

      /**
      @method create
      @static
      @return {OrderedSet}
      */


      OrderedSet.create = function create() {
        var Constructor = this;
        return new Constructor();
      };

      OrderedSet.prototype.clear = function clear() {
        this.presenceSet = Object.create(null);
        this.list = [];
        this.size = 0;
      };

      OrderedSet.prototype.add = function add(obj, _guid) {
        var guid = _guid || Ember.guidFor(obj);
        var presenceSet = this.presenceSet;
        var list = this.list;

        if (presenceSet[guid] !== true) {
          presenceSet[guid] = true;
          this.size = list.push(obj);
        }

        return this;
      };

      OrderedSet.prototype.delete = function _delete(obj, _guid) {
        var guid = _guid || Ember.guidFor(obj);
        var presenceSet = this.presenceSet;
        var list = this.list;

        if (presenceSet[guid] === true) {
          delete presenceSet[guid];
          var index = list.indexOf(obj);
          if (index > -1) {
            list.splice(index, 1);
          }
          this.size = list.length;
          return true;
        } else {
          return false;
        }
      };

      OrderedSet.prototype.isEmpty = function isEmpty() {
        return this.size === 0;
      };

      OrderedSet.prototype.has = function has(obj) {
        if (this.size === 0) {
          return false;
        }

        var guid = Ember.guidFor(obj);
        var presenceSet = this.presenceSet;

        return presenceSet[guid] === true;
      };

      OrderedSet.prototype.forEach = function forEach(fn /*, ...thisArg*/) {
        (false && !(typeof fn === 'function') && Ember.assert(Object.prototype.toString.call(fn) + ' is not a function', typeof fn === 'function'));


        if (this.size === 0) {
          return;
        }

        var list = this.list;

        if (arguments.length === 2) {
          for (var i = 0; i < list.length; i++) {
            fn.call(arguments[1], list[i]);
          }
        } else {
          for (var _i = 0; _i < list.length; _i++) {
            fn(list[_i]);
          }
        }
      };

      OrderedSet.prototype.toArray = function toArray() {
        return this.list.slice();
      };

      OrderedSet.prototype.copy = function copy() {
        var Constructor = this.constructor;
        var set = new Constructor();

        set.presenceSet = Object.create(null);

        for (var prop in this.presenceSet) {
          // hasOwnPropery is not needed because obj is Object.create(null);
          set.presenceSet[prop] = this.presenceSet[prop];
        }

        set.list = this.toArray();
        set.size = this.size;

        return set;
      };

      return OrderedSet;
    }();
  } else {
    OrderedSet = Ember.__OrderedSet__ || Ember.OrderedSet;
  }

  exports.default = OrderedSet;
});