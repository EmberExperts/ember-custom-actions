define('ember-bootstrap/utils/dom', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.findElementById = findElementById;
  exports.getDOM = getDOM;


  function childNodesOfElement(element) {
    let children = [];
    let child = element.firstChild;
    while (child) {
      children.push(child);
      child = child.nextSibling;
    }
    return children;
  } /*
     * Implement some helpers methods for interacting with the DOM,
     * be it Fastboot's SimpleDOM or the browser's version.
     *
     * Credit to https://github.com/yapplabs/ember-wormhole, from where this has been shamelessly stolen.
     */

  function findElementById(doc, id) {
    if (doc.getElementById) {
      return doc.getElementById(id);
    }

    let nodes = childNodesOfElement(doc);
    let node;

    while (nodes.length) {
      node = nodes.shift();

      if (node.getAttribute && node.getAttribute('id') === id) {
        return node;
      }
      nodes = childNodesOfElement(node).concat(nodes);
    }
  }

  // Private Ember API usage. Get the dom implementation used by the current
  // renderer, be it native browser DOM or Fastboot SimpleDOM
  function getDOM(context) {
    let { renderer } = context;
    if (!renderer._dom) {
      // pre glimmer2
      let container = Ember.getOwner ? Ember.getOwner(context) : context.container;
      let documentService = container.lookup('service:-document');

      if (documentService) {
        return documentService;
      }

      renderer = container.lookup('renderer:-dom');
    }

    if (renderer._dom && renderer._dom.document) {
      return renderer._dom.document;
    } else {
      throw new Error('Could not get DOM');
    }
  }
});