define('ember-data/-debug/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.instrument = instrument;
  function instrument(method) {
    return method();
  }

  /*
    Assert that `addedRecord` has a valid type so it can be added to the
    relationship of the `record`.
  
    The assert basically checks if the `addedRecord` can be added to the
    relationship (specified via `relationshipMeta`) of the `record`.
  
    This utility should only be used internally, as both record parameters must
    be an InternalModel and the `relationshipMeta` needs to be the meta
    information about the relationship, retrieved via
    `record.relationshipFor(key)`.
  
    @method assertPolymorphicType
    @param {InternalModel} internalModel
    @param {RelationshipMeta} relationshipMeta retrieved via
           `record.relationshipFor(key)`
    @param {InternalModel} addedRecord record which
           should be added/set for the relationship
  */
  var assertPolymorphicType = void 0;

  if (true) {
    var checkPolymorphic = function checkPolymorphic(modelClass, addedModelClass) {
      if (modelClass.__isMixin) {
        //TODO Need to do this in order to support mixins, should convert to public api
        //once it exists in Ember
        return modelClass.__mixin.detect(addedModelClass.PrototypeMixin);
      }
      if (Ember.MODEL_FACTORY_INJECTIONS) {
        modelClass = modelClass.superclass;
      }
      return modelClass.detect(addedModelClass);
    };

    exports.assertPolymorphicType = assertPolymorphicType = function assertPolymorphicType(parentInternalModel, relationshipMeta, addedInternalModel, store) {
      var addedModelName = addedInternalModel.modelName;
      var parentModelName = parentInternalModel.modelName;
      var key = relationshipMeta.key;
      var relationshipModelName = relationshipMeta.type;
      var relationshipClass = store.modelFor(relationshipModelName);
      var addedClass = store.modelFor(addedInternalModel.modelName);

      var assertionMessage = `The '${addedModelName}' type does not implement '${relationshipModelName}' and thus cannot be assigned to the '${key}' relationship in '${parentModelName}'. Make it a descendant of '${relationshipModelName}' or use a mixin of the same name.`;

      (true && !(checkPolymorphic(relationshipClass, addedClass)) && Ember.assert(assertionMessage, checkPolymorphic(relationshipClass, addedClass)));
    };
  }

  exports.assertPolymorphicType = assertPolymorphicType;
});