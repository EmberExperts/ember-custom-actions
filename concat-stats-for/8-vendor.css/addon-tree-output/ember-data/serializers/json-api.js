define('ember-data/serializers/json-api', ['exports', 'ember-inflector', 'ember-data/serializers/json', 'ember-data/-private'], function (exports, _emberInflector, _json, _private) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
    Ember Data 2.0 Serializer:
  
    In Ember Data a Serializer is used to serialize and deserialize
    records when they are transferred in and out of an external source.
    This process involves normalizing property names, transforming
    attribute values and serializing relationships.
  
    `JSONAPISerializer` supports the http://jsonapi.org/ spec and is the
    serializer recommended by Ember Data.
  
    This serializer normalizes a JSON API payload that looks like:
  
    ```app/models/player.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      name: DS.attr('string'),
      skill: DS.attr('string'),
      gamesPlayed: DS.attr('number'),
      club: DS.belongsTo('club')
    });
    ```
  
    ```app/models/club.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      name: DS.attr('string'),
      location: DS.attr('string'),
      players: DS.hasMany('player')
    });
    ```
  
    ```js
      {
        "data": [
          {
            "attributes": {
              "name": "Benfica",
              "location": "Portugal"
            },
            "id": "1",
            "relationships": {
              "players": {
                "data": [
                  {
                    "id": "3",
                    "type": "players"
                  }
                ]
              }
            },
            "type": "clubs"
          }
        ],
        "included": [
          {
            "attributes": {
              "name": "Eusebio Silva Ferreira",
              "skill": "Rocket shot",
              "games-played": 431
            },
            "id": "3",
            "relationships": {
              "club": {
                "data": {
                  "id": "1",
                  "type": "clubs"
                }
              }
            },
            "type": "players"
          }
        ]
      }
    ```
  
    to the format that the Ember Data store expects.
  
    ### Customizing meta
  
    Since a JSON API Document can have meta defined in multiple locations you can
    use the specific serializer hooks if you need to customize the meta.
  
    One scenario would be to camelCase the meta keys of your payload. The example
    below shows how this could be done using `normalizeArrayResponse` and
    `extractRelationship`.
  
    ```app/serializers/application.js
    export default JSONAPISerializer.extend({
      normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
        let normalizedDocument = this._super(...arguments);
  
        // Customize document meta
        normalizedDocument.meta = camelCaseKeys(normalizedDocument.meta);
  
        return normalizedDocument;
      },
  
      extractRelationship(relationshipHash) {
        let normalizedRelationship = this._super(...arguments);
  
        // Customize relationship meta
        normalizedRelationship.meta = camelCaseKeys(normalizedRelationship.meta);
  
        return normalizedRelationship;
      }
    });
    ```
  
    @since 1.13.0
    @class JSONAPISerializer
    @namespace DS
    @extends DS.JSONSerializer
  */
  var JSONAPISerializer = _json.default.extend({
    /**
      @method _normalizeDocumentHelper
      @param {Object} documentHash
      @return {Object}
      @private
    */
    _normalizeDocumentHelper(documentHash) {
      if (Ember.typeOf(documentHash.data) === 'object') {
        documentHash.data = this._normalizeResourceHelper(documentHash.data);
      } else if (Array.isArray(documentHash.data)) {
        var ret = new Array(documentHash.data.length);

        for (var i = 0; i < documentHash.data.length; i++) {
          var data = documentHash.data[i];
          ret[i] = this._normalizeResourceHelper(data);
        }

        documentHash.data = ret;
      }

      if (Array.isArray(documentHash.included)) {
        var _ret = new Array();
        for (var _i = 0; _i < documentHash.included.length; _i++) {
          var included = documentHash.included[_i];
          var normalized = this._normalizeResourceHelper(included);
          if (normalized !== null) {
            // can be null when unknown type is encountered
            _ret.push(normalized);
          }
        }

        documentHash.included = _ret;
      }

      return documentHash;
    },

    /**
      @method _normalizeRelationshipDataHelper
      @param {Object} relationshipDataHash
      @return {Object}
      @private
    */
    _normalizeRelationshipDataHelper(relationshipDataHash) {
      relationshipDataHash.type = this.modelNameFromPayloadKey(relationshipDataHash.type);

      return relationshipDataHash;
    },

    /**
      @method _normalizeResourceHelper
      @param {Object} resourceHash
      @return {Object}
      @private
    */
    _normalizeResourceHelper(resourceHash) {
      (true && !(!Ember.isNone(resourceHash.type)) && Ember.assert(this.warnMessageForUndefinedType(), !Ember.isNone(resourceHash.type), {
        id: 'ds.serializer.type-is-undefined'
      }));


      var modelName = void 0,
          usedLookup = void 0;

      modelName = this.modelNameFromPayloadKey(resourceHash.type);
      usedLookup = 'modelNameFromPayloadKey';

      if (!this.store._hasModelFor(modelName)) {
        (true && Ember.warn(this.warnMessageNoModelForType(modelName, resourceHash.type, usedLookup), false, {
          id: 'ds.serializer.model-for-type-missing'
        }));

        return null;
      }

      var modelClass = this.store.modelFor(modelName);
      var serializer = this.store.serializerFor(modelName);
      var { data } = serializer.normalize(modelClass, resourceHash);
      return data;
    },

    /**
      @method pushPayload
      @param {DS.Store} store
      @param {Object} payload
    */
    pushPayload(store, payload) {
      var normalizedPayload = this._normalizeDocumentHelper(payload);
      store.push(normalizedPayload);
    },

    /**
      @method _normalizeResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @param {Boolean} isSingle
      @return {Object} JSON-API Document
      @private
    */
    _normalizeResponse(store, primaryModelClass, payload, id, requestType, isSingle) {
      var normalizedPayload = this._normalizeDocumentHelper(payload);
      return normalizedPayload;
    },

    normalizeQueryRecordResponse() {
      var normalized = this._super(...arguments);

      (true && !(!Array.isArray(normalized.data)) && Ember.assert('Expected the primary data returned by the serializer for a `queryRecord` response to be a single object but instead it was an array.', !Array.isArray(normalized.data), {
        id: 'ds.serializer.json-api.queryRecord-array-response'
      }));


      return normalized;
    },

    extractAttributes(modelClass, resourceHash) {
      var attributes = {};

      if (resourceHash.attributes) {
        modelClass.eachAttribute(key => {
          var attributeKey = this.keyForAttribute(key, 'deserialize');
          if (resourceHash.attributes[attributeKey] !== undefined) {
            attributes[key] = resourceHash.attributes[attributeKey];
          }
          if (true) {
            if (resourceHash.attributes[attributeKey] === undefined && resourceHash.attributes[key] !== undefined) {
              (true && !(false) && Ember.assert(`Your payload for '${modelClass.modelName}' contains '${key}', but your serializer is setup to look for '${attributeKey}'. This is most likely because Ember Data's JSON API serializer dasherizes attribute keys by default. You should subclass JSONAPISerializer and implement 'keyForAttribute(key) { return key; }' to prevent Ember Data from customizing your attribute keys.`, false));
            }
          }
        });
      }

      return attributes;
    },

    /**
       Returns a relationship formatted as a JSON-API "relationship object".
        http://jsonapi.org/format/#document-resource-object-relationships
        @method extractRelationship
       @param {Object} relationshipHash
       @return {Object}
    */
    extractRelationship(relationshipHash) {
      if (Ember.typeOf(relationshipHash.data) === 'object') {
        relationshipHash.data = this._normalizeRelationshipDataHelper(relationshipHash.data);
      }

      if (Array.isArray(relationshipHash.data)) {
        var ret = new Array(relationshipHash.data.length);

        for (var i = 0; i < relationshipHash.data.length; i++) {
          var data = relationshipHash.data[i];
          ret[i] = this._normalizeRelationshipDataHelper(data);
        }

        relationshipHash.data = ret;
      }

      return relationshipHash;
    },

    /**
       Returns the resource's relationships formatted as a JSON-API "relationships object".
        http://jsonapi.org/format/#document-resource-object-relationships
        @method extractRelationships
       @param {Object} modelClass
       @param {Object} resourceHash
       @return {Object}
    */
    extractRelationships(modelClass, resourceHash) {
      var relationships = {};

      if (resourceHash.relationships) {
        modelClass.eachRelationship((key, relationshipMeta) => {
          var relationshipKey = this.keyForRelationship(key, relationshipMeta.kind, 'deserialize');
          if (resourceHash.relationships[relationshipKey] !== undefined) {
            var relationshipHash = resourceHash.relationships[relationshipKey];
            relationships[key] = this.extractRelationship(relationshipHash);
          }
          if (true) {
            if (resourceHash.relationships[relationshipKey] === undefined && resourceHash.relationships[key] !== undefined) {
              (true && !(false) && Ember.assert(`Your payload for '${modelClass.modelName}' contains '${key}', but your serializer is setup to look for '${relationshipKey}'. This is most likely because Ember Data's JSON API serializer dasherizes relationship keys by default. You should subclass JSONAPISerializer and implement 'keyForRelationship(key) { return key; }' to prevent Ember Data from customizing your relationship keys.`, false));
            }
          }
        });
      }

      return relationships;
    },

    /**
      @method _extractType
      @param {DS.Model} modelClass
      @param {Object} resourceHash
      @return {String}
      @private
    */
    _extractType(modelClass, resourceHash) {
      return this.modelNameFromPayloadKey(resourceHash.type);
    },

    /**
      Dasherizes and singularizes the model name in the payload to match
      the format Ember Data uses internally for the model name.
       For example the key `posts` would be converted to `post` and the
      key `studentAssesments` would be converted to `student-assesment`.
       @method modelNameFromPayloadKey
      @param {String} key
      @return {String} the model's modelName
    */
    // TODO @deprecated Use modelNameFromPayloadType instead
    modelNameFromPayloadKey(key) {
      return (0, _emberInflector.singularize)((0, _private.normalizeModelName)(key));
    },

    /**
      Converts the model name to a pluralized version of the model name.
       For example `post` would be converted to `posts` and
      `student-assesment` would be converted to `student-assesments`.
       @method payloadKeyFromModelName
      @param {String} modelName
      @return {String}
    */
    // TODO @deprecated Use payloadTypeFromModelName instead
    payloadKeyFromModelName(modelName) {
      return (0, _emberInflector.pluralize)(modelName);
    },

    normalize(modelClass, resourceHash) {
      if (resourceHash.attributes) {
        this.normalizeUsingDeclaredMapping(modelClass, resourceHash.attributes);
      }

      if (resourceHash.relationships) {
        this.normalizeUsingDeclaredMapping(modelClass, resourceHash.relationships);
      }

      var data = {
        id: this.extractId(modelClass, resourceHash),
        type: this._extractType(modelClass, resourceHash),
        attributes: this.extractAttributes(modelClass, resourceHash),
        relationships: this.extractRelationships(modelClass, resourceHash)
      };

      this.applyTransforms(modelClass, data.attributes);

      return { data };
    },

    /**
      `keyForAttribute` can be used to define rules for how to convert an
      attribute name in your model to a key in your JSON.
      By default `JSONAPISerializer` follows the format used on the examples of
      http://jsonapi.org/format and uses dashes as the word separator in the JSON
      attribute keys.
       This behaviour can be easily customized by extending this method.
       Example
       ```app/serializers/application.js
      import DS from 'ember-data';
      import { dasherize } from '@ember/string';
       export default DS.JSONAPISerializer.extend({
        keyForAttribute(attr, method) {
          return dasherize(attr).toUpperCase();
        }
      });
      ```
       @method keyForAttribute
      @param {String} key
      @param {String} method
      @return {String} normalized key
    */
    keyForAttribute(key, method) {
      return Ember.String.dasherize(key);
    },

    /**
     `keyForRelationship` can be used to define a custom key when
     serializing and deserializing relationship properties.
     By default `JSONAPISerializer` follows the format used on the examples of
     http://jsonapi.org/format and uses dashes as word separators in
     relationship properties.
      This behaviour can be easily customized by extending this method.
      Example
       ```app/serializers/post.js
      import DS from 'ember-data';
      import { underscore } from '@ember/string';
       export default DS.JSONAPISerializer.extend({
        keyForRelationship(key, relationship, method) {
          return underscore(key);
        }
      });
      ```
     @method keyForRelationship
     @param {String} key
     @param {String} typeClass
     @param {String} method
     @return {String} normalized key
    */
    keyForRelationship(key, typeClass, method) {
      return Ember.String.dasherize(key);
    },

    serialize(snapshot, options) {
      var data = this._super(...arguments);
      data.type = this.payloadKeyFromModelName(snapshot.modelName);

      return { data };
    },

    serializeAttribute(snapshot, json, key, attribute) {
      var type = attribute.type;

      if (this._canSerialize(key)) {
        json.attributes = json.attributes || {};

        var value = snapshot.attr(key);
        if (type) {
          var transform = this.transformFor(type);
          value = transform.serialize(value, attribute.options);
        }

        var payloadKey = this._getMappedKey(key, snapshot.type);

        if (payloadKey === key) {
          payloadKey = this.keyForAttribute(key, 'serialize');
        }

        json.attributes[payloadKey] = value;
      }
    },

    serializeBelongsTo(snapshot, json, relationship) {
      var key = relationship.key;

      if (this._canSerialize(key)) {
        var belongsTo = snapshot.belongsTo(key);
        var belongsToIsNotNew = belongsTo && belongsTo.record && !belongsTo.record.get('isNew');

        if (belongsTo === null || belongsToIsNotNew) {
          json.relationships = json.relationships || {};

          var payloadKey = this._getMappedKey(key, snapshot.type);
          if (payloadKey === key) {
            payloadKey = this.keyForRelationship(key, 'belongsTo', 'serialize');
          }

          var data = null;
          if (belongsTo) {
            var payloadType = this.payloadKeyFromModelName(belongsTo.modelName);

            data = {
              type: payloadType,
              id: belongsTo.id
            };
          }

          json.relationships[payloadKey] = { data };
        }
      }
    },

    serializeHasMany(snapshot, json, relationship) {
      var key = relationship.key;

      if (this.shouldSerializeHasMany(snapshot, key, relationship)) {
        var hasMany = snapshot.hasMany(key);
        if (hasMany !== undefined) {
          json.relationships = json.relationships || {};

          var payloadKey = this._getMappedKey(key, snapshot.type);
          if (payloadKey === key && this.keyForRelationship) {
            payloadKey = this.keyForRelationship(key, 'hasMany', 'serialize');
          }

          // only serialize has many relationships that are not new
          var nonNewHasMany = hasMany.filter(item => item.record && !item.record.get('isNew'));
          var data = new Array(nonNewHasMany.length);

          for (var i = 0; i < nonNewHasMany.length; i++) {
            var item = hasMany[i];
            var payloadType = this.payloadKeyFromModelName(item.modelName);

            data[i] = {
              type: payloadType,
              id: item.id
            };
          }

          json.relationships[payloadKey] = { data };
        }
      }
    }
  }); /**
        @module ember-data
      */

  if (true) {
    JSONAPISerializer.reopen({
      willMergeMixin(props) {
        var constructor = this.constructor;
        (true && Ember.warn(`You've defined 'extractMeta' in ${constructor.toString()} which is not used for serializers extending JSONAPISerializer. Read more at https://emberjs.com/api/data/classes/DS.JSONAPISerializer.html#toc_customizing-meta on how to customize meta when using JSON API.`, Ember.isNone(props.extractMeta) || props.extractMeta === _json.default.prototype.extractMeta, {
          id: 'ds.serializer.json-api.extractMeta'
        }));
        (true && Ember.warn('The JSONAPISerializer does not work with the EmbeddedRecordsMixin because the JSON API spec does not describe how to format embedded resources.', !props.isEmbeddedRecordsMixin, {
          id: 'ds.serializer.embedded-records-mixin-not-supported'
        }));
      },
      warnMessageForUndefinedType() {
        return 'Encountered a resource object with an undefined type (resolved resource using ' + this.constructor.toString() + ')';
      },
      warnMessageNoModelForType(modelName, originalType, usedLookup) {
        return `Encountered a resource object with type "${originalType}", but no model was found for model name "${modelName}" (resolved model name using '${this.constructor.toString()}.${usedLookup}("${originalType}")').`;
      }
    });
  }

  exports.default = JSONAPISerializer;
});