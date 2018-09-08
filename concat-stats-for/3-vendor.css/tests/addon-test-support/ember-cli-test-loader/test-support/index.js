define('ember-cli-test-loader/test-support/index', ['exports'], function (exports) {
  /* globals requirejs, require */
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.addModuleIncludeMatcher = addModuleIncludeMatcher;
  exports.addModuleExcludeMatcher = addModuleExcludeMatcher;

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

  var moduleIncludeMatchers = [];
  var moduleExcludeMatchers = [];

  function addModuleIncludeMatcher(fn) {
    moduleIncludeMatchers.push(fn);
  }

  function addModuleExcludeMatcher(fn) {
    moduleExcludeMatchers.push(fn);
  }

  function checkMatchers(matchers, moduleName) {
    return matchers.some(function (matcher) {
      return matcher(moduleName);
    });
  }

  var TestLoader = function () {
    _createClass(TestLoader, null, [{
      key: 'load',
      value: function load() {
        new TestLoader().loadModules();
      }
    }]);

    function TestLoader() {
      _classCallCheck(this, TestLoader);

      this._didLogMissingUnsee = false;
    }

    _createClass(TestLoader, [{
      key: 'shouldLoadModule',
      value: function shouldLoadModule(moduleName) {
        return moduleName.match(/[-_]test$/);
      }
    }, {
      key: 'listModules',
      value: function listModules() {
        return Object.keys(requirejs.entries);
      }
    }, {
      key: 'listTestModules',
      value: function listTestModules() {
        var moduleNames = this.listModules();
        var testModules = [];
        var moduleName = void 0;

        for (var i = 0; i < moduleNames.length; i++) {
          moduleName = moduleNames[i];

          if (checkMatchers(moduleExcludeMatchers, moduleName)) {
            continue;
          }

          if (checkMatchers(moduleIncludeMatchers, moduleName) || this.shouldLoadModule(moduleName)) {
            testModules.push(moduleName);
          }
        }

        return testModules;
      }
    }, {
      key: 'loadModules',
      value: function loadModules() {
        var testModules = this.listTestModules();
        var testModule = void 0;

        for (var i = 0; i < testModules.length; i++) {
          testModule = testModules[i];
          this.require(testModule);
          this.unsee(testModule);
        }
      }
    }, {
      key: 'require',
      value: function (_require) {
        function require(_x) {
          return _require.apply(this, arguments);
        }

        require.toString = function () {
          return _require.toString();
        };

        return require;
      }(function (moduleName) {
        try {
          require(moduleName);
        } catch (e) {
          this.moduleLoadFailure(moduleName, e);
        }
      })
    }, {
      key: 'unsee',
      value: function unsee(moduleName) {
        if (typeof require.unsee === 'function') {
          require.unsee(moduleName);
        } else if (!this._didLogMissingUnsee) {
          this._didLogMissingUnsee = true;
          if (typeof console !== 'undefined') {
            console.warn('unable to require.unsee, please upgrade loader.js to >= v3.3.0');
          }
        }
      }
    }, {
      key: 'moduleLoadFailure',
      value: function moduleLoadFailure(moduleName, error) {
        console.error('Error loading: ' + moduleName, error.stack);
      }
    }]);

    return TestLoader;
  }();

  exports.default = TestLoader;
  ;
});