define('ember-resolver/resolvers/classic/index', ['exports', 'ember-resolver/utils/class-factory', 'ember-resolver/utils/make-dictionary'], function (exports, _classFactory, _makeDictionary) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ModuleRegistry = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  if (typeof requirejs.entries === 'undefined') {
    requirejs.entries = requirejs._eak_seen;
  }

  var ModuleRegistry = exports.ModuleRegistry = function () {
    function ModuleRegistry(entries) {
      _classCallCheck(this, ModuleRegistry);

      this._entries = entries || requirejs.entries;
    }

    ModuleRegistry.prototype.moduleNames = function moduleNames() {
      return Object.keys(this._entries);
    };

    ModuleRegistry.prototype.has = function has(moduleName) {
      return moduleName in this._entries;
    };

    ModuleRegistry.prototype.get = function get(moduleName) {
      return require(moduleName);
    };

    return ModuleRegistry;
  }();

  /**
   * This module defines a subclass of Ember.DefaultResolver that adds two
   * important features:
   *
   *  1) The resolver makes the container aware of es6 modules via the AMD
   *     output. The loader's _moduleEntries is consulted so that classes can be
   *     resolved directly via the module loader, without needing a manual
   *     `import`.
   *  2) is able to provide injections to classes that implement `extend`
   *     (as is typical with Ember).
   */

  function parseName(fullName) {
    if (fullName.parsedName === true) {
      return fullName;
    }

    var prefix = void 0,
        type = void 0,
        name = void 0;
    var fullNameParts = fullName.split('@');

    // HTMLBars uses helper:@content-helper which collides
    // with ember-cli namespace detection.
    // This will be removed in a future release of HTMLBars.
    if (fullName !== 'helper:@content-helper' && fullNameParts.length === 2) {
      var prefixParts = fullNameParts[0].split(':');

      if (prefixParts.length === 2) {
        prefix = prefixParts[1];
        type = prefixParts[0];
        name = fullNameParts[1];
      } else {
        var nameParts = fullNameParts[1].split(':');

        prefix = fullNameParts[0];
        type = nameParts[0];
        name = nameParts[1];
      }

      if (type === 'template' && prefix.lastIndexOf('components/', 0) === 0) {
        name = 'components/' + name;
        prefix = prefix.slice(11);
      }
    } else {
      fullNameParts = fullName.split(':');
      type = fullNameParts[0];
      name = fullNameParts[1];
    }

    var fullNameWithoutType = name;
    var namespace = Ember.get(this, 'namespace');
    var root = namespace;

    return {
      parsedName: true,
      fullName: fullName,
      prefix: prefix || this.prefix({ type: type }),
      type: type,
      fullNameWithoutType: fullNameWithoutType,
      name: name,
      root: root,
      resolveMethodName: "resolve" + Ember.String.classify(type)
    };
  }

  function resolveOther(parsedName) {
    (false && !(this.namespace.modulePrefix) && Ember.assert('`modulePrefix` must be defined', this.namespace.modulePrefix));


    var normalizedModuleName = this.findModuleName(parsedName);

    if (normalizedModuleName) {
      var defaultExport = this._extractDefaultExport(normalizedModuleName, parsedName);

      if (defaultExport === undefined) {
        throw new Error(' Expected to find: \'' + parsedName.fullName + '\' within \'' + normalizedModuleName + '\' but got \'undefined\'. Did you forget to \'export default\' within \'' + normalizedModuleName + '\'?');
      }

      if (this.shouldWrapInClassFactory(defaultExport, parsedName)) {
        defaultExport = (0, _classFactory.default)(defaultExport);
      }

      return defaultExport;
    }
  }

  // Ember.DefaultResolver docs:
  //   https://github.com/emberjs/ember.js/blob/master/packages/ember-application/lib/system/resolver.js
  var Resolver = Ember.Object.extend({
    resolveOther: resolveOther,
    parseName: parseName,
    pluralizedTypes: null,
    moduleRegistry: null,

    makeToString: function makeToString(factory, fullName) {
      return '' + this.namespace.modulePrefix + '@' + fullName + ':';
    },
    shouldWrapInClassFactory: function shouldWrapInClassFactory() /* module, parsedName */{
      return false;
    },
    init: function init() {
      this._super();
      this.moduleBasedResolver = true;

      if (!this._moduleRegistry) {
        this._moduleRegistry = new ModuleRegistry();
      }

      this._normalizeCache = (0, _makeDictionary.default)();

      this.pluralizedTypes = this.pluralizedTypes || (0, _makeDictionary.default)();

      if (!this.pluralizedTypes.config) {
        this.pluralizedTypes.config = 'config';
      }
      this._deprecatedPodModulePrefix = false;
    },
    normalize: function normalize(fullName) {
      return this._normalizeCache[fullName] || (this._normalizeCache[fullName] = this._normalize(fullName));
    },
    resolve: function resolve(fullName) {
      var parsedName = this.parseName(fullName);
      var resolveMethodName = parsedName.resolveMethodName;
      var resolved = void 0;

      if (typeof this[resolveMethodName] === 'function') {
        resolved = this[resolveMethodName](parsedName);
      }

      if (resolved == null) {
        resolved = this.resolveOther(parsedName);
      }

      return resolved;
    },
    _normalize: function _normalize(fullName) {
      // A) Convert underscores to dashes
      // B) Convert camelCase to dash-case, except for helpers where we want to avoid shadowing camelCase expressions
      // C) replace `.` with `/` in order to make nested controllers work in the following cases
      //      1. `needs: ['posts/post']`
      //      2. `{{render "posts/post"}}`
      //      3. `this.render('posts/post')` from Route

      var split = fullName.split(':');
      if (split.length > 1) {
        if (split[0] === 'helper') {
          return split[0] + ':' + split[1].replace(/_/g, '-');
        } else {
          return split[0] + ':' + Ember.String.dasherize(split[1].replace(/\./g, '/'));
        }
      } else {
        return fullName;
      }
    },
    pluralize: function pluralize(type) {
      return this.pluralizedTypes[type] || (this.pluralizedTypes[type] = type + 's');
    },
    podBasedLookupWithPrefix: function podBasedLookupWithPrefix(podPrefix, parsedName) {
      var fullNameWithoutType = parsedName.fullNameWithoutType;

      if (parsedName.type === 'template') {
        fullNameWithoutType = fullNameWithoutType.replace(/^components\//, '');
      }

      return podPrefix + '/' + fullNameWithoutType + '/' + parsedName.type;
    },
    podBasedModuleName: function podBasedModuleName(parsedName) {
      var podPrefix = this.namespace.podModulePrefix || this.namespace.modulePrefix;

      return this.podBasedLookupWithPrefix(podPrefix, parsedName);
    },
    podBasedComponentsInSubdir: function podBasedComponentsInSubdir(parsedName) {
      var podPrefix = this.namespace.podModulePrefix || this.namespace.modulePrefix;
      podPrefix = podPrefix + '/components';

      if (parsedName.type === 'component' || /^components/.test(parsedName.fullNameWithoutType)) {
        return this.podBasedLookupWithPrefix(podPrefix, parsedName);
      }
    },
    resolveEngine: function resolveEngine(parsedName) {
      var engineName = parsedName.fullNameWithoutType;
      var engineModule = engineName + '/engine';

      if (this._moduleRegistry.has(engineModule)) {
        return this._extractDefaultExport(engineModule);
      }
    },
    resolveRouteMap: function resolveRouteMap(parsedName) {
      var engineName = parsedName.fullNameWithoutType;
      var engineRoutesModule = engineName + '/routes';

      if (this._moduleRegistry.has(engineRoutesModule)) {
        var routeMap = this._extractDefaultExport(engineRoutesModule);

        (false && !(routeMap.isRouteMap) && Ember.assert('The route map for ' + engineName + ' should be wrapped by \'buildRoutes\' before exporting.', routeMap.isRouteMap));


        return routeMap;
      }
    },
    resolveTemplate: function resolveTemplate(parsedName) {
      var resolved = this.resolveOther(parsedName);
      if (resolved == null) {
        resolved = Ember.TEMPLATES[parsedName.fullNameWithoutType];
      }
      return resolved;
    },
    mainModuleName: function mainModuleName(parsedName) {
      if (parsedName.fullNameWithoutType === 'main') {
        // if router:main or adapter:main look for a module with just the type first
        return parsedName.prefix + '/' + parsedName.type;
      }
    },
    defaultModuleName: function defaultModuleName(parsedName) {
      return parsedName.prefix + '/' + this.pluralize(parsedName.type) + '/' + parsedName.fullNameWithoutType;
    },
    prefix: function prefix(parsedName) {
      var tmpPrefix = this.namespace.modulePrefix;

      if (this.namespace[parsedName.type + 'Prefix']) {
        tmpPrefix = this.namespace[parsedName.type + 'Prefix'];
      }

      return tmpPrefix;
    },


    /**
      A listing of functions to test for moduleName's based on the provided
     `parsedName`. This allows easy customization of additional module based
     lookup patterns.
      @property moduleNameLookupPatterns
     @returns {Ember.Array}
     */
    moduleNameLookupPatterns: Ember.computed(function () {
      return [this.podBasedModuleName, this.podBasedComponentsInSubdir, this.mainModuleName, this.defaultModuleName];
    }).readOnly(),

    findModuleName: function findModuleName(parsedName, loggingDisabled) {
      var moduleNameLookupPatterns = this.get('moduleNameLookupPatterns');
      var moduleName = void 0;

      for (var index = 0, length = moduleNameLookupPatterns.length; index < length; index++) {
        var item = moduleNameLookupPatterns[index];

        var tmpModuleName = item.call(this, parsedName);

        // allow treat all dashed and all underscored as the same thing
        // supports components with dashes and other stuff with underscores.
        if (tmpModuleName) {
          tmpModuleName = this.chooseModuleName(tmpModuleName, parsedName);
        }

        if (tmpModuleName && this._moduleRegistry.has(tmpModuleName)) {
          moduleName = tmpModuleName;
        }

        if (!loggingDisabled) {
          this._logLookup(moduleName, parsedName, tmpModuleName);
        }

        if (moduleName) {
          return moduleName;
        }
      }
    },
    chooseModuleName: function chooseModuleName(moduleName, parsedName) {
      var underscoredModuleName = Ember.String.underscore(moduleName);

      if (moduleName !== underscoredModuleName && this._moduleRegistry.has(moduleName) && this._moduleRegistry.has(underscoredModuleName)) {
        throw new TypeError('Ambiguous module names: \'' + moduleName + '\' and \'' + underscoredModuleName + '\'');
      }

      if (this._moduleRegistry.has(moduleName)) {
        return moduleName;
      } else if (this._moduleRegistry.has(underscoredModuleName)) {
        return underscoredModuleName;
      }
      // workaround for dasherized partials:
      // something/something/-something => something/something/_something
      var partializedModuleName = moduleName.replace(/\/-([^/]*)$/, '/_$1');

      if (this._moduleRegistry.has(partializedModuleName)) {
        (false && !(false) && Ember.deprecate('Modules should not contain underscores. ' + 'Attempted to lookup "' + moduleName + '" which ' + 'was not found. Please rename "' + partializedModuleName + '" ' + 'to "' + moduleName + '" instead.', false, { id: 'ember-resolver.underscored-modules', until: '3.0.0' }));


        return partializedModuleName;
      }

      if (false) {
        var isCamelCaseHelper = parsedName.type === 'helper' && /[a-z]+[A-Z]+/.test(moduleName);
        if (isCamelCaseHelper) {
          this._camelCaseHelperWarnedNames = this._camelCaseHelperWarnedNames || [];
          var alreadyWarned = this._camelCaseHelperWarnedNames.indexOf(parsedName.fullName) > -1;
          if (!alreadyWarned && this._moduleRegistry.has(Ember.String.dasherize(moduleName))) {
            this._camelCaseHelperWarnedNames.push(parsedName.fullName);
            (false && Ember.warn('Attempted to lookup "' + parsedName.fullName + '" which ' + 'was not found. In previous versions of ember-resolver, a bug would have ' + 'caused the module at "' + Ember.String.dasherize(moduleName) + '" to be ' + 'returned for this camel case helper name. This has been fixed. ' + 'Use the dasherized name to resolve the module that would have been ' + 'returned in previous versions.', false, { id: 'ember-resolver.camelcase-helper-names', until: '3.0.0' }));
          }
        }
      }
    },
    lookupDescription: function lookupDescription(fullName) {
      var parsedName = this.parseName(fullName);

      var moduleName = this.findModuleName(parsedName, true);

      return moduleName;
    },
    _logLookup: function _logLookup(found, parsedName, description) {
      if (!Ember.ENV.LOG_MODULE_RESOLVER && !parsedName.root.LOG_RESOLVER) {
        return;
      }

      var padding = void 0;
      var symbol = found ? '[✓]' : '[ ]';

      if (parsedName.fullName.length > 60) {
        padding = '.';
      } else {
        padding = new Array(60 - parsedName.fullName.length).join('.');
      }

      if (!description) {
        description = this.lookupDescription(parsedName);
      }

      /* eslint-disable no-console */
      if (console && console.info) {
        console.info(symbol, parsedName.fullName, padding, description);
      }
    },
    knownForType: function knownForType(type) {
      var moduleKeys = this._moduleRegistry.moduleNames();

      var items = (0, _makeDictionary.default)();
      for (var index = 0, length = moduleKeys.length; index < length; index++) {
        var moduleName = moduleKeys[index];
        var fullname = this.translateToContainerFullname(type, moduleName);

        if (fullname) {
          items[fullname] = true;
        }
      }

      return items;
    },
    translateToContainerFullname: function translateToContainerFullname(type, moduleName) {
      var prefix = this.prefix({ type: type });

      // Note: using string manipulation here rather than regexes for better performance.
      // pod modules
      // '^' + prefix + '/(.+)/' + type + '$'
      var podPrefix = prefix + '/';
      var podSuffix = '/' + type;
      var start = moduleName.indexOf(podPrefix);
      var end = moduleName.indexOf(podSuffix);

      if (start === 0 && end === moduleName.length - podSuffix.length && moduleName.length > podPrefix.length + podSuffix.length) {
        return type + ':' + moduleName.slice(start + podPrefix.length, end);
      }

      // non-pod modules
      // '^' + prefix + '/' + pluralizedType + '/(.+)$'
      var pluralizedType = this.pluralize(type);
      var nonPodPrefix = prefix + '/' + pluralizedType + '/';

      if (moduleName.indexOf(nonPodPrefix) === 0 && moduleName.length > nonPodPrefix.length) {
        return type + ':' + moduleName.slice(nonPodPrefix.length);
      }
    },
    _extractDefaultExport: function _extractDefaultExport(normalizedModuleName) {
      var module = require(normalizedModuleName, null, null, true /* force sync */);

      if (module && module['default']) {
        module = module['default'];
      }

      return module;
    }
  });

  Resolver.reopenClass({
    moduleBasedResolver: true
  });

  exports.default = Resolver;
});