define('@ember-decorators/data/index', ['exports', 'ember-data', '@ember-decorators/utils/computed'], function (exports, _emberData, _computed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.belongsTo = exports.hasMany = exports.attr = undefined;

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function computedDecoratorWithKeyReflection(fn) {
    return (0, _computed.computedDecoratorWithParams)(function (target, keyName, desc, params) {
      var key = void 0;

      if (typeof params[0] === 'string') {
        key = params.shift();
      } else {
        key = keyName;
      }

      return fn.apply(undefined, [key].concat(_toConsumableArray(params)));
    });
  }

  /**
    Decorator that turns the property into an Ember Data attribute
  
    ```js
    export default class User extends Model {
      @attr firstName;
  
      @attr('string') lastName;
  
      @attr('number', { defaultValue: 0 })
      age;
    }
    ```
  
    @function
    @param {string} type? - Type of the attribute
    @param {object} options? - Options for the attribute
  */
  var attr = exports.attr = (0, _computed.computedDecoratorWithParams)(function (target, key, desc, params) {
    return _emberData.default.attr.apply(_emberData.default, _toConsumableArray(params));
  });

  /**
    Decorator that turns the property into an Ember Data `hasMany` relationship
  
    ```js
    export default class User extends Model {
      @hasMany posts;
  
      @hasMany('user') friends;
  
      @hasMany('user', { async: false })
      followers;
    }
    ```
  
    @function
    @param {string} type? - Type of relationship
    @param {object} options? - Options for the relationship
  */
  var hasMany = exports.hasMany = computedDecoratorWithKeyReflection(_emberData.default.hasMany);

  /**
    Decorator that turns the property into an Ember Data `belongsTo` relationship
  
    ```javascript
    export default class Post extends Model {
      @belongsTo user;
  
      @belongsTo('user') editor
  
      @belongsTo('post', { async: false })
      parentPost;
    }
    ```
    @function
    @param {string} type? - Type of the relationship
    @param {object} options? - Type of the relationship
  */
  var belongsTo = exports.belongsTo = computedDecoratorWithKeyReflection(_emberData.default.belongsTo);
});