var Rexbuilder_Rexelement = (function ($) {
	'use strict';

	/* ===== GLOBAL VARIABLES ===== */

	var elementsInPage = [];
	var ELEMENT_DATA_DEFAULTS = {
		synchronize: false,
		wpcf7_data: {
			background_color: 'rgb(0, 0, 0, 0)',
			border_color: 'rgb(0, 0, 0, 1)',
			border_width: '2px',
			margin_top: '5px',
			margin_left: '5px',
			margin_right: '5px',
			margin_bottom: '5px',
			error_message_color: 'rgb(0, 0, 0, 1)',
			error_message_font_size: '15px',
			send_message_color: 'rgb(0, 0, 0, 1)',
			send_message_font_size: '15px',
			columns: {
				padding_top: '15px',
				padding_left: '15px',
				padding_right: '15px',
				padding_bottom: '15px'
			},
			content: {
				background_color: 'rgb(255, 255, 255, 1)',
				background_color_hover: 'rgb(255, 255, 255, 1)',
				text_color: 'rgb(0, 0, 0, 1)',
				text_color_hover: 'rgb(0, 0, 0, 1)',
				border_color: 'rgb(0, 0, 0, 1)',
				border_color_hover: 'rgb(0, 0, 0, 1)',
				width: '200px',
				height: '50px',
				font_size: '15px',
				border_width: '1px',
				border_radius: '0px'
			},
			options_different: {
				width: true,
				height: true,
				font_size: true,
				text_color: true
			}
		},
		element_target: {
			element_id: '',
			element_number: ''
		}
	};

	/* ===== PUBLIC METHODS ===== */

	function addStyles() {
		Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper').each(function (i, element) {
			var $elementWrapper = $(element);

			if ($elementWrapper.hasClass('rex-separate-element')) {
				addElementStyle($elementWrapper);
			} else {
				if (i !== 0 && elementsInPage[i].id == elementsInPage[i - 1].id) {
					// Do nothing
				} else {
					addElementStyle($elementWrapper);
				}
			}
		});
	}

	function addElementStyle($elementWrapper) {
		var elementIsForm = 0 !== $elementWrapper.find('.wpcf7-form').length;
		// Adding form style if the element is a form
		if (elementIsForm) {
			Rexbuilder_Rexwpcf7.refreshFormStyle($elementWrapper.find('.wpcf7-form'), true);
			$elementWrapper.find('.wpcf7-column').each(function (index, element) {
				Rexbuilder_Rexwpcf7.refreshColumnContentStyle($(element));
			});
		}
	}

	/**
	 * Generates element data from RexElement dom Element.
	 * @param		{jQuery}	$elementWrapper	Element wrapper jQuery Object
	 * @returns {Object}	The generated element data
	 * @since		2.0.2
	 * @version	2.0.5			Improved by separating objects
	 */
	function generateElementData($elementWrapper) {
		var newElementData = {};
		var domData = $elementWrapper.get(0).querySelector('.rex-element-data').dataset;

		// Element general data
		var elementTarget = {
			element_id: $elementWrapper.attr('data-rex-element-id'),
			element_number: parseInt($elementWrapper.attr('data-rex-element-number'))
		};

		var $form = $elementWrapper.find('.wpcf7-form');

		// WPCF7
		var wpcf7Data = {
			background_color: domData.wpcf7BackgroundColor || $form.css('background-color'),
			border_color: domData.wpcf7BorderColor || $form.css('border-color'),
			border_width: domData.wpcf7BorderWidth || $form.css('border-width'),
			margin_top: domData.wpcf7MarginTop || $form.css('margin-top'),
			margin_left: domData.wpcf7MarginLeft || $form.css('margin-left'),
			margin_right: domData.wpcf7MarginRight || $form.css('margin-right'),
			margin_bottom: domData.wpcf7MarginBottom || $form.css('margin-bottom'),
			error_message_color: domData.wpcf7ErrorMessageColor || ELEMENT_DATA_DEFAULTS.wpcf7_data.error_message_color,
			error_message_font_size:
				domData.wpcf7ErrorMessageFontSize || ELEMENT_DATA_DEFAULTS.wpcf7_data.error_message_font_size,
			send_message_color: domData.wpcf7SendMessageColor || ELEMENT_DATA_DEFAULTS.wpcf7_data.send_message_color,
			send_message_font_size:
				domData.wpcf7SendMessageFontSize || ELEMENT_DATA_DEFAULTS.wpcf7_data.send_message_font_size
		};

		var wpcf7DataContent = {
			width: domData.wpcf7ContentWidth || ELEMENT_DATA_DEFAULTS.wpcf7_data.content.width,
			height: domData.wpcf7ContentHeight || ELEMENT_DATA_DEFAULTS.wpcf7_data.content.height,
			font_size: domData.wpcf7ContentFontSize || ELEMENT_DATA_DEFAULTS.wpcf7_data.content.font_size,
			border_width: domData.wpcf7ContentBorderWidth || ELEMENT_DATA_DEFAULTS.wpcf7_data.content.border_width,
			border_radius: domData.wpcf7ContentBorderRadius || ELEMENT_DATA_DEFAULTS.wpcf7_data.content.border_radius,
			text_color: domData.wpcf7ContentTextColor || ELEMENT_DATA_DEFAULTS.wpcf7_data.content.text_color,
			background_color:
				domData.wpcf7ContentBackgroundColor || ELEMENT_DATA_DEFAULTS.wpcf7_data.content.background_color,
			border_color: domData.wpcf7ContentBorderColor || ELEMENT_DATA_DEFAULTS.wpcf7_data.content.border_color,
			text_color_hover: domData.wpcf7ContentTextColorHover || ELEMENT_DATA_DEFAULTS.wpcf7_data.content.text_color_hover,
			background_color_hover:
				domData.wpcf7ContentBackgroundColorHover || ELEMENT_DATA_DEFAULTS.wpcf7_data.content.background_color_hover,
			border_color_hover:
				domData.wpcf7ContentBorderColorHover || ELEMENT_DATA_DEFAULTS.wpcf7_data.content.border_color_hover
		};

		var wpcf7DataColumns = {
			padding_top: domData.wpcf7ColumnsPaddingTop || ELEMENT_DATA_DEFAULTS.wpcf7_data.columns.padding_top,
			padding_left: domData.wpcf7ColumnsPaddingLeft || ELEMENT_DATA_DEFAULTS.wpcf7_data.columns.padding_left,
			padding_right: domData.wpcf7ColumnsPaddingRight || ELEMENT_DATA_DEFAULTS.wpcf7_data.columns.padding_right,
			padding_bottom: domData.wpcf7ColumnsPaddingBottom || ELEMENT_DATA_DEFAULTS.wpcf7_data.columns.padding_bottom
		};

		// Putting together WPCF7 data
		wpcf7Data.content = wpcf7DataContent;
		wpcf7Data.columns = wpcf7DataColumns;
		wpcf7Data.options_different = _scanOptionsDifferent(elementTarget.element_id);

		// Putting together all the element data
		newElementData.synchronize = domData.synchronize || false;
		newElementData.element_target = elementTarget;
		newElementData.wpcf7_data = wpcf7Data;

		return newElementData;
	}

	/**
	 * Searches if there are different options between
	 * the form inputs and the form global options.
	 * @param		{String}	elementID
	 * @returns	{void}
	 * @since		2.0.3
	 * @version	2.0.5			Changed in vanilla js, improved logic
	 */
	function _scanOptionsDifferent(elementID) {
		var elementWrapper = Rexbuilder_Util.rexContainer.querySelector(
			'.rex-element-wrapper[data-rex-element-id="' + elementID + '"]'
		);
		var elementData = elementWrapper.querySelector('.rex-element-data');
		var columnsSpanDataArray = Array.prototype.slice.call(
			elementWrapper.querySelectorAll('.rex-wpcf7-column-content-data')
		);

		// Using new Array() for readability purposes
		var columnsWidths = new Array(elementData.getAttribute('data-wpcf7-content-width'));
		var columnsHeights = new Array(elementData.getAttribute('data-wpcf7-content-height'));
		var columnsTextColors = new Array(elementData.getAttribute('data-wpcf7-content-text-color'));
		var columnsFontSizes = new Array(elementData.getAttribute('data-wpcf7-content-font-size'));

		columnsSpanDataArray.forEach(function (spanData) {
			columnsWidths.push(spanData.getAttribute('data-wpcf7-input-width'));
			columnsHeights.push(spanData.getAttribute('data-wpcf7-input-height'));
			columnsTextColors.push(spanData.getAttribute('data-text-color'));
			columnsFontSizes.push(spanData.getAttribute('data-wpcf7-font-size'));
		});

		var optionsDifferent = {};

		function checkDiff(val, i, arr) {
			return val === arr[0];
		}

		// Checking if there are different values
		optionsDifferent.width = !columnsWidths.every(checkDiff);
		optionsDifferent.height = !columnsHeights.every(checkDiff);
		optionsDifferent.text_color = !columnsTextColors.every(checkDiff);
		optionsDifferent.font_size = !columnsFontSizes.every(checkDiff);

		return optionsDifferent;
	}

	function _removeElementStyle(elementID) {
		// Used in separation too
		// @todo
	}

	function _updateElementListInPage() {
		var j;
		var flagElementFound = false;

		Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper').each(function (i, element) {
			var $elementWrapper = $(element);
			var elementID = $elementWrapper.attr('data-rex-element-id');
			var elementNumber = parseInt($elementWrapper.attr('data-rex-element-number'));
			flagElementFound = false;
			for (j = 0; j < elementsInPage.length; j++) {
				if (elementsInPage[j].id == elementID) {
					flagElementFound = true;
					break;
				}
			}
			flagElementFound = false;
			if (!flagElementFound) {
				elementsInPage.push({
					id: parseInt(elementID),
					number: elementNumber
				});
			}
			if (elementsInPage[j].number < elementNumber) {
				elementsInPage[j].number = elementNumber;
			}
		});
	}

	function _getElementsInPage() {
		return elementsInPage;
	}

	function _detectNoBuilderForms() {
		var allForms = Rexbuilder_Util.$document.find('form').get();

		// These are all the cf7 forms that were not imported from the
		// builder, but added by typing their shortcode in a text block
		// or typing manually the HTML tags
		var noBuilderForms = allForms.filter(function (form) {
			return 0 === $(form).parents('.rex-element-wrapper').length;
		});

		noBuilderForms.forEach(function (form) {
			Rexbuilder_Util.addClass(form, 'no-builder-form');
		});
	}

	function init() {
		// Calling here this funcion because Rexbuilder_Rexelement
		// is the first called between itself, Rexbuilder_Rexwpcf7,
		// Rexbuilder_Rexelement_Edtior and Rexbuilder_Rexwpcf7_Editor
		_detectNoBuilderForms();

		_updateElementListInPage();
	}

	return {
		init: init,

		/* --- Styles --- */
		addStyles: addStyles,
		addElementStyle: addElementStyle,
		generateElementData: generateElementData
	};
})(jQuery);
