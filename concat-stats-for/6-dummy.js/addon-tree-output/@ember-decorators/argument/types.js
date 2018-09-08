define('@ember-decorators/argument/types', ['exports', '@ember-decorators/argument/-debug'], function (exports, _debug) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Node = exports.Element = exports.ClosureAction = exports.Action = undefined;


  /**
   * Action type, covers both string actions and closure actions
   */
  const Action = exports.Action = (0, _debug.unionOf)('string', Function);

  /**
   * Action type, covers both string actions and closure actions
   */
  const ClosureAction = exports.ClosureAction = Function;

  /**
   * Element type polyfill for fastboot
   */
  const Element = exports.Element = window ? window.Element : class Element {};

  /**
   * Node type polyfill for fastboot
   */
  const Node = exports.Node = window ? window.Node : class Node {};
});