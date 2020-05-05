var Rexbuilder_Rexelement = (function ($) {
	'use strict';

	/* ===== GLOBAL VARIABLES ===== */

	var elementsInPage;
	var elementDataDefaults;

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
	 * Generate element data from RexElement dom Element.
	 * If getAllData is true, will get data from dom even if element is a model
	 *
	 * The obtained object has 2 fields:
	 *
	 * separateElement - true if element is separate, false if it is a model
	 *
	 * elementInfo - properties of the element
	 *
	 * @param {*} $elementWrapper DOM element wrapper
	 * @param {Boolean} getAllData flag to generate all data
	 * @returns {Object} data
	 */
	function generateElementData($elementWrapper, getAllData) {
		getAllData = typeof getAllData === 'undefined' ? false : getAllData.toString() == 'true';

		var elementData = {
			synchronize: '',
			wpcf7_data: {
				background_color: '',
				border_color: '',
				border_width: '',
				margin_top: '',
				margin_left: '',
				margin_right: '',
				margin_bottom: '',
				error_message_color: '',
				error_message_font_size: '',
				send_message_color: '',
				send_message_font_size: '',
				columns: {
					padding_top: '',
					padding_left: '',
					padding_right: '',
					padding_bottom: ''
				},
				content: {
					background_color: '',
					background_color_hover: '',
					text_color: '',
					text_color_hover: '',
					border_color: '',
					border_color_hover: '',
					width: '',
					height: '',
					font_size: '',
					border_width: '',
					border_radius: ''
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

		var $elementData = $elementWrapper.find('.rex-element-data').eq(0);
		var elementDataEl = $elementData[0];

		// Element General Data
		elementData.element_target.element_id = $elementWrapper.attr('data-rex-element-id');
		elementData.element_target.element_number = parseInt($elementWrapper.attr('data-rex-element-number'));

		elementData.synchronize =
			typeof $elementData.attr('data-synchronize') == 'undefined'
				? false
				: $elementData.attr('data-synchronize').toString();

		var separate = false;
		if ($elementWrapper.hasClass('rex-separate-element') || getAllData) {
			separate = true;
		}

		/* --- WPCF7 --- */
		var $form = $elementWrapper.find('.wpcf7-form');

		// Background color
		elementData.wpcf7_data.background_color = elementDataEl.getAttribute('data-wpcf7-background-color')
			? elementDataEl.getAttribute('data-wpcf7-background-color').toString()
			: $form.css('background-color');

		// Border color
		elementData.wpcf7_data.border_color = elementDataEl.getAttribute('data-wpcf7-border-color')
			? elementDataEl.getAttribute('data-wpcf7-border-color').toString()
			: $form.css('border-color');

		// Border width
		elementData.wpcf7_data.border_width = elementDataEl.getAttribute('data-wpcf7-border-width')
			? elementDataEl.getAttribute('data-wpcf7-border-width').toString()
			: $form.css('border-width');

		// Margins
		elementData.wpcf7_data.margin_top = elementDataEl.getAttribute('data-wpcf7-margin-top')
			? elementDataEl.getAttribute('data-wpcf7-margin-top').toString()
			: $form.css('margin-top');
		elementData.wpcf7_data.margin_left = elementDataEl.getAttribute('data-wpcf7-margin-left')
			? elementDataEl.getAttribute('data-wpcf7-margin-left').toString()
			: $form.css('margin-left');
		elementData.wpcf7_data.margin_right = elementDataEl.getAttribute('data-wpcf7-margin-right')
			? elementDataEl.getAttribute('data-wpcf7-margin-right').toString()
			: $form.css('margin-right');
		elementData.wpcf7_data.margin_bottom = elementDataEl.getAttribute('data-wpcf7-margin-bottom')
			? elementDataEl.getAttribute('data-wpcf7-margin-bottom').toString()
			: $form.css('margin-bottom');

		// Columns padding
		elementData.wpcf7_data.columns.padding_top = elementDataEl.getAttribute('data-wpcf7-columns-padding-top')
			? elementDataEl.getAttribute('data-wpcf7-columns-padding-top').toString()
			: elementDataDefaults.wpcf7_data.columns.padding_top;
		elementData.wpcf7_data.columns.padding_left = elementDataEl.getAttribute('data-wpcf7-columns-padding-left')
			? elementDataEl.getAttribute('data-wpcf7-columns-padding-left').toString()
			: elementDataDefaults.wpcf7_data.columns.padding_left;
		elementData.wpcf7_data.columns.padding_right = elementDataEl.getAttribute('data-wpcf7-columns-padding-right')
			? elementDataEl.getAttribute('data-wpcf7-columns-padding-right').toString()
			: elementDataDefaults.wpcf7_data.columns.padding_right;
		elementData.wpcf7_data.columns.padding_bottom = elementDataEl.getAttribute('data-wpcf7-columns-padding-bottom')
			? elementDataEl.getAttribute('data-wpcf7-columns-padding-bottom').toString()
			: elementDataDefaults.wpcf7_data.columns.padding_bottom;

		// Error Message
		elementData.wpcf7_data.error_message_color = elementDataEl.getAttribute('data-wpcf7-error-message-color')
			? elementDataEl.getAttribute('data-wpcf7-error-message-color').toString()
			: elementDataDefaults.wpcf7_data.error_message_color;
		elementData.wpcf7_data.error_message_font_size = elementDataEl.getAttribute('data-wpcf7-error-message-font-size')
			? elementDataEl.getAttribute('data-wpcf7-error-message-font-size').toString()
			: elementDataDefaults.wpcf7_data.error_message_font_size;

		// Send Message
		elementData.wpcf7_data.send_message_color = elementDataEl.getAttribute('data-wpcf7-send-message-color')
			? elementDataEl.getAttribute('data-wpcf7-send-message-color').toString()
			: elementDataDefaults.wpcf7_data.send_message_color;
		elementData.wpcf7_data.send_message_font_size = elementDataEl.getAttribute('data-wpcf7-send-message-font-size')
			? elementDataEl.getAttribute('data-wpcf7-send-message-font-size').toString()
			: elementDataDefaults.wpcf7_data.send_message_font_size;

		/* WPCF7 CONTENT */
		// Content width
		elementData.wpcf7_data.content.width = elementDataEl.getAttribute('data-wpcf7-content-width')
			? elementDataEl.getAttribute('data-wpcf7-content-width').toString()
			: elementDataDefaults.wpcf7_data.content.width;

		// Content height
		elementData.wpcf7_data.content.height = elementDataEl.getAttribute('data-wpcf7-content-height')
			? elementDataEl.getAttribute('data-wpcf7-content-height').toString()
			: elementDataDefaults.wpcf7_data.content.height;

		// Content font size
		elementData.wpcf7_data.content.font_size = elementDataEl.getAttribute('data-wpcf7-content-font-size')
			? elementDataEl.getAttribute('data-wpcf7-content-font-size').toString()
			: elementDataDefaults.wpcf7_data.content.font_size;

		// Content border width
		elementData.wpcf7_data.content.border_width = elementDataEl.getAttribute('data-wpcf7-content-border-width')
			? elementDataEl.getAttribute('data-wpcf7-content-border-width').toString()
			: elementDataDefaults.wpcf7_data.content.border_width;

		// Content border radius
		elementData.wpcf7_data.content.border_radius = elementDataEl.getAttribute('data-wpcf7-content-border-radius')
			? elementDataEl.getAttribute('data-wpcf7-content-border-radius').toString()
			: elementDataDefaults.wpcf7_data.content.border_radius;

		// Content text color
		elementData.wpcf7_data.content.text_color = elementDataEl.getAttribute('data-wpcf7-content-text-color')
			? elementDataEl.getAttribute('data-wpcf7-content-text-color').toString()
			: elementDataDefaults.wpcf7_data.content.text_color;

		// Content background color
		elementData.wpcf7_data.content.background_color = elementDataEl.getAttribute('data-wpcf7-content-background-color')
			? elementDataEl.getAttribute('data-wpcf7-content-background-color').toString()
			: elementDataDefaults.wpcf7_data.content.background_color;

		// Content border color
		elementData.wpcf7_data.content.border_color = elementDataEl.getAttribute('data-wpcf7-content-border-color')
			? elementDataEl.getAttribute('data-wpcf7-content-border-color').toString()
			: elementDataDefaults.wpcf7_data.content.border_color;

		// Content text color hover
		elementData.wpcf7_data.content.text_color_hover = elementDataEl.getAttribute('data-wpcf7-content-text-color-hover')
			? elementDataEl.getAttribute('data-wpcf7-content-text-color-hover').toString()
			: elementDataDefaults.wpcf7_data.content.text_color_hover;

		// Content background color hover
		elementData.wpcf7_data.content.background_color_hover = elementDataEl.getAttribute(
			'data-wpcf7-content-background-color-hover'
		)
			? elementDataEl.getAttribute('data-wpcf7-content-background-color-hover').toString()
			: elementDataDefaults.wpcf7_data.content.background_color_hover;

		// Content border color hover
		elementData.wpcf7_data.content.border_color_hover = elementDataEl.getAttribute(
			'data-wpcf7-content-border-color-hover'
		)
			? elementDataEl.getAttribute('data-wpcf7-content-border-color-hover').toString()
			: elementDataDefaults.wpcf7_data.content.border_color_hover;

		// Options different
		elementData.wpcf7_data.options_different = _scanOptionsDifferent(elementData.element_target.element_id);

		var data = {
			elementInfo: elementData,
			separateElement: separate
		};

		return data;
	}

	/* ===== PRIVATE METHODS ===== */

	function _scanOptionsDifferent(elementID) {
		var elementWrapperToScan = Rexbuilder_Util.$rexContainer
			.find('.rex-element-wrapper[data-rex-element-id="' + elementID + '"]')
			.eq(0)
			.get(0);
		var elementData = elementWrapperToScan.querySelector('.rex-element-data');
		var columnsSpanDataArray = Array.prototype.slice.call(
			elementWrapperToScan.querySelectorAll('.rex-wpcf7-column-content-data')
		);

		// Using new Array() for readability
		var columnsWidths = new Array(elementData.getAttribute('data-wpcf7-content-width'));
		var columnsHeights = new Array(elementData.getAttribute('data-wpcf7-content-height'));
		var columnsTextColors = new Array(elementData.getAttribute('data-wpcf7-content-text-color'));
		var columnsFontSizes = new Array(elementData.getAttribute('data-wpcf7-content-font-size'));

		columnsSpanDataArray.forEach(function (span) {
			columnsWidths.push(span.getAttribute('data-wpcf7-input-width'));
			columnsHeights.push(span.getAttribute('data-wpcf7-input-height'));
			columnsTextColors.push(span.getAttribute('data-text-color'));
			columnsFontSizes.push(span.getAttribute('data-wpcf7-font-size'));
		});

		var optionsDifferent = {};

		// Checking if there are different values
		optionsDifferent.width = !columnsWidths.every(function (val) {
			return val === columnsWidths[0];
		});
		optionsDifferent.height = !columnsHeights.every(function (val) {
			return val === columnsWidths[0];
		});
		optionsDifferent.text_color = !columnsTextColors.every(function (val) {
			return val === columnsWidths[0];
		});
		optionsDifferent.font_size = !columnsFontSizes.every(function (val) {
			return val === columnsWidths[0];
		});

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

	/* ===== PRIVATE METHODS END ===== */

	function init() {
		elementsInPage = [];

		elementDataDefaults = {
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
					height: '100%',
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
