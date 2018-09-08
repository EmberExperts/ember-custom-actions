define('ember-data/-private', ['exports', 'ember-inflector', '@ember/ordered-set', 'ember-data/version'], function (exports, emberInflector, EmberOrderedSet, VERSION) { 'use strict';

  EmberOrderedSet = EmberOrderedSet && EmberOrderedSet.hasOwnProperty('default') ? EmberOrderedSet['default'] : EmberOrderedSet;
  VERSION = VERSION && VERSION.hasOwnProperty('default') ? VERSION['default'] : VERSION;

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  /*
    ## Why does this exist?!?

    `Ember.Map` was a private API provided by Ember (for quite some time).
    Unfortunately, ember-data made `Ember.Map` part of its public API surface via
    documentation blocks.

    `Ember.Map` will be deprecated and removed from Ember "soon"
    (https://github.com/emberjs/rfcs/pull/237) and we would like to confirm that
    Ember Data will work without deprecation before and after that happens.

    `Ember.Map` differs from native `Map` in a few ways:

    * `Ember.Map` has custom `copy` and `isEmpty` methods which are not present in native `Map`
    * `Ember.Map` adds a static `create` method (which simply instantiates itself with `new Ember.Map()`)
    * `Ember.Map` does not accept constructor arguments
    * `Ember.Map` does not have:
      * `@@species`
      * `@@iterator`
      * `entries`
      * `values`

    This implementation adds a deprecated backwards compatibility for:

    * `copy`
    * `isEmpty`

    ## Why is this written this way?!?

    This is needed because `Map` requires instantiation with `new` and by default
    Babel transpilation will do `superConstructor.apply(this, arguments)` which
    throws an error with native `Map`.

    The desired code (if we lived in an "only native class" world) would be:

    ```js
    export default class MapWithDeprecations extends Map {
      constructor(options) {
        super();
        this.defaultValue = options.defaultValue;
      }

      get(key) {
        let hasValue = this.has(key);

        if (hasValue) {
          return super.get(key);
        } else {
          let defaultValue = this.defaultValue(key);
          this.set(key, defaultValue);
          return defaultValue;
        }
      }
    }
    ```
  */
  var MapWithDeprecations = function () {
    function MapWithDeprecations(options) {
      this._map = new Map();
    }

    MapWithDeprecations.prototype.copy = function copy() {

      // can't just pass `this._map` here because IE11 doesn't accept
      // constructor args with its `Map`

      var newMap = new MapWithDeprecations();
      this._map.forEach(function (value, key) {
        newMap.set(key, value);
      });

      return newMap;
    };

    MapWithDeprecations.prototype.isEmpty = function isEmpty() {


      return this.size === 0;
    };

    // proxy all normal Map methods to the underlying Map


    MapWithDeprecations.prototype.clear = function clear() {
      var _map;

      return (_map = this._map).clear.apply(_map, arguments);
    };

    MapWithDeprecations.prototype.delete = function _delete() {
      var _map2;

      return (_map2 = this._map).delete.apply(_map2, arguments);
    };

    MapWithDeprecations.prototype.entries = function entries() {
      var _map3;

      return (_map3 = this._map).entries.apply(_map3, arguments);
    };

    MapWithDeprecations.prototype.forEach = function forEach() {
      var _map4;

      return (_map4 = this._map).forEach.apply(_map4, arguments);
    };

    MapWithDeprecations.prototype.get = function get() {
      var _map5;

      return (_map5 = this._map).get.apply(_map5, arguments);
    };

    MapWithDeprecations.prototype.has = function has() {
      var _map6;

      return (_map6 = this._map).has.apply(_map6, arguments);
    };

    MapWithDeprecations.prototype.keys = function keys() {
      var _map7;

      return (_map7 = this._map).keys.apply(_map7, arguments);
    };

    MapWithDeprecations.prototype.set = function set() {
      var _map8;

      return (_map8 = this._map).set.apply(_map8, arguments);
    };

    MapWithDeprecations.prototype.values = function values() {
      var _map9;

      return (_map9 = this._map).values.apply(_map9, arguments);
    };

    _createClass(MapWithDeprecations, [{
      key: 'size',
      get: function get() {
        return this._map.size;
      }
    }]);

    return MapWithDeprecations;
  }();

  /**
    A `PromiseArray` is an object that acts like both an `Ember.Array`
    and a promise. When the promise is resolved the resulting value
    will be set to the `PromiseArray`'s `content` property. This makes
    it easy to create data bindings with the `PromiseArray` that will be
    updated when the promise resolves.

    For more information see the [Ember.PromiseProxyMixin
    documentation](/api/classes/Ember.PromiseProxyMixin.html).

    Example

    ```javascript
    let promiseArray = DS.PromiseArray.create({
      promise: $.getJSON('/some/remote/data.json')
    });

    promiseArray.get('length'); // 0

    promiseArray.then(function() {
      promiseArray.get('length'); // 100
    });
    ```

    @class PromiseArray
    @namespace DS
    @extends Ember.ArrayProxy
    @uses Ember.PromiseProxyMixin
  */
  var PromiseArray = Ember.ArrayProxy.extend(Ember.PromiseProxyMixin, {
    meta: Ember.computed.reads('content.meta')
  });

  /**
    A `PromiseObject` is an object that acts like both an `Ember.Object`
    and a promise. When the promise is resolved, then the resulting value
    will be set to the `PromiseObject`'s `content` property. This makes
    it easy to create data bindings with the `PromiseObject` that will
    be updated when the promise resolves.

    For more information see the [Ember.PromiseProxyMixin
    documentation](/api/classes/Ember.PromiseProxyMixin.html).

    Example

    ```javascript
    let promiseObject = DS.PromiseObject.create({
      promise: $.getJSON('/some/remote/data.json')
    });

    promiseObject.get('name'); // null

    promiseObject.then(function() {
      promiseObject.get('name'); // 'Tomster'
    });
    ```

    @class PromiseObject
    @namespace DS
    @extends Ember.ObjectProxy
    @uses Ember.PromiseProxyMixin
  */
  var PromiseObject = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

  function promiseObject(promise, label) {
    return PromiseObject.create({
      promise: Ember.RSVP.Promise.resolve(promise, label)
    });
  }

  function promiseArray(promise, label) {
    return PromiseArray.create({
      promise: Ember.RSVP.Promise.resolve(promise, label)
    });
  }

  var PromiseBelongsTo = PromiseObject.extend({
    // we don't proxy meta because we would need to proxy it to the relationship state container
    //  however, meta on relationships does not trigger change notifications.
    //  if you need relationship meta, you should do `record.belongsTo(relationshipName).meta()`
    meta: Ember.computed(function () {
    }),

    reload: function reload() {

      this.get('_belongsToState').reload();

      return this;
    }
  });

  /**
    A PromiseManyArray is a PromiseArray that also proxies certain method calls
    to the underlying manyArray.
    Right now we proxy:

      * `reload()`
      * `createRecord()`
      * `on()`
      * `one()`
      * `trigger()`
      * `off()`
      * `has()`

    @class PromiseManyArray
    @namespace DS
    @extends Ember.ArrayProxy
  */

  function proxyToContent(method) {
    return function () {
      var _EmberGet;

      return (_EmberGet = Ember.get(this, 'content'))[method].apply(_EmberGet, arguments);
    };
  }

  var PromiseManyArray = PromiseArray.extend({
    reload: function reload() {

      this.set('promise', this.get('content').reload());
      return this;
    },


    createRecord: proxyToContent('createRecord'),

    on: proxyToContent('on'),

    one: proxyToContent('one'),

    trigger: proxyToContent('trigger'),

    off: proxyToContent('off'),

    has: proxyToContent('has')
  });

  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var MapWithDefault = function (_Map) {
    _inherits(MapWithDefault, _Map);

    function MapWithDefault(options) {
      var _this = _possibleConstructorReturn(this, _Map.call(this));

      _this.defaultValue = options.defaultValue;
      return _this;
    }

    MapWithDefault.prototype.get = function get(key) {
      var hasValue = this.has(key);

      if (hasValue) {
        return _Map.prototype.get.call(this, key);
      } else {
        var defaultValue = this.defaultValue(key);
        this.set(key, defaultValue);
        return defaultValue;
      }
    };

    return MapWithDefault;
  }(MapWithDeprecations);

  /**
  @module ember-data
  */

  /**
    Holds validation errors for a given record, organized by attribute names.

    Every `DS.Model` has an `errors` property that is an instance of
    `DS.Errors`. This can be used to display validation error
    messages returned from the server when a `record.save()` rejects.

    For Example, if you had a `User` model that looked like this:

    ```app/models/user.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      username: DS.attr('string'),
      email: DS.attr('string')
    });
    ```
    And you attempted to save a record that did not validate on the backend:

    ```javascript
    let user = store.createRecord('user', {
      username: 'tomster',
      email: 'invalidEmail'
    });
    user.save();
    ```

    Your backend would be expected to return an error response that described
    the problem, so that error messages can be generated on the app.

    API responses will be translated into instances of `DS.Errors` differently,
    depending on the specific combination of adapter and serializer used. You
    may want to check the documentation or the source code of the libraries
    that you are using, to know how they expect errors to be communicated.

    Errors can be displayed to the user by accessing their property name
    to get an array of all the error objects for that property. Each
    error object is a JavaScript object with two keys:

    - `message` A string containing the error message from the backend
    - `attribute` The name of the property associated with this error message

    ```handlebars
    <label>Username: {{input value=username}} </label>
    {{#each model.errors.username as |error|}}
      <div class="error">
        {{error.message}}
      </div>
    {{/each}}

    <label>Email: {{input value=email}} </label>
    {{#each model.errors.email as |error|}}
      <div class="error">
        {{error.message}}
      </div>
    {{/each}}
    ```

    You can also access the special `messages` property on the error
    object to get an array of all the error strings.

    ```handlebars
    {{#each model.errors.messages as |message|}}
      <div class="error">
        {{message}}
      </div>
    {{/each}}
    ```

    @class Errors
    @namespace DS
    @extends Ember.Object
    @uses Ember.Enumerable
    @uses Ember.Evented
   */
  var Errors = Ember.ArrayProxy.extend(Ember.Evented, {
    /**
      Register with target handler
       @method _registerHandlers
      @private
    */
    _registerHandlers: function _registerHandlers(target, becameInvalid, becameValid) {
      this.on('becameInvalid', target, becameInvalid);
      this.on('becameValid', target, becameValid);
    },


    /**
      @property errorsByAttributeName
      @type {MapWithDefault}
      @private
    */
    errorsByAttributeName: Ember.computed(function () {
      return new MapWithDefault({
        defaultValue: function defaultValue() {
          return Ember.A();
        }
      });
    }),

    /**
      Returns errors for a given attribute
       ```javascript
      let user = store.createRecord('user', {
        username: 'tomster',
        email: 'invalidEmail'
      });
      user.save().catch(function(){
        user.get('errors').errorsFor('email'); // returns:
        // [{attribute: "email", message: "Doesn't look like a valid email."}]
      });
      ```
       @method errorsFor
      @param {String} attribute
      @return {Array}
    */
    errorsFor: function errorsFor(attribute) {
      return Ember.get(this, 'errorsByAttributeName').get(attribute);
    },


    /**
      An array containing all of the error messages for this
      record. This is useful for displaying all errors to the user.
       ```handlebars
      {{#each model.errors.messages as |message|}}
        <div class="error">
          {{message}}
        </div>
      {{/each}}
      ```
       @property messages
      @type {Array}
    */
    messages: Ember.computed.mapBy('content', 'message'),

    /**
      @property content
      @type {Array}
      @private
    */
    content: Ember.computed(function () {
      return Ember.A();
    }),

    /**
      @method unknownProperty
      @private
    */
    unknownProperty: function unknownProperty(attribute) {
      var errors = this.errorsFor(attribute);
      if (errors.length === 0) {
        return undefined;
      }
      return errors;
    },


    /**
      Total number of errors.
       @property length
      @type {Number}
      @readOnly
    */

    /**
      @property isEmpty
      @type {Boolean}
      @readOnly
    */
    isEmpty: Ember.computed.not('length').readOnly(),

    /**
      Adds error messages to a given attribute and sends
      `becameInvalid` event to the record.
       Example:
       ```javascript
      if (!user.get('username') {
        user.get('errors').add('username', 'This field is required');
      }
      ```
       @method add
      @param {String} attribute
      @param {(Array|String)} messages
      @deprecated
    */
    add: function add(attribute, messages) {


      var wasEmpty = Ember.get(this, 'isEmpty');

      this._add(attribute, messages);

      if (wasEmpty && !Ember.get(this, 'isEmpty')) {
        this.trigger('becameInvalid');
      }
    },


    /**
      Adds error messages to a given attribute without sending event.
       @method _add
      @private
    */
    _add: function _add(attribute, messages) {
      messages = this._findOrCreateMessages(attribute, messages);
      this.addObjects(messages);
      Ember.get(this, 'errorsByAttributeName').get(attribute).addObjects(messages);

      this.notifyPropertyChange(attribute);
    },


    /**
      @method _findOrCreateMessages
      @private
    */
    _findOrCreateMessages: function _findOrCreateMessages(attribute, messages) {
      var errors = this.errorsFor(attribute);
      var messagesArray = Ember.makeArray(messages);
      var _messages = new Array(messagesArray.length);

      for (var i = 0; i < messagesArray.length; i++) {
        var message = messagesArray[i];
        var err = errors.findBy('message', message);
        if (err) {
          _messages[i] = err;
        } else {
          _messages[i] = {
            attribute: attribute,
            message: message
          };
        }
      }

      return _messages;
    },


    /**
      Removes all error messages from the given attribute and sends
      `becameValid` event to the record if there no more errors left.
       Example:
       ```app/models/user.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        email: DS.attr('string'),
        twoFactorAuth: DS.attr('boolean'),
        phone: DS.attr('string')
      });
      ```
       ```app/routes/user/edit.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        actions: {
          save: function(user) {
            if (!user.get('twoFactorAuth')) {
              user.get('errors').remove('phone');
            }
            user.save();
          }
        }
      });
      ```
       @method remove
      @param {String} attribute
      @deprecated
    */
    remove: function remove(attribute) {


      if (Ember.get(this, 'isEmpty')) {
        return;
      }

      this._remove(attribute);

      if (Ember.get(this, 'isEmpty')) {
        this.trigger('becameValid');
      }
    },


    /**
      Removes all error messages from the given attribute without sending event.
       @method _remove
      @private
    */
    _remove: function _remove(attribute) {
      if (Ember.get(this, 'isEmpty')) {
        return;
      }

      var content = this.rejectBy('attribute', attribute);
      Ember.set(this, 'content', content);
      Ember.get(this, 'errorsByAttributeName').delete(attribute);

      this.notifyPropertyChange(attribute);
      this.notifyPropertyChange('length');
    },


    /**
      Removes all error messages and sends `becameValid` event
      to the record.
       Example:
       ```app/routes/user/edit.js
    import Route from '@ember/routing/route';
       export default Route.extend({
        actions: {
          retrySave: function(user) {
            user.get('errors').clear();
            user.save();
          }
        }
      });
      ```
       @method clear
      @deprecated
    */
    clear: function clear() {


      if (Ember.get(this, 'isEmpty')) {
        return;
      }

      this._clear();
      this.trigger('becameValid');
    },


    /**
      Removes all error messages.
      to the record.
       @method _clear
      @private
    */
    _clear: function _clear() {
      if (Ember.get(this, 'isEmpty')) {
        return;
      }

      var errorsByAttributeName = Ember.get(this, 'errorsByAttributeName');
      var attributes = Ember.A();

      errorsByAttributeName.forEach(function (_, attribute) {
        attributes.push(attribute);
      });

      errorsByAttributeName.clear();
      attributes.forEach(function (attribute) {
        this.notifyPropertyChange(attribute);
      }, this);

      Ember.ArrayProxy.prototype.clear.call(this);
    },


    /**
      Checks if there is error messages for the given attribute.
       ```app/routes/user/edit.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        actions: {
          save: function(user) {
            if (user.get('errors').has('email')) {
              return alert('Please update your email before attempting to save.');
            }
            user.save();
          }
        }
      });
      ```
       @method has
      @param {String} attribute
      @return {Boolean} true if there some errors on given attribute
    */
    has: function has(attribute) {
      return this.errorsFor(attribute).length > 0;
    }
  });

  /*
    This file encapsulates the various states that a record can transition
    through during its lifecycle.
  */
  /**
    ### State

    Each record has a `currentState` property that explicitly tracks what
    state a record is in at any given time. For instance, if a record is
    newly created and has not yet been sent to the adapter to be saved,
    it would be in the `root.loaded.created.uncommitted` state.  If a
    record has had local modifications made to it that are in the
    process of being saved, the record would be in the
    `root.loaded.updated.inFlight` state. (This state paths will be
    explained in more detail below.)

    Events are sent by the record or its store to the record's
    `currentState` property. How the state reacts to these events is
    dependent on which state it is in. In some states, certain events
    will be invalid and will cause an exception to be raised.

    States are hierarchical and every state is a substate of the
    `RootState`. For example, a record can be in the
    `root.deleted.uncommitted` state, then transition into the
    `root.deleted.inFlight` state. If a child state does not implement
    an event handler, the state manager will attempt to invoke the event
    on all parent states until the root state is reached. The state
    hierarchy of a record is described in terms of a path string. You
    can determine a record's current state by getting the state's
    `stateName` property:

    ```javascript
    record.get('currentState.stateName');
    //=> "root.created.uncommitted"
     ```

    The hierarchy of valid states that ship with ember data looks like
    this:

    ```text
    * root
      * deleted
        * saved
        * uncommitted
        * inFlight
      * empty
      * loaded
        * created
          * uncommitted
          * inFlight
        * saved
        * updated
          * uncommitted
          * inFlight
      * loading
    ```

    The `DS.Model` states are themselves stateless. What that means is
    that, the hierarchical states that each of *those* points to is a
    shared data structure. For performance reasons, instead of each
    record getting its own copy of the hierarchy of states, each record
    points to this global, immutable shared instance. How does a state
    know which record it should be acting on? We pass the record
    instance into the state's event handlers as the first argument.

    The record passed as the first parameter is where you should stash
    state about the record if needed; you should never store data on the state
    object itself.

    ### Events and Flags

    A state may implement zero or more events and flags.

    #### Events

    Events are named functions that are invoked when sent to a record. The
    record will first look for a method with the given name on the
    current state. If no method is found, it will search the current
    state's parent, and then its grandparent, and so on until reaching
    the top of the hierarchy. If the root is reached without an event
    handler being found, an exception will be raised. This can be very
    helpful when debugging new features.

    Here's an example implementation of a state with a `myEvent` event handler:

    ```javascript
    aState: DS.State.create({
      myEvent: function(manager, param) {
        console.log("Received myEvent with", param);
      }
    })
    ```

    To trigger this event:

    ```javascript
    record.send('myEvent', 'foo');
    //=> "Received myEvent with foo"
    ```

    Note that an optional parameter can be sent to a record's `send()` method,
    which will be passed as the second parameter to the event handler.

    Events should transition to a different state if appropriate. This can be
    done by calling the record's `transitionTo()` method with a path to the
    desired state. The state manager will attempt to resolve the state path
    relative to the current state. If no state is found at that path, it will
    attempt to resolve it relative to the current state's parent, and then its
    parent, and so on until the root is reached. For example, imagine a hierarchy
    like this:

        * created
          * uncommitted <-- currentState
          * inFlight
        * updated
          * inFlight

    If we are currently in the `uncommitted` state, calling
    `transitionTo('inFlight')` would transition to the `created.inFlight` state,
    while calling `transitionTo('updated.inFlight')` would transition to
    the `updated.inFlight` state.

    Remember that *only events* should ever cause a state transition. You should
    never call `transitionTo()` from outside a state's event handler. If you are
    tempted to do so, create a new event and send that to the state manager.

    #### Flags

    Flags are Boolean values that can be used to introspect a record's current
    state in a more user-friendly way than examining its state path. For example,
    instead of doing this:

    ```javascript
    var statePath = record.get('stateManager.currentPath');
    if (statePath === 'created.inFlight') {
      doSomething();
    }
    ```

    You can say:

    ```javascript
    if (record.get('isNew') && record.get('isSaving')) {
      doSomething();
    }
    ```

    If your state does not set a value for a given flag, the value will
    be inherited from its parent (or the first place in the state hierarchy
    where it is defined).

    The current set of flags are defined below. If you want to add a new flag,
    in addition to the area below, you will also need to declare it in the
    `DS.Model` class.


     * [isEmpty](DS.Model.html#property_isEmpty)
     * [isLoading](DS.Model.html#property_isLoading)
     * [isLoaded](DS.Model.html#property_isLoaded)
     * [hasDirtyAttributes](DS.Model.html#property_hasDirtyAttributes)
     * [isSaving](DS.Model.html#property_isSaving)
     * [isDeleted](DS.Model.html#property_isDeleted)
     * [isNew](DS.Model.html#property_isNew)
     * [isValid](DS.Model.html#property_isValid)

    @namespace DS
    @class RootState
  */

  function _didSetProperty(internalModel, context) {
    if (context.value === context.originalValue) {
      delete internalModel._attributes[context.name];
      internalModel.send('propertyWasReset', context.name);
    } else if (context.value !== context.oldValue) {
      internalModel.send('becomeDirty');
    }

    internalModel.updateRecordArrays();
  }

  // Implementation notes:
  //
  // Each state has a boolean value for all of the following flags:
  //
  // * isLoaded: The record has a populated `data` property. When a
  //   record is loaded via `store.find`, `isLoaded` is false
  //   until the adapter sets it. When a record is created locally,
  //   its `isLoaded` property is always true.
  // * isDirty: The record has local changes that have not yet been
  //   saved by the adapter. This includes records that have been
  //   created (but not yet saved) or deleted.
  // * isSaving: The record has been committed, but
  //   the adapter has not yet acknowledged that the changes have
  //   been persisted to the backend.
  // * isDeleted: The record was marked for deletion. When `isDeleted`
  //   is true and `isDirty` is true, the record is deleted locally
  //   but the deletion was not yet persisted. When `isSaving` is
  //   true, the change is in-flight. When both `isDirty` and
  //   `isSaving` are false, the change has persisted.
  // * isNew: The record was created on the client and the adapter
  //   did not yet report that it was successfully saved.
  // * isValid: The adapter did not report any server-side validation
  //   failures.

  // The dirty state is a abstract state whose functionality is
  // shared between the `created` and `updated` states.
  //
  // The deleted state shares the `isDirty` flag with the
  // subclasses of `DirtyState`, but with a very different
  // implementation.
  //
  // Dirty states have three child states:
  //
  // `uncommitted`: the store has not yet handed off the record
  //   to be saved.
  // `inFlight`: the store has handed off the record to be saved,
  //   but the adapter has not yet acknowledged success.
  // `invalid`: the record has invalid information and cannot be
  //   sent to the adapter yet.
  /**
    @module ember-data
  */
  var DirtyState = {
    initialState: 'uncommitted',

    // FLAGS
    isDirty: true,

    // SUBSTATES

    // When a record first becomes dirty, it is `uncommitted`.
    // This means that there are local pending changes, but they
    // have not yet begun to be saved, and are not invalid.
    uncommitted: {
      // EVENTS
      didSetProperty: _didSetProperty,

      //TODO(Igor) reloading now triggers a
      //loadingData event, though it seems fine?
      loadingData: function loadingData() {},
      propertyWasReset: function propertyWasReset(internalModel, name) {
        if (!internalModel.hasChangedAttributes()) {
          internalModel.send('rolledBack');
        }
      },
      pushedData: function pushedData(internalModel) {
        internalModel.updateChangedAttributes();

        if (!internalModel.hasChangedAttributes()) {
          internalModel.transitionTo('loaded.saved');
        }
      },
      becomeDirty: function becomeDirty() {},
      willCommit: function willCommit(internalModel) {
        internalModel.transitionTo('inFlight');
      },
      reloadRecord: function reloadRecord(internalModel, _ref) {
        var resolve = _ref.resolve,
            options = _ref.options;

        resolve(internalModel.store._reloadRecord(internalModel, options));
      },
      rolledBack: function rolledBack(internalModel) {
        internalModel.transitionTo('loaded.saved');
        internalModel.triggerLater('rolledBack');
      },
      becameInvalid: function becameInvalid(internalModel) {
        internalModel.transitionTo('invalid');
      },
      rollback: function rollback(internalModel) {
        internalModel.rollbackAttributes();
        internalModel.triggerLater('ready');
      }
    },

    // Once a record has been handed off to the adapter to be
    // saved, it is in the 'in flight' state. Changes to the
    // record cannot be made during this window.
    inFlight: {
      // FLAGS
      isSaving: true,

      // EVENTS
      didSetProperty: _didSetProperty,
      becomeDirty: function becomeDirty() {},
      pushedData: function pushedData() {},


      unloadRecord: assertAgainstUnloadRecord,

      // TODO: More robust semantics around save-while-in-flight
      willCommit: function willCommit() {},
      didCommit: function didCommit(internalModel) {
        internalModel.transitionTo('saved');
        internalModel.send('invokeLifecycleCallbacks', this.dirtyType);
      },
      rolledBack: function rolledBack(internalModel) {
        internalModel.triggerLater('rolledBack');
      },
      becameInvalid: function becameInvalid(internalModel) {
        internalModel.transitionTo('invalid');
        internalModel.send('invokeLifecycleCallbacks');
      },
      becameError: function becameError(internalModel) {
        internalModel.transitionTo('uncommitted');
        internalModel.triggerLater('becameError', internalModel);
      }
    },

    // A record is in the `invalid` if the adapter has indicated
    // the the record failed server-side invalidations.
    invalid: {
      // FLAGS
      isValid: false,

      // EVENTS
      deleteRecord: function deleteRecord(internalModel) {
        internalModel.transitionTo('deleted.uncommitted');
      },
      didSetProperty: function didSetProperty(internalModel, context) {
        internalModel.removeErrorMessageFromAttribute(context.name);

        _didSetProperty(internalModel, context);

        if (!internalModel.hasErrors()) {
          this.becameValid(internalModel);
        }
      },
      becameInvalid: function becameInvalid() {},
      becomeDirty: function becomeDirty() {},
      pushedData: function pushedData() {},
      willCommit: function willCommit(internalModel) {
        internalModel.clearErrorMessages();
        internalModel.transitionTo('inFlight');
      },
      rolledBack: function rolledBack(internalModel) {
        internalModel.clearErrorMessages();
        internalModel.transitionTo('loaded.saved');
        internalModel.triggerLater('ready');
      },
      becameValid: function becameValid(internalModel) {
        internalModel.transitionTo('uncommitted');
      },
      invokeLifecycleCallbacks: function invokeLifecycleCallbacks(internalModel) {
        internalModel.triggerLater('becameInvalid', internalModel);
      }
    }
  };

  // The created and updated states are created outside the state
  // chart so we can reopen their substates and add mixins as
  // necessary.

  function deepClone(object) {
    var clone = {};
    var value = void 0;

    for (var prop in object) {
      value = object[prop];
      if (value && typeof value === 'object') {
        clone[prop] = deepClone(value);
      } else {
        clone[prop] = value;
      }
    }

    return clone;
  }

  function mixin(original, hash) {
    for (var prop in hash) {
      original[prop] = hash[prop];
    }

    return original;
  }

  function dirtyState(options) {
    var newState = deepClone(DirtyState);
    return mixin(newState, options);
  }

  var createdState = dirtyState({
    dirtyType: 'created',
    // FLAGS
    isNew: true
  });

  createdState.invalid.rolledBack = function (internalModel) {
    internalModel.transitionTo('deleted.saved');
    internalModel.triggerLater('rolledBack');
  };

  createdState.uncommitted.rolledBack = function (internalModel) {
    internalModel.transitionTo('deleted.saved');
    internalModel.triggerLater('rolledBack');
  };

  var updatedState = dirtyState({
    dirtyType: 'updated'
  });

  function createdStateDeleteRecord(internalModel) {
    internalModel.transitionTo('deleted.saved');
    internalModel.send('invokeLifecycleCallbacks');
  }

  createdState.uncommitted.deleteRecord = createdStateDeleteRecord;

  createdState.invalid.deleteRecord = createdStateDeleteRecord;

  createdState.uncommitted.rollback = function (internalModel) {
    DirtyState.uncommitted.rollback.apply(this, arguments);
    internalModel.transitionTo('deleted.saved');
  };

  createdState.uncommitted.pushedData = function (internalModel) {
    internalModel.transitionTo('loaded.updated.uncommitted');
    internalModel.triggerLater('didLoad');
  };

  createdState.uncommitted.propertyWasReset = function () {};

  function assertAgainstUnloadRecord(internalModel) {
  }

  updatedState.invalid.becameValid = function (internalModel) {
    // we're eagerly transition into the loaded.saved state, even though we could
    // be still dirty; but the setup hook of the loaded.saved state checks for
    // dirty attributes and transitions into the corresponding dirty state
    internalModel.transitionTo('loaded.saved');
  };

  updatedState.inFlight.unloadRecord = assertAgainstUnloadRecord;

  updatedState.uncommitted.deleteRecord = function (internalModel) {
    internalModel.transitionTo('deleted.uncommitted');
  };

  updatedState.invalid.rolledBack = function (internalModel) {
    internalModel.clearErrorMessages();
    internalModel.transitionTo('loaded.saved');
    internalModel.triggerLater('rolledBack');
  };

  var RootState = {
    // FLAGS
    isEmpty: false,
    isLoading: false,
    isLoaded: false,
    isDirty: false,
    isSaving: false,
    isDeleted: false,
    isNew: false,
    isValid: true,

    // DEFAULT EVENTS

    // Trying to roll back if you're not in the dirty state
    // doesn't change your state. For example, if you're in the
    // in-flight state, rolling back the record doesn't move
    // you out of the in-flight state.
    rolledBack: function rolledBack() {},
    unloadRecord: function unloadRecord(internalModel) {},
    propertyWasReset: function propertyWasReset() {},


    // SUBSTATES

    // A record begins its lifecycle in the `empty` state.
    // If its data will come from the adapter, it will
    // transition into the `loading` state. Otherwise, if
    // the record is being created on the client, it will
    // transition into the `created` state.
    empty: {
      isEmpty: true,

      // EVENTS
      loadingData: function loadingData(internalModel, promise) {
        internalModel._promiseProxy = promise;
        internalModel.transitionTo('loading');
      },
      loadedData: function loadedData(internalModel) {
        internalModel.transitionTo('loaded.created.uncommitted');
        internalModel.triggerLater('ready');
      },
      pushedData: function pushedData(internalModel) {
        internalModel.transitionTo('loaded.saved');
        internalModel.triggerLater('didLoad');
        internalModel.triggerLater('ready');
      }
    },

    // A record enters this state when the store asks
    // the adapter for its data. It remains in this state
    // until the adapter provides the requested data.
    //
    // Usually, this process is asynchronous, using an
    // XHR to retrieve the data.
    loading: {
      // FLAGS
      isLoading: true,

      exit: function exit(internalModel) {
        internalModel._promiseProxy = null;
      },


      // EVENTS
      pushedData: function pushedData(internalModel) {
        internalModel.transitionTo('loaded.saved');
        internalModel.triggerLater('didLoad');
        internalModel.triggerLater('ready');
        //TODO this seems out of place here
        internalModel.didCleanError();
      },
      becameError: function becameError(internalModel) {
        internalModel.triggerLater('becameError', internalModel);
      },
      notFound: function notFound(internalModel) {
        internalModel.transitionTo('empty');
      }
    },

    // A record enters this state when its data is populated.
    // Most of a record's lifecycle is spent inside substates
    // of the `loaded` state.
    loaded: {
      initialState: 'saved',

      // FLAGS
      isLoaded: true,

      //TODO(Igor) Reloading now triggers a loadingData event,
      //but it should be ok?
      loadingData: function loadingData() {},


      // SUBSTATES

      // If there are no local changes to a record, it remains
      // in the `saved` state.
      saved: {
        setup: function setup(internalModel) {
          if (internalModel.hasChangedAttributes()) {
            internalModel.adapterDidDirty();
          }
        },


        // EVENTS
        didSetProperty: _didSetProperty,

        pushedData: function pushedData() {},
        becomeDirty: function becomeDirty(internalModel) {
          internalModel.transitionTo('updated.uncommitted');
        },
        willCommit: function willCommit(internalModel) {
          internalModel.transitionTo('updated.inFlight');
        },
        reloadRecord: function reloadRecord(internalModel, _ref2) {
          var resolve = _ref2.resolve,
              options = _ref2.options;

          resolve(internalModel.store._reloadRecord(internalModel, options));
        },
        deleteRecord: function deleteRecord(internalModel) {
          internalModel.transitionTo('deleted.uncommitted');
        },
        unloadRecord: function unloadRecord(internalModel) {},
        didCommit: function didCommit() {},


        // loaded.saved.notFound would be triggered by a failed
        // `reload()` on an unchanged record
        notFound: function notFound() {}
      },

      // A record is in this state after it has been locally
      // created but before the adapter has indicated that
      // it has been saved.
      created: createdState,

      // A record is in this state if it has already been
      // saved to the server, but there are new local changes
      // that have not yet been saved.
      updated: updatedState
    },

    // A record is in this state if it was deleted from the store.
    deleted: {
      initialState: 'uncommitted',
      dirtyType: 'deleted',

      // FLAGS
      isDeleted: true,
      isLoaded: true,
      isDirty: true,

      // TRANSITIONS
      setup: function setup(internalModel) {
        internalModel.updateRecordArrays();
      },


      // SUBSTATES

      // When a record is deleted, it enters the `start`
      // state. It will exit this state when the record
      // starts to commit.
      uncommitted: {
        // EVENTS

        willCommit: function willCommit(internalModel) {
          internalModel.transitionTo('inFlight');
        },
        rollback: function rollback(internalModel) {
          internalModel.rollbackAttributes();
          internalModel.triggerLater('ready');
        },
        pushedData: function pushedData() {},
        becomeDirty: function becomeDirty() {},
        deleteRecord: function deleteRecord() {},
        rolledBack: function rolledBack(internalModel) {
          internalModel.transitionTo('loaded.saved');
          internalModel.triggerLater('ready');
          internalModel.triggerLater('rolledBack');
        }
      },

      // After a record starts committing, but
      // before the adapter indicates that the deletion
      // has saved to the server, a record is in the
      // `inFlight` substate of `deleted`.
      inFlight: {
        // FLAGS
        isSaving: true,

        // EVENTS

        unloadRecord: assertAgainstUnloadRecord,

        // TODO: More robust semantics around save-while-in-flight
        willCommit: function willCommit() {},
        didCommit: function didCommit(internalModel) {
          internalModel.transitionTo('saved');

          internalModel.send('invokeLifecycleCallbacks');
        },
        becameError: function becameError(internalModel) {
          internalModel.transitionTo('uncommitted');
          internalModel.triggerLater('becameError', internalModel);
        },
        becameInvalid: function becameInvalid(internalModel) {
          internalModel.transitionTo('invalid');
          internalModel.triggerLater('becameInvalid', internalModel);
        }
      },

      // Once the adapter indicates that the deletion has
      // been saved, the record enters the `saved` substate
      // of `deleted`.
      saved: {
        // FLAGS
        isDirty: false,

        setup: function setup(internalModel) {
          internalModel.removeFromInverseRelationships();
        },
        invokeLifecycleCallbacks: function invokeLifecycleCallbacks(internalModel) {
          internalModel.triggerLater('didDelete', internalModel);
          internalModel.triggerLater('didCommit', internalModel);
        },
        willCommit: function willCommit() {},
        didCommit: function didCommit() {},
        pushedData: function pushedData() {}
      },

      invalid: {
        isValid: false,

        didSetProperty: function didSetProperty(internalModel, context) {
          internalModel.removeErrorMessageFromAttribute(context.name);

          _didSetProperty(internalModel, context);

          if (!internalModel.hasErrors()) {
            this.becameValid(internalModel);
          }
        },
        becameInvalid: function becameInvalid() {},
        becomeDirty: function becomeDirty() {},
        deleteRecord: function deleteRecord() {},
        willCommit: function willCommit() {},
        rolledBack: function rolledBack(internalModel) {
          internalModel.clearErrorMessages();
          internalModel.transitionTo('loaded.saved');
          internalModel.triggerLater('ready');
        },
        becameValid: function becameValid(internalModel) {
          internalModel.transitionTo('uncommitted');
        }
      }
    },

    invokeLifecycleCallbacks: function invokeLifecycleCallbacks(internalModel, dirtyType) {
      if (dirtyType === 'created') {
        internalModel.triggerLater('didCreate', internalModel);
      } else {
        internalModel.triggerLater('didUpdate', internalModel);
      }

      internalModel.triggerLater('didCommit', internalModel);
    }
  };

  function wireState(object, parent, name) {
    // TODO: Use Object.create and copy instead
    object = mixin(parent ? Object.create(parent) : {}, object);
    object.parentState = parent;
    object.stateName = name;

    for (var prop in object) {
      if (!object.hasOwnProperty(prop) || prop === 'parentState' || prop === 'stateName') {
        continue;
      }
      if (typeof object[prop] === 'object') {
        object[prop] = wireState(object[prop], object, name + '.' + prop);
      }
    }

    return object;
  }

  var RootState$1 = wireState(RootState, null, 'root');

  // All modelNames are dasherized internally. Changing this function may
  // require changes to other normalization hooks (such as typeForRoot).

  /**
   This method normalizes a modelName into the format Ember Data uses
   internally.

    @method normalizeModelName
    @public
    @param {String} modelName
    @return {String} normalizedModelName
    @for DS
  */
  function normalizeModelName(modelName) {
    return Ember.String.dasherize(modelName);
  }

  var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function typeForRelationshipMeta(meta) {
    var modelName = void 0;

    modelName = meta.type || meta.key;
    modelName = normalizeModelName(modelName);

    if (meta.kind === 'hasMany') {
      modelName = emberInflector.singularize(modelName);
    }

    return modelName;
  }

  function shouldFindInverse(relationshipMeta) {
    var options = relationshipMeta.options;
    return !(options && options.inverse === null);
  }

  var RelationshipDefinition = function () {
    function RelationshipDefinition(meta) {
      this.meta = meta;
      this._type = '';
      this.__inverseKey = '';
      this.__inverseIsAsync = null;
      this.modelClass = meta.parentType;
      this.store = null;
    }

    RelationshipDefinition.prototype._inverseKey = function _inverseKey(store, modelClass) {
      if (this.__inverseKey === '') {
        this._calculateInverse(store, modelClass);
      }
      return this.__inverseKey;
    };

    RelationshipDefinition.prototype._inverseIsAsync = function _inverseIsAsync(store, modelClass) {
      if (this.__inverseIsAsync === null) {
        this._calculateInverse(store, modelClass);
      }
      return this.__inverseIsAsync;
    };

    RelationshipDefinition.prototype._calculateInverse = function _calculateInverse(store, modelClass) {
      var inverseKey = void 0,
          inverseIsAsync = void 0;
      var inverse = null;

      if (shouldFindInverse(this.meta)) {
        inverse = modelClass.inverseFor(this.key, store);
      } else {}

      if (inverse) {
        inverseKey = inverse.name;
        inverseIsAsync = isInverseAsync(inverse);
      } else {
        inverseKey = null;
        inverseIsAsync = false;
      }
      this.__inverseKey = inverseKey;
      this.__inverseIsAsync = inverseIsAsync;
    };

    _createClass$1(RelationshipDefinition, [{
      key: 'key',
      get: function get() {
        return this.meta.key;
      }
    }, {
      key: 'kind',
      get: function get() {
        return this.meta.kind;
      }
    }, {
      key: 'type',
      get: function get() {
        if (this._type) {
          return this._type;
        }
        this._type = typeForRelationshipMeta(this.meta);
        return this._type;
      }
    }, {
      key: 'options',
      get: function get() {
        return this.meta.options;
      }
    }, {
      key: 'name',
      get: function get() {
        return this.meta.name;
      }
    }, {
      key: 'parentType',
      get: function get() {
        return this.meta.parentType;
      }
    }]);

    return RelationshipDefinition;
  }();

  function isInverseAsync(meta) {
    var inverseAsync = meta.options && meta.options.async;
    return typeof inverseAsync === 'undefined' ? true : inverseAsync;
  }

  function relationshipFromMeta(meta) {
    return new RelationshipDefinition(meta);
  }

  var relationshipsDescriptor = Ember.computed(function () {
    var map = new MapWithDefault({
      defaultValue: function defaultValue() {
        return [];
      }
    });

    var relationshipsByName = Ember.get(this, 'relationshipsByName');

    // Loop through each computed property on the class
    relationshipsByName.forEach(function (desc) {
      var relationshipsForType = map.get(desc.type);
      relationshipsForType.push(desc);
    });

    return map;
  }).readOnly();

  var relatedTypesDescriptor = Ember.computed(function () {

    var modelName = void 0;
    var types = Ember.A();

    // Loop through each computed property on the class,
    // and create an array of the unique types involved
    // in relationships
    this.eachComputedProperty(function (name, meta) {
      if (meta.isRelationship) {
        meta.key = name;
        modelName = typeForRelationshipMeta(meta);


        if (!types.includes(modelName)) {

          types.push(modelName);
        }
      }
    });

    return types;
  }).readOnly();

  var relationshipsByNameDescriptor = Ember.computed(function () {
    var map = new MapWithDeprecations();

    this.eachComputedProperty(function (name, meta) {
      if (meta.isRelationship) {
        meta.key = name;
        meta.name = name;
        map.set(name, relationshipFromMeta(meta));
      }
    });

    return map;
  }).readOnly();

  var changeProperties = Ember.changeProperties;

  /**
    @module ember-data
  */

  function findPossibleInverses(type, inverseType, name, relationshipsSoFar) {
    var possibleRelationships = relationshipsSoFar || [];

    var relationshipMap = Ember.get(inverseType, 'relationships');
    if (!relationshipMap) {
      return possibleRelationships;
    }

    var relationships = relationshipMap.get(type.modelName).filter(function (relationship) {
      var optionsForRelationship = inverseType.metaForProperty(relationship.name).options;

      if (!optionsForRelationship.inverse && optionsForRelationship.inverse !== null) {
        return true;
      }

      return name === optionsForRelationship.inverse;
    });

    if (relationships) {
      possibleRelationships.push.apply(possibleRelationships, relationships);
    }

    //Recurse to support polymorphism
    if (type.superclass) {
      findPossibleInverses(type.superclass, inverseType, name, possibleRelationships);
    }

    return possibleRelationships;
  }

  var retrieveFromCurrentState = Ember.computed('currentState', function (key) {
    return Ember.get(this._internalModel.currentState, key);
  }).readOnly();

  /**

    The model class that all Ember Data records descend from.
    This is the public API of Ember Data models. If you are using Ember Data
    in your application, this is the class you should use.
    If you are working on Ember Data internals, you most likely want to be dealing
    with `InternalModel`

    @class Model
    @namespace DS
    @extends Ember.Object
    @uses Ember.Evented
  */
  var Model = Ember.Object.extend(Ember.Evented, {
    _internalModel: null,
    store: null,
    __defineNonEnumerable: function __defineNonEnumerable(property) {
      this[property.name] = property.descriptor.value;
    },


    /**
      If this property is `true` the record is in the `empty`
      state. Empty is the first state all records enter after they have
      been created. Most records created by the store will quickly
      transition to the `loading` state if data needs to be fetched from
      the server or the `created` state if the record is created on the
      client. A record can also enter the empty state if the adapter is
      unable to locate the record.
       @property isEmpty
      @type {Boolean}
      @readOnly
    */
    isEmpty: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `loading` state. A
      record enters this state when the store asks the adapter for its
      data. It remains in this state until the adapter provides the
      requested data.
       @property isLoading
      @type {Boolean}
      @readOnly
    */
    isLoading: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `loaded` state. A
      record enters this state when its data is populated. Most of a
      record's lifecycle is spent inside substates of the `loaded`
      state.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('isLoaded'); // true
       store.findRecord('model', 1).then(function(model) {
        model.get('isLoaded'); // true
      });
      ```
       @property isLoaded
      @type {Boolean}
      @readOnly
    */
    isLoaded: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `dirty` state. The
      record has local changes that have not yet been saved by the
      adapter. This includes records that have been created (but not yet
      saved) or deleted.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('hasDirtyAttributes'); // true
       store.findRecord('model', 1).then(function(model) {
        model.get('hasDirtyAttributes'); // false
        model.set('foo', 'some value');
        model.get('hasDirtyAttributes'); // true
      });
      ```
       @since 1.13.0
      @property hasDirtyAttributes
      @type {Boolean}
      @readOnly
    */
    hasDirtyAttributes: Ember.computed('currentState.isDirty', function () {
      return this.get('currentState.isDirty');
    }),
    /**
      If this property is `true` the record is in the `saving` state. A
      record enters the saving state when `save` is called, but the
      adapter has not yet acknowledged that the changes have been
      persisted to the backend.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('isSaving'); // false
      let promise = record.save();
      record.get('isSaving'); // true
      promise.then(function() {
        record.get('isSaving'); // false
      });
      ```
       @property isSaving
      @type {Boolean}
      @readOnly
    */
    isSaving: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `deleted` state
      and has been marked for deletion. When `isDeleted` is true and
      `hasDirtyAttributes` is true, the record is deleted locally but the deletion
      was not yet persisted. When `isSaving` is true, the change is
      in-flight. When both `hasDirtyAttributes` and `isSaving` are false, the
      change has persisted.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('isDeleted');    // false
      record.deleteRecord();
       // Locally deleted
      record.get('isDeleted');           // true
      record.get('hasDirtyAttributes');  // true
      record.get('isSaving');            // false
       // Persisting the deletion
      let promise = record.save();
      record.get('isDeleted');    // true
      record.get('isSaving');     // true
       // Deletion Persisted
      promise.then(function() {
        record.get('isDeleted');          // true
        record.get('isSaving');           // false
        record.get('hasDirtyAttributes'); // false
      });
      ```
       @property isDeleted
      @type {Boolean}
      @readOnly
    */
    isDeleted: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `new` state. A
      record will be in the `new` state when it has been created on the
      client and the adapter has not yet report that it was successfully
      saved.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('isNew'); // true
       record.save().then(function(model) {
        model.get('isNew'); // false
      });
      ```
       @property isNew
      @type {Boolean}
      @readOnly
    */
    isNew: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `valid` state.
       A record will be in the `valid` state when the adapter did not report any
      server-side validation failures.
       @property isValid
      @type {Boolean}
      @readOnly
    */
    isValid: retrieveFromCurrentState,
    /**
      If the record is in the dirty state this property will report what
      kind of change has caused it to move into the dirty
      state. Possible values are:
       - `created` The record has been created by the client and not yet saved to the adapter.
      - `updated` The record has been updated by the client and not yet saved to the adapter.
      - `deleted` The record has been deleted by the client and not yet saved to the adapter.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('dirtyType'); // 'created'
      ```
       @property dirtyType
      @type {String}
      @readOnly
    */
    dirtyType: retrieveFromCurrentState,

    /**
      If `true` the adapter reported that it was unable to save local
      changes to the backend for any reason other than a server-side
      validation error.
       Example
       ```javascript
      record.get('isError'); // false
      record.set('foo', 'valid value');
      record.save().then(null, function() {
        record.get('isError'); // true
      });
      ```
       @property isError
      @type {Boolean}
      @readOnly
    */
    isError: false,

    /**
      If `true` the store is attempting to reload the record from the adapter.
       Example
       ```javascript
      record.get('isReloading'); // false
      record.reload();
      record.get('isReloading'); // true
      ```
       @property isReloading
      @type {Boolean}
      @readOnly
    */
    isReloading: false,

    /**
      All ember models have an id property. This is an identifier
      managed by an external source. These are always coerced to be
      strings before being used internally. Note when declaring the
      attributes for a model it is an error to declare an id
      attribute.
       ```javascript
      let record = store.createRecord('model');
      record.get('id'); // null
       store.findRecord('model', 1).then(function(model) {
        model.get('id'); // '1'
      });
      ```
       @property id
      @type {String}
    */

    /**
      @property currentState
      @private
      @type {Object}
    */
    currentState: RootState$1.empty,

    /**
      When the record is in the `invalid` state this object will contain
      any errors returned by the adapter. When present the errors hash
      contains keys corresponding to the invalid property names
      and values which are arrays of Javascript objects with two keys:
       - `message` A string containing the error message from the backend
      - `attribute` The name of the property associated with this error message
       ```javascript
      record.get('errors.length'); // 0
      record.set('foo', 'invalid value');
      record.save().catch(function() {
        record.get('errors').get('foo');
        // [{message: 'foo should be a number.', attribute: 'foo'}]
      });
      ```
       The `errors` property us useful for displaying error messages to
      the user.
       ```handlebars
      <label>Username: {{input value=username}} </label>
      {{#each model.errors.username as |error|}}
        <div class="error">
          {{error.message}}
        </div>
      {{/each}}
      <label>Email: {{input value=email}} </label>
      {{#each model.errors.email as |error|}}
        <div class="error">
          {{error.message}}
        </div>
      {{/each}}
      ```
        You can also access the special `messages` property on the error
      object to get an array of all the error strings.
       ```handlebars
      {{#each model.errors.messages as |message|}}
        <div class="error">
          {{message}}
        </div>
      {{/each}}
      ```
       @property errors
      @type {DS.Errors}
    */
    errors: Ember.computed(function () {
      var errors = Errors.create();

      errors._registerHandlers(this._internalModel, function () {
        this.send('becameInvalid');
      }, function () {
        this.send('becameValid');
      });
      return errors;
    }).readOnly(),

    /**
      This property holds the `DS.AdapterError` object with which
      last adapter operation was rejected.
       @property adapterError
      @type {DS.AdapterError}
    */
    adapterError: null,

    /**
      Create a JSON representation of the record, using the serialization
      strategy of the store's adapter.
      `serialize` takes an optional hash as a parameter, currently
      supported options are:
      - `includeId`: `true` if the record's ID should be included in the
        JSON representation.
       @method serialize
      @param {Object} options
      @return {Object} an object whose values are primitive JSON values only
    */
    serialize: function serialize(options) {
      return this._internalModel.createSnapshot().serialize(options);
    },


    /**
      Use [DS.JSONSerializer](DS.JSONSerializer.html) to
      get the JSON representation of a record.
       `toJSON` takes an optional hash as a parameter, currently
      supported options are:
       - `includeId`: `true` if the record's ID should be included in the
        JSON representation.
       @method toJSON
      @param {Object} options
      @return {Object} A JSON representation of the object.
    */
    toJSON: function toJSON(options) {
      // container is for lazy transform lookups
      var serializer = this.store.serializerFor('-default');
      var snapshot = this._internalModel.createSnapshot();

      return serializer.serialize(snapshot, options);
    },


    /**
      Fired when the record is ready to be interacted with,
      that is either loaded from the server or created locally.
       @event ready
    */
    ready: null,

    /**
      Fired when the record is loaded from the server.
       @event didLoad
    */
    didLoad: null,

    /**
      Fired when the record is updated.
       @event didUpdate
    */
    didUpdate: null,

    /**
      Fired when a new record is commited to the server.
       @event didCreate
    */
    didCreate: null,

    /**
      Fired when the record is deleted.
       @event didDelete
    */
    didDelete: null,

    /**
      Fired when the record becomes invalid.
       @event becameInvalid
    */
    becameInvalid: null,

    /**
      Fired when the record enters the error state.
       @event becameError
    */
    becameError: null,

    /**
      Fired when the record is rolled back.
       @event rolledBack
    */
    rolledBack: null,

    //TODO Do we want to deprecate these?
    /**
      @method send
      @private
      @param {String} name
      @param {Object} context
    */
    send: function send(name, context) {
      return this._internalModel.send(name, context);
    },


    /**
      @method transitionTo
      @private
      @param {String} name
    */
    transitionTo: function transitionTo(name) {
      return this._internalModel.transitionTo(name);
    },


    /**
      Marks the record as deleted but does not save it. You must call
      `save` afterwards if you want to persist it. You might use this
      method if you want to allow the user to still `rollbackAttributes()`
      after a delete was made.
       Example
       ```app/routes/model/delete.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        actions: {
          softDelete() {
            this.get('controller.model').deleteRecord();
          },
          confirm() {
            this.get('controller.model').save();
          },
          undo() {
            this.get('controller.model').rollbackAttributes();
          }
        }
      });
      ```
       @method deleteRecord
    */
    deleteRecord: function deleteRecord() {
      this._internalModel.deleteRecord();
    },


    /**
      Same as `deleteRecord`, but saves the record immediately.
       Example
       ```app/routes/model/delete.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        actions: {
          delete() {
            this.get('controller.model').destroyRecord().then(function() {
              controller.transitionToRoute('model.index');
            });
          }
        }
      });
      ```
       If you pass an object on the `adapterOptions` property of the options
      argument it will be passed to your adapter via the snapshot
       ```js
      record.destroyRecord({ adapterOptions: { subscribe: false } });
      ```
       ```app/adapters/post.js
      import MyCustomAdapter from './custom-adapter';
       export default MyCustomAdapter.extend({
        deleteRecord(store, type, snapshot) {
          if (snapshot.adapterOptions.subscribe) {
            // ...
          }
          // ...
        }
      });
      ```
       @method destroyRecord
      @param {Object} options
      @return {Promise} a promise that will be resolved when the adapter returns
      successfully or rejected if the adapter returns with an error.
    */
    destroyRecord: function destroyRecord(options) {
      this.deleteRecord();
      return this.save(options);
    },


    /**
      Unloads the record from the store. This will cause the record to be destroyed and freed up for garbage collection.
       @method unloadRecord
    */
    unloadRecord: function unloadRecord() {
      if (this.isDestroyed) {
        return;
      }
      this._internalModel.unloadRecord();
    },


    /**
      @method _notifyProperties
      @private
    */
    _notifyProperties: function _notifyProperties(keys) {
      var _this = this;

      // changeProperties defers notifications until after the delegate
      // and protects with a try...finally block
      // previously used begin...endPropertyChanges but this is private API
      changeProperties(function () {
        var key = void 0;
        for (var i = 0, length = keys.length; i < length; i++) {
          key = keys[i];
          _this.notifyPropertyChange(key);
        }
      });
    },


    /**
      Returns an object, whose keys are changed properties, and value is
      an [oldProp, newProp] array.
       The array represents the diff of the canonical state with the local state
      of the model. Note: if the model is created locally, the canonical state is
      empty since the adapter hasn't acknowledged the attributes yet:
       Example
       ```app/models/mascot.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        name: DS.attr('string'),
        isAdmin: DS.attr('boolean', {
          defaultValue: false
        })
      });
      ```
       ```javascript
      let mascot = store.createRecord('mascot');
       mascot.changedAttributes(); // {}
       mascot.set('name', 'Tomster');
      mascot.changedAttributes(); // { name: [undefined, 'Tomster'] }
       mascot.set('isAdmin', true);
      mascot.changedAttributes(); // { isAdmin: [undefined, true], name: [undefined, 'Tomster'] }
       mascot.save().then(function() {
        mascot.changedAttributes(); // {}
         mascot.set('isAdmin', false);
        mascot.changedAttributes(); // { isAdmin: [true, false] }
      });
      ```
       @method changedAttributes
      @return {Object} an object, whose keys are changed properties,
        and value is an [oldProp, newProp] array.
    */
    changedAttributes: function changedAttributes() {
      return this._internalModel.changedAttributes();
    },


    //TODO discuss with tomhuda about events/hooks
    //Bring back as hooks?
    /**
      @method adapterWillCommit
      @private
    adapterWillCommit: function() {
      this.send('willCommit');
    },
     /**
      @method adapterDidDirty
      @private
    adapterDidDirty: function() {
      this.send('becomeDirty');
      this.updateRecordArraysLater();
    },
    */

    /**
      If the model `hasDirtyAttributes` this function will discard any unsaved
      changes. If the model `isNew` it will be removed from the store.
       Example
       ```javascript
      record.get('name'); // 'Untitled Document'
      record.set('name', 'Doc 1');
      record.get('name'); // 'Doc 1'
      record.rollbackAttributes();
      record.get('name'); // 'Untitled Document'
      ```
       @since 1.13.0
      @method rollbackAttributes
    */
    rollbackAttributes: function rollbackAttributes() {
      this._internalModel.rollbackAttributes();
    },


    /*
      @method _createSnapshot
      @private
    */
    _createSnapshot: function _createSnapshot() {
      return this._internalModel.createSnapshot();
    },
    toStringExtension: function toStringExtension() {
      // the _internalModel guard exists, because some dev-only deprecation code
      // (addListener via validatePropertyInjections) invokes toString before the
      // object is real.
      return this._internalModel && this._internalModel.id;
    },


    /**
      Save the record and persist any changes to the record to an
      external source via the adapter.
       Example
       ```javascript
      record.set('name', 'Tomster');
      record.save().then(function() {
        // Success callback
      }, function() {
        // Error callback
      });
      ```
      If you pass an object using the `adapterOptions` property of the options
     argument it will be passed to your adapter via the snapshot.
       ```js
      record.save({ adapterOptions: { subscribe: false } });
      ```
       ```app/adapters/post.js
      import MyCustomAdapter from './custom-adapter';
       export default MyCustomAdapter.extend({
        updateRecord(store, type, snapshot) {
          if (snapshot.adapterOptions.subscribe) {
            // ...
          }
          // ...
        }
      });
      ```
       @method save
      @param {Object} options
      @return {Promise} a promise that will be resolved when the adapter returns
      successfully or rejected if the adapter returns with an error.
    */
    save: function save(options) {
      var _this2 = this;

      return PromiseObject.create({
        promise: this._internalModel.save(options).then(function () {
          return _this2;
        })
      });
    },


    /**
      Reload the record from the adapter.
       This will only work if the record has already finished loading.
       Example
       ```app/routes/model/view.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        actions: {
          reload() {
            this.controller.get('model').reload().then(function(model) {
              // do something with the reloaded model
            });
          }
        }
      });
      ```
       @method reload
      @param {Object} options optional, may include `adapterOptions` hash which will be passed to adapter request
      @return {Promise} a promise that will be resolved with the record when the
      adapter returns successfully or rejected if the adapter returns
      with an error.
    */
    reload: function reload(options) {
      var _this3 = this;

      var wrappedAdapterOptions = void 0;

      if (typeof options === 'object' && options !== null && options.adapterOptions) {
        wrappedAdapterOptions = {
          adapterOptions: options.adapterOptions
        };
      }

      return PromiseObject.create({
        promise: this._internalModel.reload(wrappedAdapterOptions).then(function () {
          return _this3;
        })
      });
    },


    /**
      Override the default event firing from Ember.Evented to
      also call methods with the given name.
       @method trigger
      @private
      @param {String} name
    */
    trigger: function trigger(name) {
      var fn = this[name];

      if (typeof fn === 'function') {
        var length = arguments.length;
        var args = new Array(length - 1);

        for (var i = 1; i < length; i++) {
          args[i - 1] = arguments[i];
        }
        fn.apply(this, args);
      }

      this._super.apply(this, arguments);
    },
    attr: function attr() {
    },


    /**
      Get the reference for the specified belongsTo relationship.
       Example
       ```app/models/blog.js
      export default DS.Model.extend({
        user: DS.belongsTo({ async: true })
      });
      ```
       ```javascript
      let blog = store.push({
        data: {
          type: 'blog',
          id: 1,
          relationships: {
            user: {
              data: { type: 'user', id: 1 }
            }
          }
        }
      });
      let userRef = blog.belongsTo('user');
       // check if the user relationship is loaded
      let isLoaded = userRef.value() !== null;
       // get the record of the reference (null if not yet available)
      let user = userRef.value();
       // get the identifier of the reference
      if (userRef.remoteType() === "id") {
        let id = userRef.id();
      } else if (userRef.remoteType() === "link") {
        let link = userRef.link();
      }
       // load user (via store.findRecord or store.findBelongsTo)
      userRef.load().then(...)
       // or trigger a reload
      userRef.reload().then(...)
       // provide data for reference
      userRef.push({
        type: 'user',
        id: 1,
        attributes: {
          username: "@user"
        }
      }).then(function(user) {
        userRef.value() === user;
      });
      ```
       @method belongsTo
      @param {String} name of the relationship
      @since 2.5.0
      @return {BelongsToReference} reference for this relationship
    */
    belongsTo: function belongsTo(name) {
      return this._internalModel.referenceFor('belongsTo', name);
    },


    /**
      Get the reference for the specified hasMany relationship.
       Example
       ```javascript
      // models/blog.js
      export default DS.Model.extend({
        comments: DS.hasMany({ async: true })
      });
       let blog = store.push({
        data: {
          type: 'blog',
          id: 1,
          relationships: {
            comments: {
              data: [
                { type: 'comment', id: 1 },
                { type: 'comment', id: 2 }
              ]
            }
          }
        }
      });
      let commentsRef = blog.hasMany('comments');
       // check if the comments are loaded already
      let isLoaded = commentsRef.value() !== null;
       // get the records of the reference (null if not yet available)
      let comments = commentsRef.value();
       // get the identifier of the reference
      if (commentsRef.remoteType() === "ids") {
        let ids = commentsRef.ids();
      } else if (commentsRef.remoteType() === "link") {
        let link = commentsRef.link();
      }
       // load comments (via store.findMany or store.findHasMany)
      commentsRef.load().then(...)
       // or trigger a reload
      commentsRef.reload().then(...)
       // provide data for reference
      commentsRef.push([{ type: 'comment', id: 1 }, { type: 'comment', id: 2 }]).then(function(comments) {
        commentsRef.value() === comments;
      });
      ```
       @method hasMany
      @param {String} name of the relationship
      @since 2.5.0
      @return {HasManyReference} reference for this relationship
    */
    hasMany: function hasMany(name) {
      return this._internalModel.referenceFor('hasMany', name);
    },


    /**
     Provides info about the model for debugging purposes
     by grouping the properties into more semantic groups.
      Meant to be used by debugging tools such as the Chrome Ember Extension.
      - Groups all attributes in "Attributes" group.
     - Groups all belongsTo relationships in "Belongs To" group.
     - Groups all hasMany relationships in "Has Many" group.
     - Groups all flags in "Flags" group.
     - Flags relationship CPs as expensive properties.
      @method _debugInfo
     @for DS.Model
     @private
     */
    _debugInfo: function _debugInfo() {
      var attributes = ['id'];
      var relationships = {};
      var expensiveProperties = [];

      this.eachAttribute(function (name, meta) {
        return attributes.push(name);
      });

      var groups = [{
        name: 'Attributes',
        properties: attributes,
        expand: true
      }];

      this.eachRelationship(function (name, relationship) {
        var properties = relationships[relationship.kind];

        if (properties === undefined) {
          properties = relationships[relationship.kind] = [];
          groups.push({
            name: relationship.name,
            properties: properties,
            expand: true
          });
        }
        properties.push(name);
        expensiveProperties.push(name);
      });

      groups.push({
        name: 'Flags',
        properties: ['isLoaded', 'hasDirtyAttributes', 'isSaving', 'isDeleted', 'isError', 'isNew', 'isValid']
      });

      return {
        propertyInfo: {
          // include all other mixins / properties (not just the grouped ones)
          includeOtherProperties: true,
          groups: groups,
          // don't pre-calculate unless cached
          expensiveProperties: expensiveProperties
        }
      };
    },
    notifyBelongsToChange: function notifyBelongsToChange(key) {
      this.notifyPropertyChange(key);
    },

    /**
     Given a callback, iterates over each of the relationships in the model,
     invoking the callback with the name of each relationship and its relationship
     descriptor.
       The callback method you provide should have the following signature (all
     parameters are optional):
      ```javascript
     function(name, descriptor);
     ```
      - `name` the name of the current property in the iteration
     - `descriptor` the meta object that describes this relationship
      The relationship descriptor argument is an object with the following properties.
      - **key** <span class="type">String</span> the name of this relationship on the Model
     - **kind** <span class="type">String</span> "hasMany" or "belongsTo"
     - **options** <span class="type">Object</span> the original options hash passed when the relationship was declared
     - **parentType** <span class="type">DS.Model</span> the type of the Model that owns this relationship
     - **type** <span class="type">String</span> the type name of the related Model
      Note that in addition to a callback, you can also pass an optional target
     object that will be set as `this` on the context.
      Example
      ```app/serializers/application.js
     import DS from 'ember-data';
      export default DS.JSONSerializer.extend({
      serialize: function(record, options) {
        let json = {};
         record.eachRelationship(function(name, descriptor) {
          if (descriptor.kind === 'hasMany') {
            let serializedHasManyName = name.toUpperCase() + '_IDS';
            json[serializedHasManyName] = record.get(name).mapBy('id');
          }
        });
         return json;
      }
    });
     ```
      @method eachRelationship
     @param {Function} callback the callback to invoke
     @param {any} binding the value to which the callback's `this` should be bound
     */
    eachRelationship: function eachRelationship(callback, binding) {
      this.constructor.eachRelationship(callback, binding);
    },
    relationshipFor: function relationshipFor(name) {
      return Ember.get(this.constructor, 'relationshipsByName').get(name);
    },
    inverseFor: function inverseFor(key) {
      return this.constructor.inverseFor(key, this.store);
    },
    notifyHasManyAdded: function notifyHasManyAdded(key) {
      //We need to notifyPropertyChange in the adding case because we need to make sure
      //we fetch the newly added record in case it is unloaded
      //TODO(Igor): Consider whether we could do this only if the record state is unloaded

      //Goes away once hasMany is double promisified
      this.notifyPropertyChange(key);
    },
    eachAttribute: function eachAttribute(callback, binding) {
      this.constructor.eachAttribute(callback, binding);
    }
  });

  /**
   @property data
   @private
   @type {Object}
   */
  Object.defineProperty(Model.prototype, 'data', {
    configurable: false,
    get: function get() {
      return this._internalModel._data;
    }
  });

  Object.defineProperty(Model.prototype, 'id', {
    configurable: false,
    set: function set(id) {
      this._internalModel.setId(id);
    },
    get: function get() {
      // the _internalModel guard exists, because some dev-only deprecation code
      // (addListener via validatePropertyInjections) invokes toString before the
      // object is real.
      return this._internalModel && this._internalModel.id;
    }
  });

  Model.reopenClass({
    isModel: true,

    /**
      Override the class' `create()` method to raise an error. This
      prevents end users from inadvertently calling `create()` instead
      of `createRecord()`. The store is still able to create instances
      by calling the `_create()` method. To create an instance of a
      `DS.Model` use [store.createRecord](DS.Store.html#method_createRecord).
       @method create
      @private
      @static
    */
    /**
     Represents the model's class name as a string. This can be used to look up the model's class name through
     `DS.Store`'s modelFor method.
      `modelName` is generated for you by Ember Data. It will be a lowercased, dasherized string.
     For example:
      ```javascript
     store.modelFor('post').modelName; // 'post'
     store.modelFor('blog-post').modelName; // 'blog-post'
     ```
      The most common place you'll want to access `modelName` is in your serializer's `payloadKeyFromModelName` method. For example, to change payload
     keys to underscore (instead of dasherized), you might use the following code:
      ```javascript
     import { underscore } from '@ember/string';
      export default const PostSerializer = DS.RESTSerializer.extend({
       payloadKeyFromModelName(modelName) {
         return underscore(modelName);
       }
     });
     ```
     @property modelName
     @type String
     @readonly
     @static
    */
    modelName: null,

    /*
     These class methods below provide relationship
     introspection abilities about relationships.
      A note about the computed properties contained here:
      **These properties are effectively sealed once called for the first time.**
     To avoid repeatedly doing expensive iteration over a model's fields, these
     values are computed once and then cached for the remainder of the runtime of
     your application.
      If your application needs to modify a class after its initial definition
     (for example, using `reopen()` to add additional attributes), make sure you
     do it before using your model with the store, which uses these properties
     extensively.
     */

    /**
     For a given relationship name, returns the model type of the relationship.
      For example, if you define a model like this:
      ```app/models/post.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        comments: DS.hasMany('comment')
      });
     ```
      Calling `store.modelFor('post').typeForRelationship('comments', store)` will return `Comment`.
      @method typeForRelationship
     @static
     @param {String} name the name of the relationship
     @param {store} store an instance of DS.Store
     @return {DS.Model} the type of the relationship, or undefined
     */
    typeForRelationship: function typeForRelationship(name, store) {
      var relationship = Ember.get(this, 'relationshipsByName').get(name);
      return relationship && store.modelFor(relationship.type);
    },


    inverseMap: Ember.computed(function () {
      return Object.create(null);
    }),

    /**
     Find the relationship which is the inverse of the one asked for.
      For example, if you define models like this:
      ```app/models/post.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        comments: DS.hasMany('message')
      });
     ```
      ```app/models/message.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        owner: DS.belongsTo('post')
      });
     ```
      ``` js
     store.modelFor('post').inverseFor('comments', store) // { type: App.Message, name: 'owner', kind: 'belongsTo' }
     store.modelFor('message').inverseFor('owner', store) // { type: App.Post, name: 'comments', kind: 'hasMany' }
     ```
      @method inverseFor
     @static
     @param {String} name the name of the relationship
     @param {DS.Store} store
     @return {Object} the inverse relationship, or null
     */
    inverseFor: function inverseFor(name, store) {
      var inverseMap = Ember.get(this, 'inverseMap');
      if (inverseMap[name] !== undefined) {
        return inverseMap[name];
      }

      var relationship = Ember.get(this, 'relationshipsByName').get(name);
      if (!relationship ||
      // populate the cache with a miss entry so we can skip getting and going
      // through `relationshipsByName`
      relationship.options && relationship.options.inverse === null) {
        return inverseMap[name] = null;
      }

      return inverseMap[name] = this._findInverseFor(name, store);
    },


    //Calculate the inverse, ignoring the cache
    _findInverseFor: function _findInverseFor(name, store) {
      var inverseType = this.typeForRelationship(name, store);
      if (!inverseType) {
        return null;
      }

      var propertyMeta = this.metaForProperty(name);
      //If inverse is manually specified to be null, like  `comments: DS.hasMany('message', { inverse: null })`
      var options = propertyMeta.options;
      if (options.inverse === null) {
        return null;
      }

      var inverseName = void 0,
          inverseKind = void 0,
          inverse = void 0,
          inverseOptions = void 0;

      //If inverse is specified manually, return the inverse
      if (options.inverse) {
        inverseName = options.inverse;
        inverse = Ember.get(inverseType, 'relationshipsByName').get(inverseName);

        // TODO probably just return the whole inverse here

        inverseKind = inverse.kind;
        inverseOptions = inverse.options;
      } else {
        //No inverse was specified manually, we need to use a heuristic to guess one
        if (propertyMeta.parentType && propertyMeta.type === propertyMeta.parentType.modelName) {
        }

        var possibleRelationships = findPossibleInverses(this, inverseType, name);

        if (possibleRelationships.length === 0) {
          return null;
        }

        var filteredRelationships = possibleRelationships.filter(function (possibleRelationship) {
          var optionsForRelationship = inverseType.metaForProperty(possibleRelationship.name).options;
          return name === optionsForRelationship.inverse;
        });


        if (filteredRelationships.length === 1) {
          possibleRelationships = filteredRelationships;
        }


        inverseName = possibleRelationships[0].name;
        inverseKind = possibleRelationships[0].kind;
        inverseOptions = possibleRelationships[0].options;
      }


      return {
        type: inverseType,
        name: inverseName,
        kind: inverseKind,
        options: inverseOptions
      };
    },


    /**
     The model's relationships as a map, keyed on the type of the
     relationship. The value of each entry is an array containing a descriptor
     for each relationship with that type, describing the name of the relationship
     as well as the type.
      For example, given the following model definition:
      ```app/models/blog.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
        posts: DS.hasMany('post')
      });
     ```
      This computed property would return a map describing these
     relationships, like this:
      ```javascript
     import Ember from 'ember';
     import Blog from 'app/models/blog';
     import User from 'app/models/user';
     import Post from 'app/models/post';
      let relationships = Ember.get(Blog, 'relationships');
     relationships.get(User);
     //=> [ { name: 'users', kind: 'hasMany' },
     //     { name: 'owner', kind: 'belongsTo' } ]
     relationships.get(Post);
     //=> [ { name: 'posts', kind: 'hasMany' } ]
     ```
      @property relationships
     @static
     @type Map
     @readOnly
     */

    relationships: relationshipsDescriptor,

    /**
     A hash containing lists of the model's relationships, grouped
     by the relationship kind. For example, given a model with this
     definition:
      ```app/models/blog.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post')
      });
     ```
      This property would contain the following:
      ```javascript
     import Ember from 'ember';
     import Blog from 'app/models/blog';
      let relationshipNames = Ember.get(Blog, 'relationshipNames');
     relationshipNames.hasMany;
     //=> ['users', 'posts']
     relationshipNames.belongsTo;
     //=> ['owner']
     ```
      @property relationshipNames
     @static
     @type Object
     @readOnly
     */
    relationshipNames: Ember.computed(function () {
      var names = {
        hasMany: [],
        belongsTo: []
      };

      this.eachComputedProperty(function (name, meta) {
        if (meta.isRelationship) {
          names[meta.kind].push(name);
        }
      });

      return names;
    }),

    /**
     An array of types directly related to a model. Each type will be
     included once, regardless of the number of relationships it has with
     the model.
      For example, given a model with this definition:
      ```app/models/blog.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post')
      });
     ```
      This property would contain the following:
      ```javascript
     import Ember from 'ember';
     import Blog from 'app/models/blog';
      let relatedTypes = Ember.get(Blog, 'relatedTypes');
     //=> [ User, Post ]
     ```
      @property relatedTypes
     @static
     @type Ember.Array
     @readOnly
     */
    relatedTypes: relatedTypesDescriptor,

    /**
     A map whose keys are the relationships of a model and whose values are
     relationship descriptors.
      For example, given a model with this
     definition:
      ```app/models/blog.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post')
      });
     ```
      This property would contain the following:
      ```javascript
     import Ember from 'ember';
     import Blog from 'app/models/blog';
      let relationshipsByName = Ember.get(Blog, 'relationshipsByName');
     relationshipsByName.get('users');
     //=> { key: 'users', kind: 'hasMany', type: 'user', options: Object, isRelationship: true }
     relationshipsByName.get('owner');
     //=> { key: 'owner', kind: 'belongsTo', type: 'user', options: Object, isRelationship: true }
     ```
      @property relationshipsByName
     @static
     @type Map
     @readOnly
     */
    relationshipsByName: relationshipsByNameDescriptor,

    /**
     A map whose keys are the fields of the model and whose values are strings
     describing the kind of the field. A model's fields are the union of all of its
     attributes and relationships.
      For example:
      ```app/models/blog.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post'),
         title: DS.attr('string')
      });
     ```
      ```js
     import Ember from 'ember';
     import Blog from 'app/models/blog';
      let fields = Ember.get(Blog, 'fields');
     fields.forEach(function(kind, field) {
        console.log(field, kind);
      });
      // prints:
     // users, hasMany
     // owner, belongsTo
     // posts, hasMany
     // title, attribute
     ```
      @property fields
     @static
     @type Map
     @readOnly
     */
    fields: Ember.computed(function () {
      var map = new MapWithDeprecations();

      this.eachComputedProperty(function (name, meta) {
        if (meta.isRelationship) {
          map.set(name, meta.kind);
        } else if (meta.isAttribute) {
          map.set(name, 'attribute');
        }
      });

      return map;
    }).readOnly(),

    /**
     Given a callback, iterates over each of the relationships in the model,
     invoking the callback with the name of each relationship and its relationship
     descriptor.
      @method eachRelationship
     @static
     @param {Function} callback the callback to invoke
     @param {any} binding the value to which the callback's `this` should be bound
     */
    eachRelationship: function eachRelationship(callback, binding) {
      Ember.get(this, 'relationshipsByName').forEach(function (relationship, name) {
        callback.call(binding, name, relationship);
      });
    },


    /**
     Given a callback, iterates over each of the types related to a model,
     invoking the callback with the related type's class. Each type will be
     returned just once, regardless of how many different relationships it has
     with a model.
      @method eachRelatedType
     @static
     @param {Function} callback the callback to invoke
     @param {any} binding the value to which the callback's `this` should be bound
     */
    eachRelatedType: function eachRelatedType(callback, binding) {
      var relationshipTypes = Ember.get(this, 'relatedTypes');

      for (var i = 0; i < relationshipTypes.length; i++) {
        var type = relationshipTypes[i];
        callback.call(binding, type);
      }
    },
    determineRelationshipType: function determineRelationshipType(knownSide, store) {
      var knownKey = knownSide.key;
      var knownKind = knownSide.kind;
      var inverse = this.inverseFor(knownKey, store);
      // let key;
      var otherKind = void 0;

      if (!inverse) {
        return knownKind === 'belongsTo' ? 'oneToNone' : 'manyToNone';
      }

      // key = inverse.name;
      otherKind = inverse.kind;

      if (otherKind === 'belongsTo') {
        return knownKind === 'belongsTo' ? 'oneToOne' : 'manyToOne';
      } else {
        return knownKind === 'belongsTo' ? 'oneToMany' : 'manyToMany';
      }
    },


    /**
     A map whose keys are the attributes of the model (properties
     described by DS.attr) and whose values are the meta object for the
     property.
      Example
      ```app/models/person.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        firstName: DS.attr('string'),
        lastName: DS.attr('string'),
        birthday: DS.attr('date')
      });
     ```
      ```javascript
     import Ember from 'ember';
     import Person from 'app/models/person';
      let attributes = Ember.get(Person, 'attributes')
      attributes.forEach(function(meta, name) {
        console.log(name, meta);
      });
      // prints:
     // firstName {type: "string", isAttribute: true, options: Object, parentType: function, name: "firstName"}
     // lastName {type: "string", isAttribute: true, options: Object, parentType: function, name: "lastName"}
     // birthday {type: "date", isAttribute: true, options: Object, parentType: function, name: "birthday"}
     ```
      @property attributes
     @static
     @type {Map}
     @readOnly
     */
    attributes: Ember.computed(function () {

      var map = new MapWithDeprecations();

      this.eachComputedProperty(function (name, meta) {
        if (meta.isAttribute) {


          meta.name = name;
          map.set(name, meta);
        }
      });

      return map;
    }).readOnly(),

    /**
     A map whose keys are the attributes of the model (properties
     described by DS.attr) and whose values are type of transformation
     applied to each attribute. This map does not include any
     attributes that do not have an transformation type.
      Example
      ```app/models/person.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        firstName: DS.attr(),
        lastName: DS.attr('string'),
        birthday: DS.attr('date')
      });
     ```
      ```javascript
     import Ember from 'ember';
     import Person from 'app/models/person';
      let transformedAttributes = Ember.get(Person, 'transformedAttributes')
      transformedAttributes.forEach(function(field, type) {
        console.log(field, type);
      });
      // prints:
     // lastName string
     // birthday date
     ```
      @property transformedAttributes
     @static
     @type {Map}
     @readOnly
     */
    transformedAttributes: Ember.computed(function () {
      var map = new MapWithDeprecations();

      this.eachAttribute(function (key, meta) {
        if (meta.type) {
          map.set(key, meta.type);
        }
      });

      return map;
    }).readOnly(),

    /**
     Iterates through the attributes of the model, calling the passed function on each
     attribute.
      The callback method you provide should have the following signature (all
     parameters are optional):
      ```javascript
     function(name, meta);
     ```
      - `name` the name of the current property in the iteration
     - `meta` the meta object for the attribute property in the iteration
      Note that in addition to a callback, you can also pass an optional target
     object that will be set as `this` on the context.
      Example
      ```javascript
     import DS from 'ember-data';
      let Person = DS.Model.extend({
        firstName: DS.attr('string'),
        lastName: DS.attr('string'),
        birthday: DS.attr('date')
      });
      Person.eachAttribute(function(name, meta) {
        console.log(name, meta);
      });
      // prints:
     // firstName {type: "string", isAttribute: true, options: Object, parentType: function, name: "firstName"}
     // lastName {type: "string", isAttribute: true, options: Object, parentType: function, name: "lastName"}
     // birthday {type: "date", isAttribute: true, options: Object, parentType: function, name: "birthday"}
     ```
      @method eachAttribute
     @param {Function} callback The callback to execute
     @param {Object} [binding] the value to which the callback's `this` should be bound
     @static
     */
    eachAttribute: function eachAttribute(callback, binding) {
      Ember.get(this, 'attributes').forEach(function (meta, name) {
        callback.call(binding, name, meta);
      });
    },


    /**
     Iterates through the transformedAttributes of the model, calling
     the passed function on each attribute. Note the callback will not be
     called for any attributes that do not have an transformation type.
      The callback method you provide should have the following signature (all
     parameters are optional):
      ```javascript
     function(name, type);
     ```
      - `name` the name of the current property in the iteration
     - `type` a string containing the name of the type of transformed
     applied to the attribute
      Note that in addition to a callback, you can also pass an optional target
     object that will be set as `this` on the context.
      Example
      ```javascript
     import DS from 'ember-data';
      let Person = DS.Model.extend({
        firstName: DS.attr(),
        lastName: DS.attr('string'),
        birthday: DS.attr('date')
      });
      Person.eachTransformedAttribute(function(name, type) {
        console.log(name, type);
      });
      // prints:
     // lastName string
     // birthday date
     ```
      @method eachTransformedAttribute
     @param {Function} callback The callback to execute
     @param {Object} [binding] the value to which the callback's `this` should be bound
     @static
     */
    eachTransformedAttribute: function eachTransformedAttribute(callback, binding) {
      Ember.get(this, 'transformedAttributes').forEach(function (type, name) {
        callback.call(binding, name, type);
      });
    },


    /**
     Returns the name of the model class.
      @method toString
     @static
     */
    toString: function toString() {
      return 'model:' + Ember.get(this, 'modelName');
    }
  });

  var SOURCE_POINTER_REGEXP = /^\/?data\/(attributes|relationships)\/(.*)/;
  var SOURCE_POINTER_PRIMARY_REGEXP = /^\/?data/;
  var PRIMARY_ATTRIBUTE_KEY = 'base';

  /**
    A `DS.AdapterError` is used by an adapter to signal that an error occurred
    during a request to an external API. It indicates a generic error, and
    subclasses are used to indicate specific error states. The following
    subclasses are provided:

    - `DS.InvalidError`
    - `DS.TimeoutError`
    - `DS.AbortError`
    - `DS.UnauthorizedError`
    - `DS.ForbiddenError`
    - `DS.NotFoundError`
    - `DS.ConflictError`
    - `DS.ServerError`

    To create a custom error to signal a specific error state in communicating
    with an external API, extend the `DS.AdapterError`. For example if the
    external API exclusively used HTTP `503 Service Unavailable` to indicate
    it was closed for maintenance:

    ```app/adapters/maintenance-error.js
    import DS from 'ember-data';

    export default DS.AdapterError.extend({ message: "Down for maintenance." });
    ```

    This error would then be returned by an adapter's `handleResponse` method:

    ```app/adapters/application.js
    import DS from 'ember-data';
    import MaintenanceError from './maintenance-error';

    export default DS.JSONAPIAdapter.extend({
      handleResponse(status) {
        if (503 === status) {
          return new MaintenanceError();
        }

        return this._super(...arguments);
      }
    });
    ```

    And can then be detected in an application and used to send the user to an
    `under-maintenance` route:

    ```app/routes/application.js
    import Route from '@ember/routing/route';
    import MaintenanceError from '../adapters/maintenance-error';

    export default Route.extend({
      actions: {
        error(error, transition) {
          if (error instanceof MaintenanceError) {
            this.transitionTo('under-maintenance');
            return;
          }

          // ...other error handling logic
        }
      }
    });
    ```

    @class AdapterError
    @namespace DS
  */
  function AdapterError(errors) {
    var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Adapter operation failed';

    this.isAdapterError = true;
    Ember.Error.call(this, message);

    this.errors = errors || [{
      title: 'Adapter Error',
      detail: message
    }];
  }

  function extendFn(ErrorClass) {
    return function () {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          defaultMessage = _ref.message;

      return extend(ErrorClass, defaultMessage);
    };
  }

  function extend(ParentErrorClass, defaultMessage) {
    var ErrorClass = function ErrorClass(errors, message) {

      ParentErrorClass.call(this, errors, message || defaultMessage);
    };
    ErrorClass.prototype = Object.create(ParentErrorClass.prototype);
    ErrorClass.extend = extendFn(ErrorClass);

    return ErrorClass;
  }

  AdapterError.prototype = Object.create(Ember.Error.prototype);

  AdapterError.extend = extendFn(AdapterError);

  /**
    A `DS.InvalidError` is used by an adapter to signal the external API
    was unable to process a request because the content was not
    semantically correct or meaningful per the API. Usually this means a
    record failed some form of server side validation. When a promise
    from an adapter is rejected with a `DS.InvalidError` the record will
    transition to the `invalid` state and the errors will be set to the
    `errors` property on the record.

    For Ember Data to correctly map errors to their corresponding
    properties on the model, Ember Data expects each error to be
    a valid json-api error object with a `source/pointer` that matches
    the property name. For example if you had a Post model that
    looked like this.

    ```app/models/post.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      title: DS.attr('string'),
      content: DS.attr('string')
    });
    ```

    To show an error from the server related to the `title` and
    `content` properties your adapter could return a promise that
    rejects with a `DS.InvalidError` object that looks like this:

    ```app/adapters/post.js
    import RSVP from 'RSVP';
    import DS from 'ember-data';

    export default DS.RESTAdapter.extend({
      updateRecord() {
        // Fictional adapter that always rejects
        return RSVP.reject(new DS.InvalidError([
          {
            detail: 'Must be unique',
            source: { pointer: '/data/attributes/title' }
          },
          {
            detail: 'Must not be blank',
            source: { pointer: '/data/attributes/content'}
          }
        ]));
      }
    });
    ```

    Your backend may use different property names for your records the
    store will attempt extract and normalize the errors using the
    serializer's `extractErrors` method before the errors get added to
    the the model. As a result, it is safe for the `InvalidError` to
    wrap the error payload unaltered.

    @class InvalidError
    @namespace DS
  */
  var InvalidError = extend(AdapterError, 'The adapter rejected the commit because it was invalid');

  /**
    A `DS.TimeoutError` is used by an adapter to signal that a request
    to the external API has timed out. I.e. no response was received from
    the external API within an allowed time period.

    An example use case would be to warn the user to check their internet
    connection if an adapter operation has timed out:

    ```app/routes/application.js
    import Route from '@ember/routing/route';
    import DS from 'ember-data';

    const { TimeoutError } = DS;

    export default Route.extend({
      actions: {
        error(error, transition) {
          if (error instanceof TimeoutError) {
            // alert the user
            alert('Are you still connected to the internet?');
            return;
          }

          // ...other error handling logic
        }
      }
    });
    ```

    @class TimeoutError
    @namespace DS
  */
  var TimeoutError = extend(AdapterError, 'The adapter operation timed out');

  /**
    A `DS.AbortError` is used by an adapter to signal that a request to
    the external API was aborted. For example, this can occur if the user
    navigates away from the current page after a request to the external API
    has been initiated but before a response has been received.

    @class AbortError
    @namespace DS
  */
  var AbortError = extend(AdapterError, 'The adapter operation was aborted');

  /**
    A `DS.UnauthorizedError` equates to a HTTP `401 Unauthorized` response
    status. It is used by an adapter to signal that a request to the external
    API was rejected because authorization is required and has failed or has not
    yet been provided.

    An example use case would be to redirect the user to a log in route if a
    request is unauthorized:

    ```app/routes/application.js
    import Route from '@ember/routing/route';
    import DS from 'ember-data';

    const { UnauthorizedError } = DS;

    export default Route.extend({
      actions: {
        error(error, transition) {
          if (error instanceof UnauthorizedError) {
            // go to the sign in route
            this.transitionTo('login');
            return;
          }

          // ...other error handling logic
        }
      }
    });
    ```

    @class UnauthorizedError
    @namespace DS
  */
  var UnauthorizedError = extend(AdapterError, 'The adapter operation is unauthorized');

  /**
    A `DS.ForbiddenError` equates to a HTTP `403 Forbidden` response status.
    It is used by an adapter to signal that a request to the external API was
    valid but the server is refusing to respond to it. If authorization was
    provided and is valid, then the authenticated user does not have the
    necessary permissions for the request.

    @class ForbiddenError
    @namespace DS
  */
  var ForbiddenError = extend(AdapterError, 'The adapter operation is forbidden');

  /**
    A `DS.NotFoundError` equates to a HTTP `404 Not Found` response status.
    It is used by an adapter to signal that a request to the external API
    was rejected because the resource could not be found on the API.

    An example use case would be to detect if the user has entered a route
    for a specific model that does not exist. For example:

    ```app/routes/post.js
    import Route from '@ember/routing/route';
    import DS from 'ember-data';

    const { NotFoundError } = DS;

    export default Route.extend({
      model(params) {
        return this.get('store').findRecord('post', params.post_id);
      },

      actions: {
        error(error, transition) {
          if (error instanceof NotFoundError) {
            // redirect to a list of all posts instead
            this.transitionTo('posts');
          } else {
            // otherwise let the error bubble
            return true;
          }
        }
      }
    });
    ```

    @class NotFoundError
    @namespace DS
  */
  var NotFoundError = extend(AdapterError, 'The adapter could not find the resource');

  /**
    A `DS.ConflictError` equates to a HTTP `409 Conflict` response status.
    It is used by an adapter to indicate that the request could not be processed
    because of a conflict in the request. An example scenario would be when
    creating a record with a client generated id but that id is already known
    to the external API.

    @class ConflictError
    @namespace DS
  */
  var ConflictError = extend(AdapterError, 'The adapter operation failed due to a conflict');

  /**
    A `DS.ServerError` equates to a HTTP `500 Internal Server Error` response
    status. It is used by the adapter to indicate that a request has failed
    because of an error in the external API.

    @class ServerError
    @namespace DS
  */
  var ServerError = extend(AdapterError, 'The adapter operation failed due to a server error');

  /**
    Convert an hash of errors into an array with errors in JSON-API format.

    ```javascript
    import DS from 'ember-data';

    const { errorsHashToArray } = DS;

    let errors = {
      base: 'Invalid attributes on saving this record',
      name: 'Must be present',
      age: ['Must be present', 'Must be a number']
    };

    let errorsArray = errorsHashToArray(errors);
    // [
    //   {
    //     title: "Invalid Document",
    //     detail: "Invalid attributes on saving this record",
    //     source: { pointer: "/data" }
    //   },
    //   {
    //     title: "Invalid Attribute",
    //     detail: "Must be present",
    //     source: { pointer: "/data/attributes/name" }
    //   },
    //   {
    //     title: "Invalid Attribute",
    //     detail: "Must be present",
    //     source: { pointer: "/data/attributes/age" }
    //   },
    //   {
    //     title: "Invalid Attribute",
    //     detail: "Must be a number",
    //     source: { pointer: "/data/attributes/age" }
    //   }
    // ]
    ```

    @method errorsHashToArray
    @public
    @namespace
    @for DS
    @param {Object} errors hash with errors as properties
    @return {Array} array of errors in JSON-API format
  */
  function errorsHashToArray(errors) {
    var out = [];

    if (Ember.isPresent(errors)) {
      Object.keys(errors).forEach(function (key) {
        var messages = Ember.makeArray(errors[key]);
        for (var i = 0; i < messages.length; i++) {
          var title = 'Invalid Attribute';
          var pointer = '/data/attributes/' + key;
          if (key === PRIMARY_ATTRIBUTE_KEY) {
            title = 'Invalid Document';
            pointer = '/data';
          }
          out.push({
            title: title,
            detail: messages[i],
            source: {
              pointer: pointer
            }
          });
        }
      });
    }

    return out;
  }

  /**
    Convert an array of errors in JSON-API format into an object.

    ```javascript
    import DS from 'ember-data';

    const { errorsArrayToHash } = DS;

    let errorsArray = [
      {
        title: 'Invalid Attribute',
        detail: 'Must be present',
        source: { pointer: '/data/attributes/name' }
      },
      {
        title: 'Invalid Attribute',
        detail: 'Must be present',
        source: { pointer: '/data/attributes/age' }
      },
      {
        title: 'Invalid Attribute',
        detail: 'Must be a number',
        source: { pointer: '/data/attributes/age' }
      }
    ];

    let errors = errorsArrayToHash(errorsArray);
    // {
    //   "name": ["Must be present"],
    //   "age":  ["Must be present", "must be a number"]
    // }
    ```

    @method errorsArrayToHash
    @public
    @namespace
    @for DS
    @param {Array} errors array of errors in JSON-API format
    @return {Object}
  */
  function errorsArrayToHash(errors) {
    var out = {};

    if (Ember.isPresent(errors)) {
      errors.forEach(function (error) {
        if (error.source && error.source.pointer) {
          var key = error.source.pointer.match(SOURCE_POINTER_REGEXP);

          if (key) {
            key = key[2];
          } else if (error.source.pointer.search(SOURCE_POINTER_PRIMARY_REGEXP) !== -1) {
            key = PRIMARY_ATTRIBUTE_KEY;
          }

          if (key) {
            out[key] = out[key] || [];
            out[key].push(error.detail || error.title);
          }
        }
      });
    }

    return out;
  }

  function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

  function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var EmberDataOrderedSet = function (_EmberOrderedSet) {
    _inherits$1(EmberDataOrderedSet, _EmberOrderedSet);

    function EmberDataOrderedSet() {
      return _possibleConstructorReturn$1(this, _EmberOrderedSet.apply(this, arguments));
    }

    EmberDataOrderedSet.create = function create() {
      return new this();
    };

    EmberDataOrderedSet.prototype.addWithIndex = function addWithIndex(obj, idx) {
      var guid = Ember.guidFor(obj);
      var presenceSet = this.presenceSet;
      var list = this.list;

      if (presenceSet[guid] === true) {
        return;
      }

      presenceSet[guid] = true;

      if (idx === undefined || idx === null) {
        list.push(obj);
      } else {
        list.splice(idx, 0, obj);
      }

      this.size += 1;

      return this;
    };

    return EmberDataOrderedSet;
  }(EmberOrderedSet);

  /*
    This method normalizes a link to an "links object". If the passed link is
    already an object it's returned without any modifications.

    See http://jsonapi.org/format/#document-links for more information.

    @method _normalizeLink
    @private
    @param {String} link
    @return {Object|null}
    @for DS
  */
  function _normalizeLink(link) {
    switch (typeof link) {
      case 'object':
        return link;
      case 'string':
        return { href: link };
    }
    return null;
  }

  var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global heimdall */

  var Relationship = function () {
    function Relationship(store, internalModel, inverseKey, relationshipMeta) {
      var async = relationshipMeta.options.async;
      var polymorphic = relationshipMeta.options.polymorphic;
      this.members = new EmberDataOrderedSet();
      this.canonicalMembers = new EmberDataOrderedSet();
      this.store = store;
      this.key = relationshipMeta.key;
      this.kind = relationshipMeta.kind;
      this.inverseKey = inverseKey;
      this.internalModel = internalModel;
      this.isAsync = typeof async === 'undefined' ? true : async;
      this.isPolymorphic = typeof polymorphic === 'undefined' ? false : polymorphic;
      this.relationshipMeta = relationshipMeta;
      //This probably breaks for polymorphic relationship in complex scenarios, due to
      //multiple possible modelNames
      this.inverseKeyForImplicit = this.internalModel.modelName + this.key;
      this.fetchPromise = null;
      this._promiseProxy = null;
      this.meta = null;
      this.__inverseMeta = undefined;

      /*
        This flag forces fetch. `true` for a single request once `reload()`
          has been called `false` at all other times.
       */
      this.shouldForceReload = false;

      /*
         This flag indicates whether we should
          re-fetch the relationship the next time
          it is accessed.
           The difference between this flag and `shouldForceReload`
          is in how we treat the presence of partially missing data:
            - for a forced reload, we will reload the link or EVERY record
            - for a stale reload, we will reload the link (if present) else only MISSING records
           Ideally these flags could be merged, but because we don't give the
          request layer the option of deciding how to resolve the data being queried
          we are forced to differentiate for now.
           It is also possible for a relationship to remain stale after a forced reload; however,
          in this case `hasFailedLoadAttempt` ought to be `true`.
         false when
          => internalModel.isNew() on initial setup
          => a previously triggered request has resolved
          => we get relationship data via push
         true when
          => !internalModel.isNew() on initial setup
          => an inverse has been unloaded
          => we get a new link for the relationship
       */
      this.relationshipIsStale = !this.isNew;

      /*
        This flag indicates whether we should consider the content
         of this relationship "known".
         If we have no relationship knowledge, and the relationship
         is `async`, we will attempt to fetch the relationship on
         access if it is also stale.
        Snapshot uses this to tell the difference between unknown
        (`undefined`) or empty (`null`). The reason for this is that
        we wouldn't want to serialize  unknown relationships as `null`
        as that might overwrite remote state.
         All relationships for a newly created (`store.createRecord()`) are
         considered known (`hasAnyRelationshipData === true`).
         true when
          => we receive a push with either new data or explicit empty (`[]` or `null`)
          => the relationship is a belongsTo and we have received data from
               the other side.
         false when
          => we have received no signal about what data belongs in this relationship
          => the relationship is a hasMany and we have only received data from
              the other side.
       */
      this.hasAnyRelationshipData = false;

      /*
        Flag that indicates whether an empty relationship is explicitly empty
          (signaled by push giving us an empty array or null relationship)
          e.g. an API response has told us that this relationship is empty.
         Thus far, it does not appear that we actually need this flag; however,
          @runspired has found it invaluable when debugging relationship tests
          to determine whether (and why if so) we are in an incorrect state.
         true when
          => we receive a push with explicit empty (`[]` or `null`)
          => we have received no signal about what data belongs in this relationship
          => on initial create (as no signal is known yet)
         false at all other times
       */
      this.relationshipIsEmpty = true;

      /*
        Flag that indicates whether we have explicitly attempted a load for the relationship
        (which may have failed)
       */
      this.hasFailedLoadAttempt = false;

      /*
        true when
          => hasAnyRelationshipData is true
          AND
          => members (NOT canonicalMembers) @each !isEmpty
         TODO, consider changing the conditional here from !isEmpty to !hiddenFromRecordArrays
       */
    }

    Relationship.prototype._inverseIsSync = function _inverseIsSync() {
      var inverseMeta = this._inverseMeta;
      if (!inverseMeta) {
        return false;
      }

      var inverseAsync = inverseMeta.options.async;
      return typeof inverseAsync === 'undefined' ? false : !inverseAsync;
    };

    Relationship.prototype.internalModelDidDematerialize = function internalModelDidDematerialize() {
      var _this = this;

      if (!this.inverseKey) {
        return;
      }

      this.forAllMembers(function (inverseInternalModel) {
        var relationship = inverseInternalModel._relationships.get(_this.inverseKey);
        relationship.inverseDidDematerialize(_this.internalModel);
      });
    };

    Relationship.prototype.inverseDidDematerialize = function inverseDidDematerialize(inverseInternalModel) {
      this.fetchPromise = null;
      this.setRelationshipIsStale(true);

      if (!this.isAsync) {
        // unloading inverse of a sync relationship is treated as a client-side
        // delete, so actually remove the models don't merely invalidate the cp
        // cache.
        this.removeInternalModelFromOwn(inverseInternalModel);
        this.removeCanonicalInternalModelFromOwn(inverseInternalModel);
      }
    };

    Relationship.prototype.updateMeta = function updateMeta(meta) {
      this.meta = meta;
    };

    Relationship.prototype.clear = function clear() {

      var members = this.members.list;
      while (members.length > 0) {
        var member = members[0];
        this.removeInternalModel(member);
      }

      var canonicalMembers = this.canonicalMembers.list;
      while (canonicalMembers.length > 0) {
        var _member = canonicalMembers[0];
        this.removeCanonicalInternalModel(_member);
      }
    };

    Relationship.prototype.removeAllInternalModelsFromOwn = function removeAllInternalModelsFromOwn() {
      this.members.clear();
      this.internalModel.updateRecordArrays();
    };

    Relationship.prototype.removeAllCanonicalInternalModelsFromOwn = function removeAllCanonicalInternalModelsFromOwn() {
      this.canonicalMembers.clear();
      this.flushCanonicalLater();
    };

    Relationship.prototype.removeInternalModels = function removeInternalModels(internalModels) {
      var _this2 = this;

      internalModels.forEach(function (internalModel) {
        return _this2.removeInternalModel(internalModel);
      });
    };

    Relationship.prototype.addInternalModels = function addInternalModels(internalModels, idx) {
      var _this3 = this;

      internalModels.forEach(function (internalModel) {
        _this3.addInternalModel(internalModel, idx);
        if (idx !== undefined) {
          idx++;
        }
      });
    };

    Relationship.prototype.addCanonicalInternalModels = function addCanonicalInternalModels(internalModels, idx) {
      for (var i = 0; i < internalModels.length; i++) {
        if (idx !== undefined) {
          this.addCanonicalInternalModel(internalModels[i], i + idx);
        } else {
          this.addCanonicalInternalModel(internalModels[i]);
        }
      }
    };

    Relationship.prototype.addCanonicalInternalModel = function addCanonicalInternalModel(internalModel, idx) {
      if (!this.canonicalMembers.has(internalModel)) {
        this.canonicalMembers.addWithIndex(internalModel, idx);
        this.setupInverseRelationship(internalModel);
      }
      this.flushCanonicalLater();
      this.setHasAnyRelationshipData(true);
    };

    Relationship.prototype.setupInverseRelationship = function setupInverseRelationship(internalModel) {
      if (this.inverseKey) {
        var relationships = internalModel._relationships;
        var relationshipExisted = relationships.has(this.inverseKey);
        var relationship = relationships.get(this.inverseKey);
        if (relationshipExisted || this.isPolymorphic) {
          // if we have only just initialized the inverse relationship, then it
          // already has this.internalModel in its canonicalMembers, so skip the
          // unnecessary work.  The exception to this is polymorphic
          // relationships whose members are determined by their inverse, as those
          // relationships cannot efficiently find their inverse payloads.
          relationship.addCanonicalInternalModel(this.internalModel);
        }
      } else {
        var _relationships = internalModel._implicitRelationships;
        var _relationship = _relationships[this.inverseKeyForImplicit];
        if (!_relationship) {
          _relationship = _relationships[this.inverseKeyForImplicit] = new Relationship(this.store, internalModel, this.key, { options: { async: this.isAsync }, type: this.parentType });
        }
        _relationship.addCanonicalInternalModel(this.internalModel);
      }
    };

    Relationship.prototype.removeCanonicalInternalModels = function removeCanonicalInternalModels(internalModels, idx) {
      for (var i = 0; i < internalModels.length; i++) {
        if (idx !== undefined) {
          this.removeCanonicalInternalModel(internalModels[i], i + idx);
        } else {
          this.removeCanonicalInternalModel(internalModels[i]);
        }
      }
    };

    Relationship.prototype.removeCanonicalInternalModel = function removeCanonicalInternalModel(internalModel, idx) {
      if (this.canonicalMembers.has(internalModel)) {
        this.removeCanonicalInternalModelFromOwn(internalModel);
        if (this.inverseKey) {
          this.removeCanonicalInternalModelFromInverse(internalModel);
        } else {
          if (internalModel._implicitRelationships[this.inverseKeyForImplicit]) {
            internalModel._implicitRelationships[this.inverseKeyForImplicit].removeCanonicalInternalModel(this.internalModel);
          }
        }
      }
      this.flushCanonicalLater();
    };

    Relationship.prototype.addInternalModel = function addInternalModel(internalModel, idx) {
      if (!this.members.has(internalModel)) {
        this.members.addWithIndex(internalModel, idx);
        this.notifyRecordRelationshipAdded(internalModel, idx);
        if (this.inverseKey) {
          internalModel._relationships.get(this.inverseKey).addInternalModel(this.internalModel);
        } else {
          if (!internalModel._implicitRelationships[this.inverseKeyForImplicit]) {
            internalModel._implicitRelationships[this.inverseKeyForImplicit] = new Relationship(this.store, internalModel, this.key, { options: { async: this.isAsync }, type: this.parentType });
          }
          internalModel._implicitRelationships[this.inverseKeyForImplicit].addInternalModel(this.internalModel);
        }
        this.internalModel.updateRecordArrays();
      }
      this.setHasAnyRelationshipData(true);
    };

    Relationship.prototype.removeInternalModel = function removeInternalModel(internalModel) {
      if (this.members.has(internalModel)) {
        this.removeInternalModelFromOwn(internalModel);
        if (this.inverseKey) {
          this.removeInternalModelFromInverse(internalModel);
        } else {
          if (internalModel._implicitRelationships[this.inverseKeyForImplicit]) {
            internalModel._implicitRelationships[this.inverseKeyForImplicit].removeInternalModel(this.internalModel);
          }
        }
      }
    };

    Relationship.prototype.removeInternalModelFromInverse = function removeInternalModelFromInverse(internalModel) {
      var inverseRelationship = internalModel._relationships.get(this.inverseKey);
      //Need to check for existence, as the record might unloading at the moment
      if (inverseRelationship) {
        inverseRelationship.removeInternalModelFromOwn(this.internalModel);
      }
    };

    Relationship.prototype.removeInternalModelFromOwn = function removeInternalModelFromOwn(internalModel) {
      this.members.delete(internalModel);
      this.internalModel.updateRecordArrays();
    };

    Relationship.prototype.removeCanonicalInternalModelFromInverse = function removeCanonicalInternalModelFromInverse(internalModel) {
      var inverseRelationship = internalModel._relationships.get(this.inverseKey);
      //Need to check for existence, as the record might unloading at the moment
      if (inverseRelationship) {
        inverseRelationship.removeCanonicalInternalModelFromOwn(this.internalModel);
      }
    };

    Relationship.prototype.removeCanonicalInternalModelFromOwn = function removeCanonicalInternalModelFromOwn(internalModel) {
      this.canonicalMembers.delete(internalModel);
      this.flushCanonicalLater();
    };

    /*
      Call this method once a record deletion has been persisted
      to purge it from BOTH current and canonical state of all
      relationships.
       @method removeCompletelyFromInverse
      @private
     */


    Relationship.prototype.removeCompletelyFromInverse = function removeCompletelyFromInverse() {
      var _this4 = this;

      if (!this.inverseKey) {
        return;
      }

      // we actually want a union of members and canonicalMembers
      // they should be disjoint but currently are not due to a bug
      var seen = Object.create(null);
      var internalModel = this.internalModel;

      var unload = function unload(inverseInternalModel) {
        var id = Ember.guidFor(inverseInternalModel);

        if (seen[id] === undefined) {
          var relationship = inverseInternalModel._relationships.get(_this4.inverseKey);
          relationship.removeCompletelyFromOwn(internalModel);
          seen[id] = true;
        }
      };

      this.members.forEach(unload);
      this.canonicalMembers.forEach(unload);

      if (!this.isAsync) {
        this.clear();
      }
    };

    Relationship.prototype.forAllMembers = function forAllMembers(callback) {
      var seen = Object.create(null);

      for (var i = 0; i < this.members.list.length; i++) {
        var inverseInternalModel = this.members.list[i];
        var id = Ember.guidFor(inverseInternalModel);
        if (!seen[id]) {
          seen[id] = true;
          callback(inverseInternalModel);
        }
      }

      for (var _i = 0; _i < this.canonicalMembers.list.length; _i++) {
        var _inverseInternalModel = this.canonicalMembers.list[_i];
        var _id = Ember.guidFor(_inverseInternalModel);
        if (!seen[_id]) {
          seen[_id] = true;
          callback(_inverseInternalModel);
        }
      }
    };

    /*
      Removes the given internalModel from BOTH canonical AND current state.
       This method is useful when either a deletion or a rollback on a new record
      needs to entirely purge itself from an inverse relationship.
     */


    Relationship.prototype.removeCompletelyFromOwn = function removeCompletelyFromOwn(internalModel) {
      this.canonicalMembers.delete(internalModel);
      this.members.delete(internalModel);
      this.internalModel.updateRecordArrays();
    };

    Relationship.prototype.flushCanonical = function flushCanonical() {
      var list = this.members.list;
      this.willSync = false;
      //a hack for not removing new internalModels
      //TODO remove once we have proper diffing
      var newInternalModels = [];
      for (var i = 0; i < list.length; i++) {
        if (list[i].isNew()) {
          newInternalModels.push(list[i]);
        }
      }

      //TODO(Igor) make this less abysmally slow
      this.members = this.canonicalMembers.copy();
      for (var _i2 = 0; _i2 < newInternalModels.length; _i2++) {
        this.members.add(newInternalModels[_i2]);
      }
    };

    Relationship.prototype.flushCanonicalLater = function flushCanonicalLater() {
      if (this.willSync) {
        return;
      }
      this.willSync = true;
      this.store._updateRelationshipState(this);
    };

    Relationship.prototype.updateLink = function updateLink(link) {


      this.link = link;
      this.fetchPromise = null;
      this.setRelationshipIsStale(true);
    };

    Relationship.prototype.reload = function reload() {
      if (this._promiseProxy) {
        if (this._promiseProxy.get('isPending')) {
          return this._promiseProxy;
        }
      }

      this.setHasFailedLoadAttempt(false);
      this.setShouldForceReload(true);
      this.getData();

      return this._promiseProxy;
    };

    Relationship.prototype.shouldMakeRequest = function shouldMakeRequest() {
      var relationshipIsStale = this.relationshipIsStale,
          hasFailedLoadAttempt = this.hasFailedLoadAttempt,
          allInverseRecordsAreLoaded = this.allInverseRecordsAreLoaded,
          hasAnyRelationshipData = this.hasAnyRelationshipData,
          shouldForceReload = this.shouldForceReload,
          relationshipIsEmpty = this.relationshipIsEmpty,
          isAsync = this.isAsync,
          isNew = this.isNew,
          fetchPromise = this.fetchPromise;

      // never make a request if this record doesn't exist server side yet

      if (isNew === true) {
        return false;
      }

      // do not re-request if we are already awaiting a request
      if (fetchPromise !== null) {
        return false;
      }

      // Always make a request when forced
      //  failed attempts must call `reload()`.
      //
      // For legacy reasons, when a relationship is missing only
      //   some of it's data we rely on individual `findRecord`
      //   calls which may resolve from cache in the non-link case.
      //   This determination is made elsewhere.
      //
      if (shouldForceReload === true || relationshipIsStale === true) {
        return !hasFailedLoadAttempt;
      }

      // never make a request if we've explicitly attempted to at least once
      // since the last update to canonical state
      // this includes failed attempts
      //  e.g. to re-attempt `reload()` must be called force the attempt.
      if (hasFailedLoadAttempt === true) {
        return false;
      }

      // we were explicitly told that there is no inverse relationship
      if (relationshipIsEmpty === true) {
        return false;
      }

      // we were explicitly told what the inverse is, and we have the inverse records available
      if (hasAnyRelationshipData === true && allInverseRecordsAreLoaded === true) {
        return false;
      }


      return true;
    };

    Relationship.prototype._updateLoadingPromise = function _updateLoadingPromise(promise, content) {
      if (this._promiseProxy) {
        if (content !== undefined) {
          this._promiseProxy.set('content', content);
        }
        this._promiseProxy.set('promise', promise);
      } else {
        this._promiseProxy = this._createProxy(promise, content);
      }

      return this._promiseProxy;
    };

    Relationship.prototype.updateInternalModelsFromAdapter = function updateInternalModelsFromAdapter(internalModels) {
      this.setHasAnyRelationshipData(true);
      //TODO(Igor) move this to a proper place
      //TODO Once we have adapter support, we need to handle updated and canonical changes
      this.computeChanges(internalModels);
    };

    Relationship.prototype.notifyRecordRelationshipAdded = function notifyRecordRelationshipAdded() {};

    Relationship.prototype.setHasAnyRelationshipData = function setHasAnyRelationshipData(value) {
      this.hasAnyRelationshipData = value;
    };

    Relationship.prototype.setHasFailedLoadAttempt = function setHasFailedLoadAttempt(value) {
      this.hasFailedLoadAttempt = value;
    };

    Relationship.prototype.setRelationshipIsStale = function setRelationshipIsStale(value) {
      this.relationshipIsStale = value;
    };

    Relationship.prototype.setRelationshipIsEmpty = function setRelationshipIsEmpty(value) {
      this.relationshipIsEmpty = value;
    };

    Relationship.prototype.setShouldForceReload = function setShouldForceReload(value) {
      this.shouldForceReload = value;
    };

    /*
     `push` for a relationship allows the store to push a JSON API Relationship
     Object onto the relationship. The relationship will then extract and set the
     meta, data and links of that relationship.
      `push` use `updateMeta`, `updateData` and `updateLink` to update the state
     of the relationship.
     */


    Relationship.prototype.push = function push(payload, initial) {

      var hasRelationshipDataProperty = false;
      var hasLink = false;

      if (payload.meta) {
        this.updateMeta(payload.meta);
      }

      if (payload.data !== undefined) {
        hasRelationshipDataProperty = true;
        this.updateData(payload.data, initial);
      } else if (payload._partialData !== undefined) {
        this.updateData(payload._partialData, initial);
      } else if (this.isAsync === false) {
        hasRelationshipDataProperty = true;
        var data = this.kind === 'hasMany' ? [] : null;

        this.updateData(data, initial);
      }

      if (payload.links && payload.links.related) {
        var relatedLink = _normalizeLink(payload.links.related);
        if (relatedLink && relatedLink.href && relatedLink.href !== this.link) {
          hasLink = true;
          this.updateLink(relatedLink.href);
        }
      }

      /*
       Data being pushed into the relationship might contain only data or links,
       or a combination of both.
        IF contains only data
       IF contains both links and data
        relationshipIsEmpty -> true if is empty array (has-many) or is null (belongs-to)
        hasAnyRelationshipData -> true
        relationshipIsStale -> false
        allInverseRecordsAreLoaded -> run-check-to-determine
        IF contains only links
        relationshipIsStale -> true
       */
      this.setHasFailedLoadAttempt(false);
      if (hasRelationshipDataProperty) {
        var relationshipIsEmpty = payload.data === null || Array.isArray(payload.data) && payload.data.length === 0;

        this.setHasAnyRelationshipData(true);
        this.setRelationshipIsStale(false);
        this.setRelationshipIsEmpty(relationshipIsEmpty);
      } else if (hasLink) {
        this.setRelationshipIsStale(true);

        if (!initial) {
          this.internalModel.notifyPropertyChange(this.key);
        }
      }
    };

    Relationship.prototype._createProxy = function _createProxy() {};

    Relationship.prototype.updateData = function updateData() {};

    Relationship.prototype.destroy = function destroy() {};

    _createClass$2(Relationship, [{
      key: 'isNew',
      get: function get() {
        return this.internalModel.isNew();
      }
    }, {
      key: '_inverseMeta',
      get: function get() {
        if (this.__inverseMeta === undefined) {
          var inverseMeta = null;

          if (this.inverseKey) {
            var inverseModelClass = this.store.modelFor(this.relationshipMeta.type);
            var inverseRelationships = Ember.get(inverseModelClass, 'relationshipsByName');
            inverseMeta = inverseRelationships.get(this.inverseKey);
          }

          this.__inverseMeta = inverseMeta;
        }

        return this.__inverseMeta;
      }
    }, {
      key: 'parentType',
      get: function get() {
        return this.internalModel.modelName;
      }
    }]);

    return Relationship;
  }();

  function _bind(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return function () {
      return fn.apply(undefined, args);
    };
  }

  function _guard(promise, test) {
    var guarded = promise.finally(function () {
      if (!test()) {
        guarded._subscribers.length = 0;
      }
    });

    return guarded;
  }

  function _objectIsAlive(object) {
    return !(Ember.get(object, 'isDestroyed') || Ember.get(object, 'isDestroying'));
  }

  function guardDestroyedStore(promise, store, label) {
    var wrapperPromise = Ember.RSVP.resolve(promise, label).then(function (v) {
      return promise;
    });

    return _guard(wrapperPromise, function () {
      return _objectIsAlive(store);
    });
  }

  /**
    @namespace
    @method diffArray
    @private
    @param {Array} oldArray the old array
    @param {Array} newArray the new array
    @return {hash} {
        firstChangeIndex: <integer>,  // null if no change
        addedCount: <integer>,        // 0 if no change
        removedCount: <integer>       // 0 if no change
      }
  */
  function diffArray(oldArray, newArray) {
    var oldLength = oldArray.length;
    var newLength = newArray.length;

    var shortestLength = Math.min(oldLength, newLength);
    var firstChangeIndex = null; // null signifies no changes

    // find the first change
    for (var i = 0; i < shortestLength; i++) {
      // compare each item in the array
      if (oldArray[i] !== newArray[i]) {
        firstChangeIndex = i;
        break;
      }
    }

    if (firstChangeIndex === null && newLength !== oldLength) {
      // no change found in the overlapping block
      // and array lengths differ,
      // so change starts at end of overlap
      firstChangeIndex = shortestLength;
    }

    var addedCount = 0;
    var removedCount = 0;
    if (firstChangeIndex !== null) {
      // we found a change, find the end of the change
      var unchangedEndBlockLength = shortestLength - firstChangeIndex;
      // walk back from the end of both arrays until we find a change
      for (var _i = 1; _i <= shortestLength; _i++) {
        // compare each item in the array
        if (oldArray[oldLength - _i] !== newArray[newLength - _i]) {
          unchangedEndBlockLength = _i - 1;
          break;
        }
      }
      addedCount = newLength - unchangedEndBlockLength - firstChangeIndex;
      removedCount = oldLength - unchangedEndBlockLength - firstChangeIndex;
    }

    return {
      firstChangeIndex: firstChangeIndex,
      addedCount: addedCount,
      removedCount: removedCount
    };
  }

  /**
    A `ManyArray` is a `MutableArray` that represents the contents of a has-many
    relationship.

    The `ManyArray` is instantiated lazily the first time the relationship is
    requested.

    ### Inverses

    Often, the relationships in Ember Data applications will have
    an inverse. For example, imagine the following models are
    defined:

    ```app/models/post.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      comments: DS.hasMany('comment')
    });
    ```

    ```app/models/comment.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      post: DS.belongsTo('post')
    });
    ```

    If you created a new instance of `App.Post` and added
    a `App.Comment` record to its `comments` has-many
    relationship, you would expect the comment's `post`
    property to be set to the post that contained
    the has-many.

    We call the record to which a relationship belongs the
    relationship's _owner_.

    @class ManyArray
    @namespace DS
    @extends Ember.Object
    @uses Ember.MutableArray, Ember.Evented
  */
  var ManyArray = Ember.Object.extend(Ember.MutableArray, Ember.Evented, {
    init: function init() {
      this._super.apply(this, arguments);

      /**
      The loading state of this array
       @property {Boolean} isLoaded
      */
      this.isLoaded = this.isLoaded || false;
      this.length = 0;

      /**
      Used for async `hasMany` arrays
      to keep track of when they will resolve.
       @property {Ember.RSVP.Promise} promise
      @private
      */
      this.promise = null;

      /**
      Metadata associated with the request for async hasMany relationships.
       Example
       Given that the server returns the following JSON payload when fetching a
      hasMany relationship:
       ```js
      {
        "comments": [{
          "id": 1,
          "comment": "This is the first comment",
        }, {
      // ...
        }],
         "meta": {
          "page": 1,
          "total": 5
        }
      }
      ```
       You can then access the metadata via the `meta` property:
       ```js
      post.get('comments').then(function(comments) {
        var meta = comments.get('meta');
       // meta.page => 1
      // meta.total => 5
      });
      ```
       @property {Object} meta
      @public
      */
      this.meta = this.meta || null;

      /**
      `true` if the relationship is polymorphic, `false` otherwise.
       @property {Boolean} isPolymorphic
      @private
      */
      this.isPolymorphic = this.isPolymorphic || false;

      /**
      The relationship which manages this array.
       @property {ManyRelationship} relationship
      @private
      */
      this.relationship = this.relationship || null;

      this.currentState = [];
      this.flushCanonical(false);
    },
    objectAt: function objectAt(index) {
      this.relationship._flushPendingManyArrayUpdates();
      var internalModel = this.currentState[index];
      if (internalModel === undefined) {
        return;
      }

      return internalModel.getRecord();
    },
    flushCanonical: function flushCanonical() {
      var isInitialized = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      // It’s possible the parent side of the relationship may have been unloaded by this point
      if (!_objectIsAlive(this)) {
        return;
      }

      var toSet = this.relationship.members.list.slice();

      // diff to find changes
      var diff = diffArray(this.currentState, toSet);

      if (diff.firstChangeIndex !== null) {
        // it's null if no change found
        // we found a change
        this.arrayContentWillChange(diff.firstChangeIndex, diff.removedCount, diff.addedCount);
        this.set('length', toSet.length);
        this.currentState = toSet;
        this.arrayContentDidChange(diff.firstChangeIndex, diff.removedCount, diff.addedCount);
        if (isInitialized && diff.addedCount > 0) {
          //notify only on additions
          //TODO only notify if unloaded
          this.relationship.notifyHasManyChange();
        }
      }
    },
    internalReplace: function internalReplace(idx, amt, objects) {
      if (!objects) {
        objects = [];
      }
      this.arrayContentWillChange(idx, amt, objects.length);
      this.currentState.splice.apply(this.currentState, [idx, amt].concat(objects));
      this.set('length', this.currentState.length);
      this.arrayContentDidChange(idx, amt, objects.length);
    },


    //TODO(Igor) optimize
    _removeInternalModels: function _removeInternalModels(internalModels) {
      for (var i = 0; i < internalModels.length; i++) {
        var index = this.currentState.indexOf(internalModels[i]);
        this.internalReplace(index, 1);
      }
    },


    //TODO(Igor) optimize
    _addInternalModels: function _addInternalModels(internalModels, idx) {
      if (idx === undefined) {
        idx = this.currentState.length;
      }
      this.internalReplace(idx, 0, internalModels);
    },
    replace: function replace(idx, amt, objects) {
      var internalModels = void 0;
      if (amt > 0) {
        internalModels = this.currentState.slice(idx, idx + amt);
        this.get('relationship').removeInternalModels(internalModels);
      }
      if (objects) {
        this.get('relationship').addInternalModels(objects.map(function (obj) {
          return obj._internalModel;
        }), idx);
      }
    },


    /**
      Reloads all of the records in the manyArray. If the manyArray
      holds a relationship that was originally fetched using a links url
      Ember Data will revisit the original links url to repopulate the
      relationship.
       If the manyArray holds the result of a `store.query()` reload will
      re-run the original query.
       Example
       ```javascript
      var user = store.peekRecord('user', 1)
      user.login().then(function() {
        user.get('permissions').then(function(permissions) {
          return permissions.reload();
        });
      });
      ```
       @method reload
      @public
    */
    reload: function reload() {
      return this.relationship.reload();
    },


    /**
      Saves all of the records in the `ManyArray`.
       Example
       ```javascript
      store.findRecord('inbox', 1).then(function(inbox) {
        inbox.get('messages').then(function(messages) {
          messages.forEach(function(message) {
            message.set('isRead', true);
          });
          messages.save()
        });
      });
      ```
       @method save
      @return {DS.PromiseArray} promise
    */
    save: function save() {
      var manyArray = this;
      var promiseLabel = 'DS: ManyArray#save ' + Ember.get(this, 'type');
      var promise = Ember.RSVP.all(this.invoke('save'), promiseLabel).then(function () {
        return manyArray;
      }, null, 'DS: ManyArray#save return ManyArray');

      return PromiseArray.create({ promise: promise });
    },


    /**
      Create a child record within the owner
       @method createRecord
      @private
      @param {Object} hash
      @return {DS.Model} record
    */
    createRecord: function createRecord(hash) {
      var store = Ember.get(this, 'store');
      var type = Ember.get(this, 'type');

      var record = store.createRecord(type.modelName, hash);
      this.pushObject(record);

      return record;
    }
  });

  var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _possibleConstructorReturn$2(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

  function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var ManyRelationship = function (_Relationship) {
    _inherits$2(ManyRelationship, _Relationship);

    function ManyRelationship(store, internalModel, inverseKey, relationshipMeta) {
      var _this = _possibleConstructorReturn$2(this, _Relationship.call(this, store, internalModel, inverseKey, relationshipMeta));

      _this.belongsToType = relationshipMeta.type;
      _this.canonicalState = [];
      // The ManyArray for this relationship
      _this._manyArray = null;
      // The previous ManyArray for this relationship.  It will be destroyed when
      // we create a new many array, but in the interim it will be updated if
      // inverse internal models are unloaded.
      _this._retainedManyArray = null;
      _this._promiseProxy = null;
      _this._willUpdateManyArray = false;
      _this._pendingManyArrayUpdates = null;
      return _this;
    }

    ManyRelationship.prototype._createProxy = function _createProxy(promise, content) {
      return PromiseManyArray.create({
        promise: promise,
        content: content
      });
    };

    ManyRelationship.prototype.removeInverseRelationships = function removeInverseRelationships() {
      _Relationship.prototype.removeInverseRelationships.call(this);
      if (this._manyArray) {
        this._manyArray.destroy();
        this._manyArray = null;
      }

      if (this._promiseProxy) {
        this._promiseProxy.destroy();
      }
    };

    ManyRelationship.prototype.updateMeta = function updateMeta(meta) {
      _Relationship.prototype.updateMeta.call(this, meta);
      if (this._manyArray) {
        this._manyArray.set('meta', meta);
      }
    };

    ManyRelationship.prototype.addCanonicalInternalModel = function addCanonicalInternalModel(internalModel, idx) {
      if (this.canonicalMembers.has(internalModel)) {
        return;
      }
      if (idx !== undefined) {
        this.canonicalState.splice(idx, 0, internalModel);
      } else {
        this.canonicalState.push(internalModel);
      }
      _Relationship.prototype.addCanonicalInternalModel.call(this, internalModel, idx);
    };

    ManyRelationship.prototype.inverseDidDematerialize = function inverseDidDematerialize(inverseInternalModel) {
      _Relationship.prototype.inverseDidDematerialize.call(this, inverseInternalModel);
      if (this.isAsync) {
        if (this._manyArray) {
          this._retainedManyArray = this._manyArray;
          this._manyArray = null;
        }
        this._removeInternalModelFromManyArray(this._retainedManyArray, inverseInternalModel);
      }
      this.notifyHasManyChange();
    };

    ManyRelationship.prototype.addInternalModel = function addInternalModel(internalModel, idx) {
      if (this.members.has(internalModel)) {
        return;
      }

      _Relationship.prototype.addInternalModel.call(this, internalModel, idx);
      this.scheduleManyArrayUpdate(internalModel, idx);
    };

    ManyRelationship.prototype.scheduleManyArrayUpdate = function scheduleManyArrayUpdate(internalModel, idx) {
      var _this2 = this;

      if (!this._manyArray) {
        return;
      }

      var pending = this._pendingManyArrayUpdates = this._pendingManyArrayUpdates || [];
      pending.push(internalModel, idx);

      if (this._willUpdateManyArray === true) {
        return;
      }

      this._willUpdateManyArray = true;
      var backburner = this.store._backburner;

      backburner.join(function () {
        backburner.schedule('syncRelationships', _this2, _this2._flushPendingManyArrayUpdates);
      });
    };

    ManyRelationship.prototype._flushPendingManyArrayUpdates = function _flushPendingManyArrayUpdates() {
      if (this._willUpdateManyArray === false) {
        return;
      }

      var pending = this._pendingManyArrayUpdates;
      this._pendingManyArrayUpdates = [];
      this._willUpdateManyArray = false;

      for (var i = 0; i < pending.length; i += 2) {
        var internalModel = pending[i];
        var idx = pending[i + 1];

        this.manyArray._addInternalModels([internalModel], idx);
      }
    };

    ManyRelationship.prototype.removeCanonicalInternalModelFromOwn = function removeCanonicalInternalModelFromOwn(internalModel, idx) {
      var i = idx;
      if (!this.canonicalMembers.has(internalModel)) {
        return;
      }
      if (i === undefined) {
        i = this.canonicalState.indexOf(internalModel);
      }
      if (i > -1) {
        this.canonicalState.splice(i, 1);
      }
      _Relationship.prototype.removeCanonicalInternalModelFromOwn.call(this, internalModel, idx);
    };

    ManyRelationship.prototype.removeAllCanonicalInternalModelsFromOwn = function removeAllCanonicalInternalModelsFromOwn() {
      this.canonicalMembers.clear();
      this.canonicalState.splice(0, this.canonicalState.length);
      _Relationship.prototype.removeAllCanonicalInternalModelsFromOwn.call(this);
    };

    ManyRelationship.prototype.removeCompletelyFromOwn = function removeCompletelyFromOwn(internalModel) {
      _Relationship.prototype.removeCompletelyFromOwn.call(this, internalModel);

      var canonicalIndex = this.canonicalState.indexOf(internalModel);

      if (canonicalIndex !== -1) {
        this.canonicalState.splice(canonicalIndex, 1);
      }

      var manyArray = this._manyArray;

      if (manyArray) {
        var idx = manyArray.currentState.indexOf(internalModel);

        if (idx !== -1) {
          manyArray.internalReplace(idx, 1);
        }
      }
    };

    ManyRelationship.prototype.flushCanonical = function flushCanonical() {
      _Relationship.prototype.flushCanonical.call(this);
      if (this._manyArray) {
        this._manyArray.flushCanonical();
      }
    };

    ManyRelationship.prototype.removeInternalModelFromOwn = function removeInternalModelFromOwn(internalModel, idx) {
      if (!this.members.has(internalModel)) {
        return;
      }
      _Relationship.prototype.removeInternalModelFromOwn.call(this, internalModel, idx);
      // note that ensuring the many array is created, via `this.manyArray`
      // (instead of `this._manyArray`) is intentional.
      //
      // Because we're removing from local, and not canonical, state, it is
      // important that the many array is initialized now with those changes,
      // otherwise it will be initialized with canonical state and we'll have
      // lost the fact that this internalModel was removed.
      this._removeInternalModelFromManyArray(this.manyArray, internalModel, idx);
      this._removeInternalModelFromManyArray(this._retainedManyArray, internalModel, idx);
    };

    ManyRelationship.prototype.removeAllInternalModelsFromOwn = function removeAllInternalModelsFromOwn() {
      _Relationship.prototype.removeAllInternalModelsFromOwn.call(this);
      // as with removeInternalModelFromOwn, we make sure the many array is
      // instantiated, or we'll lose local removals, as we're not updating
      // canonical state here.
      this.manyArray.clear();
      if (this._retainedManyArray) {
        this._retainedManyArray.clear();
      }
    };

    ManyRelationship.prototype._removeInternalModelFromManyArray = function _removeInternalModelFromManyArray(manyArray, internalModel, idx) {
      if (manyArray === null) {
        return;
      }

      if (idx !== undefined) {
        //TODO(Igor) not used currently, fix
        manyArray.currentState.removeAt(idx);
      } else {
        manyArray._removeInternalModels([internalModel]);
      }
    };

    ManyRelationship.prototype.notifyRecordRelationshipAdded = function notifyRecordRelationshipAdded(internalModel, idx) {
      this.internalModel.notifyHasManyAdded(this.key, internalModel, idx);
    };

    ManyRelationship.prototype.computeChanges = function computeChanges() {
      var internalModels = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var members = this.canonicalMembers;
      var internalModelsToRemove = [];
      var internalModelSet = setForArray(internalModels);

      members.forEach(function (member) {
        if (internalModelSet.has(member)) {
          return;
        }

        internalModelsToRemove.push(member);
      });

      this.removeCanonicalInternalModels(internalModelsToRemove);

      for (var i = 0, l = internalModels.length; i < l; i++) {
        var internalModel = internalModels[i];
        this.removeCanonicalInternalModel(internalModel);
        this.addCanonicalInternalModel(internalModel, i);
      }
    };

    ManyRelationship.prototype.setInitialInternalModels = function setInitialInternalModels(internalModels) {
      if (Array.isArray(internalModels) === false || internalModels.length === 0) {
        return;
      }

      for (var i = 0; i < internalModels.length; i++) {
        var internalModel = internalModels[i];
        if (this.canonicalMembers.has(internalModel)) {
          continue;
        }

        this.canonicalMembers.add(internalModel);
        this.members.add(internalModel);
        this.setupInverseRelationship(internalModel);
      }

      this.canonicalState = this.canonicalMembers.toArray();
    };

    // called by `getData()` when a request is needed
    //   but no link is available


    ManyRelationship.prototype._fetchRecords = function _fetchRecords() {
      var internalModels = this.currentState;
      var shouldForceReload = this.shouldForceReload;

      var promise = void 0;

      if (shouldForceReload === true) {
        promise = this.store._scheduleFetchMany(internalModels);
      } else {
        promise = this.store.findMany(internalModels);
      }

      return promise;
    };

    // called by `getData()` when a request is needed
    //   and a link is available


    ManyRelationship.prototype._fetchLink = function _fetchLink() {
      var _this3 = this;

      return this.store.findHasMany(this.internalModel, this.link, this.relationshipMeta).then(function (records) {
        if (records.hasOwnProperty('meta')) {
          _this3.updateMeta(records.meta);
        }
        _this3.store._backburner.join(function () {
          _this3.updateInternalModelsFromAdapter(records);
        });
        return records;
      });
    };

    ManyRelationship.prototype.getData = function getData() {
      var _this4 = this;

      //TODO(Igor) sync server here, once our syncing is not stupid
      var manyArray = this.manyArray;

      if (this.shouldMakeRequest()) {
        var promise = void 0;

        if (this.link) {
          promise = this._fetchLink();
        } else {
          promise = this._fetchRecords();
        }

        promise = promise.then(function () {
          return handleCompletedRequest(_this4);
        }, function (e) {
          return handleCompletedRequest(_this4, e);
        });

        this.fetchPromise = promise;
        this._updateLoadingPromise(promise, manyArray);
      }

      if (this.isAsync) {
        if (this._promiseProxy === null) {
          this._updateLoadingPromise(Ember.RSVP.resolve(manyArray), manyArray);
        }

        return this._promiseProxy;
      } else {


        return manyArray;
      }
    };

    ManyRelationship.prototype.notifyHasManyChange = function notifyHasManyChange() {
      this.internalModel.notifyHasManyAdded(this.key);
    };

    ManyRelationship.prototype.updateData = function updateData(data, initial) {
      var internalModels = this.store._pushResourceIdentifiers(this, data);
      if (initial) {
        this.setInitialInternalModels(internalModels);
      } else {
        this.updateInternalModelsFromAdapter(internalModels);
      }
    };

    ManyRelationship.prototype.destroy = function destroy() {
      this.isDestroying = true;
      _Relationship.prototype.destroy.call(this);
      var manyArray = this._manyArray;
      if (manyArray) {
        manyArray.destroy();
        this._manyArray = null;
      }

      var proxy = this._promiseProxy;

      if (proxy) {
        proxy.destroy();
        this._promiseProxy = null;
      }
      this.isDestroyed = true;
    };

    _createClass$3(ManyRelationship, [{
      key: 'currentState',
      get: function get() {
        return this.members.list;
      }

      /**
       * Flag indicating whether all inverse records are available
       *
       * true if inverse records exist and are all loaded (all not empty)
       * true if there are no inverse records
       * false if the inverse records exist and any are not loaded (any empty)
       *
       * @property
       * @return {boolean}
       */

    }, {
      key: 'allInverseRecordsAreLoaded',
      get: function get() {
        // check currentState for unloaded records
        var hasEmptyRecords = this.currentState.reduce(function (hasEmptyModel, i) {
          return hasEmptyModel || i.isEmpty();
        }, false);

        // check un-synced state for unloaded records
        if (!hasEmptyRecords && this.willSync) {
          hasEmptyRecords = this.canonicalState.reduce(function (hasEmptyModel, i) {
            return hasEmptyModel || !i.isEmpty();
          }, false);
        }

        return !hasEmptyRecords;
      }
    }, {
      key: 'manyArray',
      get: function get() {


        if (!this._manyArray && !this.isDestroying) {
          var isLoaded = this.hasFailedLoadAttempt || this.isNew || this.allInverseRecordsAreLoaded;

          this._manyArray = ManyArray.create({
            canonicalState: this.canonicalState,
            store: this.store,
            relationship: this,
            type: this.store.modelFor(this.belongsToType),
            record: this.internalModel,
            meta: this.meta,
            isPolymorphic: this.isPolymorphic,
            isLoaded: isLoaded
          });

          if (this._retainedManyArray !== null) {
            this._retainedManyArray.destroy();
            this._retainedManyArray = null;
          }
        }

        return this._manyArray;
      }
    }]);

    return ManyRelationship;
  }(Relationship);


  function handleCompletedRequest(relationship, error) {
    var manyArray = relationship.manyArray;

    //Goes away after the manyArray refactor
    if (!manyArray.get('isDestroyed')) {
      relationship.manyArray.set('isLoaded', true);
    }

    relationship.fetchPromise = null;
    relationship.setShouldForceReload(false);

    if (error) {
      relationship.setHasFailedLoadAttempt(true);
      throw error;
    }

    relationship.setHasFailedLoadAttempt(false);
    // only set to not stale if no error is thrown
    relationship.setRelationshipIsStale(false);

    return manyArray;
  }

  function setForArray(array) {
    var set = new EmberDataOrderedSet();

    if (array) {
      for (var i = 0, l = array.length; i < l; i++) {
        set.add(array[i]);
      }
    }

    return set;
  }

  var _createClass$4 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _possibleConstructorReturn$3(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

  function _inherits$3(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var BelongsToRelationship = function (_Relationship) {
    _inherits$3(BelongsToRelationship, _Relationship);

    function BelongsToRelationship(store, internalModel, inverseKey, relationshipMeta) {
      var _this = _possibleConstructorReturn$3(this, _Relationship.call(this, store, internalModel, inverseKey, relationshipMeta));

      _this.inverseInternalModel = null;
      _this.canonicalState = null;
      _this._promiseProxy = null;
      return _this;
    }

    /**
     * Flag indicating whether all inverse records are available
     *
     * true if the inverse exists and is loaded (not empty)
     * true if there is no inverse
     * false if the inverse exists and is not loaded (empty)
     *
     * @property
     * @return {boolean}
     */


    BelongsToRelationship.prototype.setInternalModel = function setInternalModel(internalModel) {
      if (internalModel) {
        this.addInternalModel(internalModel);
      } else if (this.inverseInternalModel) {
        this.removeInternalModel(this.inverseInternalModel);
      }

      this.setHasAnyRelationshipData(true);
      this.setRelationshipIsStale(false);
      this.setRelationshipIsEmpty(false);
    };

    BelongsToRelationship.prototype.setCanonicalInternalModel = function setCanonicalInternalModel(internalModel) {
      if (internalModel) {
        this.addCanonicalInternalModel(internalModel);
      } else if (this.canonicalState) {
        this.removeCanonicalInternalModel(this.canonicalState);
      }
      this.flushCanonicalLater();
    };

    BelongsToRelationship.prototype.setInitialCanonicalInternalModel = function setInitialCanonicalInternalModel(internalModel) {
      if (!internalModel) {
        return;
      }

      // When we initialize a belongsTo relationship, we want to avoid work like
      // notifying our internalModel that we've "changed" and excessive thrash on
      // setting up inverse relationships
      this.canonicalMembers.add(internalModel);
      this.members.add(internalModel);
      this.inverseInternalModel = this.canonicalState = internalModel;
      this.setupInverseRelationship(internalModel);
    };

    BelongsToRelationship.prototype.addCanonicalInternalModel = function addCanonicalInternalModel(internalModel) {
      if (this.canonicalMembers.has(internalModel)) {
        return;
      }

      if (this.canonicalState) {
        this.removeCanonicalInternalModel(this.canonicalState);
      }

      this.canonicalState = internalModel;
      this.setHasAnyRelationshipData(true);
      this.setRelationshipIsEmpty(false);
      _Relationship.prototype.addCanonicalInternalModel.call(this, internalModel);
    };

    BelongsToRelationship.prototype.inverseDidDematerialize = function inverseDidDematerialize() {
      _Relationship.prototype.inverseDidDematerialize.call(this, this.inverseInternalModel);
      this.notifyBelongsToChange();
    };

    BelongsToRelationship.prototype.removeCompletelyFromOwn = function removeCompletelyFromOwn(internalModel) {
      _Relationship.prototype.removeCompletelyFromOwn.call(this, internalModel);

      if (this.canonicalState === internalModel) {
        this.canonicalState = null;
      }

      if (this.inverseInternalModel === internalModel) {
        this.inverseInternalModel = null;
        this.notifyBelongsToChange();
      }
    };

    BelongsToRelationship.prototype.removeCompletelyFromInverse = function removeCompletelyFromInverse() {
      _Relationship.prototype.removeCompletelyFromInverse.call(this);

      this.inverseInternalModel = null;
    };

    BelongsToRelationship.prototype.flushCanonical = function flushCanonical() {
      //temporary fix to not remove newly created records if server returned null.
      //TODO remove once we have proper diffing
      if (this.inverseInternalModel && this.inverseInternalModel.isNew() && !this.canonicalState) {
        return;
      }
      if (this.inverseInternalModel !== this.canonicalState) {
        this.inverseInternalModel = this.canonicalState;
        this._promiseProxy = null;
        this.notifyBelongsToChange();
      }

      _Relationship.prototype.flushCanonical.call(this);
    };

    BelongsToRelationship.prototype.addInternalModel = function addInternalModel(internalModel) {
      if (this.members.has(internalModel)) {
        return;
      }

      if (this.inverseInternalModel) {
        this.removeInternalModel(this.inverseInternalModel);
      }

      this.inverseInternalModel = internalModel;
      _Relationship.prototype.addInternalModel.call(this, internalModel);
      this.notifyBelongsToChange();
    };

    BelongsToRelationship.prototype.setRecordPromise = function setRecordPromise(belongsToPromise) {


      var content = belongsToPromise.get('content');
      var promise = belongsToPromise.get('promise');

      this.setInternalModel(content ? content._internalModel : content);
      this._updateLoadingPromise(promise, content);
    };

    BelongsToRelationship.prototype.removeInternalModelFromOwn = function removeInternalModelFromOwn(internalModel) {
      if (!this.members.has(internalModel)) {
        return;
      }
      this.inverseInternalModel = null;
      this._promiseProxy = null;
      _Relationship.prototype.removeInternalModelFromOwn.call(this, internalModel);
      this.notifyBelongsToChange();
    };

    BelongsToRelationship.prototype.removeAllInternalModelsFromOwn = function removeAllInternalModelsFromOwn() {
      _Relationship.prototype.removeAllInternalModelsFromOwn.call(this);
      this.inverseInternalModel = null;
      this._promiseProxy = null;
      this.notifyBelongsToChange();
    };

    BelongsToRelationship.prototype.notifyBelongsToChange = function notifyBelongsToChange() {
      if (this._promiseProxy !== null) {
        var iM = this.inverseInternalModel;

        this._updateLoadingPromise(proxyRecord(iM), iM ? iM.getRecord() : null);
      }

      this.internalModel.notifyBelongsToChange(this.key);
    };

    BelongsToRelationship.prototype.removeCanonicalInternalModelFromOwn = function removeCanonicalInternalModelFromOwn(internalModel) {
      if (!this.canonicalMembers.has(internalModel)) {
        return;
      }
      this.canonicalState = null;
      this.setHasAnyRelationshipData(true);
      this.setRelationshipIsEmpty(true);
      _Relationship.prototype.removeCanonicalInternalModelFromOwn.call(this, internalModel);
    };

    BelongsToRelationship.prototype.removeAllCanonicalInternalModelsFromOwn = function removeAllCanonicalInternalModelsFromOwn() {
      _Relationship.prototype.removeAllCanonicalInternalModelsFromOwn.call(this);
      this.canonicalState = null;
    };

    // called by `getData()` when a request is needed
    //   but no link is available


    BelongsToRelationship.prototype._fetchRecord = function _fetchRecord() {
      var inverseInternalModel = this.inverseInternalModel,
          shouldForceReload = this.shouldForceReload;


      if (inverseInternalModel) {
        var promise = void 0;

        if (shouldForceReload && !inverseInternalModel.isEmpty() && inverseInternalModel.hasRecord) {
          // reload record, if it is already loaded
          //   if we have a link, we would already be in `findLink()`
          promise = inverseInternalModel.getRecord().reload();
        } else {
          promise = this.store._findByInternalModel(inverseInternalModel);
        }

        return promise;
      }

      // TODO is this actually an error case?
      return Ember.RSVP.resolve(null);
    };

    // called by `getData()` when a request is needed
    //   and a link is available


    BelongsToRelationship.prototype._fetchLink = function _fetchLink() {
      var _this2 = this;

      return this.store.findBelongsTo(this.internalModel, this.link, this.relationshipMeta).then(function (internalModel) {
        if (internalModel) {
          _this2.addInternalModel(internalModel);
        }
        return internalModel;
      });
    };

    BelongsToRelationship.prototype.getData = function getData() {
      var _this3 = this;

      //TODO(Igor) flushCanonical here once our syncing is not stupid
      var record = this.inverseInternalModel ? this.inverseInternalModel.getRecord() : null;

      if (this.shouldMakeRequest()) {
        var promise = void 0;

        if (this.link) {
          promise = this._fetchLink();
        } else {
          promise = this._fetchRecord();
        }

        promise = promise.then(function () {
          return handleCompletedFind(_this3);
        }, function (e) {
          return handleCompletedFind(_this3, e);
        });

        promise = promise.then(function (internalModel) {
          return internalModel ? internalModel.getRecord() : null;
        });

        this.fetchPromise = promise;
        this._updateLoadingPromise(promise);
      }

      if (this.isAsync) {
        if (this._promiseProxy === null) {
          var _promise = proxyRecord(this.inverseInternalModel);
          this._updateLoadingPromise(_promise, record);
        }

        return this._promiseProxy;
      } else {

        return record;
      }
    };

    BelongsToRelationship.prototype._createProxy = function _createProxy(promise, content) {
      return PromiseBelongsTo.create({
        _belongsToState: this,
        promise: promise,
        content: content
      });
    };

    BelongsToRelationship.prototype.updateData = function updateData(data, initial) {
      var internalModel = this.store._pushResourceIdentifier(this, data);
      if (initial) {
        this.setInitialCanonicalInternalModel(internalModel);
      } else {
        this.setCanonicalInternalModel(internalModel);
      }
    };

    _createClass$4(BelongsToRelationship, [{
      key: 'allInverseRecordsAreLoaded',
      get: function get() {
        var internalModel = this.inverseInternalModel;
        var isEmpty = internalModel !== null && internalModel.isEmpty();

        return !isEmpty;
      }
    }]);

    return BelongsToRelationship;
  }(Relationship);


  function proxyRecord(internalModel) {
    var promise = internalModel;
    if (internalModel && internalModel.isLoading()) {
      promise = internalModel._promiseProxy;
    }

    return Ember.RSVP.resolve(promise).then(function (resolvedInternalModel) {
      return resolvedInternalModel ? resolvedInternalModel.getRecord() : null;
    });
  }

  function handleCompletedFind(relationship, error) {
    var internalModel = relationship.inverseInternalModel;

    relationship.fetchPromise = null;
    relationship.setShouldForceReload(false);

    if (error) {
      relationship.setHasFailedLoadAttempt(true);
      throw error;
    }

    relationship.setHasFailedLoadAttempt(false);
    // only set to not stale if no error is thrown
    relationship.setRelationshipIsStale(false);

    return internalModel;
  }

  var _createClass$5 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();


  function shouldFindInverse$1(relationshipMeta) {
    var options = relationshipMeta.options;
    return !(options && options.inverse === null);
  }

  function createRelationshipFor(internalModel, relationshipMeta, store) {
    var inverseKey = void 0;
    var inverse = null;

    if (shouldFindInverse$1(relationshipMeta)) {
      inverse = internalModel.type.inverseFor(relationshipMeta.key, store);
    } else {}

    if (inverse) {
      inverseKey = inverse.name;
    }

    if (relationshipMeta.kind === 'hasMany') {
      return new ManyRelationship(store, internalModel, inverseKey, relationshipMeta);
    } else {
      return new BelongsToRelationship(store, internalModel, inverseKey, relationshipMeta);
    }
  }

  var Relationships = function () {
    function Relationships(internalModel) {
      this.internalModel = internalModel;
      this.initializedRelationships = Object.create(null);
    }

    // TODO @runspired deprecate this as it was never truly a record instance


    Relationships.prototype.has = function has(key) {
      return !!this.initializedRelationships[key];
    };

    Relationships.prototype.forEach = function forEach(cb) {
      var rels = this.initializedRelationships;
      Object.keys(rels).forEach(function (name) {
        cb(name, rels[name]);
      });
    };

    Relationships.prototype.get = function get(key) {
      var relationships = this.initializedRelationships;
      var relationship = relationships[key];
      var internalModel = this.internalModel;

      if (!relationship) {
        var relationshipsByName = Ember.get(internalModel.type, 'relationshipsByName');
        var rel = relationshipsByName.get(key);

        if (!rel) {
          return undefined;
        }

        var relationshipPayload = internalModel.store._relationshipsPayloads.get(internalModel.modelName, internalModel.id, key);

        relationship = relationships[key] = createRelationshipFor(internalModel, rel, internalModel.store);

        if (relationshipPayload) {
          relationship.push(relationshipPayload, true);
        }
      }

      return relationship;
    };

    _createClass$5(Relationships, [{
      key: 'record',
      get: function get() {
        return this.internalModel;
      }
    }]);

    return Relationships;
  }();

  var _createClass$6 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  /**
    @class Snapshot
    @namespace DS
    @private
    @constructor
    @param {DS.Model} internalModel The model to create a snapshot from
  */
  /**
    @module ember-data
  */
  var Snapshot = function () {
    function Snapshot(internalModel) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.__attributes = null;
      this._belongsToRelationships = Object.create(null);
      this._belongsToIds = Object.create(null);
      this._hasManyRelationships = Object.create(null);
      this._hasManyIds = Object.create(null);
      this._internalModel = internalModel;

      /*
        If the internalModel does not yet have a record, then we are
        likely a snapshot being provided to a find request, so we
        populate __attributes lazily. Else, to preserve the "moment
        in time" in which a snapshot is created, we greedily grab
        the values.
       */
      if (internalModel.hasRecord) {
        this._attributes;
      }

      /**O
       The id of the snapshot's underlying record
        Example
        ```javascript
       // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
       postSnapshot.id; // => '1'
       ```
        @property id
       @type {String}
       */
      this.id = internalModel.id;

      /**
       A hash of adapter options
       @property adapterOptions
       @type {Object}
       */
      this.adapterOptions = options.adapterOptions;
      this.include = options.include;

      /**
       The name of the type of the underlying record for this snapshot, as a string.
        @property modelName
       @type {String}
       */
      this.modelName = internalModel.modelName;

      this._changedAttributes = internalModel.changedAttributes();
    }

    /**
     The underlying record for this snapshot. Can be used to access methods and
     properties defined on the record.
      Example
      ```javascript
     let json = snapshot.record.toJSON();
     ```
      @property record
     @type {DS.Model}
     */


    /**
     Returns the value of an attribute.
      Example
      ```javascript
     // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
     postSnapshot.attr('author'); // => 'Tomster'
     postSnapshot.attr('title'); // => 'Ember.js rocks'
     ```
      Note: Values are loaded eagerly and cached when the snapshot is created.
      @method attr
     @param {String} keyName
     @return {Object} The attribute value or undefined
     */
    Snapshot.prototype.attr = function attr(keyName) {
      if (keyName in this._attributes) {
        return this._attributes[keyName];
      }
      throw new Ember.Error("Model '" + Ember.inspect(this.record) + "' has no attribute named '" + keyName + "' defined.");
    };

    /**
     Returns all attributes and their corresponding values.
      Example
      ```javascript
     // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
     postSnapshot.attributes(); // => { author: 'Tomster', title: 'Ember.js rocks' }
     ```
      @method attributes
     @return {Object} All attributes of the current snapshot
     */


    Snapshot.prototype.attributes = function attributes() {
      return Ember.assign({}, this._attributes);
    };

    /**
     Returns all changed attributes and their old and new values.
      Example
      ```javascript
     // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
     postModel.set('title', 'Ember.js rocks!');
     postSnapshot.changedAttributes(); // => { title: ['Ember.js rocks', 'Ember.js rocks!'] }
     ```
      @method changedAttributes
     @return {Object} All changed attributes of the current snapshot
     */


    Snapshot.prototype.changedAttributes = function changedAttributes() {
      var changedAttributes = Object.create(null);
      var changedAttributeKeys = Object.keys(this._changedAttributes);

      for (var i = 0, length = changedAttributeKeys.length; i < length; i++) {
        var key = changedAttributeKeys[i];
        changedAttributes[key] = this._changedAttributes[key].slice();
      }

      return changedAttributes;
    };

    /**
     Returns the current value of a belongsTo relationship.
      `belongsTo` takes an optional hash of options as a second parameter,
     currently supported options are:
      - `id`: set to `true` if you only want the ID of the related record to be
     returned.
      Example
      ```javascript
     // store.push('post', { id: 1, title: 'Hello World' });
     // store.createRecord('comment', { body: 'Lorem ipsum', post: post });
     commentSnapshot.belongsTo('post'); // => DS.Snapshot
     commentSnapshot.belongsTo('post', { id: true }); // => '1'
      // store.push('comment', { id: 1, body: 'Lorem ipsum' });
     commentSnapshot.belongsTo('post'); // => undefined
     ```
      Calling `belongsTo` will return a new Snapshot as long as there's any known
     data for the relationship available, such as an ID. If the relationship is
     known but unset, `belongsTo` will return `null`. If the contents of the
     relationship is unknown `belongsTo` will return `undefined`.
      Note: Relationships are loaded lazily and cached upon first access.
      @method belongsTo
     @param {String} keyName
     @param {Object} [options]
     @return {(DS.Snapshot|String|null|undefined)} A snapshot or ID of a known
     relationship or null if the relationship is known but unset. undefined
     will be returned if the contents of the relationship is unknown.
     */


    Snapshot.prototype.belongsTo = function belongsTo(keyName, options) {
      var id = options && options.id;
      var relationship = void 0;
      var result = void 0;

      if (id && keyName in this._belongsToIds) {
        return this._belongsToIds[keyName];
      }

      if (!id && keyName in this._belongsToRelationships) {
        return this._belongsToRelationships[keyName];
      }

      relationship = this._internalModel._relationships.get(keyName);
      if (!(relationship && relationship.relationshipMeta.kind === 'belongsTo')) {
        throw new Ember.Error("Model '" + Ember.inspect(this.record) + "' has no belongsTo relationship named '" + keyName + "' defined.");
      }

      var _relationship = relationship,
          hasAnyRelationshipData = _relationship.hasAnyRelationshipData,
          inverseInternalModel = _relationship.inverseInternalModel;


      if (hasAnyRelationshipData) {
        if (inverseInternalModel && !inverseInternalModel.isDeleted()) {
          if (id) {
            result = Ember.get(inverseInternalModel, 'id');
          } else {
            result = inverseInternalModel.createSnapshot();
          }
        } else {
          result = null;
        }
      }

      if (id) {
        this._belongsToIds[keyName] = result;
      } else {
        this._belongsToRelationships[keyName] = result;
      }

      return result;
    };

    /**
     Returns the current value of a hasMany relationship.
      `hasMany` takes an optional hash of options as a second parameter,
     currently supported options are:
      - `ids`: set to `true` if you only want the IDs of the related records to be
     returned.
      Example
      ```javascript
     // store.push('post', { id: 1, title: 'Hello World', comments: [2, 3] });
     postSnapshot.hasMany('comments'); // => [DS.Snapshot, DS.Snapshot]
     postSnapshot.hasMany('comments', { ids: true }); // => ['2', '3']
      // store.push('post', { id: 1, title: 'Hello World' });
     postSnapshot.hasMany('comments'); // => undefined
     ```
      Note: Relationships are loaded lazily and cached upon first access.
      @method hasMany
     @param {String} keyName
     @param {Object} [options]
     @return {(Array|undefined)} An array of snapshots or IDs of a known
     relationship or an empty array if the relationship is known but unset.
     undefined will be returned if the contents of the relationship is unknown.
     */


    Snapshot.prototype.hasMany = function hasMany(keyName, options) {
      var ids = options && options.ids;
      var relationship = void 0;
      var results = void 0;

      if (ids && keyName in this._hasManyIds) {
        return this._hasManyIds[keyName];
      }

      if (!ids && keyName in this._hasManyRelationships) {
        return this._hasManyRelationships[keyName];
      }

      relationship = this._internalModel._relationships.get(keyName);
      if (!(relationship && relationship.relationshipMeta.kind === 'hasMany')) {
        throw new Ember.Error("Model '" + Ember.inspect(this.record) + "' has no hasMany relationship named '" + keyName + "' defined.");
      }

      var _relationship2 = relationship,
          hasAnyRelationshipData = _relationship2.hasAnyRelationshipData,
          members = _relationship2.members;


      if (hasAnyRelationshipData) {
        results = [];
        members.forEach(function (member) {
          if (!member.isDeleted()) {
            if (ids) {
              results.push(member.id);
            } else {
              results.push(member.createSnapshot());
            }
          }
        });
      }

      if (ids) {
        this._hasManyIds[keyName] = results;
      } else {
        this._hasManyRelationships[keyName] = results;
      }

      return results;
    };

    /**
      Iterates through all the attributes of the model, calling the passed
      function on each attribute.
       Example
       ```javascript
      snapshot.eachAttribute(function(name, meta) {
        // ...
      });
      ```
       @method eachAttribute
      @param {Function} callback the callback to execute
      @param {Object} [binding] the value to which the callback's `this` should be bound
    */


    Snapshot.prototype.eachAttribute = function eachAttribute(callback, binding) {
      this.record.eachAttribute(callback, binding);
    };

    /**
      Iterates through all the relationships of the model, calling the passed
      function on each relationship.
       Example
       ```javascript
      snapshot.eachRelationship(function(name, relationship) {
        // ...
      });
      ```
       @method eachRelationship
      @param {Function} callback the callback to execute
      @param {Object} [binding] the value to which the callback's `this` should be bound
    */


    Snapshot.prototype.eachRelationship = function eachRelationship(callback, binding) {
      this.record.eachRelationship(callback, binding);
    };

    /**
      Serializes the snapshot using the serializer for the model.
       Example
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        createRecord(store, type, snapshot) {
          var data = snapshot.serialize({ includeId: true });
          var url = `/${type.modelName}`;
           return fetch(url, {
            method: 'POST',
            body: data,
          }).then((response) => response.json())
        }
      });
      ```
       @method serialize
      @param {Object} options
      @return {Object} an object whose values are primitive JSON values only
     */


    Snapshot.prototype.serialize = function serialize(options) {
      return this.record.store.serializerFor(this.modelName).serialize(this, options);
    };

    _createClass$6(Snapshot, [{
      key: 'record',
      get: function get() {
        return this._internalModel.getRecord();
      }
    }, {
      key: '_attributes',
      get: function get() {
        var attributes = this.__attributes;

        if (attributes === null) {
          var record = this.record;
          attributes = this.__attributes = Object.create(null);

          record.eachAttribute(function (keyName) {
            return attributes[keyName] = Ember.get(record, keyName);
          });
        }

        return attributes;
      }

      /**
       The type of the underlying record for this snapshot, as a DS.Model.
        @property type
       @type {DS.Model}
       */

    }, {
      key: 'type',
      get: function get() {
        // TODO @runspired we should deprecate this in favor of modelClass but only once
        // we've cleaned up the internals enough that a public change to follow suite is
        // uncontroversial.
        return this._internalModel.modelClass;
      }
    }]);

    return Snapshot;
  }();

  /*
    Check if the passed model has a `type` attribute or a relationship named `type`.

    @method modelHasAttributeOrRelationshipNamedType
    @param modelClass
   */
  function modelHasAttributeOrRelationshipNamedType(modelClass) {
    return Ember.get(modelClass, 'attributes').has('type') || Ember.get(modelClass, 'relationshipsByName').has('type');
  }

  /*
    ember-container-inject-owner is a new feature in Ember 2.3 that finally provides a public
    API for looking items up.  This function serves as a super simple polyfill to avoid
    triggering deprecations.
   */
  function getOwner(context) {
    var owner = void 0;

    if (Ember.getOwner) {
      owner = Ember.getOwner(context);
    } else if (context.container) {
      owner = context.container;
    }

    if (owner && owner.lookupFactory && !owner._lookupFactory) {
      // `owner` is a container, we are just making this work
      owner._lookupFactory = function () {
        var _owner;

        return (_owner = owner).lookupFactory.apply(_owner, arguments);
      };

      owner.register = function () {
        var registry = owner.registry || owner._registry || owner;

        return registry.register.apply(registry, arguments);
      };
    }

    return owner;
  }

  var Reference = function Reference(store, internalModel) {
    this.store = store;
    this.internalModel = internalModel;
  };

  Reference.prototype = {
    constructor: Reference
  };

  function _possibleConstructorReturn$4(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

  function _inherits$4(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  /**
     An RecordReference is a low level API that allows users and
     addon author to perform meta-operations on a record.

     @class RecordReference
     @namespace DS
  */

  var RecordReference = function (_Reference) {
    _inherits$4(RecordReference, _Reference);

    function RecordReference(store, internalModel) {
      var _this = _possibleConstructorReturn$4(this, _Reference.call(this, store, internalModel));

      _this.type = internalModel.modelName;
      _this._id = internalModel.id;
      return _this;
    }

    /**
       The `id` of the record that this reference refers to.
        Together, the `type` and `id` properties form a composite key for
       the identity map.
        Example
        ```javascript
       let userRef = store.getReference('user', 1);
        userRef.id(); // '1'
       ```
        @method id
       @return {String} The id of the record.
    */


    RecordReference.prototype.id = function id() {
      return this._id;
    };

    /**
       How the reference will be looked up when it is loaded: Currently
       this always return `identity` to signifying that a record will be
       loaded by the `type` and `id`.
        Example
        ```javascript
       const userRef = store.getReference('user', 1);
        userRef.remoteType(); // 'identity'
       ```
        @method remoteType
       @return {String} 'identity'
    */


    RecordReference.prototype.remoteType = function remoteType() {
      return 'identity';
    };

    /**
      This API allows you to provide a reference with new data. The
      simplest usage of this API is similar to `store.push`: you provide a
      normalized hash of data and the object represented by the reference
      will update.
       If you pass a promise to `push`, Ember Data will not ask the adapter
      for the data if another attempt to fetch it is made in the
      interim. When the promise resolves, the underlying object is updated
      with the new data, and the promise returned by *this function* is resolved
      with that object.
       For example, `recordReference.push(promise)` will be resolved with a
      record.
        Example
        ```javascript
       let userRef = store.getReference('user', 1);
        // provide data for reference
       userRef.push({ data: { id: 1, username: "@user" }}).then(function(user) {
         userRef.value() === user;
       });
       ```
       @method push
      @param objectOrPromise {Promise|Object}
      @return Promise<record> a promise for the value (record or relationship)
    */


    RecordReference.prototype.push = function push(objectOrPromise) {
      var _this2 = this;

      return Ember.RSVP.resolve(objectOrPromise).then(function (data) {
        return _this2.store.push(data);
      });
    };

    /**
      If the entity referred to by the reference is already loaded, it is
      present as `reference.value`. Otherwise the value returned by this function
      is `null`.
        Example
        ```javascript
       let userRef = store.getReference('user', 1);
        userRef.value(); // user
       ```
        @method value
       @return {DS.Model} the record for this RecordReference
    */


    RecordReference.prototype.value = function value() {
      if (this.internalModel.hasRecord) {
        return this.internalModel.getRecord();
      }
      return null;
    };

    /**
       Triggers a fetch for the backing entity based on its `remoteType`
       (see `remoteType` definitions per reference type).
        Example
        ```javascript
       let userRef = store.getReference('user', 1);
        // load user (via store.find)
       userRef.load().then(...)
       ```
        @method load
       @return {Promise<record>} the record for this RecordReference
    */


    RecordReference.prototype.load = function load() {
      return this.store.findRecord(this.type, this._id);
    };

    /**
       Reloads the record if it is already loaded. If the record is not
       loaded it will load the record via `store.findRecord`
        Example
        ```javascript
       let userRef = store.getReference('user', 1);
        // or trigger a reload
       userRef.reload().then(...)
       ```
        @method reload
       @return {Promise<record>} the record for this RecordReference
    */


    RecordReference.prototype.reload = function reload() {
      var record = this.value();
      if (record) {
        return record.reload();
      }

      return this.load();
    };

    return RecordReference;
  }(Reference);

  function _possibleConstructorReturn$5(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

  function _inherits$5(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  /**
     A BelongsToReference is a low level API that allows users and
     addon author to perform meta-operations on a belongs-to
     relationship.

     @class BelongsToReference
     @namespace DS
     @extends DS.Reference
  */
  var BelongsToReference = function (_Reference) {
    _inherits$5(BelongsToReference, _Reference);

    function BelongsToReference(store, parentInternalModel, belongsToRelationship) {
      var _this = _possibleConstructorReturn$5(this, _Reference.call(this, store, parentInternalModel));

      _this.belongsToRelationship = belongsToRelationship;
      _this.type = belongsToRelationship.relationshipMeta.type;
      _this.parent = parentInternalModel.recordReference;
      // TODO inverse
      return _this;
    }

    /**
       This returns a string that represents how the reference will be
       looked up when it is loaded. If the relationship has a link it will
       use the "link" otherwise it defaults to "id".
        Example
        ```javascript
        // models/blog.js
        export default DS.Model.extend({
          user: DS.belongsTo({ async: true })
        });
         let blog = store.push({
          type: 'blog',
          id: 1,
          relationships: {
            user: {
              data: { type: 'user', id: 1 }
            }
          }
        });
        let userRef = blog.belongsTo('user');
         // get the identifier of the reference
        if (userRef.remoteType() === "id") {
          let id = userRef.id();
        } else if (userRef.remoteType() === "link") {
          let link = userRef.link();
        }
        ```
        @method remoteType
       @return {String} The name of the remote type. This should either be "link" or "id"
    */


    BelongsToReference.prototype.remoteType = function remoteType() {
      if (this.belongsToRelationship.link) {
        return 'link';
      }

      return 'id';
    };

    /**
       The `id` of the record that this reference refers to. Together, the
       `type()` and `id()` methods form a composite key for the identity
       map. This can be used to access the id of an async relationship
       without triggering a fetch that would normally happen if you
       attempted to use `record.get('relationship.id')`.
        Example
        ```javascript
        // models/blog.js
        export default DS.Model.extend({
          user: DS.belongsTo({ async: true })
        });
         let blog = store.push({
          data: {
            type: 'blog',
            id: 1,
            relationships: {
              user: {
                data: { type: 'user', id: 1 }
              }
            }
          }
        });
        let userRef = blog.belongsTo('user');
         // get the identifier of the reference
        if (userRef.remoteType() === "id") {
          let id = userRef.id();
        }
        ```
        @method id
       @return {String} The id of the record in this belongsTo relationship.
    */


    BelongsToReference.prototype.id = function id() {
      var inverseInternalModel = this.belongsToRelationship.inverseInternalModel;
      return inverseInternalModel && inverseInternalModel.id;
    };

    /**
       The link Ember Data will use to fetch or reload this belongs-to
       relationship.
        Example
        ```javascript
        // models/blog.js
        export default DS.Model.extend({
          user: DS.belongsTo({ async: true })
        });
         let blog = store.push({
          data: {
            type: 'blog',
            id: 1,
            relationships: {
              user: {
                links: {
                  related: '/articles/1/author'
                }
              }
            }
          }
        });
        let userRef = blog.belongsTo('user');
         // get the identifier of the reference
        if (userRef.remoteType() === "link") {
          let link = userRef.link();
        }
        ```
        @method link
       @return {String} The link Ember Data will use to fetch or reload this belongs-to relationship.
    */


    BelongsToReference.prototype.link = function link() {
      return this.belongsToRelationship.link;
    };

    /**
       The meta data for the belongs-to relationship.
        Example
        ```javascript
        // models/blog.js
        export default DS.Model.extend({
          user: DS.belongsTo({ async: true })
        });
         let blog = store.push({
          data: {
            type: 'blog',
            id: 1,
            relationships: {
              user: {
                links: {
                  related: {
                    href: '/articles/1/author',
                    meta: {
                      lastUpdated: 1458014400000
                    }
                  }
                }
              }
            }
          }
        });
         let userRef = blog.belongsTo('user');
         userRef.meta() // { lastUpdated: 1458014400000 }
        ```
        @method meta
       @return {Object} The meta information for the belongs-to relationship.
    */


    BelongsToReference.prototype.meta = function meta() {
      return this.belongsToRelationship.meta;
    };

    /**
       `push` can be used to update the data in the relationship and Ember
       Data will treat the new data as the conanical value of this
       relationship on the backend.
        Example
         ```javascript
        // models/blog.js
        export default DS.Model.extend({
          user: DS.belongsTo({ async: true })
        });
         let blog = store.push({
          data: {
            type: 'blog',
            id: 1,
            relationships: {
              user: {
                data: { type: 'user', id: 1 }
              }
            }
          }
        });
        let userRef = blog.belongsTo('user');
         // provide data for reference
        userRef.push({
          data: {
            type: 'user',
            id: 1,
            attributes: {
              username: "@user"
            }
          }
        }).then(function(user) {
          userRef.value() === user;
        });
        ```
        @method push
       @param {Object|Promise} objectOrPromise a promise that resolves to a JSONAPI document object describing the new value of this relationship.
       @return {Promise<record>} A promise that resolves with the new value in this belongs-to relationship.
    */


    BelongsToReference.prototype.push = function push(objectOrPromise) {
      var _this2 = this;

      return Ember.RSVP.resolve(objectOrPromise).then(function (data) {
        var record = void 0;

        if (data instanceof Model) {
          record = data;
        } else {
          record = _this2.store.push(data);
        }

        _this2.belongsToRelationship.setCanonicalInternalModel(record._internalModel);

        return record;
      });
    };

    /**
       `value()` synchronously returns the current value of the belongs-to
       relationship. Unlike `record.get('relationshipName')`, calling
       `value()` on a reference does not trigger a fetch if the async
       relationship is not yet loaded. If the relationship is not loaded
       it will always return `null`.
        Example
         ```javascript
        // models/blog.js
        export default DS.Model.extend({
          user: DS.belongsTo({ async: true })
        });
         let blog = store.push({
          data: {
            type: 'blog',
            id: 1,
            relationships: {
              user: {
                data: { type: 'user', id: 1 }
              }
            }
          }
        });
        let userRef = blog.belongsTo('user');
         userRef.value(); // null
         // provide data for reference
        userRef.push({
          data: {
            type: 'user',
            id: 1,
            attributes: {
              username: "@user"
            }
          }
        }).then(function(user) {
          userRef.value(); // user
        });
        ```
        @method value
       @return {DS.Model} the record in this relationship
    */


    BelongsToReference.prototype.value = function value() {
      var inverseInternalModel = this.belongsToRelationship.inverseInternalModel;

      if (inverseInternalModel && inverseInternalModel.isLoaded()) {
        return inverseInternalModel.getRecord();
      }

      return null;
    };

    /**
       Loads a record in a belongs to relationship if it is not already
       loaded. If the relationship is already loaded this method does not
       trigger a new load.
        Example
         ```javascript
        // models/blog.js
        export default DS.Model.extend({
          user: DS.belongsTo({ async: true })
        });
         let blog = store.push({
          data: {
            type: 'blog',
            id: 1,
            relationships: {
              user: {
                data: { type: 'user', id: 1 }
              }
            }
          }
        });
        let userRef = blog.belongsTo('user');
         userRef.value(); // null
         userRef.load().then(function(user) {
          userRef.value() === user
        });
        ```
        @method load
       @return {Promise} a promise that resolves with the record in this belongs-to relationship.
    */


    BelongsToReference.prototype.load = function load() {
      var _this3 = this;

      var rel = this.belongsToRelationship;

      rel.getData();

      if (rel.fetchPromise !== null) {
        return rel.fetchPromise.then(function () {
          return _this3.value();
        });
      }

      return Ember.RSVP.resolve(this.value());
    };

    /**
       Triggers a reload of the value in this relationship. If the
       remoteType is `"link"` Ember Data will use the relationship link to
       reload the relationship. Otherwise it will reload the record by its
       id.
        Example
         ```javascript
        // models/blog.js
        export default DS.Model.extend({
          user: DS.belongsTo({ async: true })
        });
         let blog = store.push({
          data: {
            type: 'blog',
            id: 1,
            relationships: {
              user: {
                data: { type: 'user', id: 1 }
              }
            }
          }
        });
        let userRef = blog.belongsTo('user');
         userRef.reload().then(function(user) {
          userRef.value() === user
        });
        ```
        @method reload
       @return {Promise} a promise that resolves with the record in this belongs-to relationship after the reload has completed.
    */


    BelongsToReference.prototype.reload = function reload() {
      var _this4 = this;

      return this.belongsToRelationship.reload().then(function (internalModel) {
        return _this4.value();
      });
    };

    return BelongsToReference;
  }(Reference);

  function _possibleConstructorReturn$6(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

  function _inherits$6(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  /**
     A HasManyReference is a low level API that allows users and addon
     author to perform meta-operations on a has-many relationship.

     @class HasManyReference
     @namespace DS
  */
  var HasManyReference = function (_Reference) {
    _inherits$6(HasManyReference, _Reference);

    function HasManyReference(store, parentInternalModel, hasManyRelationship) {
      var _this = _possibleConstructorReturn$6(this, _Reference.call(this, store, parentInternalModel));

      _this.hasManyRelationship = hasManyRelationship;
      _this.type = hasManyRelationship.relationshipMeta.type;
      _this.parent = parentInternalModel.recordReference;
      // TODO inverse
      return _this;
    }

    /**
       This returns a string that represents how the reference will be
       looked up when it is loaded. If the relationship has a link it will
       use the "link" otherwise it defaults to "id".
        Example
        ```app/models/post.js
       export default DS.Model.extend({
         comments: DS.hasMany({ async: true })
       });
       ```
        ```javascript
       let post = store.push({
         data: {
           type: 'post',
           id: 1,
           relationships: {
             comments: {
               data: [{ type: 'comment', id: 1 }]
             }
           }
         }
       });
        let commentsRef = post.hasMany('comments');
        // get the identifier of the reference
       if (commentsRef.remoteType() === "ids") {
         let ids = commentsRef.ids();
       } else if (commentsRef.remoteType() === "link") {
         let link = commentsRef.link();
       }
       ```
        @method remoteType
       @return {String} The name of the remote type. This should either be "link" or "ids"
    */


    HasManyReference.prototype.remoteType = function remoteType() {
      if (this.hasManyRelationship.link) {
        return 'link';
      }

      return 'ids';
    };

    /**
       The link Ember Data will use to fetch or reload this has-many
       relationship.
        Example
        ```app/models/post.js
       export default DS.Model.extend({
         comments: DS.hasMany({ async: true })
       });
       ```
        ```javascript
       let post = store.push({
         data: {
           type: 'post',
           id: 1,
           relationships: {
             comments: {
               links: {
                 related: '/posts/1/comments'
               }
             }
           }
         }
       });
        let commentsRef = post.hasMany('comments');
        commentsRef.link(); // '/posts/1/comments'
       ```
        @method link
       @return {String} The link Ember Data will use to fetch or reload this has-many relationship.
    */


    HasManyReference.prototype.link = function link() {
      return this.hasManyRelationship.link;
    };

    /**
       `ids()` returns an array of the record ids in this relationship.
        Example
        ```app/models/post.js
       export default DS.Model.extend({
         comments: DS.hasMany({ async: true })
       });
       ```
        ```javascript
       let post = store.push({
         data: {
           type: 'post',
           id: 1,
           relationships: {
             comments: {
               data: [{ type: 'comment', id: 1 }]
             }
           }
         }
       });
        let commentsRef = post.hasMany('comments');
        commentsRef.ids(); // ['1']
       ```
        @method ids
       @return {Array} The ids in this has-many relationship
    */


    HasManyReference.prototype.ids = function ids() {
      var members = this.hasManyRelationship.members.toArray();

      return members.map(function (internalModel) {
        return internalModel.id;
      });
    };

    /**
       The meta data for the has-many relationship.
        Example
        ```app/models/post.js
       export default DS.Model.extend({
         comments: DS.hasMany({ async: true })
       });
       ```
        ```javascript
       let post = store.push({
         data: {
           type: 'post',
           id: 1,
           relationships: {
             comments: {
               links: {
                 related: {
                   href: '/posts/1/comments',
                   meta: {
                     count: 10
                   }
                 }
               }
             }
           }
         }
       });
        let commentsRef = post.hasMany('comments');
        commentsRef.meta(); // { count: 10 }
       ```
        @method meta
       @return {Object} The meta information for the has-many relationship.
    */


    HasManyReference.prototype.meta = function meta() {
      return this.hasManyRelationship.meta;
    };

    /**
       `push` can be used to update the data in the relationship and Ember
       Data will treat the new data as the canonical value of this
       relationship on the backend.
        Example
        ```app/models/post.js
       export default DS.Model.extend({
         comments: DS.hasMany({ async: true })
       });
       ```
        ```
       let post = store.push({
         data: {
           type: 'post',
           id: 1,
           relationships: {
             comments: {
               data: [{ type: 'comment', id: 1 }]
             }
           }
         }
       });
        let commentsRef = post.hasMany('comments');
        commentsRef.ids(); // ['1']
        commentsRef.push([
         [{ type: 'comment', id: 2 }],
         [{ type: 'comment', id: 3 }],
       ])
        commentsRef.ids(); // ['2', '3']
       ```
        @method push
       @param {Array|Promise} objectOrPromise a promise that resolves to a JSONAPI document object describing the new value of this relationship.
       @return {DS.ManyArray}
    */


    HasManyReference.prototype.push = function push(objectOrPromise) {
      var _this2 = this;

      return Ember.RSVP.resolve(objectOrPromise).then(function (payload) {
        var array = payload;

        if (typeof payload === 'object' && payload.data) {
          array = payload.data;
        }

        var internalModels = void 0;
        internalModels = array.map(function (obj) {
          var record = _this2.store.push(obj);

          

          return record._internalModel;
        });

        _this2.hasManyRelationship.computeChanges(internalModels);

        return _this2.hasManyRelationship.manyArray;
      });
    };

    HasManyReference.prototype._isLoaded = function _isLoaded() {
      var hasRelationshipDataProperty = Ember.get(this.hasManyRelationship, 'hasAnyRelationshipData');
      if (!hasRelationshipDataProperty) {
        return false;
      }

      var members = this.hasManyRelationship.members.toArray();

      return members.every(function (internalModel) {
        return internalModel.isLoaded() === true;
      });
    };

    /**
       `value()` synchronously returns the current value of the has-many
        relationship. Unlike `record.get('relationshipName')`, calling
        `value()` on a reference does not trigger a fetch if the async
        relationship is not yet loaded. If the relationship is not loaded
        it will always return `null`.
        Example
        ```app/models/post.js
       export default DS.Model.extend({
         comments: DS.hasMany({ async: true })
       });
       ```
        ```javascript
       let post = store.push({
         data: {
           type: 'post',
           id: 1,
           relationships: {
             comments: {
               data: [{ type: 'comment', id: 1 }]
             }
           }
         }
       });
        let commentsRef = post.hasMany('comments');
        post.get('comments').then(function(comments) {
         commentsRef.value() === comments
       })
       ```
        @method value
       @return {DS.ManyArray}
    */


    HasManyReference.prototype.value = function value() {
      if (this._isLoaded()) {
        return this.hasManyRelationship.manyArray;
      }

      return null;
    };

    /**
       Loads the relationship if it is not already loaded.  If the
       relationship is already loaded this method does not trigger a new
       load.
        Example
        ```app/models/post.js
       export default DS.Model.extend({
         comments: DS.hasMany({ async: true })
       });
       ```
        ```javascript
       let post = store.push({
         data: {
           type: 'post',
           id: 1,
           relationships: {
             comments: {
               data: [{ type: 'comment', id: 1 }]
             }
           }
         }
       });
        let commentsRef = post.hasMany('comments');
        commentsRef.load().then(function(comments) {
         //...
       });
       ```
        @method load
       @return {Promise} a promise that resolves with the ManyArray in
       this has-many relationship.
    */


    HasManyReference.prototype.load = function load() {
      // TODO this can be simplified
      if (!this._isLoaded()) {
        return this.hasManyRelationship.getData();
      }

      return Ember.RSVP.resolve(this.hasManyRelationship.manyArray);
    };

    /**
       Reloads this has-many relationship.
        Example
        ```app/models/post.js
       export default DS.Model.extend({
         comments: DS.hasMany({ async: true })
       });
       ```
        ```javascript
       let post = store.push({
         data: {
           type: 'post',
           id: 1,
           relationships: {
             comments: {
               data: [{ type: 'comment', id: 1 }]
             }
           }
         }
       });
        let commentsRef = post.hasMany('comments');
        commentsRef.reload().then(function(comments) {
         //...
       });
       ```
        @method reload
       @return {Promise} a promise that resolves with the ManyArray in this has-many relationship.
    */


    HasManyReference.prototype.reload = function reload() {
      return this.hasManyRelationship.reload();
    };

    return HasManyReference;
  }(Reference);

  var _createClass$7 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  /*
    The TransitionChainMap caches the `state.enters`, `state.setups`, and final state reached
    when transitioning from one state to another, so that future transitions can replay the
    transition without needing to walk the state tree, collect these hook calls and determine
     the state to transition into.

     A future optimization would be to build a single chained method out of the collected enters
     and setups. It may also be faster to do a two level cache (from: { to }) instead of caching based
     on a key that adds the two together.
   */
  var TransitionChainMap = Object.create(null);

  var _extractPivotNameCache = Object.create(null);
  var _splitOnDotCache = Object.create(null);

  function splitOnDot(name) {
    return _splitOnDotCache[name] || (_splitOnDotCache[name] = name.split('.'));
  }

  function extractPivotName(name) {
    return _extractPivotNameCache[name] || (_extractPivotNameCache[name] = splitOnDot(name)[0]);
  }

  function areAllModelsUnloaded(internalModels) {
    for (var i = 0; i < internalModels.length; ++i) {
      var record = internalModels[i]._record;
      if (record && !(record.get('isDestroyed') || record.get('isDestroying'))) {
        return false;
      }
    }
    return true;
  }

  // Handle dematerialization for relationship `rel`.  In all cases, notify the
  // relationship of the dematerialization: this is done so the relationship can
  // notify its inverse which needs to update state
  //
  // If the inverse is sync, unloading this record is treated as a client-side
  // delete, so we remove the inverse records from this relationship to
  // disconnect the graph.  Because it's not async, we don't need to keep around
  // the internalModel as an id-wrapper for references and because the graph is
  // disconnected we can actually destroy the internalModel when checking for
  // orphaned models.
  function destroyRelationship(rel) {
    rel.internalModelDidDematerialize();

    if (rel._inverseIsSync()) {
      // disconnect the graph so that the sync inverse relationship does not
      // prevent us from cleaning up during `_cleanupOrphanedInternalModels`
      rel.removeAllInternalModelsFromOwn();
      rel.removeAllCanonicalInternalModelsFromOwn();
    }
  }
  // this (and all heimdall instrumentation) will be stripped by a babel transform
  //  https://github.com/heimdalljs/babel5-plugin-strip-heimdall


  var InternalModelReferenceId = 1;
  var nextBfsId = 1;

  /*
    `InternalModel` is the Model class that we use internally inside Ember Data to represent models.
    Internal ED methods should only deal with `InternalModel` objects. It is a fast, plain Javascript class.

    We expose `DS.Model` to application code, by materializing a `DS.Model` from `InternalModel` lazily, as
    a performance optimization.

    `InternalModel` should never be exposed to application code. At the boundaries of the system, in places
    like `find`, `push`, etc. we convert between Models and InternalModels.

    We need to make sure that the properties from `InternalModel` are correctly exposed/proxied on `Model`
    if they are needed.

    @private
    @class InternalModel
  */

  var InternalModel = function () {
    function InternalModel(modelName, id, store, data) {
      this.id = id;

      // this ensure ordered set can quickly identify this as unique
      this[Ember.GUID_KEY] = InternalModelReferenceId++ + 'internal-model';

      this.store = store;
      this.modelName = modelName;
      this._promiseProxy = null;
      this._record = null;
      this._isDestroyed = false;
      this.isError = false;
      this._pendingRecordArrayManagerFlush = false; // used by the recordArrayManager

      // During dematerialization we don't want to rematerialize the record.  The
      // reason this might happen is that dematerialization removes records from
      // record arrays,  and Ember arrays will always `objectAt(0)` and
      // `objectAt(len - 1)` to test whether or not `firstObject` or `lastObject`
      // have changed.
      this._isDematerializing = false;
      this._scheduledDestroy = null;

      this.resetRecord();

      if (data) {
        this.__data = data;
      }

      // caches for lazy getters
      this._modelClass = null;
      this.__deferredTriggers = null;
      this.__recordArrays = null;
      this._references = null;
      this._recordReference = null;
      this.__relationships = null;
      this.__implicitRelationships = null;

      // Used during the mark phase of unloading to avoid checking the same internal
      // model twice in the same scan
      this._bfsId = 0;
    }

    InternalModel.prototype.isHiddenFromRecordArrays = function isHiddenFromRecordArrays() {
      // During dematerialization we don't want to rematerialize the record.
      // recordWasDeleted can cause other records to rematerialize because it
      // removes the internal model from the array and Ember arrays will always
      // `objectAt(0)` and `objectAt(len -1)` to check whether `firstObject` or
      // `lastObject` have changed.  When this happens we don't want those
      // models to rematerialize their records.

      return this._isDematerializing || this.hasScheduledDestroy() || this.isDestroyed || this.currentState.stateName === 'root.deleted.saved' || this.isEmpty();
    };

    InternalModel.prototype.isEmpty = function isEmpty() {
      return this.currentState.isEmpty;
    };

    InternalModel.prototype.isLoading = function isLoading() {
      return this.currentState.isLoading;
    };

    InternalModel.prototype.isLoaded = function isLoaded() {
      return this.currentState.isLoaded;
    };

    InternalModel.prototype.hasDirtyAttributes = function hasDirtyAttributes() {
      return this.currentState.hasDirtyAttributes;
    };

    InternalModel.prototype.isSaving = function isSaving() {
      return this.currentState.isSaving;
    };

    InternalModel.prototype.isDeleted = function isDeleted() {
      return this.currentState.isDeleted;
    };

    InternalModel.prototype.isNew = function isNew() {
      return this.currentState.isNew;
    };

    InternalModel.prototype.isValid = function isValid() {
      return this.currentState.isValid;
    };

    InternalModel.prototype.dirtyType = function dirtyType() {
      return this.currentState.dirtyType;
    };

    InternalModel.prototype.getRecord = function getRecord(properties) {
      if (!this._record && !this._isDematerializing) {

        // lookupFactory should really return an object that creates
        // instances with the injections applied
        var createOptions = {
          store: this.store,
          _internalModel: this,
          currentState: this.currentState,
          isError: this.isError,
          adapterError: this.error
        };

        if (properties !== undefined) {

          var classFields = this.getFields();
          var relationships = this._relationships;
          var propertyNames = Object.keys(properties);

          for (var i = 0; i < propertyNames.length; i++) {
            var name = propertyNames[i];
            var fieldType = classFields.get(name);
            var propertyValue = properties[name];

            if (name === 'id') {
              this.setId(propertyValue);
              continue;
            }

            switch (fieldType) {
              case 'attribute':
                this.setDirtyAttribute(name, propertyValue);
                break;
              case 'belongsTo':
                this.setDirtyBelongsTo(name, propertyValue);
                relationships.get(name).setHasAnyRelationshipData(true);
                relationships.get(name).setRelationshipIsEmpty(false);
                break;
              case 'hasMany':
                this.setDirtyHasMany(name, propertyValue);
                relationships.get(name).setHasAnyRelationshipData(true);
                relationships.get(name).setRelationshipIsEmpty(false);
                break;
              default:
                createOptions[name] = propertyValue;
            }
          }
        }

        if (Ember.setOwner) {
          // ensure that `getOwner(this)` works inside a model instance
          Ember.setOwner(createOptions, getOwner(this.store));
        } else {
          createOptions.container = this.store.container;
        }

        this._record = this.store._modelFactoryFor(this.modelName).create(createOptions);

        this._triggerDeferredTriggers();
      }

      return this._record;
    };

    InternalModel.prototype.getFields = function getFields() {
      return Ember.get(this.modelClass, 'fields');
    };

    InternalModel.prototype.resetRecord = function resetRecord() {
      this._record = null;
      this.isReloading = false;
      this.error = null;
      this.currentState = RootState$1.empty;
      this.__attributes = null;
      this.__inFlightAttributes = null;
      this._data = null;
    };

    InternalModel.prototype.dematerializeRecord = function dematerializeRecord() {
      this._isDematerializing = true;

      if (this._record) {
        this._record.destroy();
      }

      // move to an empty never-loaded state
      this.destroyRelationships();
      this.resetRecord();
      this.updateRecordArrays();
    };

    InternalModel.prototype.deleteRecord = function deleteRecord() {
      this.send('deleteRecord');
    };

    InternalModel.prototype.save = function save(options) {
      var promiseLabel = 'DS: Model#save ' + this;
      var resolver = Ember.RSVP.defer(promiseLabel);

      this.store.scheduleSave(this, resolver, options);
      return resolver.promise;
    };

    InternalModel.prototype.startedReloading = function startedReloading() {
      this.isReloading = true;
      if (this.hasRecord) {
        Ember.set(this._record, 'isReloading', true);
      }
    };

    InternalModel.prototype.finishedReloading = function finishedReloading() {
      this.isReloading = false;
      if (this.hasRecord) {
        Ember.set(this._record, 'isReloading', false);
      }
    };

    InternalModel.prototype.reload = function reload(options) {
      this.startedReloading();
      var internalModel = this;
      var promiseLabel = 'DS: Model#reload of ' + this;

      return new Ember.RSVP.Promise(function (resolve) {
        internalModel.send('reloadRecord', { resolve: resolve, options: options });
      }, promiseLabel).then(function () {
        internalModel.didCleanError();
        return internalModel;
      }, function (error) {
        internalModel.didError(error);
        throw error;
      }, 'DS: Model#reload complete, update flags').finally(function () {
        internalModel.finishedReloading();
        internalModel.updateRecordArrays();
      });
    };

    /*
      Computes the set of internal models reachable from `this` across exactly one
      relationship.
       @return {Array} An array containing the internal models that `this` belongs
      to or has many.
    */


    InternalModel.prototype._directlyRelatedInternalModels = function _directlyRelatedInternalModels() {
      var array = [];

      this._relationships.forEach(function (name, rel) {
        array = array.concat(rel.members.list, rel.canonicalMembers.list);
      });
      return array;
    };

    /*
      Computes the set of internal models reachable from this internal model.
       Reachability is determined over the relationship graph (ie a graph where
      nodes are internal models and edges are belongs to or has many
      relationships).
       @return {Array} An array including `this` and all internal models reachable
      from `this`.
    */


    InternalModel.prototype._allRelatedInternalModels = function _allRelatedInternalModels() {
      var array = [];
      var queue = [];
      var bfsId = nextBfsId++;
      queue.push(this);
      this._bfsId = bfsId;
      while (queue.length > 0) {
        var node = queue.shift();
        array.push(node);
        var related = node._directlyRelatedInternalModels();
        for (var i = 0; i < related.length; ++i) {
          var internalModel = related[i];

          if (internalModel._bfsId < bfsId) {
            queue.push(internalModel);
            internalModel._bfsId = bfsId;
          }
        }
      }
      return array;
    };

    /*
      Unload the record for this internal model. This will cause the record to be
      destroyed and freed up for garbage collection. It will also do a check
      for cleaning up internal models.
       This check is performed by first computing the set of related internal
      models. If all records in this set are unloaded, then the entire set is
      destroyed. Otherwise, nothing in the set is destroyed.
       This means that this internal model will be freed up for garbage collection
      once all models that refer to it via some relationship are also unloaded.
    */


    InternalModel.prototype.unloadRecord = function unloadRecord() {
      if (this.isDestroyed) {
        return;
      }
      this.send('unloadRecord');
      this.dematerializeRecord();

      if (this._scheduledDestroy === null) {
        this._scheduledDestroy = Ember.run.backburner.schedule('destroy', this, '_checkForOrphanedInternalModels');
      }
    };

    InternalModel.prototype.hasScheduledDestroy = function hasScheduledDestroy() {
      return !!this._scheduledDestroy;
    };

    InternalModel.prototype.cancelDestroy = function cancelDestroy() {


      this._isDematerializing = false;
      Ember.run.cancel(this._scheduledDestroy);
      this._scheduledDestroy = null;
    };

    // typically, we prefer to async destroy this lets us batch cleanup work.
    // Unfortunately, some scenarios where that is not possible. Such as:
    //
    // ```js
    // const record = store.find(‘record’, 1);
    // record.unloadRecord();
    // store.createRecord(‘record’, 1);
    // ```
    //
    // In those scenarios, we make that model's cleanup work, sync.
    //


    InternalModel.prototype.destroySync = function destroySync() {
      if (this._isDematerializing) {
        this.cancelDestroy();
      }
      this._checkForOrphanedInternalModels();
      if (this.isDestroyed || this.isDestroying) {
        return;
      }

      // just in-case we are not one of the orphaned, we should still
      // still destroy ourselves
      this.destroy();
    };

    InternalModel.prototype._checkForOrphanedInternalModels = function _checkForOrphanedInternalModels() {
      this._isDematerializing = false;
      this._scheduledDestroy = null;
      if (this.isDestroyed) {
        return;
      }

      this._cleanupOrphanedInternalModels();
    };

    InternalModel.prototype._cleanupOrphanedInternalModels = function _cleanupOrphanedInternalModels() {
      var relatedInternalModels = this._allRelatedInternalModels();
      if (areAllModelsUnloaded(relatedInternalModels)) {
        for (var i = 0; i < relatedInternalModels.length; ++i) {
          var internalModel = relatedInternalModels[i];
          if (!internalModel.isDestroyed) {
            internalModel.destroy();
          }
        }
      }
    };

    InternalModel.prototype.eachRelationship = function eachRelationship(callback, binding) {
      return this.modelClass.eachRelationship(callback, binding);
    };

    InternalModel.prototype.destroy = function destroy() {

      this.isDestroying = true;
      this.store._internalModelDestroyed(this);

      this._relationships.forEach(function (name, rel) {
        return rel.destroy();
      });

      this._isDestroyed = true;
    };

    InternalModel.prototype.eachAttribute = function eachAttribute(callback, binding) {
      return this.modelClass.eachAttribute(callback, binding);
    };

    InternalModel.prototype.inverseFor = function inverseFor(key) {
      return this.modelClass.inverseFor(key);
    };

    InternalModel.prototype.setupData = function setupData(data) {
      this.store._internalModelDidReceiveRelationshipData(this.modelName, this.id, data.relationships);

      var changedKeys = void 0;

      if (this.hasRecord) {
        changedKeys = this._changedKeys(data.attributes);
      }

      Ember.assign(this._data, data.attributes);
      this.pushedData();

      if (this.hasRecord) {
        this._record._notifyProperties(changedKeys);
      }
    };

    InternalModel.prototype.getAttributeValue = function getAttributeValue(key) {
      if (key in this._attributes) {
        return this._attributes[key];
      } else if (key in this._inFlightAttributes) {
        return this._inFlightAttributes[key];
      } else {
        return this._data[key];
      }
    };

    InternalModel.prototype.setDirtyHasMany = function setDirtyHasMany(key, records) {


      var relationship = this._relationships.get(key);
      relationship.clear();
      relationship.addInternalModels(records.map(function (record) {
        return Ember.get(record, '_internalModel');
      }));
    };

    InternalModel.prototype.setDirtyBelongsTo = function setDirtyBelongsTo(key, value) {
      if (value === undefined) {
        value = null;
      }
      if (value && value.then) {
        this._relationships.get(key).setRecordPromise(value);
      } else if (value) {
        this._relationships.get(key).setInternalModel(value._internalModel);
      } else {
        this._relationships.get(key).setInternalModel(value);
      }
    };

    InternalModel.prototype.setDirtyAttribute = function setDirtyAttribute(key, value) {
      if (this.isDeleted()) {
        throw new Ember.Error('Attempted to set \'' + key + '\' to \'' + value + '\' on the deleted record ' + this);
      }

      var oldValue = this.getAttributeValue(key);
      var originalValue = void 0;

      if (value !== oldValue) {
        // Add the new value to the changed attributes hash; it will get deleted by
        // the 'didSetProperty' handler if it is no different from the original value
        this._attributes[key] = value;

        if (key in this._inFlightAttributes) {
          originalValue = this._inFlightAttributes[key];
        } else {
          originalValue = this._data[key];
        }

        this.send('didSetProperty', {
          name: key,
          oldValue: oldValue,
          originalValue: originalValue,
          value: value
        });
      }

      return value;
    };

    /*
      @method createSnapshot
      @private
    */
    InternalModel.prototype.createSnapshot = function createSnapshot(options) {
      return new Snapshot(this, options);
    };

    /*
      @method loadingData
      @private
      @param {Promise} promise
    */


    InternalModel.prototype.loadingData = function loadingData(promise) {
      this.send('loadingData', promise);
    };

    /*
      @method loadedData
      @private
    */


    InternalModel.prototype.loadedData = function loadedData() {
      this.send('loadedData');
    };

    /*
      @method notFound
      @private
    */


    InternalModel.prototype.notFound = function notFound() {
      this.send('notFound');
    };

    /*
      @method pushedData
      @private
    */


    InternalModel.prototype.pushedData = function pushedData() {
      this.send('pushedData');
    };

    InternalModel.prototype.flushChangedAttributes = function flushChangedAttributes() {
      this._inFlightAttributes = this._attributes;
      this._attributes = null;
    };

    InternalModel.prototype.hasChangedAttributes = function hasChangedAttributes() {
      return this.__attributes !== null && Object.keys(this.__attributes).length > 0;
    };

    /*
      Checks if the attributes which are considered as changed are still
      different to the state which is acknowledged by the server.
       This method is needed when data for the internal model is pushed and the
      pushed data might acknowledge dirty attributes as confirmed.
       @method updateChangedAttributes
      @private
     */


    InternalModel.prototype.updateChangedAttributes = function updateChangedAttributes() {
      var changedAttributes = this.changedAttributes();
      var changedAttributeNames = Object.keys(changedAttributes);
      var attrs = this._attributes;

      for (var i = 0, length = changedAttributeNames.length; i < length; i++) {
        var attribute = changedAttributeNames[i];
        var data = changedAttributes[attribute];
        var oldData = data[0];
        var newData = data[1];

        if (oldData === newData) {
          delete attrs[attribute];
        }
      }
    };

    /*
      Returns an object, whose keys are changed properties, and value is an
      [oldProp, newProp] array.
       @method changedAttributes
      @private
    */


    InternalModel.prototype.changedAttributes = function changedAttributes() {
      var oldData = this._data;
      var currentData = this._attributes;
      var inFlightData = this._inFlightAttributes;
      var newData = Ember.assign({}, inFlightData, currentData);
      var diffData = Object.create(null);
      var newDataKeys = Object.keys(newData);

      for (var i = 0, length = newDataKeys.length; i < length; i++) {
        var key = newDataKeys[i];
        diffData[key] = [oldData[key], newData[key]];
      }

      return diffData;
    };

    /*
      @method adapterWillCommit
      @private
    */


    InternalModel.prototype.adapterWillCommit = function adapterWillCommit() {
      this.send('willCommit');
    };

    /*
      @method adapterDidDirty
      @private
    */


    InternalModel.prototype.adapterDidDirty = function adapterDidDirty() {
      this.send('becomeDirty');
      this.updateRecordArrays();
    };

    /*
      @method send
      @private
      @param {String} name
      @param {Object} context
    */


    InternalModel.prototype.send = function send(name, context) {
      var currentState = this.currentState;

      if (!currentState[name]) {
        this._unhandledEvent(currentState, name, context);
      }

      return currentState[name](this, context);
    };

    InternalModel.prototype.notifyHasManyAdded = function notifyHasManyAdded(key, record, idx) {
      if (this.hasRecord) {
        this._record.notifyHasManyAdded(key, record, idx);
      }
    };

    InternalModel.prototype.notifyBelongsToChange = function notifyBelongsToChange(key, record) {
      if (this.hasRecord) {
        this._record.notifyBelongsToChange(key, record);
      }
    };

    InternalModel.prototype.notifyPropertyChange = function notifyPropertyChange(key) {
      if (this.hasRecord) {
        this._record.notifyPropertyChange(key);
      }
    };

    InternalModel.prototype.rollbackAttributes = function rollbackAttributes() {
      var dirtyKeys = void 0;
      if (this.hasChangedAttributes()) {
        dirtyKeys = Object.keys(this._attributes);
        this._attributes = null;
      }

      if (Ember.get(this, 'isError')) {
        this._inFlightAttributes = null;
        this.didCleanError();
      }

      if (this.isNew()) {
        this.removeFromInverseRelationships();
      }

      if (this.isValid()) {
        this._inFlightAttributes = null;
      }

      this.send('rolledBack');

      if (dirtyKeys && dirtyKeys.length > 0) {
        this._record._notifyProperties(dirtyKeys);
      }
    };

    /*
      @method transitionTo
      @private
      @param {String} name
    */


    InternalModel.prototype.transitionTo = function transitionTo(name) {
      // POSSIBLE TODO: Remove this code and replace with
      // always having direct reference to state objects

      var pivotName = extractPivotName(name);
      var state = this.currentState;
      var transitionMapId = state.stateName + '->' + name;

      do {
        if (state.exit) {
          state.exit(this);
        }
        state = state.parentState;
      } while (!state[pivotName]);

      var setups = void 0;
      var enters = void 0;
      var i = void 0;
      var l = void 0;
      var map = TransitionChainMap[transitionMapId];

      if (map) {
        setups = map.setups;
        enters = map.enters;
        state = map.state;
      } else {
        setups = [];
        enters = [];

        var path = splitOnDot(name);

        for (i = 0, l = path.length; i < l; i++) {
          state = state[path[i]];

          if (state.enter) {
            enters.push(state);
          }
          if (state.setup) {
            setups.push(state);
          }
        }

        TransitionChainMap[transitionMapId] = { setups: setups, enters: enters, state: state };
      }

      for (i = 0, l = enters.length; i < l; i++) {
        enters[i].enter(this);
      }

      this.currentState = state;
      if (this.hasRecord) {
        Ember.set(this._record, 'currentState', state);
      }

      for (i = 0, l = setups.length; i < l; i++) {
        setups[i].setup(this);
      }

      this.updateRecordArrays();
    };

    InternalModel.prototype._unhandledEvent = function _unhandledEvent(state, name, context) {
      var errorMessage = 'Attempted to handle event `' + name + '` ';
      errorMessage += 'on ' + String(this) + ' while in state ';
      errorMessage += state.stateName + '. ';

      if (context !== undefined) {
        errorMessage += 'Called with ' + Ember.inspect(context) + '.';
      }

      throw new Ember.Error(errorMessage);
    };

    InternalModel.prototype.triggerLater = function triggerLater() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (this._deferredTriggers.push(args) !== 1) {
        return;
      }

      this.store._updateInternalModel(this);
    };

    InternalModel.prototype._triggerDeferredTriggers = function _triggerDeferredTriggers() {
      //TODO: Before 1.0 we want to remove all the events that happen on the pre materialized record,
      //but for now, we queue up all the events triggered before the record was materialized, and flush
      //them once we have the record
      if (!this.hasRecord) {
        return;
      }
      var triggers = this._deferredTriggers;
      var record = this._record;
      var trigger = record.trigger;
      for (var i = 0, l = triggers.length; i < l; i++) {
        trigger.apply(record, triggers[i]);
      }

      triggers.length = 0;
    };

    /*
     This method should only be called by records in the `isNew()` state OR once the record
     has been deleted and that deletion has been persisted.
      It will remove this record from any associated relationships.
       @method removeFromInverseRelationships
      @private
     */


    InternalModel.prototype.removeFromInverseRelationships = function removeFromInverseRelationships() {
      this._relationships.forEach(function (name, rel) {
        rel.removeCompletelyFromInverse();
        rel.clear();
      });

      var implicitRelationships = this._implicitRelationships;
      this.__implicitRelationships = null;

      Object.keys(implicitRelationships).forEach(function (key) {
        var rel = implicitRelationships[key];

        rel.removeCompletelyFromInverse();
        rel.clear();
      });
    };

    /*
      Notify all inverses that this internalModel has been dematerialized
      and destroys any ManyArrays.
     */


    InternalModel.prototype.destroyRelationships = function destroyRelationships() {
      var relationships = this._relationships;
      relationships.forEach(function (name, rel) {
        return destroyRelationship(rel);
      });

      var implicitRelationships = this._implicitRelationships;
      this.__implicitRelationships = null;
      Object.keys(implicitRelationships).forEach(function (key) {
        var rel = implicitRelationships[key];
        destroyRelationship(rel);
      });
    };

    /*
      When a find request is triggered on the store, the user can optionally pass in
      attributes and relationships to be preloaded. These are meant to behave as if they
      came back from the server, except the user obtained them out of band and is informing
      the store of their existence. The most common use case is for supporting client side
      nested URLs, such as `/posts/1/comments/2` so the user can do
      `store.findRecord('comment', 2, { preload: { post: 1 } })` without having to fetch the post.
       Preloaded data can be attributes and relationships passed in either as IDs or as actual
      models.
       @method preloadData
      @private
      @param {Object} preload
    */


    InternalModel.prototype.preloadData = function preloadData(preload) {
      var _this = this;

      //TODO(Igor) consider the polymorphic case
      Object.keys(preload).forEach(function (key) {
        var preloadValue = Ember.get(preload, key);
        var relationshipMeta = _this.modelClass.metaForProperty(key);
        if (relationshipMeta.isRelationship) {
          _this._preloadRelationship(key, preloadValue);
        } else {
          _this._data[key] = preloadValue;
        }
      });
    };

    InternalModel.prototype._preloadRelationship = function _preloadRelationship(key, preloadValue) {
      var relationshipMeta = this.modelClass.metaForProperty(key);
      var modelClass = relationshipMeta.type;
      if (relationshipMeta.kind === 'hasMany') {
        this._preloadHasMany(key, preloadValue, modelClass);
      } else {
        this._preloadBelongsTo(key, preloadValue, modelClass);
      }
    };

    InternalModel.prototype._preloadHasMany = function _preloadHasMany(key, preloadValue, modelClass) {

      var recordsToSet = new Array(preloadValue.length);

      for (var i = 0; i < preloadValue.length; i++) {
        var recordToPush = preloadValue[i];
        recordsToSet[i] = this._convertStringOrNumberIntoInternalModel(recordToPush, modelClass);
      }

      //We use the pathway of setting the hasMany as if it came from the adapter
      //because the user told us that they know this relationships exists already
      this._relationships.get(key).updateInternalModelsFromAdapter(recordsToSet);
    };

    InternalModel.prototype._preloadBelongsTo = function _preloadBelongsTo(key, preloadValue, modelClass) {
      var internalModelToSet = this._convertStringOrNumberIntoInternalModel(preloadValue, modelClass);

      //We use the pathway of setting the hasMany as if it came from the adapter
      //because the user told us that they know this relationships exists already
      this._relationships.get(key).setInternalModel(internalModelToSet);
    };

    InternalModel.prototype._convertStringOrNumberIntoInternalModel = function _convertStringOrNumberIntoInternalModel(value, modelClass) {
      if (typeof value === 'string' || typeof value === 'number') {
        return this.store._internalModelForId(modelClass, value);
      }
      if (value._internalModel) {
        return value._internalModel;
      }
      return value;
    };

    /*
      Used to notify the store to update FilteredRecordArray membership.
       @method updateRecordArrays
      @private
    */


    InternalModel.prototype.updateRecordArrays = function updateRecordArrays() {
      this.store.recordArrayManager.recordDidChange(this);
    };

    InternalModel.prototype.setId = function setId(id) {

      var didChange = id !== this.id;
      this.id = id;

      if (didChange && this.hasRecord) {
        this._record.notifyPropertyChange('id');
      }
    };

    InternalModel.prototype.didError = function didError(error) {
      this.error = error;
      this.isError = true;

      if (this.hasRecord) {
        this._record.setProperties({
          isError: true,
          adapterError: error
        });
      }
    };

    InternalModel.prototype.didCleanError = function didCleanError() {
      this.error = null;
      this.isError = false;

      if (this.hasRecord) {
        this._record.setProperties({
          isError: false,
          adapterError: null
        });
      }
    };

    /*
      If the adapter did not return a hash in response to a commit,
      merge the changed attributes and relationships into the existing
      saved data.
       @method adapterDidCommit
    */


    InternalModel.prototype.adapterDidCommit = function adapterDidCommit(data) {
      if (data) {
        this.store._internalModelDidReceiveRelationshipData(this.modelName, this.id, data.relationships);

        data = data.attributes;
      }

      this.didCleanError();
      var changedKeys = this._changedKeys(data);

      Ember.assign(this._data, this._inFlightAttributes);
      if (data) {
        Ember.assign(this._data, data);
      }

      this._inFlightAttributes = null;

      this.send('didCommit');
      this.updateRecordArrays();

      if (!data) {
        return;
      }

      this._record._notifyProperties(changedKeys);
    };

    InternalModel.prototype.addErrorMessageToAttribute = function addErrorMessageToAttribute(attribute, message) {
      Ember.get(this.getRecord(), 'errors')._add(attribute, message);
    };

    InternalModel.prototype.removeErrorMessageFromAttribute = function removeErrorMessageFromAttribute(attribute) {
      Ember.get(this.getRecord(), 'errors')._remove(attribute);
    };

    InternalModel.prototype.clearErrorMessages = function clearErrorMessages() {
      Ember.get(this.getRecord(), 'errors')._clear();
    };

    InternalModel.prototype.hasErrors = function hasErrors() {
      var errors = Ember.get(this.getRecord(), 'errors');

      return errors.get('length') > 0;
    };

    // FOR USE DURING COMMIT PROCESS

    /*
      @method adapterDidInvalidate
      @private
    */


    InternalModel.prototype.adapterDidInvalidate = function adapterDidInvalidate(errors) {
      var attribute = void 0;

      for (attribute in errors) {
        if (errors.hasOwnProperty(attribute)) {
          this.addErrorMessageToAttribute(attribute, errors[attribute]);
        }
      }

      this.send('becameInvalid');

      this._saveWasRejected();
    };

    /*
      @method adapterDidError
      @private
    */


    InternalModel.prototype.adapterDidError = function adapterDidError(error) {
      this.send('becameError');
      this.didError(error);
      this._saveWasRejected();
    };

    InternalModel.prototype._saveWasRejected = function _saveWasRejected() {
      var keys = Object.keys(this._inFlightAttributes);
      if (keys.length > 0) {
        var attrs = this._attributes;
        for (var i = 0; i < keys.length; i++) {
          if (attrs[keys[i]] === undefined) {
            attrs[keys[i]] = this._inFlightAttributes[keys[i]];
          }
        }
      }
      this._inFlightAttributes = null;
    };

    /*
      Ember Data has 3 buckets for storing the value of an attribute on an internalModel.
       `_data` holds all of the attributes that have been acknowledged by
      a backend via the adapter. When rollbackAttributes is called on a model all
      attributes will revert to the record's state in `_data`.
       `_attributes` holds any change the user has made to an attribute
      that has not been acknowledged by the adapter. Any values in
      `_attributes` are have priority over values in `_data`.
       `_inFlightAttributes`. When a record is being synced with the
      backend the values in `_attributes` are copied to
      `_inFlightAttributes`. This way if the backend acknowledges the
      save but does not return the new state Ember Data can copy the
      values from `_inFlightAttributes` to `_data`. Without having to
      worry about changes made to `_attributes` while the save was
      happenign.
        Changed keys builds a list of all of the values that may have been
      changed by the backend after a successful save.
       It does this by iterating over each key, value pair in the payload
      returned from the server after a save. If the `key` is found in
      `_attributes` then the user has a local changed to the attribute
      that has not been synced with the server and the key is not
      included in the list of changed keys.
    
      If the value, for a key differs from the value in what Ember Data
      believes to be the truth about the backend state (A merger of the
      `_data` and `_inFlightAttributes` objects where
      `_inFlightAttributes` has priority) then that means the backend
      has updated the value and the key is added to the list of changed
      keys.
       @method _changedKeys
      @private
    */


    InternalModel.prototype._changedKeys = function _changedKeys(updates) {
      var changedKeys = [];

      if (updates) {
        var original = void 0,
            i = void 0,
            value = void 0,
            key = void 0;
        var keys = Object.keys(updates);
        var length = keys.length;
        var hasAttrs = this.hasChangedAttributes();
        var attrs = void 0;
        if (hasAttrs) {
          attrs = this._attributes;
        }

        original = Object.create(null);
        Ember.assign(original, this._data, this._inFlightAttributes);

        for (i = 0; i < length; i++) {
          key = keys[i];
          value = updates[key];

          // A value in _attributes means the user has a local change to
          // this attributes. We never override this value when merging
          // updates from the backend so we should not sent a change
          // notification if the server value differs from the original.
          if (hasAttrs === true && attrs[key] !== undefined) {
            continue;
          }

          if (!Ember.isEqual(original[key], value)) {
            changedKeys.push(key);
          }
        }
      }

      return changedKeys;
    };

    InternalModel.prototype.toString = function toString() {
      return '<' + this.modelName + ':' + this.id + '>';
    };

    InternalModel.prototype.referenceFor = function referenceFor(kind, name) {
      var reference = this.references[name];

      if (!reference) {
        var relationship = this._relationships.get(name);

        

        if (kind === 'belongsTo') {
          reference = new BelongsToReference(this.store, this, relationship);
        } else if (kind === 'hasMany') {
          reference = new HasManyReference(this.store, this, relationship);
        }

        this.references[name] = reference;
      }

      return reference;
    };

    _createClass$7(InternalModel, [{
      key: 'modelClass',
      get: function get() {
        return this._modelClass || (this._modelClass = this.store.modelFor(this.modelName));
      }
    }, {
      key: 'type',
      get: function get() {
        return this.modelClass;
      }
    }, {
      key: 'recordReference',
      get: function get() {
        if (this._recordReference === null) {
          this._recordReference = new RecordReference(this.store, this);
        }
        return this._recordReference;
      }
    }, {
      key: '_recordArrays',
      get: function get() {
        if (this.__recordArrays === null) {
          this.__recordArrays = new EmberDataOrderedSet();
        }
        return this.__recordArrays;
      }
    }, {
      key: 'references',
      get: function get() {
        if (this._references === null) {
          this._references = Object.create(null);
        }
        return this._references;
      }
    }, {
      key: '_deferredTriggers',
      get: function get() {
        if (this.__deferredTriggers === null) {
          this.__deferredTriggers = [];
        }
        return this.__deferredTriggers;
      }
    }, {
      key: '_attributes',
      get: function get() {
        if (this.__attributes === null) {
          this.__attributes = Object.create(null);
        }
        return this.__attributes;
      },
      set: function set(v) {
        this.__attributes = v;
      }
    }, {
      key: '_relationships',
      get: function get() {
        if (this.__relationships === null) {
          this.__relationships = new Relationships(this);
        }

        return this.__relationships;
      }
    }, {
      key: '_inFlightAttributes',
      get: function get() {
        if (this.__inFlightAttributes === null) {
          this.__inFlightAttributes = Object.create(null);
        }
        return this.__inFlightAttributes;
      },
      set: function set(v) {
        this.__inFlightAttributes = v;
      }
    }, {
      key: '_data',
      get: function get() {
        if (this.__data === null) {
          this.__data = Object.create(null);
        }
        return this.__data;
      },
      set: function set(v) {
        this.__data = v;
      }

      /*
       implicit relationships are relationship which have not been declared but the inverse side exists on
       another record somewhere
       For example if there was
        ```app/models/comment.js
       import DS from 'ember-data';
        export default DS.Model.extend({
       name: DS.attr()
       })
       ```
        but there is also
        ```app/models/post.js
       import DS from 'ember-data';
        export default DS.Model.extend({
       name: DS.attr(),
       comments: DS.hasMany('comment')
       })
       ```
        would have a implicit post relationship in order to be do things like remove ourselves from the post
       when we are deleted
      */

    }, {
      key: '_implicitRelationships',
      get: function get() {
        if (this.__implicitRelationships === null) {
          this.__implicitRelationships = Object.create(null);
        }
        return this.__implicitRelationships;
      }
    }, {
      key: 'isDestroyed',
      get: function get() {
        return this._isDestroyed;
      }
    }, {
      key: 'hasRecord',
      get: function get() {
        return !!this._record;
      }
    }]);

    return InternalModel;
  }();

  var _createClass$8 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  /**
   `InternalModelMap` is a custom storage map for internalModels of a given modelName
   used by `IdentityMap`.

   It was extracted from an implicit pojo based "internalModel map" and preserves
   that interface while we work towards a more official API.

   @class InternalModelMap
   @private
   */

  var InternalModelMap = function () {
    function InternalModelMap(modelName) {
      this.modelName = modelName;
      this._idToModel = Object.create(null);
      this._models = [];
      this._metadata = null;
    }

    /**
     * @method get
     * @param id {String}
     * @return {InternalModel}
     */


    InternalModelMap.prototype.get = function get(id) {
      return this._idToModel[id];
    };

    InternalModelMap.prototype.has = function has(id) {
      return !!this._idToModel[id];
    };

    InternalModelMap.prototype.set = function set(id, internalModel) {


      this._idToModel[id] = internalModel;
    };

    InternalModelMap.prototype.add = function add(internalModel, id) {


      if (id) {


        this._idToModel[id] = internalModel;
      }

      this._models.push(internalModel);
    };

    InternalModelMap.prototype.remove = function remove(internalModel, id) {
      delete this._idToModel[id];

      var loc = this._models.indexOf(internalModel);

      if (loc !== -1) {
        this._models.splice(loc, 1);
      }
    };

    InternalModelMap.prototype.contains = function contains(internalModel) {
      return this._models.indexOf(internalModel) !== -1;
    };

    /**
     An array of all models of this modelName
     @property models
     @type Array
     */


    /**
     Destroy all models in the internalModelTest and wipe metadata.
      @method clear
     */
    InternalModelMap.prototype.clear = function clear() {
      var models = this._models;
      this._models = [];

      for (var i = 0; i < models.length; i++) {
        var model = models[i];
        model.unloadRecord();
      }

      this._metadata = null;
    };

    _createClass$8(InternalModelMap, [{
      key: 'length',
      get: function get() {
        return this._models.length;
      }
    }, {
      key: 'models',
      get: function get() {
        return this._models;
      }

      /**
       * meta information about internalModels
       * @property metadata
       * @type Object
       */

    }, {
      key: 'metadata',
      get: function get() {
        return this._metadata || (this._metadata = Object.create(null));
      }

      /**
       deprecated (and unsupported) way of accessing modelClass
        @property type
       @deprecated
       */

    }, {
      key: 'type',
      get: function get() {
        throw new Error('InternalModelMap.type is no longer available');
      }
    }]);

    return InternalModelMap;
  }();

  /**
   `IdentityMap` is a custom storage map for records by modelName
   used by `DS.Store`.

   @class IdentityMap
   @private
   */

  var IdentityMap = function () {
    function IdentityMap() {
      this._map = Object.create(null);
    }

    /**
     Retrieves the `InternalModelMap` for a given modelName,
     creating one if one did not already exist. This is
     similar to `getWithDefault` or `get` on a `MapWithDefault`
      @method retrieve
     @param modelName a previously normalized modelName
     @return {InternalModelMap} the InternalModelMap for the given modelName
     */


    IdentityMap.prototype.retrieve = function retrieve(modelName) {
      var map = this._map[modelName];

      if (map === undefined) {
        map = this._map[modelName] = new InternalModelMap(modelName);
      }

      return map;
    };

    /**
     Clears the contents of all known `RecordMaps`, but does
     not remove the InternalModelMap instances.
      @method clear
     */


    IdentityMap.prototype.clear = function clear() {
      var map = this._map;
      var keys = Object.keys(map);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        map[key].clear();
      }
    };

    return IdentityMap;
  }();

  /*
    This is a helper method that always returns a JSON-API Document.

    @method normalizeResponseHelper
    @param {DS.Serializer} serializer
    @param {DS.Store} store
    @param {subclass of DS.Model} modelClass
    @param {Object} payload
    @param {String|Number} id
    @param {String} requestType
    @return {Object} JSON-API Document
  */
  function normalizeResponseHelper(serializer, store, modelClass, payload, id, requestType) {
    var normalizedResponse = serializer.normalizeResponse(store, modelClass, payload, id, requestType);


    return normalizedResponse;
  }

  function serializerForAdapter(store, adapter, modelName) {
    var serializer = adapter.serializer;

    if (serializer === undefined) {
      serializer = store.serializerFor(modelName);
    }

    if (serializer === null || serializer === undefined) {
      serializer = {
        extract: function extract(store, type, payload) {
          return payload;
        }
      };
    }

    return serializer;
  }

  var _createClass$9 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  /**
   * Merge data,meta,links information forward to the next payload
   * if required. Latest data will always win.
   *
   * @param oldPayload
   * @param newPayload
   */
  function mergeForwardPayload(oldPayload, newPayload) {
    if (oldPayload && oldPayload.data !== undefined && newPayload.data === undefined) {
      newPayload.data = oldPayload.data;
    }

    /*
      _partialData is has-many relationship data that has been discovered via
       inverses in the absence of canonical `data` availability from the primary
       payload.
       We can't merge this data into `data` as that would trick has-many relationships
       into believing they know their complete membership. Anytime we find canonical
       data from the primary record, this partial data is discarded. If no canonical
       data is ever discovered, the partial data will be loaded by the relationship
       in a way that correctly preserves the `stale` relationship state.
     */
    if (newPayload.data === undefined && oldPayload && oldPayload._partialData !== undefined) {
      newPayload._partialData = oldPayload._partialData;
    }

    if (oldPayload && oldPayload.meta !== undefined && newPayload.meta === undefined) {
      newPayload.meta = oldPayload.meta;
    }

    if (oldPayload && oldPayload.links !== undefined && newPayload.links === undefined) {
      newPayload.links = oldPayload.links;
    }
  }

  // TODO this is now VERY similar to the identity/internal-model map
  //  so we should probably generalize
  var TypeCache = function () {
    function TypeCache() {
      this.types = Object.create(null);
    }

    TypeCache.prototype.get = function get(modelName, id) {
      var types = this.types;


      if (types[modelName] !== undefined) {
        return types[modelName][id];
      }
    };

    TypeCache.prototype.set = function set(modelName, id, payload) {
      var types = this.types;

      var typeMap = types[modelName];

      if (typeMap === undefined) {
        typeMap = types[modelName] = Object.create(null);
      }

      typeMap[id] = payload;
    };

    TypeCache.prototype.delete = function _delete(modelName, id) {
      var types = this.types;


      if (types[modelName] !== undefined) {
        delete types[modelName][id];
      }
    };

    return TypeCache;
  }();

  /**
   Manages the payloads for both sides of a single relationship, across all model
   instances.

   For example, with

   const User = DS.Model.extend({
        hobbies: DS.hasMany('hobby')
      });

   const Hobby = DS.Model.extend({
        user: DS.belongsTo('user')
      });

   let relationshipPayloads = new RelationshipPayloads('user', 'hobbies', 'hobby', 'user');

   let userPayload = {
        data: {
          id: 1,
          type: 'user',
          relationships: {
            hobbies: {
              data: [{
                id: 2,
                type: 'hobby',
              }]
            }
          }
        }
      };

   // here we expect the payload of the individual relationship
   relationshipPayloads.push('user', 1, 'hobbies', userPayload.data.relationships.hobbies);

   relationshipPayloads.get('user', 1, 'hobbies');
   relationshipPayloads.get('hobby', 2, 'user');

   @class RelationshipPayloads
   @private
   */

  var RelationshipPayloads = function () {
    function RelationshipPayloads(relInfo) {
      this._relInfo = relInfo;

      // a map of id -> payloads for the left hand side of the relationship.
      this.lhs_payloads = new TypeCache();
      this.rhs_payloads = relInfo.isReflexive ? this.lhs_payloads : new TypeCache();

      // When we push relationship payloads, just stash them in a queue until
      // somebody actually asks for one of them.
      //
      // This is a queue of the relationship payloads that have been pushed for
      // either side of this relationship
      this._pendingPayloads = [];
    }

    /**
     Get the payload for the relationship of an individual record.
      This might return the raw payload as pushed into the store, or one computed
     from the payload of the inverse relationship.
      @method
     */


    RelationshipPayloads.prototype.get = function get(modelName, id, relationshipName) {
      this._flushPending();

      if (this._isLHS(modelName, relationshipName)) {
        return this.lhs_payloads.get(modelName, id);
      } else {

        return this.rhs_payloads.get(modelName, id);
      }
    };

    /**
     Push a relationship payload for an individual record.
      This will make the payload available later for both this relationship and its inverse.
      @method
     */


    RelationshipPayloads.prototype.push = function push(modelName, id, relationshipName, relationshipData) {
      this._pendingPayloads.push([modelName, id, relationshipName, relationshipData]);
    };

    /**
     Unload the relationship payload for an individual record.
      This does not unload the inverse relationship payload.
      @method
     */


    RelationshipPayloads.prototype.unload = function unload(modelName, id, relationshipName) {
      this._flushPending();

      if (this._isLHS(modelName, relationshipName)) {
        delete this.lhs_payloads.delete(modelName, id);
      } else {

        delete this.rhs_payloads.delete(modelName, id);
      }
    };

    /**
     @return {boolean} true iff `modelName` and `relationshipName` refer to the
     left hand side of this relationship, as opposed to the right hand side.
      @method
     */


    RelationshipPayloads.prototype._isLHS = function _isLHS(modelName, relationshipName) {
      var relInfo = this._relInfo;
      var isSelfReferential = relInfo.isSelfReferential;
      var isRelationship = relationshipName === relInfo.lhs_relationshipName;

      if (isRelationship === true) {
        return isSelfReferential === true || // itself
        modelName === relInfo.lhs_baseModelName || // base or non-polymorphic
        relInfo.lhs_modelNames.indexOf(modelName) !== -1; // polymorphic
      }

      return false;
    };

    /**
     @return {boolean} true iff `modelName` and `relationshipName` refer to the
     right hand side of this relationship, as opposed to the left hand side.
      @method
     */


    RelationshipPayloads.prototype._isRHS = function _isRHS(modelName, relationshipName) {
      var relInfo = this._relInfo;
      var isSelfReferential = relInfo.isSelfReferential;
      var isRelationship = relationshipName === relInfo.rhs_relationshipName;

      if (isRelationship === true) {
        return isSelfReferential === true || // itself
        modelName === relInfo.rhs_baseModelName || // base or non-polymorphic
        relInfo.rhs_modelNames.indexOf(modelName) !== -1; // polymorphic
      }

      return false;
    };

    RelationshipPayloads.prototype._flushPending = function _flushPending() {
      if (this._pendingPayloads.length === 0) {
        return;
      }

      var payloadsToBeProcessed = this._pendingPayloads.splice(0, this._pendingPayloads.length);
      for (var i = 0; i < payloadsToBeProcessed.length; ++i) {
        var modelName = payloadsToBeProcessed[i][0];
        var id = payloadsToBeProcessed[i][1];
        var relationshipName = payloadsToBeProcessed[i][2];
        var relationshipData = payloadsToBeProcessed[i][3];

        // TODO: maybe delay this allocation slightly?
        var inverseRelationshipData = {
          data: {
            id: id,
            type: modelName
          }
        };

        // start flushing this individual payload.  The logic is the same whether
        // it's for the left hand side of the relationship or the right hand side,
        // except the role of primary and inverse idToPayloads is reversed
        //
        var previousPayload = void 0;
        var payloadMap = void 0;
        var inversePayloadMap = void 0;
        var inverseIsMany = void 0;
        if (this._isLHS(modelName, relationshipName)) {
          previousPayload = this.lhs_payloads.get(modelName, id);
          payloadMap = this.lhs_payloads;
          inversePayloadMap = this.rhs_payloads;
          inverseIsMany = this._rhsRelationshipIsMany;
        } else {

          previousPayload = this.rhs_payloads.get(modelName, id);
          payloadMap = this.rhs_payloads;
          inversePayloadMap = this.lhs_payloads;
          inverseIsMany = this._lhsRelationshipIsMany;
        }

        // actually flush this individual payload
        //
        // We remove the previous inverse before populating our current one
        // because we may have multiple payloads for the same relationship, in
        // which case the last one wins.
        //
        // eg if user hasMany helicopters, and helicopter belongsTo user and we see
        //
        //  [{
        //    data: {
        //      id: 1,
        //      type: 'helicopter',
        //      relationships: {
        //        user: {
        //          id: 2,
        //          type: 'user'
        //        }
        //      }
        //    }
        //  }, {
        //    data: {
        //      id: 1,
        //      type: 'helicopter',
        //      relationships: {
        //        user: {
        //          id: 4,
        //          type: 'user'
        //        }
        //      }
        //    }
        //  }]
        //
        // Then we will initially have set user:2 as having helicopter:1, which we
        // need to remove before adding helicopter:1 to user:4
        //
        // only remove relationship information before adding if there is relationshipData.data
        // * null is considered new information "empty", and it should win
        // * undefined is NOT considered new information, we should keep original state
        // * anything else is considered new information, and it should win
        var isMatchingIdentifier = this._isMatchingIdentifier(relationshipData && relationshipData.data, previousPayload && previousPayload.data);

        if (relationshipData.data !== undefined) {
          if (!isMatchingIdentifier) {
            this._removeInverse(id, previousPayload, inversePayloadMap);
          }
        }

        mergeForwardPayload(previousPayload, relationshipData);
        payloadMap.set(modelName, id, relationshipData);

        if (!isMatchingIdentifier) {
          this._populateInverse(relationshipData, inverseRelationshipData, inversePayloadMap, inverseIsMany);
        }
      }
    };

    RelationshipPayloads.prototype._isMatchingIdentifier = function _isMatchingIdentifier(a, b) {
      return a && b && a.type === b.type && a.id === b.id && !Array.isArray(a) && !Array.isArray(b);
    };

    /**
     Populate the inverse relationship for `relationshipData`.
      If `relationshipData` is an array (eg because the relationship is hasMany)
     this means populate each inverse, otherwise populate only the single
     inverse.
      @private
     @method
     */


    RelationshipPayloads.prototype._populateInverse = function _populateInverse(relationshipData, inversePayload, inversePayloadMap, inverseIsMany) {
      if (!relationshipData.data) {
        // This id doesn't have an inverse, eg a belongsTo with a payload
        // { data: null }, so there's nothing to populate
        return;
      }

      if (Array.isArray(relationshipData.data)) {
        for (var i = 0; i < relationshipData.data.length; ++i) {
          var resourceIdentifier = relationshipData.data[i];
          this._addToInverse(inversePayload, resourceIdentifier, inversePayloadMap, inverseIsMany);
        }
      } else {
        var _resourceIdentifier = relationshipData.data;
        this._addToInverse(inversePayload, _resourceIdentifier, inversePayloadMap, inverseIsMany);
      }
    };

    /**
     Actually add `inversePayload` to `inverseIdToPayloads`.  This is part of
     `_populateInverse` after we've normalized the case of `relationshipData`
     being either an array or a pojo.
      We still have to handle the case that the *inverse* relationship payload may
     be an array or pojo.
      @private
     @method
     */


    RelationshipPayloads.prototype._addToInverse = function _addToInverse(inversePayload, resourceIdentifier, inversePayloadMap, inverseIsMany) {
      var relInfo = this._relInfo;
      var inverseData = inversePayload.data;

      if (relInfo.isReflexive && inverseData && inverseData.id === resourceIdentifier.id) {
        // eg <user:1>.friends = [{ id: 1, type: 'user' }]
        return;
      }

      var existingPayload = inversePayloadMap.get(resourceIdentifier.type, resourceIdentifier.id);

      if (existingPayload) {
        // There already is an inverse, either add or overwrite depending on
        // whether the inverse is a many relationship or not
        //
        if (inverseIsMany) {
          var existingData = existingPayload.data;

          // in the case of a hasMany
          // we do not want create a `data` array where there was none before
          // if we also have links, which this would indicate
          if (existingData) {
            existingData.push(inversePayload.data);
          } else {
            existingPayload._partialData = existingPayload._partialData || [];
            existingPayload._partialData.push(inversePayload.data);
          }
        } else {
          mergeForwardPayload(existingPayload, inversePayload);
          inversePayloadMap.set(resourceIdentifier.type, resourceIdentifier.id, inversePayload);
        }
      } else {
        // first time we're populating the inverse side
        //
        if (inverseIsMany) {
          inversePayloadMap.set(resourceIdentifier.type, resourceIdentifier.id, {
            _partialData: [inversePayload.data]
          });
        } else {
          inversePayloadMap.set(resourceIdentifier.type, resourceIdentifier.id, inversePayload);
        }
      }
    };

    /**
     Remove the relationship in `previousPayload` from its inverse(s), because
     this relationship payload has just been updated (eg because the same
     relationship had multiple payloads pushed before the relationship was
     initialized).
      @method
     */
    RelationshipPayloads.prototype._removeInverse = function _removeInverse(id, previousPayload, inversePayloadMap) {
      var data = previousPayload && previousPayload.data;
      var partialData = previousPayload && previousPayload._partialData;
      var maybeData = data || partialData;

      if (!maybeData) {
        // either this is the first time we've seen a payload for this id, or its
        // previous payload indicated that it had no inverse, eg a belongsTo
        // relationship with payload { data: null }
        //
        // In either case there's nothing that needs to be removed from the
        // inverse map of payloads
        return;
      }

      if (Array.isArray(maybeData)) {
        // TODO: diff rather than removeall addall?
        for (var i = 0; i < maybeData.length; ++i) {
          var resourceIdentifier = maybeData[i];
          this._removeFromInverse(id, resourceIdentifier, inversePayloadMap);
        }
      } else {
        this._removeFromInverse(id, data, inversePayloadMap);
      }
    };

    /**
     Remove `id` from its inverse record with id `inverseId`.  If the inverse
     relationship is a belongsTo, this means just setting it to null, if the
     inverse relationship is a hasMany, then remove that id from its array of ids.
      @method
     */


    RelationshipPayloads.prototype._removeFromInverse = function _removeFromInverse(id, resourceIdentifier, inversePayloads) {
      var inversePayload = inversePayloads.get(resourceIdentifier.type, resourceIdentifier.id);
      var data = inversePayload && inversePayload.data;
      var partialData = inversePayload && inversePayload._partialData;

      if (!data && !partialData) {
        return;
      }

      if (Array.isArray(data)) {
        inversePayload.data = data.filter(function (x) {
          return x.id !== id;
        });
      } else if (Array.isArray(partialData)) {
        inversePayload._partialData = partialData.filter(function (x) {
          return x.id !== id;
        });
      } else {
        // this merges forward links and meta
        inversePayload.data = null;
      }
    };

    _createClass$9(RelationshipPayloads, [{
      key: '_lhsRelationshipIsMany',
      get: function get() {
        var meta = this._relInfo.lhs_relationshipMeta;
        return meta !== null && meta.kind === 'hasMany';
      }
    }, {
      key: '_rhsRelationshipIsMany',
      get: function get() {
        var meta = this._relInfo.rhs_relationshipMeta;
        return meta !== null && meta.kind === 'hasMany';
      }
    }]);

    return RelationshipPayloads;
  }();

  /**
    Manages relationship payloads for a given store, for uninitialized
    relationships.  Acts as a single source of truth (of payloads) for both sides
    of an uninitialized relationship so they can agree on the most up-to-date
    payload received without needing too much eager processing when those payloads
    are pushed into the store.

    This minimizes the work spent on relationships that are never initialized.

    Once relationships are initialized, their state is managed in a relationship
    state object (eg BelongsToRelationship or ManyRelationship).


    @example

      let relationshipPayloadsManager = new RelationshipPayloadsManager(store);

      const User = DS.Model.extend({
        hobbies: DS.hasMany('hobby')
      });

      const Hobby = DS.Model.extend({
        user: DS.belongsTo('user')
      });

      let userPayload = {
        data: {
          id: 1,
          type: 'user',
          relationships: {
            hobbies: {
              data: [{
                id: 2,
                type: 'hobby'
              }]
            }
          }
        },
      };
      relationshipPayloadsManager.push('user', 1, userPayload.data.relationships);

      relationshipPayloadsManager.get('hobby', 2, 'user') === {
        {
          data: {
            id: 1,
            type: 'user'
          }
        }
      }

    @private
    @class RelationshipPayloadsManager
  */

  var RelationshipPayloadsManager = function () {
    function RelationshipPayloadsManager(store) {
      this._store = store;
      // cache of `RelationshipPayload`s
      this._cache = Object.create(null);
      this._inverseLookupCache = new TypeCache();
    }

    /**
      Find the payload for the given relationship of the given model.
       Returns the payload for the given relationship, whether raw or computed from
      the payload of the inverse relationship.
       @example
         relationshipPayloadsManager.get('hobby', 2, 'user') === {
          {
            data: {
              id: 1,
              type: 'user'
            }
          }
        }
       @method
    */


    RelationshipPayloadsManager.prototype.get = function get(modelName, id, relationshipName) {
      var relationshipPayloads = this._getRelationshipPayloads(modelName, relationshipName, false);
      return relationshipPayloads && relationshipPayloads.get(modelName, id, relationshipName);
    };

    /**
      Push a model's relationships payload into this cache.
       @example
         let userPayload = {
          data: {
            id: 1,
            type: 'user',
            relationships: {
              hobbies: {
                data: [{
                  id: 2,
                  type: 'hobby'
                }]
              }
            }
          },
        };
        relationshipPayloadsManager.push('user', 1, userPayload.data.relationships);
       @method
    */


    RelationshipPayloadsManager.prototype.push = function push(modelName, id, relationshipsData) {
      var _this = this;

      if (!relationshipsData) {
        return;
      }

      Object.keys(relationshipsData).forEach(function (key) {
        var relationshipPayloads = _this._getRelationshipPayloads(modelName, key, true);
        if (relationshipPayloads) {
          relationshipPayloads.push(modelName, id, key, relationshipsData[key]);
        }
      });
    };

    /**
      Unload a model's relationships payload.
       @method
    */


    RelationshipPayloadsManager.prototype.unload = function unload(modelName, id) {
      var _this2 = this;

      var modelClass = this._store.modelFor(modelName);
      var relationshipsByName = Ember.get(modelClass, 'relationshipsByName');
      relationshipsByName.forEach(function (_, relationshipName) {
        var relationshipPayloads = _this2._getRelationshipPayloads(modelName, relationshipName, false);
        if (relationshipPayloads) {
          relationshipPayloads.unload(modelName, id, relationshipName);
        }
      });
    };

    /**
      Find the RelationshipPayloads object for the given relationship.  The same
      RelationshipPayloads object is returned for either side of a relationship.
       @example
         const User = DS.Model.extend({
          hobbies: DS.hasMany('hobby')
        });
         const Hobby = DS.Model.extend({
          user: DS.belongsTo('user')
        });
         relationshipPayloads.get('user', 'hobbies') === relationshipPayloads.get('hobby', 'user');
       The signature has a somewhat large arity to avoid extra work, such as
        a)  string manipulation & allocation with `modelName` and
           `relationshipName`
        b)  repeatedly getting `relationshipsByName` via `Ember.get`
        @private
      @method
    */


    RelationshipPayloadsManager.prototype._getRelationshipPayloads = function _getRelationshipPayloads(modelName, relationshipName, init) {
      var relInfo = this.getRelationshipInfo(modelName, relationshipName);

      if (relInfo === null) {
        return;
      }

      var cache = this._cache[relInfo.lhs_key];

      if (!cache && init) {
        return this._initializeRelationshipPayloads(relInfo);
      }

      return cache;
    };

    RelationshipPayloadsManager.prototype.getRelationshipInfo = function getRelationshipInfo(modelName, relationshipName) {
      var inverseCache = this._inverseLookupCache;
      var store = this._store;
      var cached = inverseCache.get(modelName, relationshipName);

      // CASE: We have a cached resolution (null if no relationship exists)
      if (cached !== undefined) {
        return cached;
      }

      var modelClass = store.modelFor(modelName);
      var relationshipsByName = Ember.get(modelClass, 'relationshipsByName');

      // CASE: We don't have a relationship at all
      if (!relationshipsByName.has(relationshipName)) {
        inverseCache.set(modelName, relationshipName, null);
        return null;
      }

      var relationshipMeta = relationshipsByName.get(relationshipName);
      var inverseMeta = void 0;

      // CASE: Inverse is explicitly null
      if (relationshipMeta.options && relationshipMeta.options.inverse === null) {
        inverseMeta = null;
      } else {
        inverseMeta = modelClass.inverseFor(relationshipName, store);
      }

      var selfIsPolymorphic = relationshipMeta.options !== undefined && relationshipMeta.options.polymorphic === true;
      var inverseBaseModelName = relationshipMeta.type;

      // CASE: We have no inverse
      if (!inverseMeta) {
        var _info = {
          lhs_key: modelName + ':' + relationshipName,
          lhs_modelNames: [modelName],
          lhs_baseModelName: modelName,
          lhs_relationshipName: relationshipName,
          lhs_relationshipMeta: relationshipMeta,
          lhs_isPolymorphic: selfIsPolymorphic,
          rhs_key: '',
          rhs_modelNames: [],
          rhs_baseModelName: inverseBaseModelName,
          rhs_relationshipName: '',
          rhs_relationshipMeta: null,
          rhs_isPolymorphic: false,
          hasInverse: false,
          isSelfReferential: false, // modelName === inverseBaseModelName,
          isReflexive: false
        };

        inverseCache.set(modelName, relationshipName, _info);

        return _info;
      }

      // CASE: We do have an inverse

      var inverseRelationshipName = inverseMeta.name;
      var inverseRelationshipMeta = Ember.get(inverseMeta.type, 'relationshipsByName').get(inverseRelationshipName);
      var baseModelName = inverseRelationshipMeta.type;
      var isSelfReferential = baseModelName === inverseBaseModelName;

      // TODO we want to assert this but this breaks all of our shoddily written tests
      /*
      if (DEBUG) {
        let inverseDoubleCheck = inverseMeta.type.inverseFor(inverseRelationshipName, store);
         assert(`The ${inverseBaseModelName}:${inverseRelationshipName} relationship declares 'inverse: null', but it was resolved as the inverse for ${baseModelName}:${relationshipName}.`, inverseDoubleCheck);
      }
      */

      // CASE: We may have already discovered the inverse for the baseModelName
      // CASE: We have already discovered the inverse
      cached = inverseCache.get(baseModelName, relationshipName) || inverseCache.get(inverseBaseModelName, inverseRelationshipName);
      if (cached) {


        var isLHS = cached.lhs_baseModelName === baseModelName;
        var modelNames = isLHS ? cached.lhs_modelNames : cached.rhs_modelNames;
        // make this lookup easier in the future by caching the key
        modelNames.push(modelName);
        inverseCache.set(modelName, relationshipName, cached);

        return cached;
      }

      var info = {
        lhs_key: baseModelName + ':' + relationshipName,
        lhs_modelNames: [modelName],
        lhs_baseModelName: baseModelName,
        lhs_relationshipName: relationshipName,
        lhs_relationshipMeta: relationshipMeta,
        lhs_isPolymorphic: selfIsPolymorphic,
        rhs_key: inverseBaseModelName + ':' + inverseRelationshipName,
        rhs_modelNames: [],
        rhs_baseModelName: inverseBaseModelName,
        rhs_relationshipName: inverseRelationshipName,
        rhs_relationshipMeta: inverseRelationshipMeta,
        rhs_isPolymorphic: inverseRelationshipMeta.options !== undefined && inverseRelationshipMeta.options.polymorphic === true,
        hasInverse: true,
        isSelfReferential: isSelfReferential,
        isReflexive: isSelfReferential && relationshipName === inverseRelationshipName
      };

      // Create entries for the baseModelName as well as modelName to speed up
      //  inverse lookups
      inverseCache.set(baseModelName, relationshipName, info);
      inverseCache.set(modelName, relationshipName, info);

      // Greedily populate the inverse
      inverseCache.set(inverseBaseModelName, inverseRelationshipName, info);

      return info;
    };

    /**
      Create the `RelationshipsPayload` for the relationship `modelName`, `relationshipName`, and its inverse.
       @private
      @method
    */


    RelationshipPayloadsManager.prototype._initializeRelationshipPayloads = function _initializeRelationshipPayloads(relInfo) {
      var lhsKey = relInfo.lhs_key;
      var rhsKey = relInfo.rhs_key;
      var existingPayloads = this._cache[lhsKey];

      if (relInfo.hasInverse === true && relInfo.rhs_isPolymorphic === true) {
        existingPayloads = this._cache[rhsKey];

        if (existingPayloads !== undefined) {
          this._cache[lhsKey] = existingPayloads;
          return existingPayloads;
        }
      }

      // populate the cache for both sides of the relationship, as they both use
      // the same `RelationshipPayloads`.
      //
      // This works out better than creating a single common key, because to
      // compute that key we would need to do work to look up the inverse
      //
      var cache = this._cache[lhsKey] = new RelationshipPayloads(relInfo);

      if (relInfo.hasInverse === true) {
        this._cache[rhsKey] = cache;
      }

      return cache;
    };

    return RelationshipPayloadsManager;
  }();

  function _find(adapter, store, modelClass, id, internalModel, options) {
    var snapshot = internalModel.createSnapshot(options);
    var modelName = internalModel.modelName;

    var promise = Ember.RSVP.Promise.resolve().then(function () {
      return adapter.findRecord(store, modelClass, id, snapshot);
    });
    var label = 'DS: Handle Adapter#findRecord of \'' + modelName + '\' with id: \'' + id + '\'';

    promise = guardDestroyedStore(promise, store, label);

    return promise.then(function (adapterPayload) {

      var serializer = serializerForAdapter(store, adapter, modelName);
      var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, id, 'findRecord');


      return store._push(payload);
    }, function (error) {
      internalModel.notFound();
      if (internalModel.isEmpty()) {
        internalModel.unloadRecord();
      }

      throw error;
    }, 'DS: Extract payload of \'' + modelName + '\'');
  }

  function _findMany(adapter, store, modelName, ids, internalModels) {
    var snapshots = Ember.A(internalModels).invoke('createSnapshot');
    var modelClass = store.modelFor(modelName); // `adapter.findMany` gets the modelClass still
    var promise = adapter.findMany(store, modelClass, ids, snapshots);
    var label = 'DS: Handle Adapter#findMany of \'' + modelName + '\'';

    if (promise === undefined) {
      throw new Error('adapter.findMany returned undefined, this was very likely a mistake');
    }

    promise = guardDestroyedStore(promise, store, label);

    return promise.then(function (adapterPayload) {

      var serializer = serializerForAdapter(store, adapter, modelName);
      var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'findMany');
      return store._push(payload);
    }, null, 'DS: Extract payload of ' + modelName);
  }

  function _findHasMany(adapter, store, internalModel, link, relationship) {
    var snapshot = internalModel.createSnapshot();
    var modelClass = store.modelFor(relationship.type);
    var promise = adapter.findHasMany(store, snapshot, link, relationship);
    var label = 'DS: Handle Adapter#findHasMany of \'' + internalModel.modelName + '\' : \'' + relationship.type + '\'';

    promise = guardDestroyedStore(promise, store, label);
    promise = _guard(promise, _bind(_objectIsAlive, internalModel));

    return promise.then(function (adapterPayload) {

      var serializer = serializerForAdapter(store, adapter, relationship.type);
      var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'findHasMany');
      var internalModelArray = store._push(payload);

      internalModelArray.meta = payload.meta;
      return internalModelArray;
    }, null, 'DS: Extract payload of \'' + internalModel.modelName + '\' : hasMany \'' + relationship.type + '\'');
  }

  function _findBelongsTo(adapter, store, internalModel, link, relationship) {
    var snapshot = internalModel.createSnapshot();
    var modelClass = store.modelFor(relationship.type);
    var promise = adapter.findBelongsTo(store, snapshot, link, relationship);
    var label = 'DS: Handle Adapter#findBelongsTo of ' + internalModel.modelName + ' : ' + relationship.type;

    promise = guardDestroyedStore(promise, store, label);
    promise = _guard(promise, _bind(_objectIsAlive, internalModel));

    return promise.then(function (adapterPayload) {
      var serializer = serializerForAdapter(store, adapter, relationship.type);
      var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'findBelongsTo');

      if (!payload.data) {
        return null;
      }

      return store._push(payload);
    }, null, 'DS: Extract payload of ' + internalModel.modelName + ' : ' + relationship.type);
  }

  function _findAll(adapter, store, modelName, sinceToken, options) {
    var modelClass = store.modelFor(modelName); // adapter.findAll depends on the class
    var recordArray = store.peekAll(modelName);
    var snapshotArray = recordArray._createSnapshot(options);
    var promise = Ember.RSVP.Promise.resolve().then(function () {
      return adapter.findAll(store, modelClass, sinceToken, snapshotArray);
    });
    var label = 'DS: Handle Adapter#findAll of ' + modelClass;

    promise = guardDestroyedStore(promise, store, label);

    return promise.then(function (adapterPayload) {

      var serializer = serializerForAdapter(store, adapter, modelName);
      var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'findAll');

      store._push(payload);
      store._didUpdateAll(modelName);

      return recordArray;
    }, null, 'DS: Extract payload of findAll ${modelName}');
  }

  function _query(adapter, store, modelName, query, recordArray, options) {
    var modelClass = store.modelFor(modelName); // adapter.query needs the class

    var promise = void 0;
    var createRecordArray = adapter.query.length > 3 || adapter.query.wrappedFunction && adapter.query.wrappedFunction.length > 3;

    if (createRecordArray) {
      recordArray = recordArray || store.recordArrayManager.createAdapterPopulatedRecordArray(modelName, query);
      promise = Ember.RSVP.Promise.resolve().then(function () {
        return adapter.query(store, modelClass, query, recordArray, options);
      });
    } else {
      promise = Ember.RSVP.Promise.resolve().then(function () {
        return adapter.query(store, modelClass, query);
      });
    }

    var label = 'DS: Handle Adapter#query of ' + modelName;
    promise = guardDestroyedStore(promise, store, label);

    return promise.then(function (adapterPayload) {
      var serializer = serializerForAdapter(store, adapter, modelName);

      var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'query');

      var internalModels = store._push(payload);

      if (recordArray) {
        recordArray._setInternalModels(internalModels, payload);
      } else {
        recordArray = store.recordArrayManager.createAdapterPopulatedRecordArray(modelName, query, internalModels, payload);
      }

      return recordArray;
    }, null, 'DS: Extract payload of query ' + modelName);
  }

  function _queryRecord(adapter, store, modelName, query, options) {
    var modelClass = store.modelFor(modelName); // adapter.queryRecord needs the class
    var promise = Ember.RSVP.Promise.resolve().then(function () {
      return adapter.queryRecord(store, modelClass, query, options);
    });

    var label = 'DS: Handle Adapter#queryRecord of ' + modelName;
    promise = guardDestroyedStore(promise, store, label);

    return promise.then(function (adapterPayload) {
      var serializer = serializerForAdapter(store, adapter, modelName);
      var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'queryRecord');


      return store._push(payload);
    }, null, 'DS: Extract payload of queryRecord ' + modelName);
  }

  // Used by the store to normalize IDs entering the store.  Despite the fact
  // that developers may provide IDs as numbers (e.g., `store.findRecord('person', 1)`),
  // it is important that internally we use strings, since IDs may be serialized
  // and lose type information.  For example, Ember's router may put a record's
  // ID into the URL, and if we later try to deserialize that URL and find the
  // corresponding record, we will not know if it is a string or a number.
  function coerceId(id) {
    if (id === null || id === undefined || id === '') {
      return null;
    }
    if (typeof id === 'string') {
      return id;
    }
    return '' + id;
  }

  function cloneNull(source) {
    var clone = Object.create(null);
    for (var key in source) {
      clone[key] = source[key];
    }
    return clone;
  }

  var _createClass$10 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  /**
    @module ember-data
  */

  /**
    @class SnapshotRecordArray
    @namespace DS
    @private
    @constructor
    @param {Array} snapshots An array of snapshots
    @param {Object} meta
  */
  var SnapshotRecordArray = function () {
    function SnapshotRecordArray(recordArray, meta) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      /**
        An array of snapshots
        @private
        @property _snapshots
        @type {Array}
      */
      this._snapshots = null;

      /**
        An array of records
        @private
        @property _recordArray
        @type {Array}
      */
      this._recordArray = recordArray;

      /**
        Number of records in the array
         Example
         ```app/adapters/post.js
        import DS from 'ember-data'
         export default DS.JSONAPIAdapter.extend({
          shouldReloadAll(store, snapshotRecordArray) {
            return !snapshotRecordArray.length;
          },
        });
        ```
         @property length
        @type {Number}
      */
      this.length = recordArray.get('length');

      this._type = null;

      /**
        Meta objects for the record array.
         Example
         ```app/adapters/post.js
        import DS from 'ember-data'
         export default DS.JSONAPIAdapter.extend({
          shouldReloadAll(store, snapshotRecordArray) {
            var lastRequestTime = snapshotRecordArray.meta.lastRequestTime;
            var twentyMinutes = 20 * 60 * 1000;
            return Date.now() > lastRequestTime + twentyMinutes;
          },
        });
        ```
         @property meta
        @type {Object}
      */
      this.meta = meta;

      /**
        A hash of adapter options passed into the store method for this request.
         Example
         ```app/adapters/post.js
        import MyCustomAdapter from './custom-adapter';
         export default MyCustomAdapter.extend({
          findAll(store, type, sinceToken, snapshotRecordArray) {
            if (snapshotRecordArray.adapterOptions.subscribe) {
              // ...
            }
            // ...
          }
        });
        ```
         @property adapterOptions
        @type {Object}
      */
      this.adapterOptions = options.adapterOptions;

      /**
        The relationships to include for this request.
         Example
         ```app/adapters/application.js
        import DS from 'ember-data';
         export default DS.Adapter.extend({
          findAll(store, type, snapshotRecordArray) {
            var url = `/${type.modelName}?include=${encodeURIComponent(snapshotRecordArray.include)}`;
             return fetch(url).then((response) => response.json())
          }
        });
         @property include
        @type {String|Array}
      */
      this.include = options.include;
    }

    /**
      The type of the underlying records for the snapshots in the array, as a DS.Model
      @property type
      @type {DS.Model}
    */


    /**
      Get snapshots of the underlying record array
       Example
       ```app/adapters/post.js
      import DS from 'ember-data'
       export default DS.JSONAPIAdapter.extend({
        shouldReloadAll(store, snapshotArray) {
          var snapshots = snapshotArray.snapshots();
           return snapshots.any(function(ticketSnapshot) {
            var timeDiff = moment().diff(ticketSnapshot.attr('lastAccessedAt'), 'minutes');
            if (timeDiff > 20) {
              return true;
            } else {
              return false;
            }
          });
        }
      });
      ```
       @method snapshots
      @return {Array} Array of snapshots
    */
    SnapshotRecordArray.prototype.snapshots = function snapshots() {
      if (this._snapshots !== null) {
        return this._snapshots;
      }

      this._snapshots = this._recordArray._takeSnapshot();

      return this._snapshots;
    };

    _createClass$10(SnapshotRecordArray, [{
      key: 'type',
      get: function get() {
        return this._type || (this._type = this._recordArray.get('type'));
      }
    }]);

    return SnapshotRecordArray;
  }();

  /**
    @module ember-data
  */

  /**
    A record array is an array that contains records of a certain modelName. The record
    array materializes records as needed when they are retrieved for the first
    time. You should not create record arrays yourself. Instead, an instance of
    `DS.RecordArray` or its subclasses will be returned by your application's store
    in response to queries.

    @class RecordArray
    @namespace DS
    @extends Ember.ArrayProxy
    @uses Ember.Evented
  */

  var RecordArray = Ember.ArrayProxy.extend(Ember.Evented, {
    init: function init() {
      this._super.apply(this, arguments);

      /**
        The array of client ids backing the record array. When a
        record is requested from the record array, the record
        for the client id at the same index is materialized, if
        necessary, by the store.
         @property content
        @private
        @type Ember.Array
        */
      this.set('content', this.content || null);

      /**
      The flag to signal a `RecordArray` is finished loading data.
       Example
       ```javascript
      var people = store.peekAll('person');
      people.get('isLoaded'); // true
      ```
       @property isLoaded
      @type Boolean
      */
      this.isLoaded = this.isLoaded || false;
      /**
      The flag to signal a `RecordArray` is currently loading data.
       Example
       ```javascript
      var people = store.peekAll('person');
      people.get('isUpdating'); // false
      people.update();
      people.get('isUpdating'); // true
      ```
       @property isUpdating
      @type Boolean
      */
      this.isUpdating = false;

      /**
      The store that created this record array.
       @property store
      @private
      @type DS.Store
      */
      this.store = this.store || null;
      this._updatingPromise = null;
    },
    replace: function replace() {
      throw new Error('The result of a server query (for all ' + this.modelName + ' types) is immutable. To modify contents, use toArray()');
    },


    /**
     The modelClass represented by this record array.
      @property type
     @type DS.Model
     */
    type: Ember.computed('modelName', function () {
      if (!this.modelName) {
        return null;
      }
      return this.store.modelFor(this.modelName);
    }).readOnly(),

    /**
      Retrieves an object from the content by index.
       @method objectAtContent
      @private
      @param {Number} index
      @return {DS.Model} record
    */
    objectAtContent: function objectAtContent(index) {
      var internalModel = Ember.get(this, 'content').objectAt(index);
      return internalModel && internalModel.getRecord();
    },


    /**
      Used to get the latest version of all of the records in this array
      from the adapter.
       Example
       ```javascript
      var people = store.peekAll('person');
      people.get('isUpdating'); // false
       people.update().then(function() {
        people.get('isUpdating'); // false
      });
       people.get('isUpdating'); // true
      ```
       @method update
    */
    update: function update() {
      var _this = this;

      if (Ember.get(this, 'isUpdating')) {
        return this._updatingPromise;
      }

      this.set('isUpdating', true);

      var updatingPromise = this._update().finally(function () {
        _this._updatingPromise = null;
        if (_this.get('isDestroying') || _this.get('isDestroyed')) {
          return;
        }
        _this.set('isUpdating', false);
      });

      this._updatingPromise = updatingPromise;

      return updatingPromise;
    },


    /*
      Update this RecordArray and return a promise which resolves once the update
      is finished.
     */
    _update: function _update() {
      return this.store.findAll(this.modelName, { reload: true });
    },


    /**
      Adds an internal model to the `RecordArray` without duplicates
       @method _pushInternalModels
      @private
      @param {InternalModel} internalModel
    */
    _pushInternalModels: function _pushInternalModels(internalModels) {
      // pushObjects because the internalModels._recordArrays set was already
      // consulted for inclusion, so addObject and its on .contains call is not
      // required.
      Ember.get(this, 'content').pushObjects(internalModels);
    },


    /**
      Removes an internalModel to the `RecordArray`.
       @method removeInternalModel
      @private
      @param {InternalModel} internalModel
    */
    _removeInternalModels: function _removeInternalModels(internalModels) {
      Ember.get(this, 'content').removeObjects(internalModels);
    },


    /**
      Saves all of the records in the `RecordArray`.
       Example
       ```javascript
      var messages = store.peekAll('message');
      messages.forEach(function(message) {
        message.set('hasBeenSeen', true);
      });
      messages.save();
      ```
       @method save
      @return {DS.PromiseArray} promise
    */
    save: function save() {
      var _this2 = this;

      var promiseLabel = 'DS: RecordArray#save ' + this.modelName;
      var promise = Ember.RSVP.Promise.all(this.invoke('save'), promiseLabel).then(function () {
        return _this2;
      }, null, 'DS: RecordArray#save return RecordArray');

      return PromiseArray.create({ promise: promise });
    },
    _dissociateFromOwnRecords: function _dissociateFromOwnRecords() {
      var _this3 = this;

      this.get('content').forEach(function (internalModel) {
        var recordArrays = internalModel.__recordArrays;

        if (recordArrays) {
          recordArrays.delete(_this3);
        }
      });
    },


    /**
      @method _unregisterFromManager
      @private
    */
    _unregisterFromManager: function _unregisterFromManager() {
      this.manager.unregisterRecordArray(this);
    },
    willDestroy: function willDestroy() {
      this._unregisterFromManager();
      this._dissociateFromOwnRecords();
      // TODO: we should not do work during destroy:
      //   * when objects are destroyed, they should simply be left to do
      //   * if logic errors do to this, that logic needs to be more careful during
      //    teardown (ember provides isDestroying/isDestroyed) for this reason
      //   * the exception being: if an dominator has a reference to this object,
      //     and must be informed to release e.g. e.g. removing itself from th
      //     recordArrayMananger
      Ember.set(this, 'content', null);
      Ember.set(this, 'length', 0);
      this._super.apply(this, arguments);
    },


    /*
      @method _createSnapshot
      @private
    */
    _createSnapshot: function _createSnapshot(options) {
      // this is private for users, but public for ember-data internals
      return new SnapshotRecordArray(this, this.get('meta'), options);
    },


    /*
      @method _takeSnapshot
      @private
    */
    _takeSnapshot: function _takeSnapshot() {
      return Ember.get(this, 'content').map(function (internalModel) {
        return internalModel.createSnapshot();
      });
    }
  });

  /**
    Represents an ordered list of records whose order and membership is
    determined by the adapter. For example, a query sent to the adapter
    may trigger a search on the server, whose results would be loaded
    into an instance of the `AdapterPopulatedRecordArray`.

    ---

    If you want to update the array and get the latest records from the
    adapter, you can invoke [`update()`](#method_update):

    Example

    ```javascript
    // GET /users?isAdmin=true
    var admins = store.query('user', { isAdmin: true });

    admins.then(function() {
      console.log(admins.get("length")); // 42
    });

    // somewhere later in the app code, when new admins have been created
    // in the meantime
    //
    // GET /users?isAdmin=true
    admins.update().then(function() {
      admins.get('isUpdating'); // false
      console.log(admins.get("length")); // 123
    });

    admins.get('isUpdating'); // true
    ```

    @class AdapterPopulatedRecordArray
    @namespace DS
    @extends DS.RecordArray
  */
  var AdapterPopulatedRecordArray = RecordArray.extend({
    init: function init() {
      // yes we are touching `this` before super, but ArrayProxy has a bug that requires this.
      this.set('content', this.get('content') || Ember.A());

      this._super.apply(this, arguments);
      this.query = this.query || null;
      this.links = this.links || null;
    },
    replace: function replace() {
      throw new Error('The result of a server query (on ' + this.modelName + ') is immutable.');
    },
    _update: function _update() {
      var store = Ember.get(this, 'store');
      var query = Ember.get(this, 'query');

      return store._query(this.modelName, query, this);
    },


    /**
      @method _setInternalModels
      @param {Array} internalModels
      @param {Object} payload normalized payload
      @private
    */
    _setInternalModels: function _setInternalModels(internalModels, payload) {

      // TODO: initial load should not cause change events at all, only
      // subsequent. This requires changing the public api of adapter.query, but
      // hopefully we can do that soon.
      this.get('content').setObjects(internalModels);

      this.setProperties({
        isLoaded: true,
        isUpdating: false,
        meta: cloneNull(payload.meta),
        links: cloneNull(payload.links)
      });

      this.manager._associateWithRecordArray(internalModels, this);

      // TODO: should triggering didLoad event be the last action of the runLoop?
      Ember.run.once(this, 'trigger', 'didLoad');
    }
  });

  /**
    @module ember-data
  */

  var emberRun = Ember.run.backburner;

  /**
    @class RecordArrayManager
    @namespace DS
    @private
  */
  var RecordArrayManager = function () {
    function RecordArrayManager(options) {
      this.store = options.store;
      this.isDestroying = false;
      this.isDestroyed = false;
      this._liveRecordArrays = Object.create(null);
      this._pending = Object.create(null);
      this._adapterPopulatedRecordArrays = [];
    }

    RecordArrayManager.prototype.recordDidChange = function recordDidChange(internalModel) {
      // TODO: change name
      // TODO: track that it was also a change
      this.internalModelDidChange(internalModel);
    };

    RecordArrayManager.prototype.recordWasLoaded = function recordWasLoaded(internalModel) {
      // TODO: change name
      // TODO: track that it was also that it was first loaded
      this.internalModelDidChange(internalModel);
    };

    RecordArrayManager.prototype.internalModelDidChange = function internalModelDidChange(internalModel) {

      var modelName = internalModel.modelName;

      if (internalModel._pendingRecordArrayManagerFlush) {
        return;
      }

      internalModel._pendingRecordArrayManagerFlush = true;

      var pending = this._pending;
      var models = pending[modelName] = pending[modelName] || [];
      if (models.push(internalModel) !== 1) {
        return;
      }

      emberRun.schedule('actions', this, this._flush);
    };

    RecordArrayManager.prototype._flushPendingInternalModelsForModelName = function _flushPendingInternalModelsForModelName(modelName, internalModels) {
      var modelsToRemove = [];

      for (var j = 0; j < internalModels.length; j++) {
        var internalModel = internalModels[j];
        // mark internalModels, so they can once again be processed by the
        // recordArrayManager
        internalModel._pendingRecordArrayManagerFlush = false;
        // build up a set of models to ensure we have purged correctly;
        if (internalModel.isHiddenFromRecordArrays()) {
          modelsToRemove.push(internalModel);
        }
      }

      var array = this._liveRecordArrays[modelName];
      if (array) {
        // TODO: skip if it only changed
        // process liveRecordArrays
        this.updateLiveRecordArray(array, internalModels);
      }

      // process adapterPopulatedRecordArrays
      if (modelsToRemove.length > 0) {
        removeFromAdapterPopulatedRecordArrays(modelsToRemove);
      }
    };

    RecordArrayManager.prototype._flush = function _flush() {

      var pending = this._pending;
      this._pending = Object.create(null);

      for (var modelName in pending) {
        this._flushPendingInternalModelsForModelName(modelName, pending[modelName]);
      }
    };

    RecordArrayManager.prototype.updateLiveRecordArray = function updateLiveRecordArray(array, internalModels) {
      return _updateLiveRecordArray(array, internalModels);
    };

    RecordArrayManager.prototype._syncLiveRecordArray = function _syncLiveRecordArray(array, modelName) {

      var pending = this._pending[modelName];
      var hasPendingChanges = Array.isArray(pending);
      var hasNoPotentialDeletions = !hasPendingChanges || pending.length === 0;
      var map = this.store._internalModelsFor(modelName);
      var hasNoInsertionsOrRemovals = Ember.get(map, 'length') === Ember.get(array, 'length');

      /*
        Ideally the recordArrayManager has knowledge of the changes to be applied to
        liveRecordArrays, and is capable of strategically flushing those changes and applying
        small diffs if desired.  However, until we've refactored recordArrayManager, this dirty
        check prevents us from unnecessarily wiping out live record arrays returned by peekAll.
        */
      if (hasNoPotentialDeletions && hasNoInsertionsOrRemovals) {
        return;
      }

      if (hasPendingChanges) {
        this._flushPendingInternalModelsForModelName(modelName, pending);
        delete pending[modelName];
      }

      var internalModels = this._visibleInternalModelsByType(modelName);
      var modelsToAdd = [];
      for (var i = 0; i < internalModels.length; i++) {
        var internalModel = internalModels[i];
        var recordArrays = internalModel._recordArrays;
        if (recordArrays.has(array) === false) {
          recordArrays.add(array);
          modelsToAdd.push(internalModel);
        }
      }

      if (modelsToAdd.length) {
        array._pushInternalModels(modelsToAdd);
      }
    };

    RecordArrayManager.prototype._didUpdateAll = function _didUpdateAll(modelName) {
      var recordArray = this._liveRecordArrays[modelName];
      if (recordArray) {
        Ember.set(recordArray, 'isUpdating', false);
      }
    };

    /**
      Get the `DS.RecordArray` for a modelName, which contains all loaded records of
      given modelName.
       @method liveRecordArrayFor
      @param {String} modelName
      @return {DS.RecordArray}
    */


    RecordArrayManager.prototype.liveRecordArrayFor = function liveRecordArrayFor(modelName) {


      var array = this._liveRecordArrays[modelName];

      if (array) {
        // if the array already exists, synchronize
        this._syncLiveRecordArray(array, modelName);
      } else {
        // if the array is being newly created merely create it with its initial
        // content already set. This prevents unneeded change events.
        var internalModels = this._visibleInternalModelsByType(modelName);
        array = this.createRecordArray(modelName, internalModels);
        this._liveRecordArrays[modelName] = array;
      }

      return array;
    };

    RecordArrayManager.prototype._visibleInternalModelsByType = function _visibleInternalModelsByType(modelName) {
      var all = this.store._internalModelsFor(modelName)._models;
      var visible = [];
      for (var i = 0; i < all.length; i++) {
        var model = all[i];
        if (model.isHiddenFromRecordArrays() === false) {
          visible.push(model);
        }
      }
      return visible;
    };

    /**
      Create a `DS.RecordArray` for a modelName.
       @method createRecordArray
      @param {String} modelName
      @param {Array} _content (optional|private)
      @return {DS.RecordArray}
    */


    RecordArrayManager.prototype.createRecordArray = function createRecordArray(modelName, content) {


      var array = RecordArray.create({
        modelName: modelName,
        content: Ember.A(content || []),
        store: this.store,
        isLoaded: true,
        manager: this
      });

      if (Array.isArray(content)) {
        associateWithRecordArray(content, array);
      }

      return array;
    };

    /**
      Create a `DS.AdapterPopulatedRecordArray` for a modelName with given query.
       @method createAdapterPopulatedRecordArray
      @param {String} modelName
      @param {Object} query
      @return {DS.AdapterPopulatedRecordArray}
    */


    RecordArrayManager.prototype.createAdapterPopulatedRecordArray = function createAdapterPopulatedRecordArray(modelName, query, internalModels, payload) {


      var array = void 0;
      if (Array.isArray(internalModels)) {
        array = AdapterPopulatedRecordArray.create({
          modelName: modelName,
          query: query,
          content: Ember.A(internalModels),
          store: this.store,
          manager: this,
          isLoaded: true,
          isUpdating: false,
          meta: cloneNull(payload.meta),
          links: cloneNull(payload.links)
        });

        associateWithRecordArray(internalModels, array);
      } else {
        array = AdapterPopulatedRecordArray.create({
          modelName: modelName,
          query: query,
          content: Ember.A(),
          store: this.store,
          manager: this
        });
      }

      this._adapterPopulatedRecordArrays.push(array);

      return array;
    };

    /**
      Unregister a RecordArray.
      So manager will not update this array.
       @method unregisterRecordArray
      @param {DS.RecordArray} array
    */


    RecordArrayManager.prototype.unregisterRecordArray = function unregisterRecordArray(array) {

      var modelName = array.modelName;

      // remove from adapter populated record array
      var removedFromAdapterPopulated = remove(this._adapterPopulatedRecordArrays, array);

      if (!removedFromAdapterPopulated) {
        var liveRecordArrayForType = this._liveRecordArrays[modelName];
        // unregister live record array
        if (liveRecordArrayForType) {
          if (array === liveRecordArrayForType) {
            delete this._liveRecordArrays[modelName];
          }
        }
      }
    };

    RecordArrayManager.prototype._associateWithRecordArray = function _associateWithRecordArray(internalModels, array) {
      associateWithRecordArray(internalModels, array);
    };

    RecordArrayManager.prototype.willDestroy = function willDestroy() {
      var _this = this;

      Object.keys(this._liveRecordArrays).forEach(function (modelName) {
        return _this._liveRecordArrays[modelName].destroy();
      });
      this._adapterPopulatedRecordArrays.forEach(destroy);
      this.isDestroyed = true;
    };

    RecordArrayManager.prototype.destroy = function destroy() {
      this.isDestroying = true;
      emberRun.schedule('actions', this, this.willDestroy);
    };

    return RecordArrayManager;
  }();


  function destroy(entry) {
    entry.destroy();
  }

  function remove(array, item) {
    var index = array.indexOf(item);

    if (index !== -1) {
      array.splice(index, 1);
      return true;
    }

    return false;
  }

  function _updateLiveRecordArray(array, internalModels) {
    var modelsToAdd = [];
    var modelsToRemove = [];

    for (var i = 0; i < internalModels.length; i++) {
      var internalModel = internalModels[i];
      var isDeleted = internalModel.isHiddenFromRecordArrays();
      var recordArrays = internalModel._recordArrays;

      if (!isDeleted && !internalModel.isEmpty()) {
        if (!recordArrays.has(array)) {
          modelsToAdd.push(internalModel);
          recordArrays.add(array);
        }
      }

      if (isDeleted) {
        modelsToRemove.push(internalModel);
        recordArrays.delete(array);
      }
    }

    if (modelsToAdd.length > 0) {
      array._pushInternalModels(modelsToAdd);
    }
    if (modelsToRemove.length > 0) {
      array._removeInternalModels(modelsToRemove);
    }

    // return whether we performed an update.
    // Necessary until 3.5 allows us to finish off ember-data-filter support.
    return (modelsToAdd.length || modelsToRemove.length) > 0;
  }

  function removeFromAdapterPopulatedRecordArrays(internalModels) {
    for (var i = 0; i < internalModels.length; i++) {
      var internalModel = internalModels[i];
      var list = internalModel._recordArrays.list;

      for (var j = 0; j < list.length; j++) {
        // TODO: group by arrays, so we can batch remove
        list[j]._removeInternalModels([internalModel]);
      }

      internalModel._recordArrays.clear();
    }
  }

  function associateWithRecordArray(internalModels, array) {
    for (var i = 0, l = internalModels.length; i < l; i++) {
      var internalModel = internalModels[i];
      internalModel._recordArrays.add(array);
    }
  }

  var backburner = new Ember._Backburner(['normalizeRelationships', 'syncRelationships', 'finished']);

  /**
    @module ember-data
  */
  var emberRun$1 = Ember.run.backburner;
  var ENV = Ember.ENV;

  //Get the materialized model from the internalModel/promise that returns
  //an internal model and return it in a promiseObject. Useful for returning
  //from find methods

  function promiseRecord(internalModelPromise, label) {
    var toReturn = internalModelPromise.then(function (internalModel) {
      return internalModel.getRecord();
    });

    return promiseObject(toReturn, label);
  }

  var Store = void 0;

  // Implementors Note:
  //
  //   The variables in this file are consistently named according to the following
  //   scheme:
  //
  //   * +id+ means an identifier managed by an external source, provided inside
  //     the data provided by that source. These are always coerced to be strings
  //     before being used internally.
  //   * +clientId+ means a transient numerical identifier generated at runtime by
  //     the data store. It is important primarily because newly created objects may
  //     not yet have an externally generated id.
  //   * +internalModel+ means a record internalModel object, which holds metadata about a
  //     record, even if it has not yet been fully materialized.
  //   * +type+ means a DS.Model.

  /**
    The store contains all of the data for records loaded from the server.
    It is also responsible for creating instances of `DS.Model` that wrap
    the individual data for a record, so that they can be bound to in your
    Handlebars templates.

    Define your application's store like this:

    ```app/services/store.js
    import DS from 'ember-data';

    export default DS.Store.extend({
    });
    ```

    Most Ember.js applications will only have a single `DS.Store` that is
    automatically created by their `Ember.Application`.

    You can retrieve models from the store in several ways. To retrieve a record
    for a specific id, use `DS.Store`'s `findRecord()` method:

    ```javascript
    store.findRecord('person', 123).then(function (person) {
    });
    ```

    By default, the store will talk to your backend using a standard
    REST mechanism. You can customize how the store talks to your
    backend by specifying a custom adapter:

    ```app/adapters/application.js
    import DS from 'ember-data';

    export default DS.Adapter.extend({
    });
    ```

    You can learn more about writing a custom adapter by reading the `DS.Adapter`
    documentation.

    ### Store createRecord() vs. push() vs. pushPayload()

    The store provides multiple ways to create new record objects. They have
    some subtle differences in their use which are detailed below:

    [createRecord](#method_createRecord) is used for creating new
    records on the client side. This will return a new record in the
    `created.uncommitted` state. In order to persist this record to the
    backend you will need to call `record.save()`.

    [push](#method_push) is used to notify Ember Data's store of new or
    updated records that exist in the backend. This will return a record
    in the `loaded.saved` state. The primary use-case for `store#push` is
    to notify Ember Data about record updates (full or partial) that happen
    outside of the normal adapter methods (for example
    [SSE](http://dev.w3.org/html5/eventsource/) or [Web
    Sockets](http://www.w3.org/TR/2009/WD-websockets-20091222/)).

    [pushPayload](#method_pushPayload) is a convenience wrapper for
    `store#push` that will deserialize payloads if the
    Serializer implements a `pushPayload` method.

    Note: When creating a new record using any of the above methods
    Ember Data will update `DS.RecordArray`s such as those returned by
    `store#peekAll()` or `store#findAll()`. This means any
    data bindings or computed properties that depend on the RecordArray
    will automatically be synced to include the new or updated record
    values.

    @class Store
    @namespace DS
    @extends Ember.Service
  */
  Store = Ember.Service.extend({
    /**
      @method init
      @private
    */
    init: function init() {

      this._super.apply(this, arguments);
      this._backburner = backburner;
      // internal bookkeeping; not observable
      this.recordArrayManager = new RecordArrayManager({ store: this });
      this._identityMap = new IdentityMap();
      this._pendingSave = [];
      this._modelFactoryCache = Object.create(null);
      this._relationshipsPayloads = new RelationshipPayloadsManager(this);

      /*
        Ember Data uses several specialized micro-queues for organizing
        and coalescing similar async work.
         These queues are currently controlled by a flush scheduled into
        ember-data's custom backburner instance.
       */
      // used for coalescing record save requests
      this._pendingSave = [];
      // used for coalescing relationship updates
      this._updatedRelationships = [];
      // used for coalescing relationship setup needs
      this._pushedInternalModels = [];
      // used for coalescing internal model updates
      this._updatedInternalModels = [];

      // used to keep track of all the find requests that need to be coalesced
      this._pendingFetch = new MapWithDefault({
        defaultValue: function defaultValue() {
          return [];
        }
      });

      this._adapterCache = Object.create(null);
      this._serializerCache = Object.create(null);
    },


    /**
      The default adapter to use to communicate to a backend server or
      other persistence layer. This will be overridden by an application
      adapter if present.
       If you want to specify `app/adapters/custom.js` as a string, do:
       ```js
      import DS from 'ember-data';
       export default DS.Store.extend({
        adapter: 'custom',
      });
      ```
       @property adapter
      @default '-json-api'
      @type {String}
    */
    adapter: '-json-api',

    /**
      This property returns the adapter, after resolving a possible
      string key.
       If the supplied `adapter` was a class, or a String property
      path resolved to a class, this property will instantiate the
      class.
       This property is cacheable, so the same instance of a specified
      adapter class should be used for the lifetime of the store.
       @property defaultAdapter
      @private
      @return DS.Adapter
    */
    defaultAdapter: Ember.computed('adapter', function () {
      var adapter = Ember.get(this, 'adapter');


      return this.adapterFor(adapter);
    }),

    // .....................
    // . CREATE NEW RECORD .
    // .....................

    /**
      Create a new record in the current store. The properties passed
      to this method are set on the newly created record.
       To create a new instance of a `Post`:
       ```js
      store.createRecord('post', {
        title: 'Rails is omakase'
      });
      ```
       To create a new instance of a `Post` that has a relationship with a `User` record:
       ```js
      let user = this.store.peekRecord('user', 1);
      store.createRecord('post', {
        title: 'Rails is omakase',
        user: user
      });
      ```
       @method createRecord
      @param {String} modelName
      @param {Object} inputProperties a hash of properties to set on the
        newly created record.
      @return {DS.Model} record
    */
    createRecord: function createRecord(modelName, inputProperties) {
      var _this2 = this;

      // This is wrapped in a `run.join` so that in test environments users do not need to manually wrap
      //   calls to `createRecord`. The run loop usage here is because we batch the joining and updating
      //   of record-arrays via ember's run loop, not our own.
      //
      //   to remove this, we would need to move to a new `async` API.

      return emberRun$1.join(function () {
        return _this2._backburner.join(function () {
          var normalizedModelName = normalizeModelName(modelName);
          var properties = Ember.assign({}, inputProperties);

          // If the passed properties do not include a primary key,
          // give the adapter an opportunity to generate one. Typically,
          // client-side ID generators will use something like uuid.js
          // to avoid conflicts.

          if (Ember.isNone(properties.id)) {
            properties.id = _this2._generateId(normalizedModelName, properties);
          }

          // Coerce ID to a string
          properties.id = coerceId(properties.id);

          var internalModel = _this2._buildInternalModel(normalizedModelName, properties.id);
          internalModel.loadedData();
          return internalModel.getRecord(properties);
        });
      });
    },


    /**
      If possible, this method asks the adapter to generate an ID for
      a newly created record.
       @method _generateId
      @private
      @param {String} modelName
      @param {Object} properties from the new record
      @return {String} if the adapter can generate one, an ID
    */
    _generateId: function _generateId(modelName, properties) {
      var adapter = this.adapterFor(modelName);

      if (adapter && adapter.generateIdForRecord) {
        return adapter.generateIdForRecord(this, modelName, properties);
      }

      return null;
    },


    // .................
    // . DELETE RECORD .
    // .................

    /**
      For symmetry, a record can be deleted via the store.
       Example
       ```javascript
      let post = store.createRecord('post', {
        title: 'Rails is omakase'
      });
       store.deleteRecord(post);
      ```
       @method deleteRecord
      @param {DS.Model} record
    */
    deleteRecord: function deleteRecord(record) {
      record.deleteRecord();
    },


    /**
      For symmetry, a record can be unloaded via the store.
      This will cause the record to be destroyed and freed up for garbage collection.
       Example
       ```javascript
      store.findRecord('post', 1).then(function(post) {
        store.unloadRecord(post);
      });
      ```
       @method unloadRecord
      @param {DS.Model} record
    */
    unloadRecord: function unloadRecord(record) {
      record.unloadRecord();
    },


    // ................
    // . FIND RECORDS .
    // ................

    /**
      @method find
      @param {String} modelName
      @param {String|Integer} id
      @param {Object} options
      @return {Promise} promise
      @private
    */
    find: function find(modelName, id, options) {


      return this.findRecord(modelName, id);
    },


    /**
      This method returns a record for a given type and id combination.
       The `findRecord` method will always resolve its promise with the same
      object for a given type and `id`.
       The `findRecord` method will always return a **promise** that will be
      resolved with the record.
       Example
       ```app/routes/post.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model(params) {
          return this.store.findRecord('post', params.post_id);
        }
      });
      ```
       If the record is not yet available, the store will ask the adapter's `find`
      method to find the necessary data. If the record is already present in the
      store, it depends on the reload behavior _when_ the returned promise
      resolves.
       ### Preloading
       You can optionally `preload` specific attributes and relationships that you know of
      by passing them via the passed `options`.
       For example, if your Ember route looks like `/posts/1/comments/2` and your API route
      for the comment also looks like `/posts/1/comments/2` if you want to fetch the comment
      without fetching the post you can pass in the post to the `findRecord` call:
       ```javascript
      store.findRecord('comment', 2, { preload: { post: 1 } });
      ```
       If you have access to the post model you can also pass the model itself:
       ```javascript
      store.findRecord('post', 1).then(function (myPostModel) {
        store.findRecord('comment', 2, { post: myPostModel });
      });
      ```
       ### Reloading
       The reload behavior is configured either via the passed `options` hash or
      the result of the adapter's `shouldReloadRecord`.
       If `{ reload: true }` is passed or `adapter.shouldReloadRecord` evaluates
      to `true`, then the returned promise resolves once the adapter returns
      data, regardless if the requested record is already in the store:
       ```js
      store.push({
        data: {
          id: 1,
          type: 'post',
          revision: 1
        }
      });
       // adapter#findRecord resolves with
      // [
      //   {
      //     id: 1,
      //     type: 'post',
      //     revision: 2
      //   }
      // ]
      store.findRecord('post', 1, { reload: true }).then(function(post) {
        post.get('revision'); // 2
      });
      ```
       If no reload is indicated via the abovementioned ways, then the promise
      immediately resolves with the cached version in the store.
       ### Background Reloading
       Optionally, if `adapter.shouldBackgroundReloadRecord` evaluates to `true`,
      then a background reload is started, which updates the records' data, once
      it is available:
       ```js
      // app/adapters/post.js
      import ApplicationAdapter from "./application";
       export default ApplicationAdapter.extend({
        shouldReloadRecord(store, snapshot) {
          return false;
        },
         shouldBackgroundReloadRecord(store, snapshot) {
          return true;
        }
      });
       // ...
       store.push({
        data: {
          id: 1,
          type: 'post',
          revision: 1
        }
      });
       let blogPost = store.findRecord('post', 1).then(function(post) {
        post.get('revision'); // 1
      });
       // later, once adapter#findRecord resolved with
      // [
      //   {
      //     id: 1,
      //     type: 'post',
      //     revision: 2
      //   }
      // ]
       blogPost.get('revision'); // 2
      ```
       If you would like to force or prevent background reloading, you can set a
      boolean value for `backgroundReload` in the options object for
      `findRecord`.
       ```app/routes/post/edit.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model(params) {
          return this.store.findRecord('post', params.post_id, { backgroundReload: false });
        }
      });
      ```
       If you pass an object on the `adapterOptions` property of the options
      argument it will be passed to you adapter via the snapshot
       ```app/routes/post/edit.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model(params) {
          return this.store.findRecord('post', params.post_id, {
            adapterOptions: { subscribe: false }
          });
        }
      });
      ```
       ```app/adapters/post.js
      import MyCustomAdapter from './custom-adapter';
       export default MyCustomAdapter.extend({
        findRecord(store, type, id, snapshot) {
          if (snapshot.adapterOptions.subscribe) {
            // ...
          }
          // ...
        }
      });
      ```
       See [peekRecord](#method_peekRecord) to get the cached version of a record.
       ### Retrieving Related Model Records
       If you use an adapter such as Ember's default
      [`JSONAPIAdapter`](https://emberjs.com/api/data/classes/DS.JSONAPIAdapter.html)
      that supports the [JSON API specification](http://jsonapi.org/) and if your server
      endpoint supports the use of an
      ['include' query parameter](http://jsonapi.org/format/#fetching-includes),
      you can use `findRecord()` to automatically retrieve additional records related to
      the one you request by supplying an `include` parameter in the `options` object.
       For example, given a `post` model that has a `hasMany` relationship with a `comment`
      model, when we retrieve a specific post we can have the server also return that post's
      comments in the same request:
       ```app/routes/post.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model(params) {
          return this.store.findRecord('post', params.post_id, { include: 'comments' });
        }
      });
       ```
      In this case, the post's comments would then be available in your template as
      `model.comments`.
       Multiple relationships can be requested using an `include` parameter consisting of a
      comma-separated list (without white-space) while nested relationships can be specified
      using a dot-separated sequence of relationship names. So to request both the post's
      comments and the authors of those comments the request would look like this:
       ```app/routes/post.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model(params) {
          return this.store.findRecord('post', params.post_id, { include: 'comments,comments.author' });
        }
      });
       ```
       @since 1.13.0
      @method findRecord
      @param {String} modelName
      @param {(String|Integer)} id
      @param {Object} options
      @return {Promise} promise
    */
    findRecord: function findRecord(modelName, id, options) {


      var normalizedModelName = normalizeModelName(modelName);

      var internalModel = this._internalModelForId(normalizedModelName, id);
      options = options || {};

      if (!this.hasRecordForId(normalizedModelName, id)) {
        return this._findByInternalModel(internalModel, options);
      }

      var fetchedInternalModel = this._findRecord(internalModel, options);

      return promiseRecord(fetchedInternalModel, 'DS: Store#findRecord ' + normalizedModelName + ' with id: ' + id);
    },
    _findRecord: function _findRecord(internalModel, options) {
      // Refetch if the reload option is passed
      if (options.reload) {
        return this._scheduleFetch(internalModel, options);
      }

      var snapshot = internalModel.createSnapshot(options);
      var adapter = this.adapterFor(internalModel.modelName);

      // Refetch the record if the adapter thinks the record is stale
      if (adapter.shouldReloadRecord(this, snapshot)) {
        return this._scheduleFetch(internalModel, options);
      }

      if (options.backgroundReload === false) {
        return Ember.RSVP.Promise.resolve(internalModel);
      }

      // Trigger the background refetch if backgroundReload option is passed
      if (options.backgroundReload || adapter.shouldBackgroundReloadRecord(this, snapshot)) {
        this._scheduleFetch(internalModel, options);
      }

      // Return the cached record
      return Ember.RSVP.Promise.resolve(internalModel);
    },
    _findByInternalModel: function _findByInternalModel(internalModel) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (options.preload) {
        internalModel.preloadData(options.preload);
      }

      var fetchedInternalModel = this._findEmptyInternalModel(internalModel, options);

      return promiseRecord(fetchedInternalModel, 'DS: Store#findRecord ' + internalModel.modelName + ' with id: ' + internalModel.id);
    },
    _findEmptyInternalModel: function _findEmptyInternalModel(internalModel, options) {
      if (internalModel.isEmpty()) {
        return this._scheduleFetch(internalModel, options);
      }

      //TODO double check about reloading
      if (internalModel.isLoading()) {
        return internalModel._promiseProxy;
      }

      return Ember.RSVP.Promise.resolve(internalModel);
    },


    /**
      This method makes a series of requests to the adapter's `find` method
      and returns a promise that resolves once they are all loaded.
       @private
      @method findByIds
      @param {String} modelName
      @param {Array} ids
      @return {Promise} promise
    */
    findByIds: function findByIds(modelName, ids) {


      var promises = new Array(ids.length);

      var normalizedModelName = normalizeModelName(modelName);

      for (var i = 0; i < ids.length; i++) {
        promises[i] = this.findRecord(normalizedModelName, ids[i]);
      }

      return promiseArray(Ember.RSVP.all(promises).then(Ember.A, null, 'DS: Store#findByIds of ' + normalizedModelName + ' complete'));
    },


    /**
      This method is called by `findRecord` if it discovers that a particular
      type/id pair hasn't been loaded yet to kick off a request to the
      adapter.
       @method _fetchRecord
      @private
      @param {InternalModel} internalModel model
      @return {Promise} promise
     */
    _fetchRecord: function _fetchRecord(internalModel, options) {
      var modelName = internalModel.modelName;
      var adapter = this.adapterFor(modelName);


      return _find(adapter, this, internalModel.type, internalModel.id, internalModel, options);
    },
    _scheduleFetchMany: function _scheduleFetchMany(internalModels) {
      var fetches = new Array(internalModels.length);

      for (var i = 0; i < internalModels.length; i++) {
        fetches[i] = this._scheduleFetch(internalModels[i]);
      }

      return Ember.RSVP.Promise.all(fetches);
    },
    _scheduleFetch: function _scheduleFetch(internalModel, options) {
      if (internalModel._promiseProxy) {
        return internalModel._promiseProxy;
      }

      var id = internalModel.id,
          modelName = internalModel.modelName;

      var resolver = Ember.RSVP.defer('Fetching ' + modelName + '\' with id: ' + id);
      var pendingFetchItem = {
        internalModel: internalModel,
        resolver: resolver,
        options: options
      };

      

      var promise = resolver.promise;

      internalModel.loadingData(promise);
      if (this._pendingFetch.size === 0) {
        emberRun$1.schedule('actions', this, this.flushAllPendingFetches);
      }

      this._pendingFetch.get(modelName).push(pendingFetchItem);

      return promise;
    },
    flushAllPendingFetches: function flushAllPendingFetches() {
      if (this.isDestroyed || this.isDestroying) {
        return;
      }

      this._pendingFetch.forEach(this._flushPendingFetchForType, this);
      this._pendingFetch.clear();
    },
    _flushPendingFetchForType: function _flushPendingFetchForType(pendingFetchItems, modelName) {
      var store = this;
      var adapter = store.adapterFor(modelName);
      var shouldCoalesce = !!adapter.findMany && adapter.coalesceFindRequests;
      var totalItems = pendingFetchItems.length;
      var internalModels = new Array(totalItems);
      var seeking = Object.create(null);

      for (var _i = 0; _i < totalItems; _i++) {
        var pendingItem = pendingFetchItems[_i];
        var _internalModel = pendingItem.internalModel;
        internalModels[_i] = _internalModel;
        seeking[_internalModel.id] = pendingItem;
      }

      for (var _i2 = 0; _i2 < totalItems; _i2++) {
        var _internalModel2 = internalModels[_i2];
        // We may have unloaded the record after scheduling this fetch, in which
        // case we must cancel the destroy.  This is because we require a record
        // to build a snapshot.  This is not fundamental: this cancelation code
        // can be removed when snapshots can be created for internal models that
        // have no records.
        if (_internalModel2.hasScheduledDestroy()) {
          internalModels[_i2].cancelDestroy();
        }
      }

      function _fetchRecord(recordResolverPair) {
        var recordFetch = store._fetchRecord(recordResolverPair.internalModel, recordResolverPair.options); // TODO adapter options

        recordResolverPair.resolver.resolve(recordFetch);
      }

      function handleFoundRecords(foundInternalModels, expectedInternalModels) {
        // resolve found records
        var found = Object.create(null);
        for (var _i3 = 0, _l = foundInternalModels.length; _i3 < _l; _i3++) {
          var _internalModel3 = foundInternalModels[_i3];
          var _pair = seeking[_internalModel3.id];
          found[_internalModel3.id] = _internalModel3;

          if (_pair) {
            var resolver = _pair.resolver;
            resolver.resolve(_internalModel3);
          }
        }

        // reject missing records
        var missingInternalModels = [];

        for (var _i4 = 0, _l2 = expectedInternalModels.length; _i4 < _l2; _i4++) {
          var _internalModel4 = expectedInternalModels[_i4];

          if (!found[_internalModel4.id]) {
            missingInternalModels.push(_internalModel4);
          }
        }

        if (missingInternalModels.length) {

          rejectInternalModels(missingInternalModels);
        }
      }

      function rejectInternalModels(internalModels, error) {
        for (var _i5 = 0, _l3 = internalModels.length; _i5 < _l3; _i5++) {
          var _internalModel5 = internalModels[_i5];
          var _pair2 = seeking[_internalModel5.id];

          if (_pair2) {
            _pair2.resolver.reject(error || new Error('Expected: \'' + _internalModel5 + '\' to be present in the adapter provided payload, but it was not found.'));
          }
        }
      }

      if (shouldCoalesce) {
        // TODO: Improve records => snapshots => records => snapshots
        //
        // We want to provide records to all store methods and snapshots to all
        // adapter methods. To make sure we're doing that we're providing an array
        // of snapshots to adapter.groupRecordsForFindMany(), which in turn will
        // return grouped snapshots instead of grouped records.
        //
        // But since the _findMany() finder is a store method we need to get the
        // records from the grouped snapshots even though the _findMany() finder
        // will once again convert the records to snapshots for adapter.findMany()
        var snapshots = new Array(totalItems);
        for (var _i6 = 0; _i6 < totalItems; _i6++) {
          snapshots[_i6] = internalModels[_i6].createSnapshot();
        }

        var groups = adapter.groupRecordsForFindMany(this, snapshots);

        for (var i = 0, l = groups.length; i < l; i++) {
          var group = groups[i];
          var totalInGroup = groups[i].length;
          var ids = new Array(totalInGroup);
          var groupedInternalModels = new Array(totalInGroup);

          for (var j = 0; j < totalInGroup; j++) {
            var internalModel = group[j]._internalModel;

            groupedInternalModels[j] = internalModel;
            ids[j] = internalModel.id;
          }

          if (totalInGroup > 1) {
            (function (groupedInternalModels) {
              _findMany(adapter, store, modelName, ids, groupedInternalModels).then(function (foundInternalModels) {
                handleFoundRecords(foundInternalModels, groupedInternalModels);
              }).catch(function (error) {
                rejectInternalModels(groupedInternalModels, error);
              });
            })(groupedInternalModels);
          } else if (ids.length === 1) {
            var pair = seeking[groupedInternalModels[0].id];
            _fetchRecord(pair);
          } else {
          }
        }
      } else {
        for (var _i7 = 0; _i7 < totalItems; _i7++) {
          _fetchRecord(pendingFetchItems[_i7]);
        }
      }
    },


    /**
      Get the reference for the specified record.
       Example
       ```javascript
      let userRef = store.getReference('user', 1);
       // check if the user is loaded
      let isLoaded = userRef.value() !== null;
       // get the record of the reference (null if not yet available)
      let user = userRef.value();
       // get the identifier of the reference
      if (userRef.remoteType() === 'id') {
      let id = userRef.id();
      }
       // load user (via store.find)
      userRef.load().then(...)
       // or trigger a reload
      userRef.reload().then(...)
       // provide data for reference
      userRef.push({ id: 1, username: '@user' }).then(function(user) {
        userRef.value() === user;
      });
      ```
       @method getReference
      @param {String} modelName
      @param {String|Integer} id
      @since 2.5.0
      @return {RecordReference}
    */
    getReference: function getReference(modelName, id) {
      var normalizedModelName = normalizeModelName(modelName);

      return this._internalModelForId(normalizedModelName, id).recordReference;
    },


    /**
      Get a record by a given type and ID without triggering a fetch.
       This method will synchronously return the record if it is available in the store,
      otherwise it will return `null`. A record is available if it has been fetched earlier, or
      pushed manually into the store.
       See [findRecord](#method_findRecord) if you would like to request this record from the backend.
       _Note: This is a synchronous method and does not return a promise._
       ```js
      let post = store.peekRecord('post', 1);
       post.get('id'); // 1
      ```
       @since 1.13.0
      @method peekRecord
      @param {String} modelName
      @param {String|Integer} id
      @return {DS.Model|null} record
    */
    peekRecord: function peekRecord(modelName, id) {

      var normalizedModelName = normalizeModelName(modelName);

      if (this.hasRecordForId(normalizedModelName, id)) {
        return this._internalModelForId(normalizedModelName, id).getRecord();
      } else {
        return null;
      }
    },


    /**
      This method is called by the record's `reload` method.
       This method calls the adapter's `find` method, which returns a promise. When
      **that** promise resolves, `_reloadRecord` will resolve the promise returned
      by the record's `reload`.
       @method _reloadRecord
      @private
      @param {DS.Model} internalModel
      @param options optional to include adapterOptions
      @return {Promise} promise
    */
    _reloadRecord: function _reloadRecord(internalModel, options) {
      var id = internalModel.id,
          modelName = internalModel.modelName;

      var adapter = this.adapterFor(modelName);


      return this._scheduleFetch(internalModel, options);
    },


    /**
     This method returns true if a record for a given modelName and id is already
     loaded in the store. Use this function to know beforehand if a findRecord()
     will result in a request or that it will be a cache hit.
      Example
      ```javascript
     store.hasRecordForId('post', 1); // false
     store.findRecord('post', 1).then(function() {
       store.hasRecordForId('post', 1); // true
     });
     ```
       @method hasRecordForId
      @param {String} modelName
      @param {(String|Integer)} id
      @return {Boolean}
    */
    hasRecordForId: function hasRecordForId(modelName, id) {


      var normalizedModelName = normalizeModelName(modelName);

      var trueId = coerceId(id);
      var internalModel = this._internalModelsFor(normalizedModelName).get(trueId);

      return !!internalModel && internalModel.isLoaded();
    },


    /**
      Returns id record for a given type and ID. If one isn't already loaded,
      it builds a new record and leaves it in the `empty` state.
       @method recordForId
      @private
      @param {String} modelName
      @param {(String|Integer)} id
      @return {DS.Model} record
    */
    recordForId: function recordForId(modelName, id) {


      return this._internalModelForId(modelName, id).getRecord();
    },
    _internalModelForId: function _internalModelForId(modelName, id) {
      var trueId = coerceId(id);
      var internalModel = this._internalModelsFor(modelName).get(trueId);

      if (internalModel) {
        // unloadRecord is async, if one attempts to unload + then sync push,
        //   we must ensure the unload is canceled before continuing
        //   The createRecord path will take _existingInternalModelForId()
        //   which will call `destroySync` instead for this unload + then
        //   sync createRecord scenario. Once we have true client-side
        //   delete signaling, we should never call destroySync
        if (internalModel.hasScheduledDestroy()) {
          internalModel.cancelDestroy();
        }

        return internalModel;
      }

      return this._buildInternalModel(modelName, trueId);
    },
    _internalModelDidReceiveRelationshipData: function _internalModelDidReceiveRelationshipData(modelName, id, relationshipData) {
      this._relationshipsPayloads.push(modelName, id, relationshipData);
    },
    _internalModelDestroyed: function _internalModelDestroyed(internalModel) {
      this._removeFromIdMap(internalModel);

      if (!this.isDestroying) {
        this._relationshipsPayloads.unload(internalModel.modelName, internalModel.id);
      }
    },


    /**
      @method findMany
      @private
      @param {Array} internalModels
      @return {Promise} promise
    */
    findMany: function findMany(internalModels) {
      var finds = new Array(internalModels.length);

      for (var i = 0; i < internalModels.length; i++) {
        finds[i] = this._findEmptyInternalModel(internalModels[i]);
      }

      return Ember.RSVP.Promise.all(finds);
    },


    /**
      If a relationship was originally populated by the adapter as a link
      (as opposed to a list of IDs), this method is called when the
      relationship is fetched.
       The link (which is usually a URL) is passed through unchanged, so the
      adapter can make whatever request it wants.
       The usual use-case is for the server to register a URL as a link, and
      then use that URL in the future to make a request for the relationship.
       @method findHasMany
      @private
      @param {InternalModel} internalModel
      @param {any} link
      @param {(Relationship)} relationship
      @return {Promise} promise
    */
    findHasMany: function findHasMany(internalModel, link, relationship) {
      var adapter = this.adapterFor(internalModel.modelName);


      return _findHasMany(adapter, this, internalModel, link, relationship);
    },


    /**
      @method findBelongsTo
      @private
      @param {InternalModel} internalModel
      @param {any} link
      @param {Relationship} relationship
      @return {Promise} promise
    */
    findBelongsTo: function findBelongsTo(internalModel, link, relationship) {
      var adapter = this.adapterFor(internalModel.modelName);


      return _findBelongsTo(adapter, this, internalModel, link, relationship);
    },


    /**
      This method delegates a query to the adapter. This is the one place where
      adapter-level semantics are exposed to the application.
       Each time this method is called a new request is made through the adapter.
       Exposing queries this way seems preferable to creating an abstract query
      language for all server-side queries, and then require all adapters to
      implement them.
       ---
       If you do something like this:
       ```javascript
      store.query('person', { page: 1 });
      ```
       The call made to the server, using a Rails backend, will look something like this:
       ```
      Started GET "/api/v1/person?page=1"
      Processing by Api::V1::PersonsController#index as HTML
      Parameters: { "page"=>"1" }
      ```
       ---
       If you do something like this:
       ```javascript
      store.query('person', { ids: [1, 2, 3] });
      ```
       The call to the server, using a Rails backend, will look something like this:
       ```
      Started GET "/api/v1/person?ids%5B%5D=1&ids%5B%5D=2&ids%5B%5D=3"
      Processing by Api::V1::PersonsController#index as HTML
      Parameters: { "ids" => ["1", "2", "3"] }
      ```
       This method returns a promise, which is resolved with an
      [`AdapterPopulatedRecordArray`](https://emberjs.com/api/data/classes/DS.AdapterPopulatedRecordArray.html)
      once the server returns.
       @since 1.13.0
      @method query
      @param {String} modelName
      @param {any} query an opaque query to be used by the adapter
      @param {Object} options optional, may include `adapterOptions` hash which will be passed to adapter.query
      @return {Promise} promise
    */
    query: function query(modelName, _query2, options) {


      var adapterOptionsWrapper = {};

      if (options && options.adapterOptions) {
        adapterOptionsWrapper.adapterOptions = options.adapterOptions;
      }

      var normalizedModelName = normalizeModelName(modelName);
      return this._query(normalizedModelName, _query2, null, adapterOptionsWrapper);
    },
    _query: function _query$$1(modelName, query, array, options) {

      var adapter = this.adapterFor(modelName);


      var pA = promiseArray(_query(adapter, this, modelName, query, array, options));

      return pA;
    },


    /**
      This method makes a request for one record, where the `id` is not known
      beforehand (if the `id` is known, use [`findRecord`](#method_findRecord)
      instead).
       This method can be used when it is certain that the server will return a
      single object for the primary data.
       Each time this method is called a new request is made through the adapter.
       Let's assume our API provides an endpoint for the currently logged in user
      via:
       ```
      // GET /api/current_user
      {
        user: {
          id: 1234,
          username: 'admin'
        }
      }
      ```
       Since the specific `id` of the `user` is not known beforehand, we can use
      `queryRecord` to get the user:
       ```javascript
      store.queryRecord('user', {}).then(function(user) {
        let username = user.get('username');
        console.log(`Currently logged in as ${username}`);
      });
      ```
       The request is made through the adapters' `queryRecord`:
       ```app/adapters/user.js
      import $ from 'jquery';
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        queryRecord(modelName, query) {
          return $.getJSON('/api/current_user');
        }
      });
      ```
       Note: the primary use case for `store.queryRecord` is when a single record
      is queried and the `id` is not known beforehand. In all other cases
      `store.query` and using the first item of the array is likely the preferred
      way:
       ```
      // GET /users?username=unique
      {
        data: [{
          id: 1234,
          type: 'user',
          attributes: {
            username: "unique"
          }
        }]
      }
      ```
       ```javascript
      store.query('user', { username: 'unique' }).then(function(users) {
        return users.get('firstObject');
      }).then(function(user) {
        let id = user.get('id');
      });
      ```
       This method returns a promise, which resolves with the found record.
       If the adapter returns no data for the primary data of the payload, then
      `queryRecord` resolves with `null`:
       ```
      // GET /users?username=unique
      {
        data: null
      }
      ```
       ```javascript
      store.queryRecord('user', { username: 'unique' }).then(function(user) {
        console.log(user); // null
      });
      ```
       @since 1.13.0
      @method queryRecord
      @param {String} modelName
      @param {any} query an opaque query to be used by the adapter
      @param {Object} options optional, may include `adapterOptions` hash which will be passed to adapter.queryRecord
      @return {Promise} promise which resolves with the found record or `null`
    */
    queryRecord: function queryRecord(modelName, query, options) {


      var normalizedModelName = normalizeModelName(modelName);
      var adapter = this.adapterFor(normalizedModelName);
      var adapterOptionsWrapper = {};

      if (options && options.adapterOptions) {
        adapterOptionsWrapper.adapterOptions = options.adapterOptions;
      }


      return promiseObject(_queryRecord(adapter, this, modelName, query, adapterOptionsWrapper).then(function (internalModel) {
        // the promise returned by store.queryRecord is expected to resolve with
        // an instance of DS.Model
        if (internalModel) {
          return internalModel.getRecord();
        }

        return null;
      }));
    },


    /**
      `findAll` asks the adapter's `findAll` method to find the records for the
      given type, and returns a promise which will resolve with all records of
      this type present in the store, even if the adapter only returns a subset
      of them.
       ```app/routes/authors.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model(params) {
          return this.store.findAll('author');
        }
      });
      ```
       _When_ the returned promise resolves depends on the reload behavior,
      configured via the passed `options` hash and the result of the adapter's
      `shouldReloadAll` method.
       ### Reloading
       If `{ reload: true }` is passed or `adapter.shouldReloadAll` evaluates to
      `true`, then the returned promise resolves once the adapter returns data,
      regardless if there are already records in the store:
       ```js
      store.push({
        data: {
          id: 'first',
          type: 'author'
        }
      });
       // adapter#findAll resolves with
      // [
      //   {
      //     id: 'second',
      //     type: 'author'
      //   }
      // ]
      store.findAll('author', { reload: true }).then(function(authors) {
        authors.getEach('id'); // ['first', 'second']
      });
      ```
       If no reload is indicated via the abovementioned ways, then the promise
      immediately resolves with all the records currently loaded in the store.
       ### Background Reloading
       Optionally, if `adapter.shouldBackgroundReloadAll` evaluates to `true`,
      then a background reload is started. Once this resolves, the array with
      which the promise resolves, is updated automatically so it contains all the
      records in the store:
       ```app/adapters/application.js
      import DS from 'ember-data';
      export default DS.Adapter.extend({
        shouldReloadAll(store, snapshotsArray) {
          return false;
        },
         shouldBackgroundReloadAll(store, snapshotsArray) {
          return true;
        }
      });
       // ...
       store.push({
        data: {
          id: 'first',
          type: 'author'
        }
      });
       let allAuthors;
      store.findAll('author').then(function(authors) {
        authors.getEach('id'); // ['first']
         allAuthors = authors;
      });
       // later, once adapter#findAll resolved with
      // [
      //   {
      //     id: 'second',
      //     type: 'author'
      //   }
      // ]
       allAuthors.getEach('id'); // ['first', 'second']
      ```
       If you would like to force or prevent background reloading, you can set a
      boolean value for `backgroundReload` in the options object for
      `findAll`.
       ```app/routes/post/edit.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model() {
          return this.store.findAll('post', { backgroundReload: false });
        }
      });
      ```
       If you pass an object on the `adapterOptions` property of the options
      argument it will be passed to you adapter via the `snapshotRecordArray`
       ```app/routes/posts.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model(params) {
          return this.store.findAll('post', {
            adapterOptions: { subscribe: false }
          });
        }
      });
      ```
       ```app/adapters/post.js
      import MyCustomAdapter from './custom-adapter';
       export default MyCustomAdapter.extend({
        findAll(store, type, sinceToken, snapshotRecordArray) {
          if (snapshotRecordArray.adapterOptions.subscribe) {
            // ...
          }
          // ...
        }
      });
      ```
       See [peekAll](#method_peekAll) to get an array of current records in the
      store, without waiting until a reload is finished.
       ### Retrieving Related Model Records
       If you use an adapter such as Ember's default
      [`JSONAPIAdapter`](https://emberjs.com/api/data/classes/DS.JSONAPIAdapter.html)
      that supports the [JSON API specification](http://jsonapi.org/) and if your server
      endpoint supports the use of an
      ['include' query parameter](http://jsonapi.org/format/#fetching-includes),
      you can use `findAll()` to automatically retrieve additional records related to
      those requested by supplying an `include` parameter in the `options` object.
       For example, given a `post` model that has a `hasMany` relationship with a `comment`
      model, when we retrieve all of the post records we can have the server also return
      all of the posts' comments in the same request:
       ```app/routes/posts.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model() {
          return this.store.findAll('post', { include: 'comments' });
        }
      });
       ```
      Multiple relationships can be requested using an `include` parameter consisting of a
      comma-separated list (without white-space) while nested relationships can be specified
      using a dot-separated sequence of relationship names. So to request both the posts'
      comments and the authors of those comments the request would look like this:
       ```app/routes/posts.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model() {
          return this.store.findAll('post', { include: 'comments,comments.author' });
        }
      });
       ```
       See [query](#method_query) to only get a subset of records from the server.
       @since 1.13.0
      @method findAll
      @param {String} modelName
      @param {Object} options
      @return {Promise} promise
    */
    findAll: function findAll(modelName, options) {

      var normalizedModelName = normalizeModelName(modelName);
      var fetch = this._fetchAll(normalizedModelName, this.peekAll(normalizedModelName), options);

      return fetch;
    },


    /**
      @method _fetchAll
      @private
      @param {DS.Model} modelName
      @param {DS.RecordArray} array
      @return {Promise} promise
    */
    _fetchAll: function _fetchAll(modelName, array) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var adapter = this.adapterFor(modelName);
      var sinceToken = this._internalModelsFor(modelName).metadata.since;


      if (options.reload) {
        Ember.set(array, 'isUpdating', true);
        return promiseArray(_findAll(adapter, this, modelName, sinceToken, options));
      }

      var snapshotArray = array._createSnapshot(options);

      if (adapter.shouldReloadAll(this, snapshotArray)) {
        Ember.set(array, 'isUpdating', true);
        return promiseArray(_findAll(adapter, this, modelName, sinceToken, options));
      }

      if (options.backgroundReload === false) {
        return promiseArray(Ember.RSVP.Promise.resolve(array));
      }

      if (options.backgroundReload || adapter.shouldBackgroundReloadAll(this, snapshotArray)) {
        Ember.set(array, 'isUpdating', true);
        _findAll(adapter, this, modelName, sinceToken, options);
      }

      return promiseArray(Ember.RSVP.Promise.resolve(array));
    },


    /**
      @method _didUpdateAll
      @param {String} modelName
      @private
    */
    _didUpdateAll: function _didUpdateAll(modelName) {
      this.recordArrayManager._didUpdateAll(modelName);
    },


    /**
      This method returns a filtered array that contains all of the
      known records for a given type in the store.
       Note that because it's just a filter, the result will contain any
      locally created records of the type, however, it will not make a
      request to the backend to retrieve additional records. If you
      would like to request all the records from the backend please use
      [store.findAll](#method_findAll).
       Also note that multiple calls to `peekAll` for a given type will always
      return the same `RecordArray`.
       Example
       ```javascript
      let localPosts = store.peekAll('post');
      ```
       @since 1.13.0
      @method peekAll
      @param {String} modelName
      @return {DS.RecordArray}
    */
    peekAll: function peekAll(modelName) {

      var normalizedModelName = normalizeModelName(modelName);
      return this.recordArrayManager.liveRecordArrayFor(normalizedModelName);
    },


    /**
      This method unloads all records in the store.
      It schedules unloading to happen during the next run loop.
       Optionally you can pass a type which unload all records for a given type.
       ```javascript
      store.unloadAll();
      store.unloadAll('post');
      ```
       @method unloadAll
      @param {String} modelName
    */
    unloadAll: function unloadAll(modelName) {


      if (arguments.length === 0) {
        this._identityMap.clear();
      } else {
        var normalizedModelName = normalizeModelName(modelName);
        this._internalModelsFor(normalizedModelName).clear();
      }
    },
    filter: function filter() {
    },


    // ..............
    // . PERSISTING .
    // ..............

    /**
      This method is called by `record.save`, and gets passed a
      resolver for the promise that `record.save` returns.
       It schedules saving to happen at the end of the run loop.
       @method scheduleSave
      @private
      @param {InternalModel} internalModel
      @param {Resolver} resolver
      @param {Object} options
    */
    scheduleSave: function scheduleSave(internalModel, resolver, options) {
      var snapshot = internalModel.createSnapshot(options);
      internalModel.flushChangedAttributes();
      internalModel.adapterWillCommit();
      this._pendingSave.push({
        snapshot: snapshot,
        resolver: resolver
      });
      emberRun$1.scheduleOnce('actions', this, this.flushPendingSave);
    },


    /**
      This method is called at the end of the run loop, and
      flushes any records passed into `scheduleSave`
       @method flushPendingSave
      @private
    */
    flushPendingSave: function flushPendingSave() {
      var pending = this._pendingSave.slice();
      this._pendingSave = [];

      for (var i = 0, j = pending.length; i < j; i++) {
        var pendingItem = pending[i];
        var snapshot = pendingItem.snapshot;
        var resolver = pendingItem.resolver;
        var internalModel = snapshot._internalModel;
        var adapter = this.adapterFor(internalModel.modelName);
        var operation = void 0;

        if (internalModel.currentState.stateName === 'root.deleted.saved') {
          resolver.resolve();
          continue;
        } else if (internalModel.isNew()) {
          operation = 'createRecord';
        } else if (internalModel.isDeleted()) {
          operation = 'deleteRecord';
        } else {
          operation = 'updateRecord';
        }

        resolver.resolve(_commit(adapter, this, operation, snapshot));
      }
    },


    /**
      This method is called once the promise returned by an
      adapter's `createRecord`, `updateRecord` or `deleteRecord`
      is resolved.
       If the data provides a server-generated ID, it will
      update the record and the store's indexes.
       @method didSaveRecord
      @private
      @param {InternalModel} internalModel the in-flight internal model
      @param {Object} data optional data (see above)
    */
    didSaveRecord: function didSaveRecord(internalModel, dataArg) {
      var data = void 0;
      if (dataArg) {
        data = dataArg.data;
      }
      if (data) {
        // normalize relationship IDs into records
        this.updateId(internalModel, data);
        this._setupRelationshipsForModel(internalModel, data);
      } else {
      }

      //We first make sure the primary data has been updated
      //TODO try to move notification to the user to the end of the runloop
      internalModel.adapterDidCommit(data);
    },


    /**
      This method is called once the promise returned by an
      adapter's `createRecord`, `updateRecord` or `deleteRecord`
      is rejected with a `DS.InvalidError`.
       @method recordWasInvalid
      @private
      @param {InternalModel} internalModel
      @param {Object} errors
    */
    recordWasInvalid: function recordWasInvalid(internalModel, errors) {
      internalModel.adapterDidInvalidate(errors);
    },


    /**
      This method is called once the promise returned by an
      adapter's `createRecord`, `updateRecord` or `deleteRecord`
      is rejected (with anything other than a `DS.InvalidError`).
       @method recordWasError
      @private
      @param {InternalModel} internalModel
      @param {Error} error
    */
    recordWasError: function recordWasError(internalModel, error) {
      internalModel.adapterDidError(error);
    },


    /**
      When an adapter's `createRecord`, `updateRecord` or `deleteRecord`
      resolves with data, this method extracts the ID from the supplied
      data.
       @method updateId
      @private
      @param {InternalModel} internalModel
      @param {Object} data
    */
    updateId: function updateId(internalModel, data) {
      var oldId = internalModel.id;
      var modelName = internalModel.modelName;
      var id = coerceId(data.id);

      // ID can be null if oldID is not null (altered ID in response for a record)
      // however, this is more than likely a developer error.

      if (oldId !== null && id === null) {

        return;
      }

      var existingInternalModel = this._existingInternalModelForId(modelName, id);


      this._internalModelsFor(internalModel.modelName).set(id, internalModel);

      internalModel.setId(id);
    },


    /**
      Returns a map of IDs to client IDs for a given modelName.
       @method _internalModelsFor
      @private
      @param {String} modelName
      @return {Object} recordMap
    */
    _internalModelsFor: function _internalModelsFor(modelName) {
      return this._identityMap.retrieve(modelName);
    },


    // ................
    // . LOADING DATA .
    // ................

    /**
      This internal method is used by `push`.
       @method _load
      @private
      @param {Object} data
    */
    _load: function _load(data) {
      var modelName = normalizeModelName(data.type);
      var internalModel = this._internalModelForId(modelName, data.id);

      var isUpdate = internalModel.currentState.isEmpty === false;

      internalModel.setupData(data);

      if (isUpdate) {
        this.recordArrayManager.recordDidChange(internalModel);
      } else {
        this.recordArrayManager.recordWasLoaded(internalModel);
      }

      return internalModel;
    },


    /*
      @deprecated
      @private
     */
    _modelForMixin: function _modelForMixin(modelName) {

      var normalizedModelName = normalizeModelName(modelName);

      return _modelForMixin2(this, normalizedModelName);
    },


    /**
      Returns the model class for the particular `modelName`.
       The class of a model might be useful if you want to get a list of all the
      relationship names of the model, see
      [`relationshipNames`](https://emberjs.com/api/data/classes/DS.Model.html#property_relationshipNames)
      for example.
       @method modelFor
      @param {String} modelName
      @return {DS.Model}
    */
    modelFor: function modelFor(modelName) {


      var maybeFactory = this._modelFactoryFor(modelName);

      // for factorFor factory/class split
      return maybeFactory.class ? maybeFactory.class : maybeFactory;
    },


    /*
      @deprecated
      @private
    */
    _modelFor: function _modelFor(modelName) {

      return this.modelFor(modelName);
    },
    _modelFactoryFor: function _modelFactoryFor(modelName) {

      var normalizedModelName = normalizeModelName(modelName);
      var factory = getModelFactory(this, this._modelFactoryCache, normalizedModelName);

      if (factory === null) {
        throw new Ember.Error('No model was found for \'' + normalizedModelName + '\'');
      }

      return factory;
    },


    /*
      @deprecated
      @private
    */
    modelFactoryFor: function modelFactoryFor(modelName) {

      return this._modelFactoryFor(modelName);
    },


    /*
    Returns whether a ModelClass exists for a given modelName
    This exists for legacy support for the RESTSerializer,
    which due to how it must guess whether a key is a model
    must query for whether a match exists.
     We should investigate an RFC to make this public or removing
    this requirement.
     @private
    */
    _hasModelFor: function _hasModelFor(modelName) {

      var normalizedModelName = normalizeModelName(modelName);
      var factory = getModelFactory(this, this._modelFactoryCache, normalizedModelName);

      return factory !== null;
    },


    /**
      Push some data for a given type into the store.
       This method expects normalized [JSON API](http://jsonapi.org/) document. This means you have to follow [JSON API specification](http://jsonapi.org/format/) with few minor adjustments:
      - record's `type` should always be in singular, dasherized form
      - members (properties) should be camelCased
       [Your primary data should be wrapped inside `data` property](http://jsonapi.org/format/#document-top-level):
       ```js
      store.push({
        data: {
          // primary data for single record of type `Person`
          id: '1',
          type: 'person',
          attributes: {
            firstName: 'Daniel',
            lastName: 'Kmak'
          }
        }
      });
      ```
       [Demo.](http://ember-twiddle.com/fb99f18cd3b4d3e2a4c7)
       `data` property can also hold an array (of records):
       ```js
      store.push({
        data: [
          // an array of records
          {
            id: '1',
            type: 'person',
            attributes: {
              firstName: 'Daniel',
              lastName: 'Kmak'
            }
          },
          {
            id: '2',
            type: 'person',
            attributes: {
              firstName: 'Tom',
              lastName: 'Dale'
            }
          }
        ]
      });
      ```
       [Demo.](http://ember-twiddle.com/69cdbeaa3702159dc355)
       There are some typical properties for `JSONAPI` payload:
      * `id` - mandatory, unique record's key
      * `type` - mandatory string which matches `model`'s dasherized name in singular form
      * `attributes` - object which holds data for record attributes - `DS.attr`'s declared in model
      * `relationships` - object which must contain any of the following properties under each relationships' respective key (example path is `relationships.achievements.data`):
        - [`links`](http://jsonapi.org/format/#document-links)
        - [`data`](http://jsonapi.org/format/#document-resource-object-linkage) - place for primary data
        - [`meta`](http://jsonapi.org/format/#document-meta) - object which contains meta-information about relationship
       For this model:
       ```app/models/person.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        firstName: DS.attr('string'),
        lastName: DS.attr('string'),
         children: DS.hasMany('person')
      });
      ```
       To represent the children as IDs:
       ```js
      {
        data: {
          id: '1',
          type: 'person',
          attributes: {
            firstName: 'Tom',
            lastName: 'Dale'
          },
          relationships: {
            children: {
              data: [
                {
                  id: '2',
                  type: 'person'
                },
                {
                  id: '3',
                  type: 'person'
                },
                {
                  id: '4',
                  type: 'person'
                }
              ]
            }
          }
        }
      }
      ```
       [Demo.](http://ember-twiddle.com/343e1735e034091f5bde)
       To represent the children relationship as a URL:
       ```js
      {
        data: {
          id: '1',
          type: 'person',
          attributes: {
            firstName: 'Tom',
            lastName: 'Dale'
          },
          relationships: {
            children: {
              links: {
                related: '/people/1/children'
              }
            }
          }
        }
      }
      ```
       If you're streaming data or implementing an adapter, make sure
      that you have converted the incoming data into this form. The
      store's [normalize](#method_normalize) method is a convenience
      helper for converting a json payload into the form Ember Data
      expects.
       ```js
      store.push(store.normalize('person', data));
      ```
       This method can be used both to push in brand new
      records, as well as to update existing records.
       @method push
      @param {Object} data
      @return {DS.Model|Array} the record(s) that was created or
        updated.
    */
    push: function push(data) {
      var pushed = this._push(data);

      if (Array.isArray(pushed)) {
        var records = pushed.map(function (internalModel) {
          return internalModel.getRecord();
        });

        return records;
      }

      if (pushed === null) {
        return null;
      }

      var record = pushed.getRecord();

      return record;
    },


    /*
      Push some data in the form of a json-api document into the store,
      without creating materialized records.
       @method _push
      @private
      @param {Object} jsonApiDoc
      @return {DS.InternalModel|Array<DS.InternalModel>} pushed InternalModel(s)
    */
    _push: function _push(jsonApiDoc) {
      var _this3 = this;

      var internalModelOrModels = this._backburner.join(function () {
        var included = jsonApiDoc.included;
        var i = void 0,
            length = void 0;

        if (included) {
          for (i = 0, length = included.length; i < length; i++) {
            _this3._pushInternalModel(included[i]);
          }
        }

        if (Array.isArray(jsonApiDoc.data)) {
          length = jsonApiDoc.data.length;
          var internalModels = new Array(length);

          for (i = 0; i < length; i++) {
            internalModels[i] = _this3._pushInternalModel(jsonApiDoc.data[i]);
          }
          return internalModels;
        }

        if (jsonApiDoc.data === null) {
          return null;
        }


        return _this3._pushInternalModel(jsonApiDoc.data);
      });

      return internalModelOrModels;
    },
    _pushInternalModel: function _pushInternalModel(data) {
      var modelName = data.type;


      

      // Actually load the record into the store.
      var internalModel = this._load(data);

      this._setupRelationshipsForModel(internalModel, data);

      return internalModel;
    },
    _setupRelationshipsForModel: function _setupRelationshipsForModel(internalModel, data) {
      if (data.relationships === undefined) {
        return;
      }

      if (this._pushedInternalModels.push(internalModel, data) !== 2) {
        return;
      }

      this._backburner.schedule('normalizeRelationships', this, this._setupRelationships);
    },
    _setupRelationships: function _setupRelationships() {
      var pushed = this._pushedInternalModels;

      // Cache the inverse maps for each modelClass that we visit during this
      // payload push.  In the common case where we are pushing many more
      // instances than types we want to minimize the cost of looking up the
      // inverse map and the overhead of Ember.get adds up.
      var modelNameToInverseMap = void 0;

      for (var i = 0, l = pushed.length; i < l; i += 2) {
        modelNameToInverseMap = modelNameToInverseMap || Object.create(null);
        // This will convert relationships specified as IDs into DS.Model instances
        // (possibly unloaded) and also create the data structures used to track
        // relationships.
        var internalModel = pushed[i];
        var data = pushed[i + 1];
        setupRelationships(this, internalModel, data, modelNameToInverseMap);
      }

      pushed.length = 0;
    },


    /**
      Push some raw data into the store.
       This method can be used both to push in brand new
      records, as well as to update existing records. You
      can push in more than one type of object at once.
      All objects should be in the format expected by the
      serializer.
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.ActiveModelSerializer;
      ```
       ```js
      let pushData = {
        posts: [
          { id: 1, post_title: "Great post", comment_ids: [2] }
        ],
        comments: [
          { id: 2, comment_body: "Insightful comment" }
        ]
      }
       store.pushPayload(pushData);
      ```
       By default, the data will be deserialized using a default
      serializer (the application serializer if it exists).
       Alternatively, `pushPayload` will accept a model type which
      will determine which serializer will process the payload.
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.ActiveModelSerializer;
      ```
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.JSONSerializer;
      ```
       ```js
      store.pushPayload(pushData); // Will use the application serializer
      store.pushPayload('post', pushData); // Will use the post serializer
      ```
       @method pushPayload
      @param {String} modelName Optionally, a model type used to determine which serializer will be used
      @param {Object} inputPayload
    */
    pushPayload: function pushPayload(modelName, inputPayload) {
      var serializer = void 0;
      var payload = void 0;
      if (!inputPayload) {
        payload = modelName;
        serializer = defaultSerializer(this);
      } else {
        payload = inputPayload;

        var normalizedModelName = normalizeModelName(modelName);
        serializer = this.serializerFor(normalizedModelName);
      }
      serializer.pushPayload(this, payload);
    },


    /**
      `normalize` converts a json payload into the normalized form that
      [push](#method_push) expects.
       Example
       ```js
      socket.on('message', function(message) {
        let modelName = message.model;
        let data = message.data;
        store.push(store.normalize(modelName, data));
      });
      ```
       @method normalize
      @param {String} modelName The name of the model type for this payload
      @param {Object} payload
      @return {Object} The normalized payload
    */
    normalize: function normalize(modelName, payload) {

      var normalizedModelName = normalizeModelName(modelName);
      var serializer = this.serializerFor(normalizedModelName);
      var model = this.modelFor(normalizedModelName);
      return serializer.normalize(model, payload);
    },


    /**
      Build a brand new record for a given type, ID, and
      initial data.
       @method _buildInternalModel
      @private
      @param {String} modelName
      @param {String} id
      @param {Object} data
      @return {InternalModel} internal model
    */
    _buildInternalModel: function _buildInternalModel(modelName, id, data) {


      var existingInternalModel = this._existingInternalModelForId(modelName, id);

      // lookupFactory should really return an object that creates
      // instances with the injections applied

      var internalModel = new InternalModel(modelName, id, this, data);

      this._internalModelsFor(modelName).add(internalModel, id);

      return internalModel;
    },
    _existingInternalModelForId: function _existingInternalModelForId(modelName, id) {
      var internalModel = this._internalModelsFor(modelName).get(id);

      if (internalModel && internalModel.hasScheduledDestroy()) {
        // unloadRecord is async, if one attempts to unload + then sync create,
        //   we must ensure the unload is complete before starting the create
        //   The push path will take _internalModelForId()
        //   which will call `cancelDestroy` instead for this unload + then
        //   sync push scenario. Once we have true client-side
        //   delete signaling, we should never call destroySync
        internalModel.destroySync();
        internalModel = null;
      }
      return internalModel;
    },


    //Called by the state machine to notify the store that the record is ready to be interacted with
    recordWasLoaded: function recordWasLoaded(record) {
      this.recordArrayManager.recordWasLoaded(record);
    },


    // ...............
    // . DESTRUCTION .
    // ...............

    /**
      When a record is destroyed, this un-indexes it and
      removes it from any record arrays so it can be GCed.
       @method _removeFromIdMap
      @private
      @param {InternalModel} internalModel
    */
    _removeFromIdMap: function _removeFromIdMap(internalModel) {
      var recordMap = this._internalModelsFor(internalModel.modelName);
      var id = internalModel.id;

      recordMap.remove(internalModel, id);
    },


    // ......................
    // . PER-TYPE ADAPTERS
    // ......................

    /**
      Returns an instance of the adapter for a given type. For
      example, `adapterFor('person')` will return an instance of
      `App.PersonAdapter`.
       If no `App.PersonAdapter` is found, this method will look
      for an `App.ApplicationAdapter` (the default adapter for
      your entire application).
       If no `App.ApplicationAdapter` is found, it will return
      the value of the `defaultAdapter`.
       @method adapterFor
      @public
      @param {String} modelName
      @return DS.Adapter
    */
    adapterFor: function adapterFor(modelName) {

      var normalizedModelName = normalizeModelName(modelName);

      var _adapterCache = this._adapterCache;

      var adapter = _adapterCache[normalizedModelName];
      if (adapter) {
        return adapter;
      }

      var owner = getOwner(this);

      adapter = owner.lookup('adapter:' + normalizedModelName);
      if (adapter !== undefined) {
        Ember.set(adapter, 'store', this);
        _adapterCache[normalizedModelName] = adapter;
        return adapter;
      }

      // no adapter found for the specific model, fallback and check for application adapter
      adapter = _adapterCache.application || owner.lookup('adapter:application');
      if (adapter !== undefined) {
        Ember.set(adapter, 'store', this);
        _adapterCache[normalizedModelName] = adapter;
        _adapterCache.application = adapter;
        return adapter;
      }

      // no model specific adapter or application adapter, check for an `adapter`
      // property defined on the store
      var adapterName = this.get('adapter');
      adapter = _adapterCache[adapterName] || owner.lookup('adapter:' + adapterName);
      if (adapter !== undefined) {
        Ember.set(adapter, 'store', this);
        _adapterCache[normalizedModelName] = adapter;
        _adapterCache[adapterName] = adapter;
        return adapter;
      }

      // final fallback, no model specific adapter, no application adapter, no
      // `adapter` property on store: use json-api adapter
      adapter = _adapterCache['-json-api'] || owner.lookup('adapter:-json-api');
      Ember.set(adapter, 'store', this);
      _adapterCache[normalizedModelName] = adapter;
      _adapterCache['-json-api'] = adapter;
      return adapter;
    },


    // ..............................
    // . RECORD CHANGE NOTIFICATION .
    // ..............................

    /**
      Returns an instance of the serializer for a given type. For
      example, `serializerFor('person')` will return an instance of
      `App.PersonSerializer`.
       If no `App.PersonSerializer` is found, this method will look
      for an `App.ApplicationSerializer` (the default serializer for
      your entire application).
       if no `App.ApplicationSerializer` is found, it will attempt
      to get the `defaultSerializer` from the `PersonAdapter`
      (`adapterFor('person')`).
       If a serializer cannot be found on the adapter, it will fall back
      to an instance of `DS.JSONSerializer`.
       @method serializerFor
      @public
      @param {String} modelName the record to serialize
      @return {DS.Serializer}
    */
    serializerFor: function serializerFor(modelName) {

      var normalizedModelName = normalizeModelName(modelName);

      var _serializerCache = this._serializerCache;

      var serializer = _serializerCache[normalizedModelName];
      if (serializer) {
        return serializer;
      }

      var owner = getOwner(this);

      serializer = owner.lookup('serializer:' + normalizedModelName);
      if (serializer !== undefined) {
        Ember.set(serializer, 'store', this);
        _serializerCache[normalizedModelName] = serializer;
        return serializer;
      }

      // no serializer found for the specific model, fallback and check for application serializer
      serializer = _serializerCache.application || owner.lookup('serializer:application');
      if (serializer !== undefined) {
        Ember.set(serializer, 'store', this);
        _serializerCache[normalizedModelName] = serializer;
        _serializerCache.application = serializer;
        return serializer;
      }

      // no model specific serializer or application serializer, check for the `defaultSerializer`
      // property defined on the adapter
      var adapter = this.adapterFor(modelName);
      var serializerName = Ember.get(adapter, 'defaultSerializer');
      serializer = _serializerCache[serializerName] || owner.lookup('serializer:' + serializerName);
      if (serializer !== undefined) {
        Ember.set(serializer, 'store', this);
        _serializerCache[normalizedModelName] = serializer;
        _serializerCache[serializerName] = serializer;
        return serializer;
      }

      // final fallback, no model specific serializer, no application serializer, no
      // `serializer` property on store: use json-api serializer
      serializer = _serializerCache['-default'] || owner.lookup('serializer:-default');
      Ember.set(serializer, 'store', this);
      _serializerCache[normalizedModelName] = serializer;
      _serializerCache['-default'] = serializer;

      return serializer;
    },
    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);
      this._pushedInternalModels = null;
      this.recordArrayManager.destroy();

      this._relationshipsPayloads = null;
      this._adapterCache = null;
      this._serializerCache = null;

      this.unloadAll();

      
    },
    _updateRelationshipState: function _updateRelationshipState(relationship) {
      var _this4 = this;

      if (this._updatedRelationships.push(relationship) !== 1) {
        return;
      }

      this._backburner.join(function () {
        _this4._backburner.schedule('syncRelationships', _this4, _this4._flushUpdatedRelationships);
      });
    },
    _flushUpdatedRelationships: function _flushUpdatedRelationships() {
      var updated = this._updatedRelationships;

      for (var i = 0, l = updated.length; i < l; i++) {
        updated[i].flushCanonical();
      }

      updated.length = 0;
    },
    _updateInternalModel: function _updateInternalModel(internalModel) {
      if (this._updatedInternalModels.push(internalModel) !== 1) {
        return;
      }

      emberRun$1.schedule('actions', this, this._flushUpdatedInternalModels);
    },
    _flushUpdatedInternalModels: function _flushUpdatedInternalModels() {
      var updated = this._updatedInternalModels;

      for (var i = 0, l = updated.length; i < l; i++) {
        updated[i]._triggerDeferredTriggers();
      }

      updated.length = 0;
    },
    _pushResourceIdentifier: function _pushResourceIdentifier(relationship, resourceIdentifier) {
      if (Ember.isNone(resourceIdentifier)) {
        return;
      }
      assertRelationshipData(this, relationship.internalModel, resourceIdentifier, relationship.relationshipMeta);

      return this._internalModelForId(resourceIdentifier.type, resourceIdentifier.id);
    },
    _pushResourceIdentifiers: function _pushResourceIdentifiers(relationship, resourceIdentifiers) {
      if (Ember.isNone(resourceIdentifiers)) {
        return;
      }


      var _internalModels = new Array(resourceIdentifiers.length);
      for (var i = 0; i < resourceIdentifiers.length; i++) {
        _internalModels[i] = this._pushResourceIdentifier(relationship, resourceIdentifiers[i]);
      }
      return _internalModels;
    }
  });

  // Delegation to the adapter and promise management

  function defaultSerializer(store) {
    return store.serializerFor('application');
  }

  function _commit(adapter, store, operation, snapshot) {
    var internalModel = snapshot._internalModel;
    var modelName = snapshot.modelName;
    var modelClass = store.modelFor(modelName);


    var promise = Ember.RSVP.Promise.resolve().then(function () {
      return adapter[operation](store, modelClass, snapshot);
    });
    var serializer = serializerForAdapter(store, adapter, modelName);
    var label = 'DS: Extract and notify about ' + operation + ' completion of ' + internalModel;


    promise = guardDestroyedStore(promise, store, label);
    promise = _guard(promise, _bind(_objectIsAlive, internalModel));

    return promise.then(function (adapterPayload) {
      /*
      Note to future spelunkers hoping to optimize.
      We rely on this `run` to create a run loop if needed
      that `store._push` and `store.didSaveRecord` will both share.
       We use `join` because it is often the case that we
      have an outer run loop available still from the first
      call to `store._push`;
      */
      store._backburner.join(function () {
        var payload = void 0,
            data = void 0;
        if (adapterPayload) {
          payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, snapshot.id, operation);
          if (payload.included) {
            store._push({ data: null, included: payload.included });
          }
          data = payload.data;
        }
        store.didSaveRecord(internalModel, { data: data });
      });

      return internalModel;
    }, function (error) {
      if (error instanceof InvalidError) {
        var errors = serializer.extractErrors(store, modelClass, error, snapshot.id);

        store.recordWasInvalid(internalModel, errors);
      } else {
        store.recordWasError(internalModel, error);
      }

      throw error;
    }, label);
  }

  function isInverseRelationshipInitialized(store, internalModel, data, key, modelNameToInverseMap) {
    var relationshipData = data.relationships[key].data;

    if (!relationshipData) {
      // can't check inverse for eg { comments: { links: { related: URL }}}
      return false;
    }

    var inverseMap = modelNameToInverseMap[internalModel.modelName];
    if (!inverseMap) {
      inverseMap = modelNameToInverseMap[internalModel.modelName] = Ember.get(internalModel.type, 'inverseMap');
    }
    var inverseRelationshipMetadata = inverseMap[key];
    if (inverseRelationshipMetadata === undefined) {
      inverseRelationshipMetadata = internalModel.type.inverseFor(key, store);
    }

    if (!inverseRelationshipMetadata) {
      return false;
    }

    var _inverseRelationshipM = inverseRelationshipMetadata,
        inverseRelationshipName = _inverseRelationshipM.name;


    if (Array.isArray(relationshipData)) {
      for (var i = 0; i < relationshipData.length; ++i) {
        var inverseInternalModel = store._internalModelsFor(relationshipData[i].type).get(relationshipData[i].id);
        if (inverseInternalModel && inverseInternalModel._relationships.has(inverseRelationshipName)) {
          return true;
        }
      }

      return false;
    } else {
      var _inverseInternalModel = store._internalModelsFor(relationshipData.type).get(relationshipData.id);
      return _inverseInternalModel && _inverseInternalModel._relationships.has(inverseRelationshipName);
    }
  }

  /**
   * @function
   * @param store
   * @param cache modelFactoryCache
   * @param normalizedModelName already normalized modelName
   * @return {*}
   */
  function getModelFactory(store, cache, normalizedModelName) {
    var factory = cache[normalizedModelName];

    if (!factory) {
      factory = _lookupModelFactory(store, normalizedModelName);

      if (!factory) {
        //Support looking up mixins as base types for polymorphic relationships
        factory = _modelForMixin2(store, normalizedModelName);
      }

      if (!factory) {
        // we don't cache misses in case someone wants to register a missing model
        return null;
      }

      // interopt with the future
      var klass = getOwner(store).factoryFor ? factory.class : factory;

      // TODO: deprecate this

      var hasOwnModelNameSet = klass.modelName && klass.hasOwnProperty('modelName');
      if (!hasOwnModelNameSet) {
        klass.modelName = normalizedModelName;
      }

      cache[normalizedModelName] = factory;
    }

    return factory;
  }

  function _lookupModelFactory(store, normalizedModelName) {
    var owner = getOwner(store);

    if (owner.factoryFor) {
      return owner.factoryFor('model:' + normalizedModelName);
    } else {
      return owner._lookupFactory('model:' + normalizedModelName);
    }
  }

  /*
    In case someone defined a relationship to a mixin, for example:
    ```
      let Comment = DS.Model.extend({
        owner: belongsTo('commentable'. { polymorphic: true })
      });
      let Commentable = Ember.Mixin.create({
        comments: hasMany('comment')
      });
    ```
    we want to look up a Commentable class which has all the necessary
    relationship metadata. Thus, we look up the mixin and create a mock
    DS.Model, so we can access the relationship CPs of the mixin (`comments`)
    in this case
  */
  function _modelForMixin2(store, normalizedModelName) {
    // container.registry = 2.1
    // container._registry = 1.11 - 2.0
    // container = < 1.11
    var owner = getOwner(store);
    var mixin = void 0;

    if (owner.factoryFor) {
      var MaybeMixin = owner.factoryFor('mixin:' + normalizedModelName);
      mixin = MaybeMixin && MaybeMixin.class;
    } else {
      mixin = owner._lookupFactory('mixin:' + normalizedModelName);
    }

    if (mixin) {
      var ModelForMixin = Model.extend(mixin);
      ModelForMixin.reopenClass({
        __isMixin: true,
        __mixin: mixin
      });

      //Cache the class as a model
      owner.register('model:' + normalizedModelName, ModelForMixin);
    }

    return _lookupModelFactory(store, normalizedModelName);
  }

  function setupRelationships(store, internalModel, data, modelNameToInverseMap) {
    Object.keys(data.relationships).forEach(function (relationshipName) {
      var relationships = internalModel._relationships;
      var relationshipRequiresNotification = relationships.has(relationshipName) || isInverseRelationshipInitialized(store, internalModel, data, relationshipName, modelNameToInverseMap);

      if (relationshipRequiresNotification) {
        var relationshipData = data.relationships[relationshipName];
        relationships.get(relationshipName).push(relationshipData, false);
      }

      
    });
  }

  function assertRelationshipData(store, internalModel, data, meta) {
  }
  var Store$1 = Store;

  /**
    @module ember-data
  */

  /**
    All Ember Data classes, methods and functions are defined inside of this namespace.

    @class DS
    @static
  */

  /**
    @property VERSION
    @type String
    @static
  */
  var DS = Ember.Namespace.create({
    VERSION: VERSION,
    name: 'DS'
  });

  if (Ember.libraries) {
    Ember.libraries.registerCoreLibrary('Ember Data', DS.VERSION);
  }

  /**
    `DS.belongsTo` is used to define One-To-One and One-To-Many
    relationships on a [DS.Model](/api/data/classes/DS.Model.html).


    `DS.belongsTo` takes an optional hash as a second parameter, currently
    supported options are:

    - `async`: A boolean value used to explicitly declare this to be an async relationship.
    - `inverse`: A string used to identify the inverse property on a
      related model in a One-To-Many relationship. See [Explicit Inverses](#toc_explicit-inverses)

    #### One-To-One
    To declare a one-to-one relationship between two models, use
    `DS.belongsTo`:

    ```app/models/user.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      profile: DS.belongsTo('profile')
    });
    ```

    ```app/models/profile.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      user: DS.belongsTo('user')
    });
    ```

    #### One-To-Many
    To declare a one-to-many relationship between two models, use
    `DS.belongsTo` in combination with `DS.hasMany`, like this:

    ```app/models/post.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      comments: DS.hasMany('comment')
    });
    ```

    ```app/models/comment.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      post: DS.belongsTo('post')
    });
    ```

    You can avoid passing a string as the first parameter. In that case Ember Data
    will infer the type from the key name.

    ```app/models/comment.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      post: DS.belongsTo()
    });
    ```

    will lookup for a Post type.

    @namespace
    @method belongsTo
    @for DS
    @param {String} modelName (optional) type of the relationship
    @param {Object} options (optional) a hash of options
    @return {Ember.computed} relationship
  */
  function belongsTo(modelName, options) {
    var opts = void 0,
        userEnteredModelName = void 0;
    if (typeof modelName === 'object') {
      opts = modelName;
      userEnteredModelName = undefined;
    } else {
      opts = options;
      userEnteredModelName = modelName;
    }

    if (typeof userEnteredModelName === 'string') {
      userEnteredModelName = normalizeModelName(userEnteredModelName);
    }


    opts = opts || {};

    var meta = {
      type: userEnteredModelName,
      isRelationship: true,
      options: opts,
      kind: 'belongsTo',
      name: 'Belongs To',
      key: null
    };

    return Ember.computed({
      get: function get(key) {
        if (opts.hasOwnProperty('serialize')) {
        }

        if (opts.hasOwnProperty('embedded')) {
        }

        return this._internalModel._relationships.get(key).getData();
      },
      set: function set(key, value) {
        this._internalModel.setDirtyBelongsTo(key, value);

        return this._internalModel._relationships.get(key).getData();
      }
    }).meta(meta);
  }

  /**
    @module ember-data
  */

  /**
    `DS.hasMany` is used to define One-To-Many and Many-To-Many
    relationships on a [DS.Model](/api/data/classes/DS.Model.html).

    `DS.hasMany` takes an optional hash as a second parameter, currently
    supported options are:

    - `async`: A boolean value used to explicitly declare this to be an async relationship.
    - `inverse`: A string used to identify the inverse property on a related model.

    #### One-To-Many
    To declare a one-to-many relationship between two models, use
    `DS.belongsTo` in combination with `DS.hasMany`, like this:

    ```app/models/post.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      comments: DS.hasMany('comment')
    });
    ```

    ```app/models/comment.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      post: DS.belongsTo('post')
    });
    ```

    #### Many-To-Many
    To declare a many-to-many relationship between two models, use
    `DS.hasMany`:

    ```app/models/post.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      tags: DS.hasMany('tag')
    });
    ```

    ```app/models/tag.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      posts: DS.hasMany('post')
    });
    ```

    You can avoid passing a string as the first parameter. In that case Ember Data
    will infer the type from the singularized key name.

    ```app/models/post.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      tags: DS.hasMany()
    });
    ```

    will lookup for a Tag type.

    #### Explicit Inverses

    Ember Data will do its best to discover which relationships map to
    one another. In the one-to-many code above, for example, Ember Data
    can figure out that changing the `comments` relationship should update
    the `post` relationship on the inverse because post is the only
    relationship to that model.

    However, sometimes you may have multiple `belongsTo`/`hasMany` for the
    same type. You can specify which property on the related model is
    the inverse using `DS.hasMany`'s `inverse` option:

    ```app/models/comment.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      onePost: DS.belongsTo('post'),
      twoPost: DS.belongsTo('post'),
      redPost: DS.belongsTo('post'),
      bluePost: DS.belongsTo('post')
    });
    ```

    ```app/models/post.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      comments: DS.hasMany('comment', {
        inverse: 'redPost'
      })
    });
    ```

    You can also specify an inverse on a `belongsTo`, which works how
    you'd expect.

    @namespace
    @method hasMany
    @for DS
    @param {String} type (optional) type of the relationship
    @param {Object} options (optional) a hash of options
    @return {Ember.computed} relationship
  */
  function hasMany(type, options) {
    if (typeof type === 'object') {
      options = type;
      type = undefined;
    }


    options = options || {};

    if (typeof type === 'string') {
      type = normalizeModelName(type);
    }

    // Metadata about relationships is stored on the meta of
    // the relationship. This is used for introspection and
    // serialization. Note that `key` is populated lazily
    // the first time the CP is called.
    var meta = {
      type: type,
      options: options,
      isRelationship: true,
      kind: 'hasMany',
      name: 'Has Many',
      key: null
    };

    return Ember.computed({
      get: function get(key) {
        return this._internalModel._relationships.get(key).getData();
      },
      set: function set(key, records) {
        this._internalModel.setDirtyHasMany(key, records);

        return this._internalModel._relationships.get(key).getData();
      }
    }).meta(meta);
  }

  /**

    WARNING: This interface is likely to change in order to accomodate https://github.com/emberjs/rfcs/pull/4

    ## Using BuildURLMixin

    To use url building, include the mixin when extending an adapter, and call `buildURL` where needed.
    The default behaviour is designed for RESTAdapter.

    ### Example

    ```javascript
    export default DS.Adapter.extend(BuildURLMixin, {
      findRecord: function(store, type, id, snapshot) {
        var url = this.buildURL(type.modelName, id, snapshot, 'findRecord');
        return this.ajax(url, 'GET');
      }
    });
    ```

    ### Attributes

    The `host` and `namespace` attributes will be used if defined, and are optional.

    @class BuildURLMixin
    @namespace DS
  */
  var buildUrlMixin = Ember.Mixin.create({
    /**
      Builds a URL for a given type and optional ID.
       By default, it pluralizes the type's name (for example, 'post'
      becomes 'posts' and 'person' becomes 'people'). To override the
      pluralization see [pathForType](#method_pathForType).
       If an ID is specified, it adds the ID to the path generated
      for the type, separated by a `/`.
       When called by RESTAdapter.findMany() the `id` and `snapshot` parameters
      will be arrays of ids and snapshots.
       @method buildURL
      @param {String} modelName
      @param {(String|Array|Object)} id single id or array of ids or query
      @param {(DS.Snapshot|Array)} snapshot single snapshot or array of snapshots
      @param {String} requestType
      @param {Object} query object of query parameters to send for query requests.
      @return {String} url
    */
    buildURL: function buildURL(modelName, id, snapshot, requestType, query) {
      switch (requestType) {
        case 'findRecord':
          return this.urlForFindRecord(id, modelName, snapshot);
        case 'findAll':
          return this.urlForFindAll(modelName, snapshot);
        case 'query':
          return this.urlForQuery(query, modelName);
        case 'queryRecord':
          return this.urlForQueryRecord(query, modelName);
        case 'findMany':
          return this.urlForFindMany(id, modelName, snapshot);
        case 'findHasMany':
          return this.urlForFindHasMany(id, modelName, snapshot);
        case 'findBelongsTo':
          return this.urlForFindBelongsTo(id, modelName, snapshot);
        case 'createRecord':
          return this.urlForCreateRecord(modelName, snapshot);
        case 'updateRecord':
          return this.urlForUpdateRecord(id, modelName, snapshot);
        case 'deleteRecord':
          return this.urlForDeleteRecord(id, modelName, snapshot);
        default:
          return this._buildURL(modelName, id);
      }
    },


    /**
      @method _buildURL
      @private
      @param {String} modelName
      @param {String} id
      @return {String} url
    */
    _buildURL: function _buildURL(modelName, id) {
      var path = void 0;
      var url = [];
      var host = Ember.get(this, 'host');
      var prefix = this.urlPrefix();

      if (modelName) {
        path = this.pathForType(modelName);
        if (path) {
          url.push(path);
        }
      }

      if (id) {
        url.push(encodeURIComponent(id));
      }
      if (prefix) {
        url.unshift(prefix);
      }

      url = url.join('/');
      if (!host && url && url.charAt(0) !== '/') {
        url = '/' + url;
      }

      return url;
    },


    /**
     Builds a URL for a `store.findRecord(type, id)` call.
      Example:
      ```app/adapters/user.js
     import DS from 'ember-data';
      export default DS.JSONAPIAdapter.extend({
       urlForFindRecord(id, modelName, snapshot) {
         let baseUrl = this.buildURL(modelName, id, snapshot);
         return `${baseUrl}/users/${snapshot.adapterOptions.user_id}/playlists/${id}`;
       }
     });
     ```
      @method urlForFindRecord
     @param {String} id
     @param {String} modelName
     @param {DS.Snapshot} snapshot
     @return {String} url
      */
    urlForFindRecord: function urlForFindRecord(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },


    /**
     Builds a URL for a `store.findAll(type)` call.
      Example:
      ```app/adapters/comment.js
     import DS from 'ember-data';
      export default DS.JSONAPIAdapter.extend({
       urlForFindAll(modelName, snapshot) {
         return 'data/comments.json';
       }
     });
     ```
      @method urlForFindAll
     @param {String} modelName
     @param {DS.SnapshotRecordArray} snapshot
     @return {String} url
     */
    urlForFindAll: function urlForFindAll(modelName, snapshot) {
      return this._buildURL(modelName);
    },


    /**
     Builds a URL for a `store.query(type, query)` call.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       host: 'https://api.github.com',
       urlForQuery (query, modelName) {
         switch(modelName) {
           case 'repo':
             return `https://api.github.com/orgs/${query.orgId}/repos`;
           default:
             return this._super(...arguments);
         }
       }
     });
     ```
      @method urlForQuery
     @param {Object} query
     @param {String} modelName
     @return {String} url
     */
    urlForQuery: function urlForQuery(query, modelName) {
      return this._buildURL(modelName);
    },


    /**
     Builds a URL for a `store.queryRecord(type, query)` call.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       urlForQueryRecord({ slug }, modelName) {
         let baseUrl = this.buildURL();
         return `${baseUrl}/${encodeURIComponent(slug)}`;
       }
     });
     ```
      @method urlForQueryRecord
     @param {Object} query
     @param {String} modelName
     @return {String} url
     */
    urlForQueryRecord: function urlForQueryRecord(query, modelName) {
      return this._buildURL(modelName);
    },


    /**
     Builds a URL for coalesceing multiple `store.findRecord(type, id)`
     records into 1 request when the adapter's `coalesceFindRequests`
     property is true.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       urlForFindMany(ids, modelName) {
         let baseUrl = this.buildURL();
         return `${baseUrl}/coalesce`;
       }
     });
     ```
      @method urlForFindMany
     @param {Array} ids
     @param {String} modelName
     @param {Array} snapshots
     @return {String} url
     */
    urlForFindMany: function urlForFindMany(ids, modelName, snapshots) {
      return this._buildURL(modelName);
    },


    /**
     Builds a URL for fetching a async hasMany relationship when a url
     is not provided by the server.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.JSONAPIAdapter.extend({
       urlForFindHasMany(id, modelName, snapshot) {
         let baseUrl = this.buildURL(id, modelName);
         return `${baseUrl}/relationships`;
       }
     });
     ```
      @method urlForFindHasMany
     @param {String} id
     @param {String} modelName
     @param {DS.Snapshot} snapshot
     @return {String} url
     */
    urlForFindHasMany: function urlForFindHasMany(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },


    /**
     Builds a URL for fetching a async belongsTo relationship when a url
     is not provided by the server.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.JSONAPIAdapter.extend({
       urlForFindBelongsTo(id, modelName, snapshot) {
         let baseUrl = this.buildURL(id, modelName);
         return `${baseUrl}/relationships`;
       }
     });
     ```
      @method urlForFindBelongsTo
     @param {String} id
     @param {String} modelName
     @param {DS.Snapshot} snapshot
     @return {String} url
     */
    urlForFindBelongsTo: function urlForFindBelongsTo(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },


    /**
     Builds a URL for a `record.save()` call when the record was created
     locally using `store.createRecord()`.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       urlForCreateRecord(modelName, snapshot) {
         return this._super(...arguments) + '/new';
       }
     });
     ```
      @method urlForCreateRecord
     @param {String} modelName
     @param {DS.Snapshot} snapshot
     @return {String} url
     */
    urlForCreateRecord: function urlForCreateRecord(modelName, snapshot) {
      return this._buildURL(modelName);
    },


    /**
     Builds a URL for a `record.save()` call when the record has been update locally.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       urlForUpdateRecord(id, modelName, snapshot) {
         return `/${id}/feed?access_token=${snapshot.adapterOptions.token}`;
       }
     });
     ```
      @method urlForUpdateRecord
     @param {String} id
     @param {String} modelName
     @param {DS.Snapshot} snapshot
     @return {String} url
     */
    urlForUpdateRecord: function urlForUpdateRecord(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },


    /**
     Builds a URL for a `record.save()` call when the record has been deleted locally.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       urlForDeleteRecord(id, modelName, snapshot) {
         return this._super(...arguments) + '/destroy';
       }
     });
     ```
      @method urlForDeleteRecord
     @param {String} id
     @param {String} modelName
     @param {DS.Snapshot} snapshot
     @return {String} url
     */
    urlForDeleteRecord: function urlForDeleteRecord(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },


    /**
      @method urlPrefix
      @private
      @param {String} path
      @param {String} parentURL
      @return {String} urlPrefix
    */
    urlPrefix: function urlPrefix(path, parentURL) {
      var host = Ember.get(this, 'host');
      var namespace = Ember.get(this, 'namespace');

      if (!host || host === '/') {
        host = '';
      }

      if (path) {
        // Protocol relative url
        if (/^\/\//.test(path) || /http(s)?:\/\//.test(path)) {
          // Do nothing, the full host is already included.
          return path;

          // Absolute path
        } else if (path.charAt(0) === '/') {
          return '' + host + path;
          // Relative path
        } else {
          return parentURL + '/' + path;
        }
      }

      // No path provided
      var url = [];
      if (host) {
        url.push(host);
      }
      if (namespace) {
        url.push(namespace);
      }
      return url.join('/');
    },


    /**
      Determines the pathname for a given type.
       By default, it pluralizes the type's name (for example,
      'post' becomes 'posts' and 'person' becomes 'people').
       ### Pathname customization
       For example if you have an object LineItem with an
      endpoint of "/line_items/".
       ```app/adapters/application.js
      import DS from 'ember-data';
      import { decamelize } from '@ember/string';
      import { pluralize } from 'ember-inflector';
       export default DS.RESTAdapter.extend({
        pathForType: function(modelName) {
          var decamelized = decamelize(modelName);
          return pluralize(decamelized);
        }
      });
      ```
       @method pathForType
      @param {String} modelName
      @return {String} path
    **/
    pathForType: function pathForType(modelName) {
      var camelized = Ember.String.camelize(modelName);
      return emberInflector.pluralize(camelized);
    }
  });

  /**
    @module ember-data
  */

  function getDefaultValue(record, options, key) {
    if (typeof options.defaultValue === 'function') {
      return options.defaultValue.apply(null, arguments);
    } else {
      var defaultValue = options.defaultValue;

      return defaultValue;
    }
  }

  function hasValue(record, key) {
    return key in record._attributes || key in record._inFlightAttributes || key in record._data;
  }

  /**
    `DS.attr` defines an attribute on a [DS.Model](/api/data/classes/DS.Model.html).
    By default, attributes are passed through as-is, however you can specify an
    optional type to have the value automatically transformed.
    Ember Data ships with four basic transform types: `string`, `number`,
    `boolean` and `date`. You can define your own transforms by subclassing
    [DS.Transform](/api/data/classes/DS.Transform.html).

    Note that you cannot use `attr` to define an attribute of `id`.

    `DS.attr` takes an optional hash as a second parameter, currently
    supported options are:

    - `defaultValue`: Pass a string or a function to be called to set the attribute
    to a default value if none is supplied.

    Example

    ```app/models/user.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      username: DS.attr('string'),
      email: DS.attr('string'),
      verified: DS.attr('boolean', { defaultValue: false })
    });
    ```

    Default value can also be a function. This is useful it you want to return
    a new object for each attribute.

    ```app/models/user.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      username: DS.attr('string'),
      email: DS.attr('string'),
      settings: DS.attr({
        defaultValue() {
          return {};
        }
      })
    });
    ```

    The `options` hash is passed as second argument to a transforms'
    `serialize` and `deserialize` method. This allows to configure a
    transformation and adapt the corresponding value, based on the config:

    ```app/models/post.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      text: DS.attr('text', {
        uppercase: true
      })
    });
    ```

    ```app/transforms/text.js
    import DS from 'ember-data';

    export default DS.Transform.extend({
      serialize(value, options) {
        if (options.uppercase) {
          return value.toUpperCase();
        }

        return value;
      },

      deserialize(value) {
        return value;
      }
    })
    ```

    @namespace
    @method attr
    @for DS
    @param {String|Object} type the attribute type
    @param {Object} options a hash of options
    @return {Attribute}
  */

  function attr(type, options) {
    if (typeof type === 'object') {
      options = type;
      type = undefined;
    } else {
      options = options || {};
    }

    var meta = {
      type: type,
      isAttribute: true,
      options: options
    };

    return Ember.computed({
      get: function get(key) {
        var internalModel = this._internalModel;
        if (hasValue(internalModel, key)) {
          return internalModel.getAttributeValue(key);
        } else {
          return getDefaultValue(this, options, key);
        }
      },
      set: function set(key, value) {
        return this._internalModel.setDirtyAttribute(key, value);
      }
    }).meta(meta);
  }

  var newline = /\r?\n/;

  function parseResponseHeaders(headersString) {
    var headers = Object.create(null);

    if (!headersString) {
      return headers;
    }

    var headerPairs = headersString.split(newline);

    for (var i = 0; i < headerPairs.length; i++) {
      var header = headerPairs[i];
      var j = 0;
      var foundSep = false;

      for (; j < header.length; j++) {
        if (header.charCodeAt(j) === 58 /* ':' */) {
            foundSep = true;
            break;
          }
      }

      if (foundSep === false) {
        continue;
      }

      var field = header.substring(0, j).trim();
      var value = header.substring(j + 1, header.length).trim();

      if (value) {
        headers[field] = value;
      }
    }

    return headers;
  }

  function isEnabled() {
    var _Ember$FEATURES;

    return (_Ember$FEATURES = Ember.FEATURES).isEnabled.apply(_Ember$FEATURES, arguments);
  }

  /*
    Extend `Ember.DataAdapter` with ED specific code.

    @class DebugAdapter
    @namespace DS
    @extends Ember.DataAdapter
    @private
  */
  /**
    @module ember-data
  */
  var debugAdapter = Ember.DataAdapter.extend({
    getFilters: function getFilters() {
      return [{ name: 'isNew', desc: 'New' }, { name: 'isModified', desc: 'Modified' }, { name: 'isClean', desc: 'Clean' }];
    },
    detect: function detect(typeClass) {
      return typeClass !== Model && Model.detect(typeClass);
    },
    columnsForType: function columnsForType(typeClass) {
      var columns = [{
        name: 'id',
        desc: 'Id'
      }];
      var count = 0;
      var self = this;
      Ember.get(typeClass, 'attributes').forEach(function (meta, name) {
        if (count++ > self.attributeLimit) {
          return false;
        }
        var desc = Ember.String.capitalize(Ember.String.underscore(name).replace('_', ' '));
        columns.push({ name: name, desc: desc });
      });
      return columns;
    },
    getRecords: function getRecords(modelClass, modelName) {
      if (arguments.length < 2) {
        // Legacy Ember.js < 1.13 support
        var containerKey = modelClass._debugContainerKey;
        if (containerKey) {
          var match = containerKey.match(/model:(.*)/);
          if (match !== null) {
            modelName = match[1];
          }
        }
      }

      return this.get('store').peekAll(modelName);
    },
    getRecordColumnValues: function getRecordColumnValues(record) {
      var _this = this;

      var count = 0;
      var columnValues = { id: Ember.get(record, 'id') };

      record.eachAttribute(function (key) {
        if (count++ > _this.attributeLimit) {
          return false;
        }
        columnValues[key] = Ember.get(record, key);
      });
      return columnValues;
    },
    getRecordKeywords: function getRecordKeywords(record) {
      var keywords = [];
      var keys = Ember.A(['id']);
      record.eachAttribute(function (key) {
        return keys.push(key);
      });
      keys.forEach(function (key) {
        return keywords.push(Ember.get(record, key));
      });
      return keywords;
    },
    getRecordFilterValues: function getRecordFilterValues(record) {
      return {
        isNew: record.get('isNew'),
        isModified: record.get('hasDirtyAttributes') && !record.get('isNew'),
        isClean: !record.get('hasDirtyAttributes')
      };
    },
    getRecordColor: function getRecordColor(record) {
      var color = 'black';
      if (record.get('isNew')) {
        color = 'green';
      } else if (record.get('hasDirtyAttributes')) {
        color = 'blue';
      }
      return color;
    },
    observeRecord: function observeRecord(record, recordUpdated) {
      var releaseMethods = Ember.A();
      var keysToObserve = Ember.A(['id', 'isNew', 'hasDirtyAttributes']);

      record.eachAttribute(function (key) {
        return keysToObserve.push(key);
      });
      var adapter = this;

      keysToObserve.forEach(function (key) {
        var handler = function handler() {
          recordUpdated(adapter.wrapRecord(record));
        };
        Ember.addObserver(record, key, handler);
        releaseMethods.push(function () {
          Ember.removeObserver(record, key, handler);
        });
      });

      var release = function release() {
        releaseMethods.forEach(function (fn) {
          return fn();
        });
      };

      return release;
    }
  });

  // public

  exports.Model = Model;
  exports.Errors = Errors;
  exports.Store = Store$1;
  exports.DS = DS;
  exports.belongsTo = belongsTo;
  exports.hasMany = hasMany;
  exports.BuildURLMixin = buildUrlMixin;
  exports.Snapshot = Snapshot;
  exports.attr = attr;
  exports.AdapterError = AdapterError;
  exports.InvalidError = InvalidError;
  exports.UnauthorizedError = UnauthorizedError;
  exports.ForbiddenError = ForbiddenError;
  exports.NotFoundError = NotFoundError;
  exports.ConflictError = ConflictError;
  exports.ServerError = ServerError;
  exports.TimeoutError = TimeoutError;
  exports.AbortError = AbortError;
  exports.errorsHashToArray = errorsHashToArray;
  exports.errorsArrayToHash = errorsArrayToHash;
  exports.normalizeModelName = normalizeModelName;
  exports.getOwner = getOwner;
  exports.modelHasAttributeOrRelationshipNamedType = modelHasAttributeOrRelationshipNamedType;
  exports.coerceId = coerceId;
  exports.parseResponseHeaders = parseResponseHeaders;
  exports.isEnabled = isEnabled;
  exports.RootState = RootState$1;
  exports.InternalModel = InternalModel;
  exports.PromiseArray = PromiseArray;
  exports.PromiseObject = PromiseObject;
  exports.PromiseManyArray = PromiseManyArray;
  exports.RecordArray = RecordArray;
  exports.AdapterPopulatedRecordArray = AdapterPopulatedRecordArray;
  exports.ManyArray = ManyArray;
  exports.RecordArrayManager = RecordArrayManager;
  exports.Relationship = Relationship;
  exports.Map = MapWithDeprecations;
  exports.MapWithDefault = MapWithDefault;
  exports.DebugAdapter = debugAdapter;
  exports.diffArray = diffArray;
  exports.RelationshipPayloadsManager = RelationshipPayloadsManager;
  exports.RelationshipPayloads = RelationshipPayloads;
  exports.SnapshotRecordArray = SnapshotRecordArray;

  Object.defineProperty(exports, '__esModule', { value: true });

});
