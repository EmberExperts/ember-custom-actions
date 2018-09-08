define('@ember-decorators/object/computed', ['exports', '@ember-decorators/utils/computed'], function (exports, _computed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.uniqBy = exports.uniq = exports.union = exports.sum = exports.sort = exports.setDiff = exports.readOnly = exports.reads = exports.or = exports.oneWay = exports.notEmpty = exports.not = exports.none = exports.min = exports.max = exports.match = exports.mapBy = exports.map = exports.lte = exports.lt = exports.intersect = exports.gte = exports.gt = exports.filterBy = exports.filter = exports.equal = exports.empty = exports.deprecatingAlias = exports.collect = exports.bool = exports.and = exports.alias = undefined;
  exports.macro = macro;

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

  function legacyMacro(fn) {
    return (0, _computed.computedDecoratorWithRequiredParams)(function (target, key, desc, params) {
      if (desc !== undefined && desc.value !== undefined) {
        return fn.apply(undefined, _toConsumableArray(params).concat([desc.value]));
      }

      return fn.apply(undefined, _toConsumableArray(params));
    });
  }

  function legacyMacroWithRequiredMethod(fn) {
    return (0, _computed.computedDecoratorWithRequiredParams)(function (target, key, desc, params) {
      var method = desc !== undefined && typeof desc.value === 'function' ? desc.value : params.pop();

      (false && !(typeof method === 'function') && Ember.assert('The @' + fn.name + ' decorator must be used to decorate a method', typeof method === 'function'));


      return fn.apply(undefined, _toConsumableArray(params).concat([method]));
    });
  }

  /**
    Creates a new decorator from a computed macro function. For instance, you can
    use this utility function to create decorators from the macros provided by
    addons such as [ember-awesome-macros](https://github.com/kellyselden/ember-awesome-macros).
  
    ```js
    import { macro } from '@ember-decorators/object/computed';
    import firstMacro from 'ember-awesome-macros/array/first';
  
    const first = macro(firstMacro);
  
    export default class LeaderBoardComponent extends Component {
      ranking = ['Natalie', 'Emma', 'Thomas'];
  
      @first('ranking') winner; // => 'Natalie'
  
    }
    ```
  
    You can also make use of [partial application](http://2ality.com/2011/09/currying-vs-part-eval.html)
    of arguments:
  
    ```js
    import { macro } from '@ember-decorators/object/computed';
    import { computed } from '@ember/object';
  
    const titleGeneratorMacro = (prefix, titleKey) => computed(function() {
      return `${prefix}: ${String(get(this, titleKey)).toUpperCase()}!`;
    });
  
    const newsFlash = macro(titleGeneratorMacro, 'News Flash');
  
    export default class NewsPaperComponent extends Component {
      title = 'Ember chosen best framework of the year again';
  
      @newsFlash('title') attentionGrabber; // => 'News Flash: EMBER CHOSEN BEST FRAMEWORK OF THE YEAR AGAIN!'
    }
    ```
  
    @param {function} fn - The macro function to create a decorator from
    @param {...any} params - Parameters to be partially applied to the macro fn
    @return {PropertyDecorator}
   */
  function macro(fn) {
    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    return (0, _computed.computedDecoratorWithParams)(function (target, key, desc, paramsOnDecorator) {
      return fn.apply(undefined, params.concat(_toConsumableArray(paramsOnDecorator)));
    });
  }

  /**
    Creates a new property that is an alias for another property on an object.
  
    Equivalent to the Ember [alias](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/alias) macro.
  
    ```js
    export default class UserProfileComponent extends Component {
      person = {
        first: 'Joe'
      };
  
      @alias('person.first') firstName;
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the aliased property
    @return {any}
  */
  var alias = exports.alias = legacyMacro(Ember.computed.alias);

  /**
    A computed property that performs a logical and on the original values for the
    provided dependent properties.
  
    Equivalent to the Ember [and](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/and) macro.
  
    ```js
    export default class UserProfileComponent extends Component {
      person = {
        first: 'Joe'
      };
  
      @and('person.{first,last}') hasFullName; // false
    }
    ```
  
    @function
    @param {...string} dependentKeys - Keys for the properties to `and`
    @return {boolean}
  */
  var and = exports.and = legacyMacro(Ember.computed.and);

  /**
    A computed property that converts the provided dependent property into a
    boolean value.
  
    Equivalent to the Ember [bool](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/bool) macro.
  
    ```js
    export default class MessagesNotificationComponent extends Component {
      messageCount = 1;
  
      @bool('messageCount') hasMessages; // true
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the property to convert
    @return {boolean}
  */
  var bool = exports.bool = legacyMacro(Ember.computed.bool);

  /**
    A computed property that returns the array of values for the provided
    dependent properties.
  
    Equivalent to the Ember [collect](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/collect) macro.
  
    ```js
    export default class CameraEquipmentComponent extends Component {
      light = 'strobe';
      lens = '35mm prime';
  
      @collect('light', 'lens') equipment; // ['strobe', '35mm prime']
    }
    ```
  
    @function
    @param {...string} dependentKeys - Keys for the properties to collect
    @return {any[]}
  */
  var collect = exports.collect = legacyMacro(Ember.computed.collect);

  /**
    Creates a new property that is an alias for another property on an object.
    Calls to get or set this property behave as though they were called on
    the original property, but will also trigger a deprecation warning.
  
    Equivalent to the Ember [deprecatingAlias](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/deprecatingAlias) macro.
  
    ```js
    export default class UserProfileComponent extends {
      person = {
        first: 'Joe'
      };
  
      @deprecatingAlias('person.first', {
        id: 'user-profile.firstName',
        until: '3.0.0',
        url: 'https://example.com/deprecations/user-profile.firstName'
      }) firstName;
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the property to alias
    @param {object} options
  */
  var deprecatingAlias = exports.deprecatingAlias = legacyMacro(Ember.computed.deprecatingAlias);

  /**
    A computed property that returns `true` if the value of the dependent
    property is null, an empty string, empty array, or empty function.
  
    Equivalent to the Ember [empty](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/empty) macro.
  
    ```js
    export default class FoodItemsComponent extends Component {
      items = ['taco', 'burrito'];
  
      @empty('items') isEmpty; // false
    }
    ```
  
    @function
    @param {string} dependentKey - Key of the property to check emptiness of
    @return {boolean}
  */
  var empty = exports.empty = legacyMacro(Ember.computed.empty);

  /**
    A computed property that returns true if the dependent properties are equal.
  
    Equivalent to the Ember [equal](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/equal) macro.
  
    ```js
    export default class NapTimeComponent extends Component {
      state = 'sleepy';
  
      @equal('state', 'sleepy') napTime; // true
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the property to check
    @param {any} value - Value to compare the dependent property to
    @return {boolean}
  */
  var equal = exports.equal = legacyMacro(Ember.computed.equal);

  /**
    Filters the items in the array by the provided callback.
  
    Equivalent to the Ember [filter](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/filter) macro.
  
    ```js
    export default class ChoresListComponent extends Component {
      chores = [
        { name: 'cook', done: true },
        { name: 'clean', done: true },
        { name: 'write more unit tests', done: false }
      ];
  
      @filter('chores')
      remainingChores(chore, index, array) {
        return !chore.done;
      } // [{name: 'write more unit tests', done: false}]
  
      // alternative syntax:
  
      @filter('chores', function(chore, index, array) {
        return !chore.done;
      }) remainingChores; // [{name: 'write more unit tests', done: false}]
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the array to filter
    @param { (item: any, index: number, array: any[]) => boolean} callback? - The function to filter with
    @return {any[]}
  */
  var filter = exports.filter = legacyMacroWithRequiredMethod(Ember.computed.filter);

  /**
    Filters the array by the property and value.
  
    Equivalent to the Ember [filter](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/filterBy) macro.
  
    ```js
    export default class ChoresListComponent extends Component {
      chores = [
        { name: 'cook', done: true },
        { name: 'clean', done: true },
        { name: 'write more unit tests', done: false }
      ];
  
      @filterBy('chores', 'done', false) remainingChores; // [{name: 'write more unit tests', done: false}]
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the array to filter
    @param {string} propertyKey - Property of the array items to filter by
    @param {any} value - Value to filter by
    @return {any[]}
  */
  var filterBy = exports.filterBy = legacyMacro(Ember.computed.filterBy);

  /**
    A computed property that returns `true` if the provided dependent property
    is strictly greater than the provided value.
  
    Equivalent to the Ember [gt](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/gt) macro.
  
    ```js
    export default class CatPartyComponent extends Component {
      totalCats = 11;
  
      @gt('totalCats', 10) isCatParty; // true
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the property to compare
    @param {number} value - Value to compare against
    @return {boolean}
  */
  var gt = exports.gt = legacyMacro(Ember.computed.gt);

  /**
    A computed property that returns `true` if the provided dependent property
    is greater than or equal to the provided value.
  
    Equivalent to the Ember [gte](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/gte) macro.
  
    ```js
    export default class PlayerListComponent extends Component {
      totalPlayers = 14;
  
      @gte('totalPlayers', 14) hasEnoughPlayers; // true
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the property to compare
    @param {number} value - Value to compare against
    @return {boolean}
  */
  var gte = exports.gte = legacyMacro(Ember.computed.gte);

  /**
    A computed property which returns a new array with all the duplicated elements
    from two or more dependent arrays.
  
    Equivalent to the Ember [intersect](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/intersect) macro.
  
    ```js
    export default class FoodListComponent extends Component {
      likes = [ 'tacos', 'puppies', 'pizza' ];
      foods = ['tacos', 'pizza'];
  
      @intersect('likes', 'foods') favoriteFoods; // ['tacos', 'pizza']
    }
    ```
  
    @function
    @param {...string} dependentKeys - Keys of the arrays to intersect
    @return {any[]}
  */
  var intersect = exports.intersect = legacyMacro(Ember.computed.intersect);

  /**
    A computed property that returns `true` if the provided dependent property
    is strictly less than the provided value.
  
    Equivalent to the Ember [lt](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/lt) macro
  
    ```js
    export default class DogPartyComponent extends Component {
      totalDogs = 3;
  
      @lt('totalDogs', 10) isDogParty; // true
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the property to compare
    @param {number} value - Value to compare against
    @return {boolean}
  */
  var lt = exports.lt = legacyMacro(Ember.computed.lt);

  /**
    A computed property that returns `true` if the provided dependent property
    is less than or equal to the provided value.
  
    Equivalent to the Ember [lte](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/lte) macro.
  
    ```js
    export default class PlayerListComponent extends Component {
      totalPlayers = 14;
  
      @lte('totalPlayers', 14) hasEnoughPlayers; // true
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the property to compare
    @param {number} value - Value to compare against
    @return {boolean}
  */
  var lte = exports.lte = legacyMacro(Ember.computed.lte);

  /**
    Returns an array mapped via the callback.
  
    Equivalent to the Ember [map](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/map) macro.
  
    ```js
    export default class ChoresListComponent extends Component {
      chores = ['clean', 'write more unit tests']);
  
      @map('chores')
      loudChores(chore, index) {
        return chore.toUpperCase() + '!';
      } // ['CLEAN!', 'WRITE MORE UNIT TESTS!']
  
      // alternative syntax:
  
      @map('chores', function(chore, index) {
        return chore.toUpperCase() + '!';
      }) loudChores; // ['CLEAN!', 'WRITE MORE UNIT TESTS!']
    }
    ```
  
    @function
    @param {string} dependentKey? - Key for the array to map over
    @param { (item: any, index: number, array: any[]) => any} callback? - Function to map over the array
    @return {any[]}
  */
  var map = exports.map = legacyMacroWithRequiredMethod(Ember.computed.map);

  /**
    Returns an array mapped to the specified key.
  
    Equivalent to the Ember [mapBy](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/mapBy) macro.
  
    ```js
    export default class PeopleListComponent extends Component {
      people = [
        {name: "George", age: 5},
        {name: "Stella", age: 10},
        {name: "Violet", age: 7}
      ];
  
      @mapBy('people', 'age') ages; // [5, 10, 7]
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the array to map over
    @param {string} propertyKey - Property of the array items to map by
    @return {any[]}
  */
  var mapBy = exports.mapBy = legacyMacro(Ember.computed.mapBy);

  /**
    A computed property which matches the original value for the dependent
    property against a given RegExp, returning `true` if they values matches
    the RegExp and `false` if it does not.
  
    Equivalent to the Ember [match](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/match) macro.
  
    ```js
    export default class IsEmailValidComponent extends Component {
      email = 'tomster@emberjs.com';
  
      @match('email', /^.+@.+\..+$/) validEmail;
    }
    ```
  
    @function
    @param {string} dependentKey - The property to match
    @param {RegExp} pattern - The pattern to match against
    @return {boolean}
  */
  var match = exports.match = legacyMacro(Ember.computed.match);

  /**
    A computed property that calculates the maximum value in the dependent array.
    This will return `-Infinity` when the dependent array is empty.
  
    Equivalent to the Ember [max](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/max) macro.
  
    ```js
    export default class MaxValueComponent extends Component {
      values = [1, 2, 5, 10];
  
      @max('values') maxValue; // 10
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the array to find the max value of
    @return {number}
  */
  var max = exports.max = legacyMacro(Ember.computed.max);

  /**
    A computed property that calculates the minimum value in the dependent array.
    This will return `Infinity` when the dependent array is empty.
  
    Equivalent to the Ember [min](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/min) macro.
  
    ```js
    export default class MinValueComponent extends Component {
      values = [1, 2, 5, 10];
  
      @min('values') minValue; // 1
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the array to find the max value of
    @return {number}
  */
  var min = exports.min = legacyMacro(Ember.computed.min);

  /**
    A computed property that returns true if the value of the dependent property
    is null or undefined.
  
    Equivalent to the Ember [none](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/none) macro.
  
    ```js
    export default class NameDisplayComponent extends Component {
      firstName = null;
  
      @none('firstName') isNameless; // true unless firstName is defined
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the property to check
    @return {boolean}
  */
  var none = exports.none = legacyMacro(Ember.computed.none);

  /**
    A computed property that returns the inverse boolean value of the original
    value for the dependent property.
  
    Equivalent to the Ember [not](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/not) macro.
  
    ```js
    export default class UserInfoComponent extends Component {
      loggedIn = false;
  
      @not('loggedIn') isAnonymous; // true
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the property to `not`
    @return {boolean}
  */
  var not = exports.not = legacyMacro(Ember.computed.not);

  /**
    A computed property that returns `true` if the value of the dependent property
    is NOT null, an empty string, empty array, or empty function.
  
    Equivalent to the Ember [notEmpty](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/notEmpty) macro.
  
    ```js
    export default class GroceryBagComponent extends Component {
      groceryBag = ['milk', 'eggs', 'apples'];
  
      @notEmpty('groceryBag') hasGroceriesToPutAway; // true
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the property to check
    @return {boolean}
  */
  var notEmpty = exports.notEmpty = legacyMacro(Ember.computed.notEmpty);

  /**
    Where `computed.alias` aliases `get` and `set`, and allows for bidirectional
    data flow, `computed.oneWay` only provides an aliased `get`. The `set` will
    not mutate the upstream property, rather causes the current property to
    become the value set. This causes the downstream property to permanently
    diverge from the upstream property.
  
    Equivalent to the Ember [oneWay](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/oneWay) macro.
  
    ```js
    export default class UserProfileComponent extends Component {
      firstName = 'Joe';
  
      @oneWay('firstName') originalName; // 'Joe'
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the property to alias
    @return {any}
  */
  var oneWay = exports.oneWay = legacyMacro(Ember.computed.oneWay);

  /**
    A computed property which performs a logical or on the original values for the
    provided dependent properties.
  
    Equivalent to the Ember [or](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/or) macro.
  
    ```js
    export default class OutfitFeaturesComponent extends Component {
      hasJacket = true;
      hasUmbrella = false;
  
      @or('hasJacket', 'hasUmbrella') isReadyForRain; // true
    }
    ```
  
    @function
    @param {...string} dependentKey - Key for the properties to `or`
    @return {boolean}
  */
  var or = exports.or = legacyMacro(Ember.computed.or);

  /**
    This is a more semantically meaningful alias of `oneWay`, whose name is
    somewhat ambiguous as to which direction the data flows.
  
    Equivalent to the Ember [reads](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/reads) macro.
  
    ```js
    export default class UserProfileComponent extends Component {
      first = 'Tomster';
  
      @reads('first') firstName;
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the property to read
    @return {any}
  */
  var reads = exports.reads = legacyMacro(Ember.computed.reads);

  /**
    A computed property which creates a one way computed property to the original
    value for property. Where `@reads` provides a one way bindings, `@readOnly`
    provides a read only one way binding. Very often when using `@reads` one wants
    to explicitly prevent users from ever setting the property. This prevents the
    reverse flow, and also throws an exception when it occurs.
  
    Equivalent to the Ember [readOnly](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/readOnly) macro.
  
    ```js
    export default class UserProfileComponent extends Component {
      first = 'Tomster';
  
      @readOnly('first') firstName;
    }
    ```
  
    @function
    @param {string} dependentKey - Key for the property to read
    @return {any}
  */
  var readOnly = exports.readOnly = legacyMacro(Ember.computed.readOnly);

  /**
    A computed property which returns a new array with all the properties from the
    first dependent array that are not in the second dependent array.
  
    Equivalent to the Ember [setDiff](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/setDiff) macro.
  
    ```js
    export default class FavoriteThingsComponent extends Component {
      likes = [ 'tacos', 'puppies', 'pizza' ];
      foods = ['tacos', 'pizza'];
  
      @setDiff('likes', 'foods') favoriteThingsThatArentFood; // ['puppies']
    }
    ```
  
    @function
    @param {string} setAProperty - Key for the first set
    @param {string} setBProperty - Key for the first set
    @return {any[]}
  */
  var setDiff = exports.setDiff = legacyMacro(Ember.computed.setDiff);

  /**
    A computed property which returns a new array with all the properties from
    the first dependent array sorted based on a property or sort function.
  
    If a callback method is provided, it should have the following signature:
  
    ```js
    (itemA: any, itemB: any) => number;
    ```
    - `itemA` the first item to compare.
    - `itemB` the second item to compare.
  
    This function should return negative number (e.g. `-1`) when `itemA` should
    come before `itemB`. It should return positive number (e.g. `1`) when
    `itemA` should come after `itemB`. If the `itemA` and `itemB` are equal this
    function should return `0`.
  
    Therefore, if this function is comparing some numeric values, you can do
    `itemA - itemB` or `itemA.foo - itemB.foo` instead of explicit if statements.
  
    ```js
    export default class SortNamesComponent extends Component {
      names = [{name:'Link'},{name:'Zelda'},{name:'Ganon'},{name:'Navi'}];
  
      @sort('names')
      sortedNames(a, b){
        if (a.name > b.name) {
          return 1;
        } else if (a.name < b.name) {
          return -1;
        }
  
        return 0;
      } // [{ name:'Ganon' }, { name:'Link' }, { name:'Navi' }, { name:'Zelda' }]
  
      // alternative syntax:
  
      @sort('names', function(a, b){
        if (a.name > b.name) {
          return 1;
        } else if (a.name < b.name) {
          return -1;
        }
  
        return 0;
      }) sortedNames; // [{ name:'Ganon' }, { name:'Link' }, { name:'Navi' }, { name:'Zelda' }]
    }
    ```
  
    Equivalent to the Ember [sort](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/sort) macro.
  
    @function
    @param {string} dependentKey - The key for the array that should be sorted
    @param {string[] | (itemA: any, itemB: any) => number} sortDefinition? - Sorting function or sort descriptor
    @return {any[]}
  */
  var sort = exports.sort = legacyMacro(Ember.computed.sort);

  /**
    A computed property that returns the sum of the values in the dependent array.
  
    Equivalent to the Ember [sum](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/sum) macro.
  
    ```js
    export default class SumValuesComponent extends Component {
      values = [1, 2, 3];
  
      @sum('values') total; // 6
    }
    ```
  
    @function
    @param {string} dependentKey - Key of the array to sum up
    @return {number}
  */
  var sum = exports.sum = legacyMacro(Ember.computed.sum);

  /**
    Alias for [uniq](#uniq).
  
    Equivalent to the Ember [union](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/union) macro.
  
    ```js
    export default class LikesAndFoodsComponent extends Component {
      likes = [ 'tacos', 'puppies', 'pizza' ];
      foods = ['tacos', 'pizza', 'ramen'];
  
      @union('likes', 'foods') favorites; // ['tacos', 'puppies', 'pizza', 'ramen']
    }
    ```
  
    @function
    @param {...string} dependentKeys - Keys of the arrays to union
    @return {any[]}
  */
  var union = exports.union = legacyMacro(Ember.computed.union);

  /**
    A computed property which returns a new array with all the unique elements from one or more dependent arrays.
  
    Equivalent to the Ember [uniq](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/uniq) macro.
  
    ```js
    export default class FavoriteThingsComponent extends Component {
      likes = [ 'tacos', 'puppies', 'pizza' ];
      foods = ['tacos', 'pizza', 'ramen'];
  
      @uniq('likes', 'foods') favorites; // ['tacos', 'puppies', 'pizza', 'ramen']
    }
    ```
  
    @function
    @param {string} dependentKey - Key of the array to uniq
    @return {any[]}
  */
  var uniq = exports.uniq = legacyMacro(Ember.computed.uniq);

  /**
    A computed property which returns a new array with all the unique elements
    from an array, with uniqueness determined by a specific key.
  
    Equivalent to the Ember [uniqBy](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/uniqBy) macro.
  
    ```js
    export default class FruitBowlComponent extends Component {
      fruits = [
        { name: 'banana', color: 'yellow' },
        { name: 'apple',  color: 'red' },
        { name: 'kiwi',   color: 'brown' },
        { name: 'cherry', color: 'red' },
        { name: 'lemon',  color: 'yellow' }
      ];
  
      @uniqBy('fruits', 'color') oneOfEachColor;
      // [
      //  { name: 'banana', color: 'yellow'},
      //  { name: 'apple',  color: 'red'},
      //  { name: 'kiwi',   color: 'brown'}
      // ]
    }
    ```
  
    @function
    @param {string} dependentKey - Key of the array to uniq
    @param {string} propertyKey - Key of the property on the objects of the array to determine uniqueness by
    @return {any[]}
  */
  var uniqBy = exports.uniqBy = true ? legacyMacro(Ember.computed.uniqBy) : function () {
    (false && !(false) && Ember.assert('uniqBy is only available from Ember.js v2.7 onwards.', false));
  };
});