define('ember-data/adapters/rest', ['exports', 'ember-data/adapter', 'ember-data/-private'], function (exports, _adapter, _private) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Promise = Ember.RSVP.Promise;

  /**
    The REST adapter allows your store to communicate with an HTTP server by
    transmitting JSON via XHR. Most Ember.js apps that consume a JSON API
    should use the REST adapter.
  
    This adapter is designed around the idea that the JSON exchanged with
    the server should be conventional.
  
    ## Success and failure
  
    The REST adapter will consider a success any response with a status code
    of the 2xx family ("Success"), as well as 304 ("Not Modified"). Any other
    status code will be considered a failure.
  
    On success, the request promise will be resolved with the full response
    payload.
  
    Failed responses with status code 422 ("Unprocessable Entity") will be
    considered "invalid". The response will be discarded, except for the
    `errors` key. The request promise will be rejected with a `DS.InvalidError`.
    This error object will encapsulate the saved `errors` value.
  
    Any other status codes will be treated as an "adapter error". The request
    promise will be rejected, similarly to the "invalid" case, but with
    an instance of `DS.AdapterError` instead.
  
    ## JSON Structure
  
    The REST adapter expects the JSON returned from your server to follow
    these conventions.
  
    ### Object Root
  
    The JSON payload should be an object that contains the record inside a
    root property. For example, in response to a `GET` request for
    `/posts/1`, the JSON should look like this:
  
    ```js
    {
      "posts": {
        "id": 1,
        "title": "I'm Running to Reform the W3C's Tag",
        "author": "Yehuda Katz"
      }
    }
    ```
  
    Similarly, in response to a `GET` request for `/posts`, the JSON should
    look like this:
  
    ```js
    {
      "posts": [
        {
          "id": 1,
          "title": "I'm Running to Reform the W3C's Tag",
          "author": "Yehuda Katz"
        },
        {
          "id": 2,
          "title": "Rails is omakase",
          "author": "D2H"
        }
      ]
    }
    ```
  
    Note that the object root can be pluralized for both a single-object response
    and an array response: the REST adapter is not strict on this. Further, if the
    HTTP server responds to a `GET` request to `/posts/1` (e.g. the response to a
    `findRecord` query) with more than one object in the array, Ember Data will
    only display the object with the matching ID.
  
    ### Conventional Names
  
    Attribute names in your JSON payload should be the camelCased versions of
    the attributes in your Ember.js models.
  
    For example, if you have a `Person` model:
  
    ```app/models/person.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      firstName: DS.attr('string'),
      lastName: DS.attr('string'),
      occupation: DS.attr('string')
    });
    ```
  
    The JSON returned should look like this:
  
    ```js
    {
      "people": {
        "id": 5,
        "firstName": "Zaphod",
        "lastName": "Beeblebrox",
        "occupation": "President"
      }
    }
    ```
  
    #### Relationships
  
    Relationships are usually represented by ids to the record in the
    relationship. The related records can then be sideloaded in the
    response under a key for the type.
  
    ```js
    {
      "posts": {
        "id": 5,
        "title": "I'm Running to Reform the W3C's Tag",
        "author": "Yehuda Katz",
        "comments": [1, 2]
      },
      "comments": [{
        "id": 1,
        "author": "User 1",
        "message": "First!",
      }, {
        "id": 2,
        "author": "User 2",
        "message": "Good Luck!",
      }]
    }
    ```
  
    If the records in the relationship are not known when the response
    is serialized its also possible to represent the relationship as a
    url using the `links` key in the response. Ember Data will fetch
    this url to resolve the relationship when it is accessed for the
    first time.
  
    ```js
    {
      "posts": {
        "id": 5,
        "title": "I'm Running to Reform the W3C's Tag",
        "author": "Yehuda Katz",
        "links": {
          "comments": "/posts/5/comments"
        }
      }
    }
    ```
  
    ### Errors
  
    If a response is considered a failure, the JSON payload is expected to include
    a top-level key `errors`, detailing any specific issues. For example:
  
    ```js
    {
      "errors": {
        "msg": "Something went wrong"
      }
    }
    ```
  
    This adapter does not make any assumptions as to the format of the `errors`
    object. It will simply be passed along as is, wrapped in an instance
    of `DS.InvalidError` or `DS.AdapterError`. The serializer can interpret it
    afterwards.
  
    ## Customization
  
    ### Endpoint path customization
  
    Endpoint paths can be prefixed with a `namespace` by setting the namespace
    property on the adapter:
  
    ```app/adapters/application.js
    import DS from 'ember-data';
  
    export default DS.RESTAdapter.extend({
      namespace: 'api/1'
    });
    ```
    Requests for the `Person` model would now target `/api/1/people/1`.
  
    ### Host customization
  
    An adapter can target other hosts by setting the `host` property.
  
    ```app/adapters/application.js
    import DS from 'ember-data';
  
    export default DS.RESTAdapter.extend({
      host: 'https://api.example.com'
    });
    ```
  
    ### Headers customization
  
    Some APIs require HTTP headers, e.g. to provide an API key. Arbitrary
    headers can be set as key/value pairs on the `RESTAdapter`'s `headers`
    object and Ember Data will send them along with each ajax request.
  
  
    ```app/adapters/application.js
    import DS from 'ember-data';
    import { computed } from '@ember/object';
  
    export default DS.RESTAdapter.extend({
      headers: computed(function() {
        return {
          'API_KEY': 'secret key',
          'ANOTHER_HEADER': 'Some header value'
        };
      }
    });
    ```
  
    `headers` can also be used as a computed property to support dynamic
    headers. In the example below, the `session` object has been
    injected into an adapter by Ember's container.
  
    ```app/adapters/application.js
    import DS from 'ember-data';
    import { computed } from '@ember/object';
  
    export default DS.RESTAdapter.extend({
      headers: computed('session.authToken', function() {
        return {
          'API_KEY': this.get('session.authToken'),
          'ANOTHER_HEADER': 'Some header value'
        };
      })
    });
    ```
  
    In some cases, your dynamic headers may require data from some
    object outside of Ember's observer system (for example
    `document.cookie`). You can use the
    [volatile](/api/classes/Ember.ComputedProperty.html#method_volatile)
    function to set the property into a non-cached mode causing the headers to
    be recomputed with every request.
  
    ```app/adapters/application.js
    import DS from 'ember-data';
    import { get } from '@ember/object';
    import { computed } from '@ember/object';
  
    export default DS.RESTAdapter.extend({
      headers: computed(function() {
        return {
          'API_KEY': get(document.cookie.match(/apiKey\=([^;]*)/), '1'),
          'ANOTHER_HEADER': 'Some header value'
        };
      }).volatile()
    });
    ```
  
    @class RESTAdapter
    @constructor
    @namespace DS
    @extends DS.Adapter
    @uses DS.BuildURLMixin
  */
  /* global heimdall */
  /* globals najax */
  /**
    @module ember-data
  */

  var RESTAdapter = _adapter.default.extend(_private.BuildURLMixin, {
    defaultSerializer: '-rest',

    fastboot: Ember.computed(function () {
      return Ember.getOwner(this).lookup('service:fastboot');
    }),

    sortQueryParams: function sortQueryParams(obj) {
      var keys = Object.keys(obj);
      var len = keys.length;
      if (len < 2) {
        return obj;
      }
      var newQueryParams = {};
      var sortedKeys = keys.sort();

      for (var i = 0; i < len; i++) {
        newQueryParams[sortedKeys[i]] = obj[sortedKeys[i]];
      }
      return newQueryParams;
    },


    /**
      By default the RESTAdapter will send each find request coming from a `store.find`
      or from accessing a relationship separately to the server. If your server supports passing
      ids as a query string, you can set coalesceFindRequests to true to coalesce all find requests
      within a single runloop.
       For example, if you have an initial payload of:
       ```javascript
      {
        post: {
          id: 1,
          comments: [1, 2]
        }
      }
      ```
       By default calling `post.get('comments')` will trigger the following requests(assuming the
      comments haven't been loaded before):
       ```
      GET /comments/1
      GET /comments/2
      ```
       If you set coalesceFindRequests to `true` it will instead trigger the following request:
       ```
      GET /comments?ids[]=1&ids[]=2
      ```
       Setting coalesceFindRequests to `true` also works for `store.find` requests and `belongsTo`
      relationships accessed within the same runloop. If you set `coalesceFindRequests: true`
       ```javascript
      store.findRecord('comment', 1);
      store.findRecord('comment', 2);
      ```
       will also send a request to: `GET /comments?ids[]=1&ids[]=2`
       Note: Requests coalescing rely on URL building strategy. So if you override `buildURL` in your app
      `groupRecordsForFindMany` more likely should be overridden as well in order for coalescing to work.
       @property coalesceFindRequests
      @type {boolean}
    */
    coalesceFindRequests: false,

    findRecord: function findRecord(store, type, id, snapshot) {
      var url = this.buildURL(type.modelName, id, snapshot, 'findRecord');
      var query = this.buildQuery(snapshot);

      return this.ajax(url, 'GET', { data: query });
    },
    findAll: function findAll(store, type, sinceToken, snapshotRecordArray) {
      var query = this.buildQuery(snapshotRecordArray);
      var url = this.buildURL(type.modelName, null, snapshotRecordArray, 'findAll');

      if (sinceToken) {
        query.since = sinceToken;
      }

      return this.ajax(url, 'GET', { data: query });
    },
    query: function query(store, type, _query) {
      var url = this.buildURL(type.modelName, null, null, 'query', _query);

      if (this.sortQueryParams) {
        _query = this.sortQueryParams(_query);
      }

      return this.ajax(url, 'GET', { data: _query });
    },
    queryRecord: function queryRecord(store, type, query) {
      var url = this.buildURL(type.modelName, null, null, 'queryRecord', query);

      if (this.sortQueryParams) {
        query = this.sortQueryParams(query);
      }

      return this.ajax(url, 'GET', { data: query });
    },
    findMany: function findMany(store, type, ids, snapshots) {
      var url = this.buildURL(type.modelName, ids, snapshots, 'findMany');
      return this.ajax(url, 'GET', { data: { ids: ids } });
    },
    findHasMany: function findHasMany(store, snapshot, url, relationship) {
      var id = snapshot.id;
      var type = snapshot.modelName;

      url = this.urlPrefix(url, this.buildURL(type, id, snapshot, 'findHasMany'));

      return this.ajax(url, 'GET');
    },
    findBelongsTo: function findBelongsTo(store, snapshot, url, relationship) {
      var id = snapshot.id;
      var type = snapshot.modelName;

      url = this.urlPrefix(url, this.buildURL(type, id, snapshot, 'findBelongsTo'));
      return this.ajax(url, 'GET');
    },
    createRecord: function createRecord(store, type, snapshot) {
      var data = {};
      var serializer = store.serializerFor(type.modelName);
      var url = this.buildURL(type.modelName, null, snapshot, 'createRecord');

      serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

      return this.ajax(url, 'POST', { data: data });
    },
    updateRecord: function updateRecord(store, type, snapshot) {
      var data = {};
      var serializer = store.serializerFor(type.modelName);

      serializer.serializeIntoHash(data, type, snapshot);

      var id = snapshot.id;
      var url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

      return this.ajax(url, 'PUT', { data: data });
    },
    deleteRecord: function deleteRecord(store, type, snapshot) {
      var id = snapshot.id;

      return this.ajax(this.buildURL(type.modelName, id, snapshot, 'deleteRecord'), 'DELETE');
    },
    _stripIDFromURL: function _stripIDFromURL(store, snapshot) {
      var url = this.buildURL(snapshot.modelName, snapshot.id, snapshot);

      var expandedURL = url.split('/');
      // Case when the url is of the format ...something/:id
      // We are decodeURIComponent-ing the lastSegment because if it represents
      // the id, it has been encodeURIComponent-ified within `buildURL`. If we
      // don't do this, then records with id having special characters are not
      // coalesced correctly (see GH #4190 for the reported bug)
      var lastSegment = expandedURL[expandedURL.length - 1];
      var id = snapshot.id;
      if (decodeURIComponent(lastSegment) === id) {
        expandedURL[expandedURL.length - 1] = '';
      } else if (endsWith(lastSegment, '?id=' + id)) {
        //Case when the url is of the format ...something?id=:id
        expandedURL[expandedURL.length - 1] = lastSegment.substring(0, lastSegment.length - id.length - 1);
      }

      return expandedURL.join('/');
    },


    // http://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
    maxURLLength: 2048,

    groupRecordsForFindMany: function groupRecordsForFindMany(store, snapshots) {
      var groups = new _private.MapWithDefault({
        defaultValue: function defaultValue() {
          return [];
        }
      });
      var adapter = this;
      var maxURLLength = this.maxURLLength;

      snapshots.forEach(function (snapshot) {
        var baseUrl = adapter._stripIDFromURL(store, snapshot);
        groups.get(baseUrl).push(snapshot);
      });

      function splitGroupToFitInUrl(group, maxURLLength, paramNameLength) {
        var idsSize = 0;
        var baseUrl = adapter._stripIDFromURL(store, group[0]);
        var splitGroups = [[]];

        group.forEach(function (snapshot) {
          var additionalLength = encodeURIComponent(snapshot.id).length + paramNameLength;
          if (baseUrl.length + idsSize + additionalLength >= maxURLLength) {
            idsSize = 0;
            splitGroups.push([]);
          }

          idsSize += additionalLength;

          var lastGroupIndex = splitGroups.length - 1;
          splitGroups[lastGroupIndex].push(snapshot);
        });

        return splitGroups;
      }

      var groupsArray = [];
      groups.forEach(function (group, key) {
        var paramNameLength = '&ids%5B%5D='.length;
        var splitGroups = splitGroupToFitInUrl(group, maxURLLength, paramNameLength);

        splitGroups.forEach(function (splitGroup) {
          return groupsArray.push(splitGroup);
        });
      });

      return groupsArray;
    },
    handleResponse: function handleResponse(status, headers, payload, requestData) {
      if (this.isSuccess(status, headers, payload)) {
        return payload;
      } else if (this.isInvalid(status, headers, payload)) {
        return new _private.InvalidError(payload.errors);
      }

      var errors = this.normalizeErrorResponse(status, headers, payload);
      var detailedMessage = this.generatedDetailedMessage(status, headers, payload, requestData);

      switch (status) {
        case 401:
          return new _private.UnauthorizedError(errors, detailedMessage);
        case 403:
          return new _private.ForbiddenError(errors, detailedMessage);
        case 404:
          return new _private.NotFoundError(errors, detailedMessage);
        case 409:
          return new _private.ConflictError(errors, detailedMessage);
        default:
          if (status >= 500) {
            return new _private.ServerError(errors, detailedMessage);
          }
      }

      return new _private.AdapterError(errors, detailedMessage);
    },
    isSuccess: function isSuccess(status, headers, payload) {
      return status >= 200 && status < 300 || status === 304;
    },
    isInvalid: function isInvalid(status, headers, payload) {
      return status === 422;
    },
    ajax: function ajax(url, type, options) {
      var adapter = this;

      var requestData = {
        url: url,
        method: type
      };
      var hash = adapter.ajaxOptions(url, type, options);

      return new Promise(function (resolve, reject) {
        hash.success = function (payload, textStatus, jqXHR) {
          var response = ajaxSuccessHandler(adapter, payload, jqXHR, requestData);
          Ember.run.join(null, resolve, response);
        };
        hash.error = function (jqXHR, textStatus, errorThrown) {
          var error = ajaxErrorHandler(adapter, jqXHR, errorThrown, requestData);
          Ember.run.join(null, reject, error);
        };

        adapter._ajax(hash);
      }, 'DS: RESTAdapter#ajax ' + type + ' to ' + url);
    },
    _ajaxRequest: function _ajaxRequest(options) {
      Ember.$.ajax(options);
    },
    _najaxRequest: function _najaxRequest(options) {
      if (typeof najax !== 'undefined') {
        najax(options);
      } else {
        throw new Error('najax does not seem to be defined in your app. Did you override it via `addOrOverrideSandboxGlobals` in the fastboot server?');
      }
    },
    _ajax: function _ajax(options) {
      if (Ember.get(this, 'fastboot.isFastBoot')) {
        this._najaxRequest(options);
      } else {
        this._ajaxRequest(options);
      }
    },
    ajaxOptions: function ajaxOptions(url, type, options) {
      var hash = options || {};
      hash.type = type;
      hash.dataType = 'json';
      hash.context = this;

      if (hash.data && type !== 'GET') {
        hash.contentType = 'application/json; charset=utf-8';
        hash.data = JSON.stringify(hash.data);
      }

      var headers = Ember.get(this, 'headers');
      if (headers !== undefined) {
        hash.beforeSend = function (xhr) {
          Object.keys(headers).forEach(function (key) {
            return xhr.setRequestHeader(key, headers[key]);
          });
        };
      }

      hash.url = this._ajaxURL(url);

      return hash;
    },
    _ajaxURL: function _ajaxURL(url) {
      if (Ember.get(this, 'fastboot.isFastBoot')) {
        var httpRegex = /^https?:\/\//;
        var protocolRelativeRegex = /^\/\//;
        var protocol = Ember.get(this, 'fastboot.request.protocol');
        var host = Ember.get(this, 'fastboot.request.host');

        if (protocolRelativeRegex.test(url)) {
          return '' + protocol + url;
        } else if (!httpRegex.test(url)) {
          try {
            return protocol + '//' + host + url;
          } catch (fbError) {
            throw new Error('You are using Ember Data with no host defined in your adapter. This will attempt to use the host of the FastBoot request, which is not configured for the current host of this request. Please set the hostWhitelist property for in your environment.js. FastBoot Error: ' + fbError.message);
          }
        }
      }

      return url;
    },
    parseErrorResponse: function parseErrorResponse(responseText) {
      var json = responseText;

      try {
        json = JSON.parse(responseText);
      } catch (e) {
        // ignored
      }

      return json;
    },
    normalizeErrorResponse: function normalizeErrorResponse(status, headers, payload) {
      if (payload && typeof payload === 'object' && payload.errors) {
        return payload.errors;
      } else {
        return [{
          status: '' + status,
          title: 'The backend responded with an error',
          detail: '' + payload
        }];
      }
    },


    /**
      Generates a detailed ("friendly") error message, with plenty
      of information for debugging (good luck!)
       @method generatedDetailedMessage
      @private
      @param  {Number} status
      @param  {Object} headers
      @param  {Object} payload
      @param  {Object} requestData
      @return {String} detailed error message
    */
    generatedDetailedMessage: function generatedDetailedMessage(status, headers, payload, requestData) {
      var shortenedPayload = void 0;
      var payloadContentType = headers['Content-Type'] || 'Empty Content-Type';

      if (payloadContentType === 'text/html' && payload.length > 250) {
        shortenedPayload = '[Omitted Lengthy HTML]';
      } else {
        shortenedPayload = payload;
      }

      var requestDescription = requestData.method + ' ' + requestData.url;
      var payloadDescription = 'Payload (' + payloadContentType + ')';

      return ['Ember Data Request ' + requestDescription + ' returned a ' + status, payloadDescription, shortenedPayload].join('\n');
    },

    buildQuery: function buildQuery(snapshot) {
      var query = {};

      if (snapshot) {
        var include = snapshot.include;


        if (include) {
          query.include = include;
        }
      }

      return query;
    }
  });

  function ajaxSuccess(adapter, payload, requestData, responseData) {
    var response = void 0;
    try {
      response = adapter.handleResponse(responseData.status, responseData.headers, payload, requestData);
    } catch (error) {
      return Promise.reject(error);
    }

    if (response && response.isAdapterError) {
      return Promise.reject(response);
    } else {
      return response;
    }
  }

  function ajaxError(adapter, payload, requestData, responseData) {
    if (false) {
      var message = 'The server returned an empty string for ' + requestData.method + ' ' + requestData.url + ', which cannot be parsed into a valid JSON. Return either null or {}.';
      var validJSONString = !(responseData.textStatus === 'parsererror' && payload === '');
      (false && Ember.warn(message, validJSONString, {
        id: 'ds.adapter.returned-empty-string-as-JSON'
      }));
    }

    var error = void 0;

    if (responseData.errorThrown instanceof Error) {
      error = responseData.errorThrown;
    } else if (responseData.textStatus === 'timeout') {
      error = new _private.TimeoutError();
    } else if (responseData.textStatus === 'abort' || responseData.status === 0) {
      error = new _private.AbortError();
    } else {
      try {
        error = adapter.handleResponse(responseData.status, responseData.headers, payload || responseData.errorThrown, requestData);
      } catch (e) {
        error = e;
      }
    }

    return error;
  }

  //From http://stackoverflow.com/questions/280634/endswith-in-javascript
  function endsWith(string, suffix) {
    if (typeof String.prototype.endsWith !== 'function') {
      return string.indexOf(suffix, string.length - suffix.length) !== -1;
    } else {
      return string.endsWith(suffix);
    }
  }

  function ajaxSuccessHandler(adapter, payload, jqXHR, requestData) {
    var responseData = ajaxResponseData(jqXHR);
    return ajaxSuccess(adapter, payload, requestData, responseData);
  }

  function ajaxErrorHandler(adapter, jqXHR, errorThrown, requestData) {
    var responseData = ajaxResponseData(jqXHR);
    responseData.errorThrown = errorThrown;
    var payload = adapter.parseErrorResponse(jqXHR.responseText);
    return ajaxError(adapter, payload, requestData, responseData);
  }

  function ajaxResponseData(jqXHR) {
    return {
      status: jqXHR.status,
      textStatus: jqXHR.textStatus,
      headers: (0, _private.parseResponseHeaders)(jqXHR.getAllResponseHeaders())
    };
  }

  exports.default = RESTAdapter;
});