define('ember-bootstrap/components/base/bs-modal-simple', ['exports', 'ember-bootstrap/components/bs-modal', 'ember-bootstrap/templates/components/bs-modal-simple'], function (exports, _bsModal, _bsModalSimple) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _bsModal.default.extend({
    layout: _bsModalSimple.default,

    /**
     * The title of the modal, visible in the modal header. Is ignored if `header` is false.
     *
     * @property title
     * @type string
     * @public
     */
    title: null,

    /**
     * Display a close button (x icon) in the corner of the modal header.
     *
     * @property closeButton
     * @type boolean
     * @default true
     * @public
     */
    closeButton: true,

    /**
     * The title of the default close button.
     *
     * @property closeTitle
     * @type string
     * @default 'Ok'
     * @public
     */
    closeTitle: 'Ok',

    /**
     * The type of the submit button (primary button).
     *
     * @property submitButtonType
     * @type string
     * @default 'primary'
     * @public
     */
    submitButtonType: 'primary',

    /**
     * The title of the submit button (primary button). Will be ignored (i.e. no button) if set to null.
     *
     * @property submitTitle
     * @type string
     * @default null
     * @public
     */
    submitTitle: null

  });
});