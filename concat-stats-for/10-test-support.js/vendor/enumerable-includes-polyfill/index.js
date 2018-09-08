(function() {
  function objectAt(content, idx) {
    if (content.objectAt) {
      return content.objectAt(idx);
    }

    return content[idx];
  }

  function arrayIncludes(obj, startAt) {
    var len = Ember.get(this, 'length');
    var idx, currentObj;

    if (startAt === undefined) {
      startAt = 0;
    }

    if (startAt < 0) {
      startAt += len;
    }

    for (idx = startAt; idx < len; idx++) {
      currentObj = objectAt(this, idx);

      // SameValueZero comparison (NaN !== NaN)
      if (obj === currentObj || (obj !== obj && currentObj !== currentObj)) {
        return true;
      }
    }

    return false;
  }

  Ember.Array.reopen({
    // inlined from https://git.io/v6F5T
    includes: arrayIncludes
  });

  Ember.MutableArray.reopen({
    addObject: function(obj) {
      if (!this.includes(obj)) {
        this.pushObject(obj);
      }

      return this;
    }
  });

  Ember.Enumerable.reopen({
    includes: function(obj) {
      Ember.assert('Enumerable#includes cannot accept a second argument "startAt" as enumerable items are unordered.', arguments.length === 1);

      var len = Ember.get(this, 'length');
      var idx, next;
      var last = null;
      var found = false;

      for (idx = 0; idx < len && !found; idx++) {
        next = this.nextObject(idx, last);

        found = obj === next || (obj !== obj && next !== next);

        last = next;
      }

      next = last = null;

      return found;
    }
  });

  if ((Ember.EXTEND_PROTOTYPES === true || Ember.EXTEND_PROTOTYPES.Array) && !Array.prototype.includes) {
    Array.prototype.includes = arrayIncludes;
  }
})();
