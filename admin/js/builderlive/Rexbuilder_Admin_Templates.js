/**
 * HTML templates in string, much faster on Safari
 * @since  2.0.6
 */
var Rexbuilder_Admin_Templates = (function ($, window, document) {
	'use strict';

	function getTemplate(tmpl, data) {
		switch (tmpl) {
			case 'tmpl-tool-save':
				return '<div class="rex-modal__outside-footer"><div class="tool-button tool-button--inline tool-button--confirm tool-button--modal rex-modal-option tippy" data-tippy-content="Save" data-rex-option="save"><span class="rex-button btn-save--wrap"><i class="l-svg-icons"><svg><use xlink:href="#Z016-Checked"></use></svg></i></span></div><div class="tool-button tool-button--inline tool-button--modal rex-modal-option tippy" data-rex-option="reset" data-tippy-content="Reset"><span class="rex-button btn-save--wrap"><i class="l-svg-icons"><svg><use xlink:href="#Z014-Refresh"></use></svg></i></span></div></div>';
			case 'tmpl-tool-close':
				return '<div class="tool-button tool-button--black tool-button--close rex-modal__close-button"><i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i></div>';

			default:
				break;
		}
	}

	function getParsedTemplate(tmpl, data) {
		return $.parseHTML(getTemplate(tmpl, data));
	}

	return {
		getTemplate: getTemplate,
		getParsedTemplate: getParsedTemplate
	};
})(jQuery, window, document);
