/**
 * HTML templates in string, much faster on Safari
 * @since  2.0.5
 */
var Rexbuilder_Public_Templates = (function () {
	'use strict';

	function getTemplate(tmpl, data) {
		switch (tmpl) {
			case 'label-text-paragraph':
				return '<div class="wpcf7-label-text__paragraph" contenteditable="false"></div>';

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
})();
