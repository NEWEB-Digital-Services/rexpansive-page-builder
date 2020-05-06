/**
 * Edit content of wpcf7 forms
 * @since x.x.x
 */
var Wpcf7_Edit_Content_Modal = (function ($) {
	var wpcf7_content_editor_properties;
	var editPoint;
	var columnContentData;
	var reverseData;
	var resetData;
	var needToRemoveSpanData = true; // Needs to be set false the first time an edit happens
	var tinyMCE_editor;
	var needToSave = false;

	/**
	 * @param {jQuery} $target input field
	 * @param {Boolean} negativeNumbers true if allow negative numbers
	 */
	var _linkKeyDownListenerInputNumber = function ($target, negativeNumbers) {
		negativeNumbers = typeof negativeNumbers === 'undefined' ? false : negativeNumbers.toString() == 'true';
		$target.keydown(function (e) {
			var $input = $(e.target);
			// Allow: backspace, delete, tab, enter and .
			if (
				$.inArray(e.keyCode, [46, 8, 9, 13, 110]) !== -1 ||
				// Allow: Ctrl+A, Command+A
				(e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
				// Allow: home, end, left, right, down, up
				(e.keyCode >= 35 && e.keyCode <= 40) ||
				// Allow: -
				e.key == '-'
			) {
				// if negative numbers are not allowed
				if (!negativeNumbers && e.key == '-') {
					e.preventDefault();
				}
				// let it happen, don't do anything
				if (e.keyCode == 38) {
					// up
					e.preventDefault();
					$input.val(isNaN(parseInt($input.val())) ? 0 : parseInt($input.val()) + 1);
				}

				if (e.keyCode == 40) {
					//down
					e.preventDefault();
					if (negativeNumbers) {
						$input.val(isNaN(parseInt($input.val())) ? 0 : parseInt($input.val() - 1));
					} else {
						$input.val(Math.max(isNaN(parseInt($input.val())) ? 0 : parseInt($input.val()) - 1, 0));
					}
				}
				return;
			}

			// Ensure that it is a number and stop the keypress
			if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
				e.preventDefault();
			}

			//escape
			if (e.keyCode == 27) {
				$input.blur();
			}
		});
	};
	/**
	 *
	 * @param {jQuery} $target input field
	 * @param {function} callbackFunction  function to call when a valid input is insered. Function will be called with new value as argument
	 * @param {Boolean} negativeNumbers true if allow negative numbers
	 */
	var _linkKeyUpListenerInputNumber = function ($target, callbackFunction, negativeNumbers) {
		negativeNumbers = typeof negativeNumbers === 'undefined' ? false : negativeNumbers.toString() == 'true';
		$target.keyup(function (e) {
			if (
				//Numbers
				(e.keyCode >= 48 && e.keyCode <= 57) ||
				(e.keyCode >= 96 && e.keyCode <= 105) ||
				// arrow up, arrow down, back, -
				e.keyCode == 38 ||
				e.keyCode == 40 ||
				e.keyCode == 8 ||
				e.key == '-'
			) {
				e.preventDefault();
				if (negativeNumbers || !(e.key == '-')) {
					callbackFunction.call(this, parseInt(e.target.value));
				}
			}
		});
	};

	// MODAL FUNCTIONS

	var _openColumnContentEditorModal = function (data) {
		columnContentData = jQuery.extend(true, {}, data.columnContentData);
		editPoint = data.columnContentData.target;
		// var spanDataExists = data.spanDataExists;
		needToRemoveSpanData = !data.spanDataExists; // If the span data already exists, we don't have to remove it
		var inputType = columnContentData.input_type;

		_updateColumnContentEditorModal(columnContentData);

		wpcf7_content_editor_properties.$self.find('.bl_modal-row').not('.row-hidden').addClass('row-hidden');
		wpcf7_content_editor_properties.$self.find('.bl_modal__option-wrap').not('.row-hidden').addClass('row-hidden'); // Hiding all modal rows
		wpcf7_content_editor_properties.$content_required_field.parents('.bl_modal__option-wrap').removeClass('no-br');
		var fontSizeField = wpcf7_content_editor_properties.$content_input_font_size
			.parents('#rex-wpcf7-font-size-field')
			.detach();
		wpcf7_content_editor_properties.$button_preview.parents('.rex-accordion-outer--content').css('display', 'none');
		wpcf7_content_editor_properties.$content_text_color_value
			.parents('.bl_modal-row')
			.find('.rex-wpcf7-accordion-plus-wrap')
			.css('visibility', 'visible');

		wpcf7_content_editor_properties.$button_preview.css({
			display: '',
			'font-weight': '',
			'justify-content': '',
			'text-transform': '',
			'text-align': '',
			'align-items': ''
		});

		switch (inputType) {
			case 'text':
				wpcf7_content_editor_properties.$content_required_field
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_required_field.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_set_email.parents('.bl_modal__option-wrap').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_only_numbers
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_placeholder.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width_type.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height_type.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_text_color_value.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_text_color_value.parents('.rexwpcf7-cont_row').append(fontSizeField);
				wpcf7_content_editor_properties.$content_text_color_focus_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_placeholder_color_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_placeholder_hover_color_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				break;
			case 'email':
				wpcf7_content_editor_properties.$content_required_field
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_required_field.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_set_email.parents('.bl_modal__option-wrap').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_only_numbers
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_placeholder.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width_type.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height_type.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_text_color_value.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_text_color_value.parents('.rexwpcf7-cont_row').append(fontSizeField);
				wpcf7_content_editor_properties.$content_text_color_focus_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_placeholder_color_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_placeholder_hover_color_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				break;
			case 'number':
				wpcf7_content_editor_properties.$content_required_field
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_required_field.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_set_email.parents('.bl_modal__option-wrap').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_only_numbers
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_placeholder.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width_type.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height_type.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_text_color_value.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_text_color_value.parents('.rexwpcf7-cont_row').append(fontSizeField);
				wpcf7_content_editor_properties.$content_text_color_focus_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_placeholder_color_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_placeholder_hover_color_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				break;
			case 'textarea':
				wpcf7_content_editor_properties.$content_required_field
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden')
					.addClass('no-br');
				wpcf7_content_editor_properties.$content_required_field.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_placeholder.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width_type.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height_type.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_text_color_value.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_text_color_value.parents('.rexwpcf7-cont_row').append(fontSizeField);
				wpcf7_content_editor_properties.$content_text_color_focus_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_placeholder_color_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_placeholder_hover_color_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				break;
			case 'select':
				wpcf7_content_editor_properties.$content_required_field
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden')
					.addClass('no-br');
				wpcf7_content_editor_properties.$content_required_field.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_placeholder.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width_type.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height_type.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_select_color_value.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_select_color_value.parents('.rexwpcf7-cont_row').append(fontSizeField);
				wpcf7_content_editor_properties.$content_select_color_after_selection_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$field_list.removeClass('row-hidden');
				wpcf7_content_editor_properties.$add_list_field.parents('.bl_modal-row').removeClass('row-hidden');
				break;
			case 'radio':
				wpcf7_content_editor_properties.$content_input_width.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width_type.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height_type.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_text_color_value
					.parents('.bl_modal-row')
					.find('.rex-wpcf7-accordion-plus-wrap')
					.css('visibility', 'hidden');
				wpcf7_content_editor_properties.$content_text_color_value.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_text_color_value.parents('.rexwpcf7-cont_row').append(fontSizeField);
				wpcf7_content_editor_properties.$content_text_color_focus_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$field_list.removeClass('row-hidden');
				wpcf7_content_editor_properties.$add_list_field.parents('.bl_modal-row').removeClass('row-hidden');
				break;
			case 'acceptance':
				wpcf7_content_editor_properties.$content_required_field
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden')
					.addClass('no-br');
				wpcf7_content_editor_properties.$content_required_field.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_default_check.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width_type.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height_type.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_text_color_value
					.parents('.bl_modal-row')
					.find('.rex-wpcf7-accordion-plus-wrap')
					.css('visibility', 'hidden');
				wpcf7_content_editor_properties.$content_text_color_value.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_text_color_value.parents('.rexwpcf7-cont_row').append(fontSizeField);
				wpcf7_content_editor_properties.$content_text_color_focus_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_text_editor.parents('.bl_modal-row').removeClass('row-hidden');
				break;
			case 'file':
				wpcf7_content_editor_properties.$content_required_field
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden')
					.addClass('no-br');
				wpcf7_content_editor_properties.$content_required_field.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width_type.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_width
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height_type.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_height
					.parents('.bl_modal__option-wrap')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_text_color_value.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_text_color_value.parents('.rexwpcf7-cont_row').append(fontSizeField);
				wpcf7_content_editor_properties.$content_text_color_focus_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_input_text_editor.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_file_max_dimensions.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_file_max_dimensions_unit
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$field_list.removeClass('row-hidden');
				wpcf7_content_editor_properties.$field_list.addClass('rex-wpcf7-file-list');
				wpcf7_content_editor_properties.$add_list_field.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$button_preview.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$button_preview.css({
					display: 'block',
					'text-align': 'left',
					'text-transform': 'none'
				});
				wpcf7_content_editor_properties.$self
					.find('.accotdion-button-title')
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_button_text_color_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_button_background_color_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_button_border_color_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_button_text_color_hover_preview
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_button_background_color_hover_preview
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_button_border_color_hover_preview
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_button_margin_top.parents('.bl_modal-row').removeClass('row-hidden');
				break;
			case 'submit':
				wpcf7_content_editor_properties.$button_preview.parents('.rex-accordion-outer--content').css('display', '');
				wpcf7_content_editor_properties.$button_preview.parents('.bl_modal-row').removeClass('row-hidden');
				wpcf7_content_editor_properties.$button_preview.css({
					display: 'flex',
					'font-weight': 700,
					'justify-content': 'center',
					'text-transform': 'uppercase',
					'align-items': 'center'
				});
				wpcf7_content_editor_properties.$content_button_text_color_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_button_background_color_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_button_border_color_value
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_button_text_color_hover_preview
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_button_background_color_hover_preview
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_button_border_color_hover_preview
					.parents('.bl_modal-row')
					.removeClass('row-hidden');
				wpcf7_content_editor_properties.$content_button_margin_top.parents('.bl_modal-row').removeClass('row-hidden');
				break;
		}

		Rexlive_Modals_Utils.openModal(
			wpcf7_content_editor_properties.$self.parent('.rex-modal-wrap'), // $target
			false, // target_only
			['wpcf7-editing-content'] // additional_class
		);
	};

	var _closeModal = function () {
		_resetModal();

		Rexlive_Modals_Utils.closeModal(
			wpcf7_content_editor_properties.$self.parent('.rex-modal-wrap'), // $target
			false, // target_only
			['wpcf7-editing-content'] // additional_class
		);
	};

	var _resetModal = function () {
		var fontSizeField = wpcf7_content_editor_properties.$content_input_font_size
			.parents('#rex-wpcf7-font-size-field')
			.detach();
		wpcf7_content_editor_properties.$self.find('.rex-wpcf7-font-size-row').append(fontSizeField);

		wpcf7_content_editor_properties.$field_list.removeClass('rex-wpcf7-file-list');
	};

	var _applyData = function () {
		var columnContentDataToIframe = {
			eventName: 'rexlive:update_wcpf7_column_content_page',
			data_to_send: {
				reverseColumnContentData: jQuery.extend(true, {}, reverseData),
				actionColumnContentData: jQuery.extend(true, {}, columnContentData),
				needToSave: needToSave
			}
		};
		reverseData = jQuery.extend(true, {}, columnContentDataToIframe.data_to_send.actionColumnContentData);
		Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(columnContentDataToIframe);
	};

	var _updateColumnContentEditorModal = function (data) {
		_clearColumnContentData();
		_updateColumnContentData(data);
		_updatePanel();
	};

	var _clearColumnContentData = function () {
		columnContentData = {
			wpcf7_required_field: '',
			wpcf7_email: '',
			wpcf7_only_numbers: '',
			wpcf7_default_check: '',
			wpcf7_placeholder: '',
			wpcf7_list_fields: [],
			wpcf7_file_max_dimensions: '',
			wpcf7_button: {
				text: '',
				font_size: '',
				height: '',
				width: '',
				border_width: '',
				border_radius: '',
				margin_top: '',
				margin_right: '',
				margin_bottom: '',
				margin_left: '',
				padding_top: '',
				padding_right: '',
				padding_bottom: '',
				padding_left: '',
				text_color: '',
				text_color_hover: '',
				background_color: '',
				background_color_hover: '',
				border_color: '',
				border_color_hover: ''
			},
			input_width: '',
			input_height: '',
			font_size: '',
			border_width: '',
			border_radius: '',
			background_color: '',
			background_color_hover: '',
			border_color: '',
			border_color_hover: '',
			placeholder_color: '',
			placeholder_hover_color: '',
			select_color_after_selection: '',
			text_color: '',
			text_color_hover: '',
			text_color_focus: '',
			text: '',
			type: '',
			field_class: '',
			input_type: '',
			target: {
				element_id: '',
				row_number: '',
				column_number: ''
			}
		};
	};

	// data = columnContentData
	var _updateColumnContentData = function (data) {
		columnContentData = jQuery.extend(true, {}, data);
		reverseData = jQuery.extend(true, {}, columnContentData);
		resetData = jQuery.extend(true, {}, columnContentData);
	};

	var _updatePanel = function () {
		// Required Field
		wpcf7_content_editor_properties.$content_required_field.prop('checked', columnContentData.wpcf7_required_field);

		// Email
		wpcf7_content_editor_properties.$content_set_email.prop('checked', columnContentData.wpcf7_email);

		// Only Numbers
		wpcf7_content_editor_properties.$content_only_numbers.prop('checked', columnContentData.wpcf7_only_numbers);

		// Default Check
		wpcf7_content_editor_properties.$content_input_default_check.prop('checked', columnContentData.wpcf7_default_check);

		// Placeholder
		wpcf7_content_editor_properties.$content_placeholder.siblings('label, .prefix').removeClass('active');
		wpcf7_content_editor_properties.$content_placeholder.val(columnContentData.wpcf7_placeholder);
		if (wpcf7_content_editor_properties.$content_placeholder.val() != '') {
			wpcf7_content_editor_properties.$content_placeholder.siblings('label, .prefix').addClass('active');
		}

		// Width & Height
		wpcf7_content_editor_properties.$content_input_width.val(/[0-9]+/.exec(columnContentData.input_width));
		var widthType =
			null != /[a-z]{2}|\%/.exec(columnContentData.input_width)
				? /[a-z]{2}|\%/.exec(columnContentData.input_width)[0]
				: '%';
		switch (widthType) {
			case 'px':
				wpcf7_content_editor_properties.$content_input_width_type.filter('[value=pixel]').prop('checked', true);
				break;
			case '%':
			default:
				wpcf7_content_editor_properties.$content_input_width_type.filter('[value=percentage]').prop('checked', true);
				break;
		}
		wpcf7_content_editor_properties.$content_input_width.siblings('label, .prefix').removeClass('active');
		if (wpcf7_content_editor_properties.$content_input_width.val() != '') {
			wpcf7_content_editor_properties.$content_input_width.siblings('label, .prefix').addClass('active');
		}

		wpcf7_content_editor_properties.$content_input_height.val(/[0-9]+/.exec(columnContentData.input_height));
		var heightType =
			null != /[a-z]{2}|\%/.exec(columnContentData.input_height)
				? /[a-z]{2}|\%/.exec(columnContentData.input_height)[0]
				: '%';
		switch (heightType) {
			case '%':
				wpcf7_content_editor_properties.$content_input_height_type.filter('[value=percentage]').prop('checked', true);
				break;
			case 'px':
				wpcf7_content_editor_properties.$content_input_height_type.filter('[value=pixel]').prop('checked', true);
				break;
			default:
				break;
		}
		wpcf7_content_editor_properties.$content_input_height.siblings('label, .prefix').removeClass('active');
		if (wpcf7_content_editor_properties.$content_input_height.val() != '') {
			wpcf7_content_editor_properties.$content_input_height.siblings('label, .prefix').addClass('active');
		}

		// Font Size
		wpcf7_content_editor_properties.$content_input_font_size.val(/[0-9]+/.exec(columnContentData.font_size));

		// Text Editor
		tinyMCE_editor = tinyMCE.get('wpcf7_text_editor');
		columnContentData.text = columnContentData.text.replace(/<p>[\u25A0\u00A0\s]*<\/p>/g, ''); // Removes p empty elements with standard whitespaces, non-breaking spaces and bullet points
		tinyMCE_editor.setContent(columnContentData.text);
		_linkTextEditorListeners();

		// File Max Dimensions
		wpcf7_content_editor_properties.$content_file_max_dimensions.val(
			/[0-9]+/.exec(columnContentData.wpcf7_file_max_dimensions)
		);
		var dimensionsUnit =
			null != /[a-z]{2}/.exec(columnContentData.wpcf7_file_max_dimensions)
				? /[a-z]{2}/.exec(columnContentData.wpcf7_file_max_dimensions)[0]
				: 'kb';
		switch (dimensionsUnit) {
			case 'mb':
				wpcf7_content_editor_properties.$content_file_max_dimensions_unit.val('mb');
				break;
			case 'gb':
				wpcf7_content_editor_properties.$content_file_max_dimensions_unit.val('gb');
				break;
			case 'kb':
			default:
				wpcf7_content_editor_properties.$content_file_max_dimensions_unit.val('kb');
				break;
		}
		wpcf7_content_editor_properties.$content_file_max_dimensions.siblings('label, .prefix').removeClass('active');
		if (wpcf7_content_editor_properties.$content_file_max_dimensions.val() != '') {
			wpcf7_content_editor_properties.$content_file_max_dimensions.siblings('label, .prefix').addClass('active');
		}

		// List Fields
		wpcf7_content_editor_properties.$field_list.empty();
		tmpl.arg = 'o';
		for (var i = 1; i <= columnContentData.wpcf7_list_fields.length; i++) {
			wpcf7_content_editor_properties.$field_list.append(
				tmpl('tmpl-rex-wpcf7-edit-content-list', {
					number: i
				})
			);

			wpcf7_content_editor_properties.$field_list.find('.field-' + i).val(columnContentData.wpcf7_list_fields[i - 1]);
		}

		_linkListListeners();
		_updateDeleteFieldListener();

		// Text color
		wpcf7_content_editor_properties.$content_preview_text.css('background-color', columnContentData.text_color);
		wpcf7_content_editor_properties.$content_text_color_value.val(columnContentData.text_color);
		wpcf7_content_editor_properties.$content_text_color_preview.hide();
		wpcf7_content_editor_properties.$content_text_color_value.spectrum('set', columnContentData.text_color);

		// Text focus color
		wpcf7_content_editor_properties.$content_preview_text_focus.css(
			'background-color',
			columnContentData.text_color_focus
		);
		wpcf7_content_editor_properties.$content_text_color_focus_value.val(columnContentData.text_color_focus);
		wpcf7_content_editor_properties.$content_text_color_focus_preview.hide();
		wpcf7_content_editor_properties.$content_text_color_focus_value.spectrum('set', columnContentData.text_color_focus);

		// Select text color
		wpcf7_content_editor_properties.$content_preview_select.css('background-color', columnContentData.text_color);
		wpcf7_content_editor_properties.$content_select_color_value.val(columnContentData.text_color);
		wpcf7_content_editor_properties.$content_select_color_preview.hide();
		wpcf7_content_editor_properties.$content_select_color_value.spectrum('set', columnContentData.text_color);

		// Select text color after selection
		wpcf7_content_editor_properties.$content_preview_select_after_selection.css(
			'background-color',
			columnContentData.select_color_after_selection
		);
		wpcf7_content_editor_properties.$content_select_color_after_selection_value.val(
			columnContentData.select_color_after_selection
		);
		wpcf7_content_editor_properties.$content_select_color_after_selection_preview.hide();
		wpcf7_content_editor_properties.$content_select_color_after_selection_value.spectrum(
			'set',
			columnContentData.select_color_after_selection
		);

		// Placeholder color
		wpcf7_content_editor_properties.$content_preview_placeholder.css(
			'background-color',
			columnContentData.placeholder_color
		);
		wpcf7_content_editor_properties.$content_placeholder_color_value.val(columnContentData.placeholder_color);
		wpcf7_content_editor_properties.$content_placeholder_color_preview.hide();
		wpcf7_content_editor_properties.$content_placeholder_color_value.spectrum(
			'set',
			columnContentData.placeholder_color
		);

		// Placeholder hover color
		wpcf7_content_editor_properties.$content_preview_placeholder_hover.css(
			'background-color',
			columnContentData.placeholder_hover_color
		);
		wpcf7_content_editor_properties.$content_placeholder_hover_color_value.val(
			columnContentData.placeholder_hover_color
		);
		wpcf7_content_editor_properties.$content_placeholder_hover_color_preview.hide();
		wpcf7_content_editor_properties.$content_placeholder_hover_color_value.spectrum(
			'set',
			columnContentData.placeholder_hover_color
		);

		// Button

		// Button Preview
		wpcf7_content_editor_properties.$button_preview.css({
			width: columnContentData.wpcf7_button.width,
			height: columnContentData.wpcf7_button.height,
			color: columnContentData.wpcf7_button.text_color,
			'font-size': columnContentData.wpcf7_button.font_size,
			'background-color': columnContentData.wpcf7_button.background_color,
			'border-color': columnContentData.wpcf7_button.border_color,
			'border-style': 'solid',
			'border-width': columnContentData.wpcf7_button.border_width,
			'border-radius': columnContentData.wpcf7_button.border_radius,
			'margin-top': columnContentData.wpcf7_button.margin_top,
			'margin-right': columnContentData.wpcf7_button.margin_right,
			'margin-bottom': columnContentData.wpcf7_button.margin_bottom,
			'margin-left': columnContentData.wpcf7_button.margin_left,
			'padding-top': columnContentData.wpcf7_button.padding_top,
			'padding-right': columnContentData.wpcf7_button.padding_right,
			'padding-bottom': columnContentData.wpcf7_button.padding_bottom,
			'padding-left': columnContentData.wpcf7_button.padding_left
		});

		wpcf7_content_editor_properties.$button_preview.text(columnContentData.wpcf7_button.text);

		wpcf7_content_editor_properties.$button_preview.hover(
			function () {
				$(this).css({
					color: columnContentData.wpcf7_button.text_color_hover,
					'background-color': columnContentData.wpcf7_button.background_color_hover,
					'border-color': columnContentData.wpcf7_button.border_color_hover
				});
			},
			function () {
				$(this).css({
					color: columnContentData.wpcf7_button.text_color,
					'background-color': columnContentData.wpcf7_button.background_color,
					'border-color': columnContentData.wpcf7_button.border_color
				});
			}
		);

		// Button Text
		wpcf7_content_editor_properties.$content_button_text.siblings('label, .prefix').removeClass('active');
		wpcf7_content_editor_properties.$content_button_text.val(columnContentData.wpcf7_button.text);
		if (wpcf7_content_editor_properties.$content_button_text.val() != '') {
			wpcf7_content_editor_properties.$content_button_text.siblings('label, .prefix').addClass('active');
		}

		// Button Text Font Size
		wpcf7_content_editor_properties.$content_button_text_font_size.val(
			/[0-9]+/.exec(columnContentData.wpcf7_button.font_size)
		);

		// Button Border Width
		wpcf7_content_editor_properties.$content_button_border_width.val(
			/[0-9]+/.exec(columnContentData.wpcf7_button.border_width)
		);

		// Button Border Radius
		wpcf7_content_editor_properties.$content_button_border_radius.siblings('label, .prefix').removeClass('active');
		wpcf7_content_editor_properties.$content_button_border_radius.val(
			/[0-9]+/.exec(columnContentData.wpcf7_button.border_radius)
		);
		if (wpcf7_content_editor_properties.$content_button_border_radius.val() != '') {
			wpcf7_content_editor_properties.$content_button_border_radius.siblings('label, .prefix').addClass('active');
		}

		// Button Height
		wpcf7_content_editor_properties.$content_button_height.siblings('label, .prefix').removeClass('active');
		wpcf7_content_editor_properties.$content_button_height.val(/[0-9]+/.exec(columnContentData.wpcf7_button.height));
		if (wpcf7_content_editor_properties.$content_button_height.val() != '') {
			wpcf7_content_editor_properties.$content_button_height.siblings('label, .prefix').addClass('active');
		}

		// Button Width
		wpcf7_content_editor_properties.$content_button_width.siblings('label, .prefix').removeClass('active');
		wpcf7_content_editor_properties.$content_button_width.val(/[0-9]+/.exec(columnContentData.wpcf7_button.width));
		if (wpcf7_content_editor_properties.$content_button_width.val() != '') {
			wpcf7_content_editor_properties.$content_button_width.siblings('label, .prefix').addClass('active');
		}

		// Button Margins
		wpcf7_content_editor_properties.$content_button_margin_top.val(
			/[0-9]+/.exec(columnContentData.wpcf7_button.margin_top)
		);
		wpcf7_content_editor_properties.$content_button_margin_right.val(
			/[0-9]+/.exec(columnContentData.wpcf7_button.margin_right)
		);
		wpcf7_content_editor_properties.$content_button_margin_bottom.val(
			/[0-9]+/.exec(columnContentData.wpcf7_button.margin_bottom)
		);
		wpcf7_content_editor_properties.$content_button_margin_left.val(
			/[0-9]+/.exec(columnContentData.wpcf7_button.margin_left)
		);

		// Button Paddings
		wpcf7_content_editor_properties.$content_button_padding_top.val(
			/[0-9]+/.exec(columnContentData.wpcf7_button.padding_top)
		);
		wpcf7_content_editor_properties.$content_button_padding_right.val(
			/[0-9]+/.exec(columnContentData.wpcf7_button.padding_right)
		);
		wpcf7_content_editor_properties.$content_button_padding_bottom.val(
			/[0-9]+/.exec(columnContentData.wpcf7_button.padding_bottom)
		);
		wpcf7_content_editor_properties.$content_button_padding_left.val(
			/[0-9]+/.exec(columnContentData.wpcf7_button.padding_left)
		);

		// Button text color
		wpcf7_content_editor_properties.$content_button_text_color_value.val(columnContentData.wpcf7_button.text_color);
		wpcf7_content_editor_properties.$content_button_text_color_preview.hide();
		wpcf7_content_editor_properties.$content_button_text_color_value.spectrum(
			'set',
			columnContentData.wpcf7_button.text_color
		);

		// Button text color hover
		wpcf7_content_editor_properties.$content_preview_button_text_color_hover.css(
			'background-color',
			columnContentData.wpcf7_button.text_color_hover
		);
		wpcf7_content_editor_properties.$content_button_text_color_hover_value.val(
			columnContentData.wpcf7_button.text_color_hover
		);
		wpcf7_content_editor_properties.$content_button_text_color_hover_preview.hide();
		wpcf7_content_editor_properties.$content_button_text_color_hover_value.spectrum(
			'set',
			columnContentData.wpcf7_button.text_color_hover
		);

		// Button background color
		wpcf7_content_editor_properties.$content_preview_button_background_color.css(
			'background-color',
			columnContentData.wpcf7_button.background_color
		);
		wpcf7_content_editor_properties.$content_button_background_color_value.val(
			columnContentData.wpcf7_button.background_color
		);
		wpcf7_content_editor_properties.$content_button_background_color_preview.hide();
		wpcf7_content_editor_properties.$content_button_background_color_value.spectrum(
			'set',
			columnContentData.wpcf7_button.background_color
		);

		// Button background color hover
		wpcf7_content_editor_properties.$content_preview_button_background_color_hover.css(
			'background-color',
			columnContentData.wpcf7_button.background_color_hover
		);
		wpcf7_content_editor_properties.$content_button_background_color_hover_value.val(
			columnContentData.wpcf7_button.background_color_hover
		);
		wpcf7_content_editor_properties.$content_button_background_color_hover_preview.hide();
		wpcf7_content_editor_properties.$content_button_background_color_hover_value.spectrum(
			'set',
			columnContentData.wpcf7_button.background_color_hover
		);

		// Button border color
		wpcf7_content_editor_properties.$content_preview_button_border_color.css(
			'border-color',
			columnContentData.wpcf7_button.border_color
		);
		wpcf7_content_editor_properties.$content_button_border_color_value.val(columnContentData.wpcf7_button.border_color);
		wpcf7_content_editor_properties.$content_button_border_color_preview.hide();
		wpcf7_content_editor_properties.$content_button_border_color_value.spectrum(
			'set',
			columnContentData.wpcf7_button.border_color
		);

		// Button border color hover
		wpcf7_content_editor_properties.$content_preview_button_border_color_hover.css(
			'border-color',
			columnContentData.wpcf7_button.border_color_hover
		);
		wpcf7_content_editor_properties.$content_button_border_color_hover_value.val(
			columnContentData.wpcf7_button.border_color_hover
		);
		wpcf7_content_editor_properties.$content_button_border_color_hover_preview.hide();
		wpcf7_content_editor_properties.$content_button_border_color_hover_value.spectrum(
			'set',
			columnContentData.wpcf7_button.border_color_hover
		);
	};

	var _updateColumnContentDataFromPanel = function () {
		// Requried field
		columnContentData.wpcf7_required_field =
			undefined !== wpcf7_content_editor_properties.$content_required_field.attr('checked');

		// E-Mail
		columnContentData.wpcf7_email = undefined !== wpcf7_content_editor_properties.$content_set_email.attr('checked');

		// Only numbers
		columnContentData.wpcf7_only_numbers =
			undefined !== wpcf7_content_editor_properties.$content_only_numbers.attr('checked');

		// Default check
		columnContentData.wpcf7_default_check =
			undefined !== wpcf7_content_editor_properties.$content_input_default_check.attr('checked');

		// Placeholder
		columnContentData.wpcf7_placeholder = wpcf7_content_editor_properties.$content_placeholder.val();

		// Width & height
		columnContentData.input_width = wpcf7_content_editor_properties.$content_input_width.val();
		var widthType = wpcf7_content_editor_properties.$content_input_width_type.filter(':checked').val();

		switch (widthType) {
			case 'percentage':
				columnContentData.input_width = columnContentData.input_width + '%';
				break;
			case 'pixel':
				columnContentData.input_width = columnContentData.input_width + 'px';
				break;
		}

		columnContentData.input_height = wpcf7_content_editor_properties.$content_input_height.val();
		var heightType = wpcf7_content_editor_properties.$content_input_height_type.filter(':checked').val();

		switch (heightType) {
			case 'percentage':
				columnContentData.input_height = columnContentData.input_height + '%';
				break;
			case 'pixel':
				columnContentData.input_height = columnContentData.input_height + 'px';
				break;
		}

		// Font size
		columnContentData.font_size = wpcf7_content_editor_properties.$content_input_font_size.val() + 'px';

		// Text editor
		columnContentData.text = tinyMCE_editor.getContent();
		columnContentData.text = columnContentData.text.replace(/<p>[\u25A0\u00A0\s]*<\/p>/g, ''); // Removes p empty elements with standard whitespaces, non-breaking spaces and bullet points

		// File max dimensions
		columnContentData.wpcf7_file_max_dimensions = wpcf7_content_editor_properties.$content_file_max_dimensions.val();
		var dimensionsUnit = wpcf7_content_editor_properties.$content_file_max_dimensions_unit.val();
		columnContentData.wpcf7_file_max_dimensions += dimensionsUnit;

		// List fields
		var $listFields = wpcf7_content_editor_properties.$field_list.find('.wpcf7-select-field');
		columnContentData.wpcf7_list_fields = [];

		for (var i = 0; i < $listFields.length; i++) {
			columnContentData.wpcf7_list_fields.push($listFields[i].value);
		}

		// Button
		columnContentData.wpcf7_button.text = wpcf7_content_editor_properties.$content_button_text.val();
		columnContentData.wpcf7_button.font_size =
			wpcf7_content_editor_properties.$content_button_text_font_size.val() + 'px';
		columnContentData.wpcf7_button.height = wpcf7_content_editor_properties.$content_button_height.val() + 'px';
		columnContentData.wpcf7_button.width = wpcf7_content_editor_properties.$content_button_width.val() + 'px';
		columnContentData.wpcf7_button.border_width =
			wpcf7_content_editor_properties.$content_button_border_width.val() + 'px';
		columnContentData.wpcf7_button.border_radius =
			wpcf7_content_editor_properties.$content_button_border_radius.val() + 'px';
		columnContentData.wpcf7_button.margin_top = wpcf7_content_editor_properties.$content_button_margin_top.val() + 'px';
		columnContentData.wpcf7_button.margin_right =
			wpcf7_content_editor_properties.$content_button_margin_right.val() + 'px';
		columnContentData.wpcf7_button.margin_bottom =
			wpcf7_content_editor_properties.$content_button_margin_bottom.val() + 'px';
		columnContentData.wpcf7_button.margin_left =
			wpcf7_content_editor_properties.$content_button_margin_left.val() + 'px';
		columnContentData.wpcf7_button.padding_top =
			wpcf7_content_editor_properties.$content_button_padding_top.val() + 'px';
		columnContentData.wpcf7_button.padding_right =
			wpcf7_content_editor_properties.$content_button_padding_right.val() + 'px';
		columnContentData.wpcf7_button.padding_bottom =
			wpcf7_content_editor_properties.$content_button_padding_bottom.val() + 'px';
		columnContentData.wpcf7_button.padding_left =
			wpcf7_content_editor_properties.$content_button_padding_left.val() + 'px';
	};

	/////////////////////////////////////////////////////////////////////////////////////////////////
	/// FUNCTIONS THAT TELL THE IFRAME WHAT TO DO
	/////////////////////////////////////////////////////////////////////////////////////////////////

	var _createSpanData = function () {
		var columnContentDataToIframe = {
			eventName: 'rexlive:wpcf7_create_column_content_span_data',
			data_to_send: {
				editPoint: editPoint
			}
		};
		Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(columnContentDataToIframe);
	};

	var _updateColumnContentLive = function (data) {
		_updateColumnContentDataFromPanel();
		var elementDataToIframe = {
			eventName: 'rexlive:updateColumnContentLive',
			data_to_send: {
				target: columnContentData.target,
				content: columnContentData,
				propertyType: data.type,
				propertyName: data.name,
				newValue: data.value
			}
		};
		Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(elementDataToIframe);
	};

	/////////////////////////////////////////////////////////////////////////////////////////////////
	/// LINKING PANEL TOOLS
	/////////////////////////////////////////////////////////////////////////////////////////////////

	var _linkTextInputs = function () {
		_linkListListeners();

		wpcf7_content_editor_properties.$content_placeholder.on('keyup', function (e) {
			_updateColumnContentLive({
				type: 'wpcf7-placeholder',
				value: wpcf7_content_editor_properties.$content_placeholder.val()
			});
		});

		wpcf7_content_editor_properties.$content_button_text.on('keyup', function (e) {
			var newText = wpcf7_content_editor_properties.$content_button_text.val();
			_updateColumnContentLive({
				type: 'button-text',
				name: 'button-text',
				value: newText
			});

			wpcf7_content_editor_properties.$button_preview.text(newText);
		});
	};

	var _linkListListeners = function () {
		wpcf7_content_editor_properties.$field_list.find('.wpcf7-select-field').on('keyup', function (e) {
			var $listFields = wpcf7_content_editor_properties.$field_list.find('.wpcf7-select-field');
			var listFieldsArray = [];

			for (var i = 0; i < $listFields.length; i++) {
				listFieldsArray.push($listFields[i].value);
			}

			_updateColumnContentLive({
				type: 'wpcf7-list',
				value: {
					fields: listFieldsArray,
					type: 'writing'
				}
			});
		});
	};

	var _linkNumberInputs = function () {
		var outputString = '';
		// FONT SIZE
		var _updateFontSizeColumnContent = function (newFontSize) {
			outputString = isNaN(parseInt(newFontSize)) ? defaultColumnContentValues.font_size : newFontSize + 'px';
			_updateColumnContentLive({
				type: 'font-size',
				name: 'font-size',
				value: outputString
			});
		};
		_linkKeyDownListenerInputNumber(wpcf7_content_editor_properties.$content_input_font_size, false);
		_linkKeyUpListenerInputNumber(
			wpcf7_content_editor_properties.$content_input_font_size,
			_updateFontSizeColumnContent,
			false
		);

		// INPUT WIDTH
		var _updateColumnContentWidth = function (newInputWidth) {
			// outputString = isNaN(parseInt(newInputHeight)) ? defaultColumnContentValues.input_height : newInputHeight + "px";
			var widthType = wpcf7_content_editor_properties.$content_input_width_type.filter(':checked').val();

			switch (widthType) {
				case 'percentage':
					outputString = newInputWidth + '%';
					break;
				case 'pixel':
					outputString = newInputWidth + 'px';
					break;
			}

			_updateColumnContentLive({
				type: 'width',
				name: 'width',
				value: outputString
			});
		};
		_linkKeyDownListenerInputNumber(wpcf7_content_editor_properties.$content_input_width, false);
		_linkKeyUpListenerInputNumber(
			wpcf7_content_editor_properties.$content_input_width,
			_updateColumnContentWidth,
			false
		);

		// INPUT HEIGHT
		var _updateColumnContentHeight = function (newInputHeight) {
			// outputString = isNaN(parseInt(newInputHeight)) ? defaultButtonValues.dimensions.height : newInputHeight + "px";
			var heightType = wpcf7_content_editor_properties.$content_input_height_type.filter(':checked').val();

			switch (heightType) {
				case 'percentage':
					outputString = newInputHeight + '%';
					break;
				case 'pixel':
					outputString = newInputHeight + 'px';
					break;
			}

			_updateColumnContentLive({
				type: 'height',
				name: 'height',
				value: outputString
			});
		};
		_linkKeyDownListenerInputNumber(wpcf7_content_editor_properties.$content_input_height, false);
		_linkKeyUpListenerInputNumber(
			wpcf7_content_editor_properties.$content_input_height,
			_updateColumnContentHeight,
			false
		);

		// FILE MAX DIMENSIONS
		// var _updateFileMaxDimensions = function (newMaxDimensions) {
		//     // outputString = isNaN(parseInt(newInputHeight)) ? defaultButtonValues.dimensions.height : newInputHeight + "px";
		//     outputString = newMaxDimensions + wpcf7_content_editor_properties.$content_file_max_dimensions_unit.val();

		//     _updateColumnContentLive({
		//         type: "wpcf7-file-dimensions",
		//         value: outputString
		//     });
		// };
		// _linkKeyDownListenerInputNumber(wpcf7_content_editor_properties.$content_file_max_dimensions, false);
		// _linkKeyUpListenerInputNumber(wpcf7_content_editor_properties.$content_file_max_dimensions, _updateFileMaxDimensions, false);

		// BUTTON FONT SIZE
		var _updateButtonFontSize = function (newFontSize) {
			// outputString = isNaN(parseInt(newInputHeight)) ? defaultButtonValues.dimensions.height : newInputHeight + "px";
			outputString = newFontSize + 'px';

			_updateColumnContentLive({
				type: 'button-font-size',
				name: 'font-size',
				value: outputString
			});

			wpcf7_content_editor_properties.$button_preview.css({
				'font-size': outputString
			});
		};
		_linkKeyDownListenerInputNumber(wpcf7_content_editor_properties.$content_button_text_font_size, false);
		_linkKeyUpListenerInputNumber(
			wpcf7_content_editor_properties.$content_button_text_font_size,
			_updateButtonFontSize,
			false
		);

		// BUTTON HEIGHT
		var _updateButtonHeight = function (newButtonHeight) {
			// outputString = isNaN(parseInt(newInputHeight)) ? defaultButtonValues.dimensions.height : newInputHeight + "px";
			outputString = newButtonHeight + 'px';

			_updateColumnContentLive({
				type: 'button-height',
				name: 'height',
				value: outputString
			});

			wpcf7_content_editor_properties.$button_preview.css({
				height: outputString
			});
		};
		_linkKeyDownListenerInputNumber(wpcf7_content_editor_properties.$content_button_height, false);
		_linkKeyUpListenerInputNumber(wpcf7_content_editor_properties.$content_button_height, _updateButtonHeight, false);

		// BUTTON WIDTH
		var _updateButtonWidth = function (newButtonWidth) {
			// outputString = isNaN(parseInt(newInputHeight)) ? defaultButtonValues.dimensions.height : newInputHeight + "px";
			outputString = newButtonWidth + 'px';

			_updateColumnContentLive({
				type: 'button-width',
				name: 'width',
				value: outputString
			});

			wpcf7_content_editor_properties.$button_preview.css({
				width: outputString
			});
		};
		_linkKeyDownListenerInputNumber(wpcf7_content_editor_properties.$content_button_width, false);
		_linkKeyUpListenerInputNumber(wpcf7_content_editor_properties.$content_button_width, _updateButtonWidth, false);

		// BUTTON BORDER WIDTH
		var _updateButtonBorderWidth = function (newButtonBorderWidth) {
			// outputString = isNaN(parseInt(newInputHeight)) ? defaultButtonValues.dimensions.height : newInputHeight + "px";
			outputString = newButtonBorderWidth + 'px';

			_updateColumnContentLive({
				type: 'button-border-width',
				name: 'border-width',
				value: outputString
			});

			wpcf7_content_editor_properties.$button_preview.css({
				'border-width': outputString
			});
		};
		_linkKeyDownListenerInputNumber(wpcf7_content_editor_properties.$content_button_border_width, false);
		_linkKeyUpListenerInputNumber(
			wpcf7_content_editor_properties.$content_button_border_width,
			_updateButtonBorderWidth,
			false
		);

		// BUTTON BORDER RADIUS
		var _updateButtonBorderRadius = function (newButtonBorderRadius) {
			// outputString = isNaN(parseInt(newInputHeight)) ? defaultButtonValues.dimensions.height : newInputHeight + "px";
			outputString = newButtonBorderRadius + 'px';

			_updateColumnContentLive({
				type: 'button-border-radius',
				name: 'border-radius',
				value: outputString
			});

			wpcf7_content_editor_properties.$button_preview.css({
				'border-radius': outputString
			});
		};
		_linkKeyDownListenerInputNumber(wpcf7_content_editor_properties.$content_button_border_radius, false);
		_linkKeyUpListenerInputNumber(
			wpcf7_content_editor_properties.$content_button_border_radius,
			_updateButtonBorderRadius,
			false
		);

		// BUTTON MARGIN TOP
		var _updateButtonMarginTop = function (newButtonMarginTop) {
			// outputString = isNaN(parseInt(newInputHeight)) ? defaultButtonValues.dimensions.height : newInputHeight + "px";
			outputString = newButtonMarginTop + 'px';

			_updateColumnContentLive({
				type: 'button-margin-top',
				name: 'margin-top',
				value: outputString
			});

			wpcf7_content_editor_properties.$button_preview.css({
				'margin-top': outputString
			});
		};
		_linkKeyDownListenerInputNumber(wpcf7_content_editor_properties.$content_button_margin_top, false);
		_linkKeyUpListenerInputNumber(
			wpcf7_content_editor_properties.$content_button_margin_top,
			_updateButtonMarginTop,
			false
		);

		// BUTTON MARGIN RIGHT
		var _updateButtonMarginRight = function (newButtonMarginRight) {
			// outputString = isNaN(parseInt(newInputHeight)) ? defaultButtonValues.dimensions.height : newInputHeight + "px";
			outputString = newButtonMarginRight + 'px';

			_updateColumnContentLive({
				type: 'button-margin-right',
				name: 'margin-right',
				value: outputString
			});

			wpcf7_content_editor_properties.$button_preview.css({
				'margin-right': outputString
			});
		};
		_linkKeyDownListenerInputNumber(wpcf7_content_editor_properties.$content_button_margin_right, false);
		_linkKeyUpListenerInputNumber(
			wpcf7_content_editor_properties.$content_button_margin_right,
			_updateButtonMarginRight,
			false
		);

		// BUTTON MARGIN BOTTOM
		var _updateButtonMarginBottom = function (newButtonMarginBottom) {
			// outputString = isNaN(parseInt(newInputHeight)) ? defaultButtonValues.dimensions.height : newInputHeight + "px";
			outputString = newButtonMarginBottom + 'px';

			_updateColumnContentLive({
				type: 'button-margin-bottom',
				name: 'margin-bottom',
				value: outputString
			});

			wpcf7_content_editor_properties.$button_preview.css({
				'margin-bottom': outputString
			});
		};
		_linkKeyDownListenerInputNumber(wpcf7_content_editor_properties.$content_button_margin_bottom, false);
		_linkKeyUpListenerInputNumber(
			wpcf7_content_editor_properties.$content_button_margin_bottom,
			_updateButtonMarginBottom,
			false
		);

		// BUTTON MARGIN LEFT
		var _updateButtonMarginLeft = function (newButtonMarginLeft) {
			// outputString = isNaN(parseInt(newInputHeight)) ? defaultButtonValues.dimensions.height : newInputHeight + "px";
			outputString = newButtonMarginLeft + 'px';

			_updateColumnContentLive({
				type: 'button-margin-left',
				name: 'margin-left',
				value: outputString
			});

			wpcf7_content_editor_properties.$button_preview.css({
				'margin-left': outputString
			});
		};
		_linkKeyDownListenerInputNumber(wpcf7_content_editor_properties.$content_button_margin_left, false);
		_linkKeyUpListenerInputNumber(
			wpcf7_content_editor_properties.$content_button_margin_left,
			_updateButtonMarginLeft,
			false
		);

		// BUTTON PADDING TOP
		var _updateButtonPaddingTop = function (newButtonPaddingTop) {
			// outputString = isNaN(parseInt(newInputHeight)) ? defaultButtonValues.dimensions.height : newInputHeight + "px";
			outputString = newButtonPaddingTop + 'px';

			_updateColumnContentLive({
				type: 'button-padding-top',
				name: 'padding-top',
				value: outputString
			});

			wpcf7_content_editor_properties.$button_preview.css({
				'padding-top': outputString
			});
		};
		_linkKeyDownListenerInputNumber(wpcf7_content_editor_properties.$content_button_padding_top, false);
		_linkKeyUpListenerInputNumber(
			wpcf7_content_editor_properties.$content_button_padding_top,
			_updateButtonPaddingTop,
			false
		);

		// BUTTON PADDING RIGHT
		var _updateButtonPaddingRight = function (newButtonPaddingRight) {
			// outputString = isNaN(parseInt(newInputHeight)) ? defaultButtonValues.dimensions.height : newInputHeight + "px";
			outputString = newButtonPaddingRight + 'px';

			_updateColumnContentLive({
				type: 'button-padding-right',
				name: 'padding-right',
				value: outputString
			});

			wpcf7_content_editor_properties.$button_preview.css({
				'padding-right': outputString
			});
		};
		_linkKeyDownListenerInputNumber(wpcf7_content_editor_properties.$content_button_padding_right, false);
		_linkKeyUpListenerInputNumber(
			wpcf7_content_editor_properties.$content_button_padding_right,
			_updateButtonPaddingRight,
			false
		);

		// BUTTON PADDING BOTTOM
		var _updateButtonPaddingBottom = function (newButtonPaddingBottom) {
			// outputString = isNaN(parseInt(newInputHeight)) ? defaultButtonValues.dimensions.height : newInputHeight + "px";
			outputString = newButtonPaddingBottom + 'px';

			_updateColumnContentLive({
				type: 'button-padding-bottom',
				name: 'padding-bottom',
				value: outputString
			});

			wpcf7_content_editor_properties.$button_preview.css({
				'padding-bottom': outputString
			});
		};
		_linkKeyDownListenerInputNumber(wpcf7_content_editor_properties.$content_button_padding_bottom, false);
		_linkKeyUpListenerInputNumber(
			wpcf7_content_editor_properties.$content_button_padding_bottom,
			_updateButtonPaddingBottom,
			false
		);

		// BUTTON PADDING LEFT
		var _updateButtonPaddingLeft = function (newButtonPaddingLeft) {
			// outputString = isNaN(parseInt(newInputHeight)) ? defaultButtonValues.dimensions.height : newInputHeight + "px";
			outputString = newButtonPaddingLeft + 'px';

			_updateColumnContentLive({
				type: 'button-padding-left',
				name: 'padding-left',
				value: outputString
			});

			wpcf7_content_editor_properties.$button_preview.css({
				'padding-left': outputString
			});
		};
		_linkKeyDownListenerInputNumber(wpcf7_content_editor_properties.$content_button_padding_left, false);
		_linkKeyUpListenerInputNumber(
			wpcf7_content_editor_properties.$content_button_padding_left,
			_updateButtonPaddingLeft,
			false
		);
	};

	var _linkBackgroundColorEditor = function () {
		// Not used
		var colorTEXT;
		wpcf7_content_editor_properties.$content_background_color_value.spectrum({
			replacerClassName: 'btn-floating',
			preferredFormat: 'hex',
			showPalette: false,
			showAlpha: true,
			showInput: true,
			showButtons: false,
			containerClassName: 'rexbuilder-materialize-wrap block-background-color-picker',
			show: function () {},
			move: function (color) {
				if (needToRemoveSpanData) {
					needToRemoveSpanData = false;
				}

				colorTEXT = color.toRgbString();
				wpcf7_content_editor_properties.$content_background_color_preview.hide();
				wpcf7_content_editor_properties.$content_preview_background.css('background-color', colorTEXT);
				_updateColumnContentLive({
					type: 'background',
					name: 'background-color',
					value: colorTEXT
				});
			},
			change: function (color) {},
			hide: function (color) {
				columnContentData.background_color = color.toRgbString();
			},
			cancelText: '',
			chooseText: ''
		});

		var close = tmpl('tmpl-tool-close', {});
		var $close = $(close);
		wpcf7_content_editor_properties.$content_background_color_value.spectrum('container').append($close);

		$close.on('click', function (e) {
			e.preventDefault();
			wpcf7_content_editor_properties.$content_background_color_value.spectrum('hide');
		});

		wpcf7_content_editor_properties.$content_background_color_preview.on('click', function () {
			wpcf7_content_editor_properties.$content_background_color_value.spectrum('show');
			return false;
		});
	};

	var _linkTextColorEditor = function () {
		var colorTEXT;
		wpcf7_content_editor_properties.$content_text_color_value.spectrum({
			replacerClassName: 'btn-floating',
			preferredFormat: 'hex',
			showPalette: false,
			showAlpha: true,
			showInput: true,
			showButtons: false,
			containerClassName: 'rexbuilder-materialize-wrap block-background-color-picker',
			show: function () {},
			move: function (color) {
				if (needToRemoveSpanData) {
					needToRemoveSpanData = false;
				}

				colorTEXT = color.toRgbString();
				wpcf7_content_editor_properties.$content_text_color_preview.hide();
				wpcf7_content_editor_properties.$content_preview_text.css('background-color', colorTEXT);
				_updateColumnContentLive({
					type: 'text-color',
					name: 'text-color',
					value: colorTEXT
				});
			},
			change: function (color) {},
			hide: function (color) {
				columnContentData.text_color = color.toRgbString();
			},
			cancelText: '',
			chooseText: ''
		});

		var close = tmpl('tmpl-tool-close', {});
		var $close = $(close);
		wpcf7_content_editor_properties.$content_text_color_value.spectrum('container').append($close);

		$close.on('click', function (e) {
			e.preventDefault();
			wpcf7_content_editor_properties.$content_text_color_value.spectrum('hide');
		});

		wpcf7_content_editor_properties.$content_text_color_preview.on('click', function () {
			wpcf7_content_editor_properties.$content_text_color_value.spectrum('show');
			return false;
		});
	};

	var _linkTextFocusColorEditor = function () {
		var colorTEXT;
		wpcf7_content_editor_properties.$content_text_color_focus_value.spectrum({
			replacerClassName: 'btn-floating',
			preferredFormat: 'hex',
			showPalette: false,
			showAlpha: true,
			showInput: true,
			showButtons: false,
			containerClassName: 'rexbuilder-materialize-wrap block-background-color-picker',
			show: function () {},
			move: function (color) {
				if (needToRemoveSpanData) {
					needToRemoveSpanData = false;
				}

				colorTEXT = color.toRgbString();
				wpcf7_content_editor_properties.$content_text_color_focus_preview.hide();
				wpcf7_content_editor_properties.$content_preview_text_focus.css('background-color', colorTEXT);
				_updateColumnContentLive({
					type: 'text-focus',
					name: 'text-color',
					value: colorTEXT
				});
			},
			change: function (color) {},
			hide: function (color) {
				columnContentData.text_color_focus = color.toRgbString();
			},
			cancelText: '',
			chooseText: ''
		});

		var close = tmpl('tmpl-tool-close', {});
		var $close = $(close);
		wpcf7_content_editor_properties.$content_text_color_focus_value.spectrum('container').append($close);

		$close.on('click', function (e) {
			e.preventDefault();
			wpcf7_content_editor_properties.$content_text_color_focus_value.spectrum('hide');
		});

		wpcf7_content_editor_properties.$content_text_color_focus_preview.on('click', function () {
			wpcf7_content_editor_properties.$content_text_color_focus_value.spectrum('show');
			return false;
		});
	};

	var _linkSelectTextColorEditor = function () {
		var colorTEXT;
		wpcf7_content_editor_properties.$content_select_color_value.spectrum({
			replacerClassName: 'btn-floating',
			preferredFormat: 'hex',
			showPalette: false,
			showAlpha: true,
			showInput: true,
			showButtons: false,
			containerClassName: 'rexbuilder-materialize-wrap block-background-color-picker',
			show: function () {},
			move: function (color) {
				if (needToRemoveSpanData) {
					needToRemoveSpanData = false;
				}

				colorTEXT = color.toRgbString();
				wpcf7_content_editor_properties.$content_select_color_preview.hide();
				wpcf7_content_editor_properties.$content_preview_select.css('background-color', colorTEXT);
				_updateColumnContentLive({
					type: 'text-color',
					name: 'text-color',
					value: colorTEXT
				});
			},
			change: function (color) {},
			hide: function (color) {
				columnContentData.text_color = color.toRgbString();
			},
			cancelText: '',
			chooseText: ''
		});

		var close = tmpl('tmpl-tool-close', {});
		var $close = $(close);
		wpcf7_content_editor_properties.$content_select_color_value.spectrum('container').append($close);

		$close.on('click', function (e) {
			e.preventDefault();
			wpcf7_content_editor_properties.$content_select_color_value.spectrum('hide');
		});

		wpcf7_content_editor_properties.$content_select_color_preview.on('click', function () {
			wpcf7_content_editor_properties.$content_select_color_value.spectrum('show');
			return false;
		});
	};

	var _linkSelectTextColorAfterSelectionEditor = function () {
		var colorTEXT;
		wpcf7_content_editor_properties.$content_select_color_after_selection_value.spectrum({
			replacerClassName: 'btn-floating',
			preferredFormat: 'hex',
			showPalette: false,
			showAlpha: true,
			showInput: true,
			showButtons: false,
			containerClassName: 'rexbuilder-materialize-wrap block-background-color-picker',
			show: function () {},
			move: function (color) {
				if (needToRemoveSpanData) {
					needToRemoveSpanData = false;
				}

				colorTEXT = color.toRgbString();
				wpcf7_content_editor_properties.$content_select_color_after_selection_preview.hide();
				wpcf7_content_editor_properties.$content_preview_select_after_selection.css('background-color', colorTEXT);
				_updateColumnContentLive({
					type: 'select-color',
					name: 'text-color',
					value: colorTEXT
				});
			},
			change: function (color) {},
			hide: function (color) {
				columnContentData.select_color_after_selection = color.toRgbString();
			},
			cancelText: '',
			chooseText: ''
		});

		var close = tmpl('tmpl-tool-close', {});
		var $close = $(close);
		wpcf7_content_editor_properties.$content_select_color_after_selection_value.spectrum('container').append($close);

		$close.on('click', function (e) {
			e.preventDefault();
			wpcf7_content_editor_properties.$content_select_color_after_selection_value.spectrum('hide');
		});

		wpcf7_content_editor_properties.$content_select_color_after_selection_preview.on('click', function () {
			wpcf7_content_editor_properties.$content_select_color_after_selection_value.spectrum('show');
			return false;
		});
	};

	var _linkPlaceholderColorEditor = function () {
		var colorTEXT;
		wpcf7_content_editor_properties.$content_placeholder_color_value.spectrum({
			replacerClassName: 'btn-floating',
			preferredFormat: 'hex',
			showPalette: false,
			showAlpha: true,
			showInput: true,
			showButtons: false,
			containerClassName: 'rexbuilder-materialize-wrap block-placeholder-color-picker',
			show: function () {},
			move: function (color) {
				if (needToRemoveSpanData) {
					needToRemoveSpanData = false;
				}

				colorTEXT = color.toRgbString();
				wpcf7_content_editor_properties.$content_placeholder_color_preview.hide();
				wpcf7_content_editor_properties.$content_preview_placeholder.css('background-color', colorTEXT);
				_updateColumnContentLive({
					type: 'placeholder-color',
					name: 'text-color',
					value: colorTEXT
				});
			},
			change: function (color) {},
			hide: function (color) {
				columnContentData.placeholder_color = color.toRgbString();
			},
			cancelText: '',
			chooseText: ''
		});

		var close = tmpl('tmpl-tool-close', {});
		var $close = $(close);
		wpcf7_content_editor_properties.$content_placeholder_color_value.spectrum('container').append($close);

		$close.on('click', function (e) {
			e.preventDefault();
			wpcf7_content_editor_properties.$content_placeholder_color_value.spectrum('hide');
		});

		wpcf7_content_editor_properties.$content_placeholder_color_preview.on('click', function () {
			wpcf7_content_editor_properties.$content_placeholder_color_value.spectrum('show');
			return false;
		});
	};

	var _linkPlaceholderHoverColorEditor = function () {
		var colorTEXT;
		wpcf7_content_editor_properties.$content_placeholder_hover_color_value.spectrum({
			replacerClassName: 'btn-floating',
			preferredFormat: 'hex',
			showPalette: false,
			showAlpha: true,
			showInput: true,
			showButtons: false,
			containerClassName: 'rexbuilder-materialize-wrap block-placeholder-color-picker',
			show: function () {},
			move: function (color) {
				if (needToRemoveSpanData) {
					needToRemoveSpanData = false;
				}

				colorTEXT = color.toRgbString();
				wpcf7_content_editor_properties.$content_placeholder_hover_color_preview.hide();
				wpcf7_content_editor_properties.$content_preview_placeholder_hover.css('background-color', colorTEXT);
				_updateColumnContentLive({
					type: 'placeholder-color-hover',
					name: 'text-color',
					value: colorTEXT
				});
			},
			change: function (color) {},
			hide: function (color) {
				columnContentData.placeholder_hover_color = color.toRgbString();
			},
			cancelText: '',
			chooseText: ''
		});

		var close = tmpl('tmpl-tool-close', {});
		var $close = $(close);
		wpcf7_content_editor_properties.$content_placeholder_hover_color_value.spectrum('container').append($close);

		$close.on('click', function (e) {
			e.preventDefault();
			wpcf7_content_editor_properties.$content_placeholder_hover_color_value.spectrum('hide');
		});

		wpcf7_content_editor_properties.$content_placeholder_hover_color_preview.on('click', function () {
			wpcf7_content_editor_properties.$content_placeholder_hover_color_value.spectrum('show');
			return false;
		});
	};

	var _linkButtonTextColorEditor = function () {
		var colorTEXT;
		wpcf7_content_editor_properties.$content_button_text_color_value.spectrum({
			replacerClassName: 'btn-floating',
			preferredFormat: 'hex',
			showPalette: false,
			showAlpha: true,
			showInput: true,
			showButtons: false,
			containerClassName: 'rexbuilder-materialize-wrap block-background-color-picker',
			show: function () {},
			move: function (color) {
				if (needToRemoveSpanData) {
					needToRemoveSpanData = false;
				}

				colorTEXT = color.toRgbString();
				wpcf7_content_editor_properties.$content_button_text_color_preview.hide();
				_updateColumnContentLive({
					type: 'button-text-color',
					name: 'text-color',
					value: colorTEXT
				});

				wpcf7_content_editor_properties.$button_preview.css({
					color: colorTEXT
				});
			},
			change: function (color) {},
			hide: function (color) {
				columnContentData.wpcf7_button.text_color = color.toRgbString();
			},
			cancelText: '',
			chooseText: ''
		});

		var close = tmpl('tmpl-tool-close', {});
		var $close = $(close);
		wpcf7_content_editor_properties.$content_button_text_color_value.spectrum('container').append($close);

		$close.on('click', function (e) {
			e.preventDefault();
			wpcf7_content_editor_properties.$content_button_text_color_value.spectrum('hide');
		});

		wpcf7_content_editor_properties.$content_button_text_color_preview.on('click', function () {
			wpcf7_content_editor_properties.$content_button_text_color_value.spectrum('show');
			return false;
		});
	};

	var _linkButtonTextColorHoverEditor = function () {
		var colorTEXT;
		wpcf7_content_editor_properties.$content_button_text_color_hover_value.spectrum({
			replacerClassName: 'btn-floating',
			preferredFormat: 'hex',
			showPalette: false,
			showAlpha: true,
			showInput: true,
			showButtons: false,
			containerClassName: 'rexbuilder-materialize-wrap block-background-color-picker',
			show: function () {},
			move: function (color) {
				if (needToRemoveSpanData) {
					needToRemoveSpanData = false;
				}

				colorTEXT = color.toRgbString();
				wpcf7_content_editor_properties.$content_button_text_color_hover_preview.hide();
				wpcf7_content_editor_properties.$content_preview_button_text_color_hover.css('background-color', colorTEXT);
				_updateColumnContentLive({
					type: 'button-text-color-hover',
					name: 'text-color',
					value: colorTEXT
				});

				wpcf7_content_editor_properties.$button_preview.hover(
					function () {
						$(this).css({
							color: colorTEXT
						});
					},
					function () {
						$(this).css({
							color: columnContentData.wpcf7_button.text_color
						});
					}
				);
			},
			change: function (color) {},
			hide: function (color) {
				columnContentData.wpcf7_button.text_color_hover = color.toRgbString();
			},
			cancelText: '',
			chooseText: ''
		});

		var close = tmpl('tmpl-tool-close', {});
		var $close = $(close);
		wpcf7_content_editor_properties.$content_button_text_color_hover_value.spectrum('container').append($close);

		$close.on('click', function (e) {
			e.preventDefault();
			wpcf7_content_editor_properties.$content_button_text_color_hover_value.spectrum('hide');
		});

		wpcf7_content_editor_properties.$content_button_text_color_hover_preview.on('click', function () {
			wpcf7_content_editor_properties.$content_button_text_color_hover_value.spectrum('show');
			return false;
		});
	};

	var _linkButtonBackgroundColorEditor = function () {
		var colorTEXT;
		wpcf7_content_editor_properties.$content_button_background_color_value.spectrum({
			replacerClassName: 'btn-floating',
			preferredFormat: 'hex',
			showPalette: false,
			showAlpha: true,
			showInput: true,
			showButtons: false,
			containerClassName: 'rexbuilder-materialize-wrap block-background-color-picker',
			show: function () {},
			move: function (color) {
				if (needToRemoveSpanData) {
					needToRemoveSpanData = false;
				}

				colorTEXT = color.toRgbString();
				wpcf7_content_editor_properties.$content_button_background_color_preview.hide();
				wpcf7_content_editor_properties.$content_preview_button_background_color.css('background-color', colorTEXT);
				_updateColumnContentLive({
					type: 'button-background-color',
					name: 'background-color',
					value: colorTEXT
				});

				wpcf7_content_editor_properties.$button_preview.css({
					'background-color': colorTEXT
				});
			},
			change: function (color) {},
			hide: function (color) {
				columnContentData.wpcf7_button.background_color = color.toRgbString();
			},
			cancelText: '',
			chooseText: ''
		});

		var close = tmpl('tmpl-tool-close', {});
		var $close = $(close);
		wpcf7_content_editor_properties.$content_button_background_color_value.spectrum('container').append($close);

		$close.on('click', function (e) {
			e.preventDefault();
			wpcf7_content_editor_properties.$content_button_background_color_value.spectrum('hide');
		});

		wpcf7_content_editor_properties.$content_button_background_color_preview.on('click', function () {
			wpcf7_content_editor_properties.$content_button_background_color_value.spectrum('show');
			return false;
		});
	};

	var _linkButtonBackgroundColorHoverEditor = function () {
		var colorTEXT;
		wpcf7_content_editor_properties.$content_button_background_color_hover_value.spectrum({
			replacerClassName: 'btn-floating',
			preferredFormat: 'hex',
			showPalette: false,
			showAlpha: true,
			showInput: true,
			showButtons: false,
			containerClassName: 'rexbuilder-materialize-wrap block-background-color-picker',
			show: function () {},
			move: function (color) {
				if (needToRemoveSpanData) {
					needToRemoveSpanData = false;
				}

				colorTEXT = color.toRgbString();
				wpcf7_content_editor_properties.$content_button_background_color_hover_preview.hide();
				wpcf7_content_editor_properties.$content_preview_button_background_color_hover.css(
					'background-color',
					colorTEXT
				);
				_updateColumnContentLive({
					type: 'button-background-color-hover',
					name: 'background-color',
					value: colorTEXT
				});

				wpcf7_content_editor_properties.$button_preview.hover(
					function () {
						$(this).css({
							'background-color': colorTEXT
						});
					},
					function () {
						$(this).css({
							'background-color': columnContentData.wpcf7_button.background_color
						});
					}
				);
			},
			change: function (color) {},
			hide: function (color) {
				columnContentData.wpcf7_button.background_color_hover = color.toRgbString();
			},
			cancelText: '',
			chooseText: ''
		});

		var close = tmpl('tmpl-tool-close', {});
		var $close = $(close);
		wpcf7_content_editor_properties.$content_button_background_color_hover_value.spectrum('container').append($close);

		$close.on('click', function (e) {
			e.preventDefault();
			wpcf7_content_editor_properties.$content_button_background_color_hover_value.spectrum('hide');
		});

		wpcf7_content_editor_properties.$content_button_background_color_hover_preview.on('click', function () {
			wpcf7_content_editor_properties.$content_button_background_color_hover_value.spectrum('show');
			return false;
		});
	};

	var _linkButtonBorderColorEditor = function () {
		var colorTEXT;
		wpcf7_content_editor_properties.$content_button_border_color_value.spectrum({
			replacerClassName: 'btn-floating',
			preferredFormat: 'hex',
			showPalette: false,
			showAlpha: true,
			showInput: true,
			showButtons: false,
			containerClassName: 'rexbuilder-materialize-wrap block-background-color-picker',
			show: function () {},
			move: function (color) {
				if (needToRemoveSpanData) {
					needToRemoveSpanData = false;
				}

				colorTEXT = color.toRgbString();
				wpcf7_content_editor_properties.$content_button_border_color_preview.hide();
				wpcf7_content_editor_properties.$content_preview_button_border_color.css('border-color', colorTEXT);
				_updateColumnContentLive({
					type: 'button-border-color',
					name: 'border-color',
					value: colorTEXT
				});

				wpcf7_content_editor_properties.$button_preview.css({
					'border-color': colorTEXT
				});
			},
			change: function (color) {},
			hide: function (color) {
				columnContentData.wpcf7_button.border_color = color.toRgbString();
			},
			cancelText: '',
			chooseText: ''
		});

		var close = tmpl('tmpl-tool-close', {});
		var $close = $(close);
		wpcf7_content_editor_properties.$content_button_border_color_value.spectrum('container').append($close);

		$close.on('click', function (e) {
			e.preventDefault();
			wpcf7_content_editor_properties.$content_button_border_color_value.spectrum('hide');
		});

		wpcf7_content_editor_properties.$content_button_border_color_preview.on('click', function () {
			wpcf7_content_editor_properties.$content_button_border_color_value.spectrum('show');
			return false;
		});
	};

	var _linkButtonBorderColorHoverEditor = function () {
		var colorTEXT;
		wpcf7_content_editor_properties.$content_button_border_color_hover_value.spectrum({
			replacerClassName: 'btn-floating',
			preferredFormat: 'hex',
			showPalette: false,
			showAlpha: true,
			showInput: true,
			showButtons: false,
			containerClassName: 'rexbuilder-materialize-wrap block-background-color-picker',
			show: function () {},
			move: function (color) {
				if (needToRemoveSpanData) {
					needToRemoveSpanData = false;
				}

				colorTEXT = color.toRgbString();
				wpcf7_content_editor_properties.$content_button_border_color_hover_preview.hide();
				wpcf7_content_editor_properties.$content_preview_button_border_color_hover.css('border-color', colorTEXT);
				_updateColumnContentLive({
					type: 'button-border-color-hover',
					name: 'border-color',
					value: colorTEXT
				});

				wpcf7_content_editor_properties.$button_preview.hover(
					function () {
						$(this).css({
							'border-color': colorTEXT
						});
					},
					function () {
						$(this).css({
							'border-color': columnContentData.wpcf7_button.border_color
						});
					}
				);
			},
			change: function (color) {},
			hide: function (color) {
				columnContentData.wpcf7_button.border_color_hover = color.toRgbString();
			},
			cancelText: '',
			chooseText: ''
		});

		var close = tmpl('tmpl-tool-close', {});
		var $close = $(close);
		wpcf7_content_editor_properties.$content_button_border_color_hover_value.spectrum('container').append($close);

		$close.on('click', function (e) {
			e.preventDefault();
			wpcf7_content_editor_properties.$content_button_border_color_hover_value.spectrum('hide');
		});

		wpcf7_content_editor_properties.$content_button_border_color_hover_preview.on('click', function () {
			wpcf7_content_editor_properties.$content_button_border_color_hover_value.spectrum('show');
			return false;
		});
	};

	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	var _linkDocumentListeners = function () {
		wpcf7_content_editor_properties.$modal.click(function (e) {
			if ($(e.target).is('.rex-modal-wrap')) {
				needToSave = false;
			}
		});

		/**
		 * Closes the modal
		 */
		wpcf7_content_editor_properties.$close_button.on('click', function () {
			needToSave = false;
			_closeModal();
		});

		/**
		 * Reset Panel with data when was opened, updates button in page
		 */
		wpcf7_content_editor_properties.$reset_button.on('click', function () {
			needToSave = false;
			columnContentData = jQuery.extend(true, {}, resetData);
			var wasSetRequiredField = undefined !== wpcf7_content_editor_properties.$content_required_field.attr('checked');
			var wasSetEmail = undefined !== wpcf7_content_editor_properties.$content_set_email.attr('checked');
			var wasSetOnlyNumbers = undefined !== wpcf7_content_editor_properties.$content_only_numbers.attr('checked');

			_updatePanel();
			_applyData();

			/* Resetting the DOM */
			if (wasSetRequiredField) {
				_updateColumnContentLive({
					type: 'wpcf7-required',
					value: false
				});
			}

			if (wasSetEmail) {
				_updateColumnContentLive({
					type: 'wpcf7-email',
					value: false
				});
			}

			if (wasSetOnlyNumbers) {
				_updateColumnContentLive({
					type: 'wpcf7-only-numbers',
					value: false
				});
			}

			_updateColumnContentLive({
				type: 'button-text',
				name: 'button-text',
				value: columnContentData.wpcf7_button.text
			});

			_updateColumnContentLive({
				type: 'wpcf7-placeholder',
				value: columnContentData.wpcf7_placeholder
			});

			var $listFields = wpcf7_content_editor_properties.$field_list.find('.wpcf7-select-field');
			if (0 !== $listFields.length) {
				var listFieldsArray = [];

				for (var i = 0; i < $listFields.length; i++) {
					listFieldsArray.push($listFields[i].value);
				}

				_updateColumnContentLive({
					type: 'wpcf7-list',
					value: {
						fields: listFieldsArray,
						type: 'resetting'
					}
				});
			}
		});

		/**
		 * Applies changes
		 */
		wpcf7_content_editor_properties.$apply_changes_button.on('click', function () {
			needToSave = !_.isEqual(columnContentData, resetData);
			_closeModal();
		});

		wpcf7_content_editor_properties.$modal.on('rexlive:this_modal_closed', function () {
			/* 	This event is triggered also when clicking out of the modal. 
					In that case it's considered like a "don't want to save" action */
			Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage({ eventName: 'rexlive:clearFormOutlines' });

			var wasSetEmail = undefined !== wpcf7_content_editor_properties.$content_set_email.attr('checked');
			var wasSetOnlyNumbers = undefined !== wpcf7_content_editor_properties.$content_only_numbers.attr('checked');

			if (!needToSave) {
				columnContentData = jQuery.extend(true, {}, resetData);
				_updatePanel();
			}

			_updateColumnContentDataFromPanel();
			_applyData();

			var isSetRequiredField = columnContentData.wpcf7_required_field;
			var isSetEmail = columnContentData.wpcf7_email;
			var isSetOnlyNumbers = columnContentData.wpcf7_only_numbers;

			/* Resetting the DOM */
			_updateColumnContentLive({
				type: 'wpcf7-required',
				value: isSetRequiredField
			});

			if (isSetEmail) {
				_updateColumnContentLive({
					type: 'wpcf7-email',
					value: true
				});
			} else if (isSetOnlyNumbers) {
				_updateColumnContentLive({
					type: 'wpcf7-only-numbers',
					value: true
				});
			} else if (!isSetEmail && wasSetEmail) {
				_updateColumnContentLive({
					type: 'wpcf7-email',
					value: false
				});
			} else if (!isSetOnlyNumbers && wasSetOnlyNumbers) {
				_updateColumnContentLive({
					type: 'wpcf7-only-numbers',
					value: false
				});
			}

			_updateColumnContentLive({
				type: 'button-text',
				name: 'button-text',
				value: columnContentData.wpcf7_button.text
			});

			_updateColumnContentLive({
				type: 'wpcf7-placeholder',
				value: columnContentData.wpcf7_placeholder
			});
		});

		wpcf7_content_editor_properties.$content_required_field.on('click', function () {
			var isSetRequiredField = undefined !== wpcf7_content_editor_properties.$content_required_field.attr('checked');

			_updateColumnContentLive({
				type: 'wpcf7-required',
				value: isSetRequiredField
			});
		});

		wpcf7_content_editor_properties.$content_set_email.on('click', function () {
			var isSetEmail = undefined !== wpcf7_content_editor_properties.$content_set_email.attr('checked');

			if (isSetEmail) {
				wpcf7_content_editor_properties.$content_only_numbers.prop('checked', false);
			}

			_updateColumnContentLive({
				type: 'wpcf7-email',
				value: isSetEmail
			});
		});

		wpcf7_content_editor_properties.$content_only_numbers.on('click', function () {
			var isSetOnlyNumbers = undefined !== wpcf7_content_editor_properties.$content_only_numbers.attr('checked');

			if (isSetOnlyNumbers) {
				wpcf7_content_editor_properties.$content_set_email.prop('checked', false);
			}

			_updateColumnContentLive({
				type: 'wpcf7-only-numbers',
				value: isSetOnlyNumbers
			});
		});

		wpcf7_content_editor_properties.$content_input_default_check.on('click', function () {
			var isSetDefaultCheck =
				undefined !== wpcf7_content_editor_properties.$content_input_default_check.attr('checked');

			_updateColumnContentLive({
				type: 'wpcf7-default-check',
				value: isSetDefaultCheck
			});
		});

		wpcf7_content_editor_properties.$content_input_width_type.on('click', function () {
			var widthValue = wpcf7_content_editor_properties.$content_input_width.val();
			var widthType = $(this).val();

			switch (widthType) {
				case 'percentage':
					widthValue = widthValue + '%';
					break;
				case 'pixel':
					widthValue = widthValue + 'px';
					break;
			}

			_updateColumnContentLive({
				type: 'width',
				name: 'width',
				value: widthValue
			});
		});

		wpcf7_content_editor_properties.$content_input_height_type.on('click', function () {
			var heightValue = wpcf7_content_editor_properties.$content_input_height.val();
			var heightType = $(this).val();

			switch (heightType) {
				case 'percentage':
					heightValue = heightValue + '%';
					break;
				case 'pixel':
					heightValue = heightValue + 'px';
					break;
			}

			_updateColumnContentLive({
				type: 'height',
				name: 'height',
				value: heightValue
			});
		});

		// Text Color Palette
		wpcf7_content_editor_properties.$content_text_color_palette_buttons.on('click', function (event) {
			var color = $(event.currentTarget).find('.bg-palette-value').val();

			$(event.currentTarget).addClass('palette-color-active');
			wpcf7_content_editor_properties.$content_preview_text.hide();
			wpcf7_content_editor_properties.$content_text_color_palette_buttons
				.not(event.currentTarget)
				.removeClass('palette-color-active');
			wpcf7_content_editor_properties.$content_text_color_value.spectrum('set', color);
			wpcf7_content_editor_properties.$content_text_color_runtime.val(color);

			columnContentData.text_color = color;

			_updateColumnContentLive({
				type: 'text-color',
				name: 'text-color',
				value: color
			});
		});

		// Text Color Focus Palette
		wpcf7_content_editor_properties.$content_text_color_focus_palette_buttons.on('click', function (event) {
			var color = $(event.currentTarget).find('.bg-palette-value').val();

			$(event.currentTarget).addClass('palette-color-active');
			wpcf7_content_editor_properties.$content_preview_text_focus.hide();
			wpcf7_content_editor_properties.$content_text_color_focus_palette_buttons
				.not(event.currentTarget)
				.removeClass('palette-color-active');
			wpcf7_content_editor_properties.$content_text_color_focus_value.spectrum('set', color);
			wpcf7_content_editor_properties.$content_text_color_focus_runtime.val(color);

			columnContentData.text_color_focus = color;

			_updateColumnContentLive({
				type: 'text-focus',
				name: 'text-color',
				value: color
			});
		});

		// Select Color Palette
		wpcf7_content_editor_properties.$content_select_color_palette_buttons.on('click', function (event) {
			var color = $(event.currentTarget).find('.bg-palette-value').val();

			$(event.currentTarget).addClass('palette-color-active');
			wpcf7_content_editor_properties.$content_preview_select.hide();
			wpcf7_content_editor_properties.$content_select_color_palette_buttons
				.not(event.currentTarget)
				.removeClass('palette-color-active');
			wpcf7_content_editor_properties.$content_select_color_value.spectrum('set', color);
			wpcf7_content_editor_properties.$content_select_color_runtime.val(color);

			columnContentData.text_color = color;

			_updateColumnContentLive({
				type: 'text-color',
				name: 'text-color',
				value: color
			});
		});

		// Select Color Ater Selection Palette
		wpcf7_content_editor_properties.$content_select_color_after_selection_palette_buttons.on('click', function (event) {
			var color = $(event.currentTarget).find('.bg-palette-value').val();

			$(event.currentTarget).addClass('palette-color-active');
			wpcf7_content_editor_properties.$content_preview_select_after_selection.hide();
			wpcf7_content_editor_properties.$content_select_color_after_selection_palette_buttons
				.not(event.currentTarget)
				.removeClass('palette-color-active');
			wpcf7_content_editor_properties.$content_select_color_after_selection_value.spectrum('set', color);
			wpcf7_content_editor_properties.$content_select_color_after_selection_runtime.val(color);

			columnContentData.text_color = color;

			_updateColumnContentLive({
				type: 'select-color',
				name: 'text-color',
				value: color
			});
		});

		// Placeholder Color Palette
		wpcf7_content_editor_properties.$content_placeholder_color_palette_buttons.on('click', function (event) {
			var color = $(event.currentTarget).find('.bg-palette-value').val();

			$(event.currentTarget).addClass('palette-color-active');
			wpcf7_content_editor_properties.$content_preview_placeholder.hide();
			wpcf7_content_editor_properties.$content_placeholder_color_palette_buttons
				.not(event.currentTarget)
				.removeClass('palette-color-active');
			wpcf7_content_editor_properties.$content_placeholder_color_value.spectrum('set', color);
			wpcf7_content_editor_properties.$content_placeholder_color_runtime.val(color);

			columnContentData.placeholder_color = color;

			_updateColumnContentLive({
				type: 'placeholder-color',
				name: 'text-color',
				value: color
			});
		});

		// Placeholder Color Hover Palette
		wpcf7_content_editor_properties.$content_placeholder_hover_color_palette_buttons.on('click', function (event) {
			var color = $(event.currentTarget).find('.bg-palette-value').val();

			$(event.currentTarget).addClass('palette-color-active');
			wpcf7_content_editor_properties.$content_preview_placeholder_hover.hide();
			wpcf7_content_editor_properties.$content_placeholder_hover_color_palette_buttons
				.not(event.currentTarget)
				.removeClass('palette-color-active');
			wpcf7_content_editor_properties.$content_placeholder_hover_color_value.spectrum('set', color);
			wpcf7_content_editor_properties.$content_placeholder_hover_color_runtime.val(color);

			columnContentData.placeholder_hover_color = color;

			_updateColumnContentLive({
				type: 'placeholder-color-hover',
				name: 'text-color',
				value: color
			});
		});

		// Button Hover Text Color Palette
		wpcf7_content_editor_properties.$content_button_hover_text_color_palette_buttons.on('click', function (event) {
			var color = $(event.currentTarget).find('.bg-palette-value').val();

			$(event.currentTarget).addClass('palette-color-active');
			wpcf7_content_editor_properties.$content_preview_button_text_color_hover.hide();
			wpcf7_content_editor_properties.$content_button_hover_text_color_palette_buttons
				.not(event.currentTarget)
				.removeClass('palette-color-active');
			wpcf7_content_editor_properties.$content_button_text_color_hover_value.spectrum('set', color);
			wpcf7_content_editor_properties.$content_button_text_color_hover_runtime.val(color);

			columnContentData.wpcf7_button.text_color_hover = color;

			_updateColumnContentLive({
				type: 'button-text-color-hover',
				name: 'text-color',
				value: color
			});

			wpcf7_content_editor_properties.$button_preview.hover(
				function () {
					$(this).css({
						color: color
					});
				},
				function () {
					$(this).css({
						color: columnContentData.wpcf7_button.text_color
					});
				}
			);
		});

		// Button Hover Background Color Palette
		wpcf7_content_editor_properties.$content_button_hover_background_color_palette_buttons.on('click', function (
			event
		) {
			var color = $(event.currentTarget).find('.bg-palette-value').val();

			$(event.currentTarget).addClass('palette-color-active');
			wpcf7_content_editor_properties.$content_preview_button_background_color_hover.hide();
			wpcf7_content_editor_properties.$content_button_hover_background_color_palette_buttons
				.not(event.currentTarget)
				.removeClass('palette-color-active');
			wpcf7_content_editor_properties.$content_button_background_color_hover_value.spectrum('set', color);
			wpcf7_content_editor_properties.$content_button_background_color_hover_runtime.val(color);

			columnContentData.wpcf7_button.background_color_hover = color;

			_updateColumnContentLive({
				type: 'button-background-color-hover',
				name: 'background-color',
				value: color
			});

			wpcf7_content_editor_properties.$button_preview.hover(
				function () {
					$(this).css({
						'background-color': color
					});
				},
				function () {
					$(this).css({
						'background-color': columnContentData.wpcf7_button.background_color
					});
				}
			);
		});

		// Button Hover Border Color Palette
		wpcf7_content_editor_properties.$content_button_hover_border_color_palette_buttons.on('click', function (event) {
			var color = $(event.currentTarget).find('.bg-palette-value').val();

			$(event.currentTarget).addClass('palette-color-active');
			wpcf7_content_editor_properties.$content_preview_button_border_color_hover.hide();
			wpcf7_content_editor_properties.$content_button_hover_border_color_palette_buttons
				.not(event.currentTarget)
				.removeClass('palette-color-active');
			wpcf7_content_editor_properties.$content_button_border_color_hover_value.spectrum('set', color);
			wpcf7_content_editor_properties.$content_button_border_color_hover_runtime.val(color);

			columnContentData.wpcf7_button.border_color_hover = color;

			_updateColumnContentLive({
				type: 'button-border-color-hover',
				name: 'border-color',
				value: color
			});

			wpcf7_content_editor_properties.$button_preview.hover(
				function () {
					$(this).css({
						'border-color': color
					});
				},
				function () {
					$(this).css({
						'border-color': columnContentData.wpcf7_button.border_color
					});
				}
			);
		});

		wpcf7_content_editor_properties.$add_list_field.on('click', function () {
			var newRowNumber = parseInt(wpcf7_content_editor_properties.$field_list.find('.wpcf7-select-field').length) + 1;
			tmpl.arg = 'o';
			wpcf7_content_editor_properties.$field_list.append(
				tmpl('tmpl-rex-wpcf7-edit-content-list', {
					number: newRowNumber
				})
			);

			_updateColumnContentLive({
				type: 'wpcf7-list-add'
			});
			_linkListListeners();
			_updateDeleteFieldListener();
		});
	};

	var _updateDeleteFieldListener = function () {
		wpcf7_content_editor_properties.$delete_list_field = wpcf7_content_editor_properties.$self.find(
			'.rex-wpcf7-delete-list-field'
		);
		wpcf7_content_editor_properties.$delete_list_field.off('click'); // Removing the listeners to the delete buttons
		wpcf7_content_editor_properties.$delete_list_field.on('click', _handleClickDeleteRow); // Adding the listeners to the delete buttons
	};

	var _handleClickDeleteRow = function (event) {
		var $target = $(event.target).parents('.rexwpcf7-cont_row');
		var rowNumber = /[0-9]+/.exec(/field-[0-9]+/.exec($target.find("[type='text']")[0].classList))[0];
		$target.remove();

		var $listFields = wpcf7_content_editor_properties.$field_list.find('.wpcf7-select-field');

		for (var i = 0; i < $listFields.length; i++) {
			var classToRemove = /field\-[0-9]+/.exec($listFields[i].classList)[0];
			$($listFields[i]).removeClass(classToRemove);
			$($listFields[i]).addClass('field-' + (i + 1));
		}

		_updateColumnContentLive({
			type: 'wpcf7-list-remove',
			value: rowNumber
		});
	};

	var _linkTextEditorListeners = function () {
		tinyMCE_editor.on('keyup', _handleTextEditorEvents);
		tinyMCE_editor.on('change', _handleTextEditorEvents);
		tinyMCE_editor.on('undo', _handleTextEditorEvents);
		tinyMCE_editor.on('redo', _handleTextEditorEvents);
		tinyMCE_editor.on('cut', _handleTextEditorEvents);
		tinyMCE_editor.on('paste', _handleTextEditorEvents);
	};

	var _handleTextEditorEvents = function () {
		_updateColumnContentLive({
			type: 'wpcf7-text-editor',
			value: tinyMCE_editor.getContent()
		});
	};

	var _init = function () {
		var $self = $('#rex-wpcf7-content-editor');
		var $accordions = $self.find('.rex-accordion');
		var $outerAccordion = $self.find('.rexpansive-accordion-outer');
		var $container = $self;

		$outerAccordion.rexAccordion({
			open: {},
			close: {},
			selectors: {
				self: '.rexpansive-accordion-outer',
				toggle: '.rex-accordion-outer--toggle',
				content: '.rex-accordion-outer--content'
			}
		});

		wpcf7_content_editor_properties = {
			$self: $self,
			$modal: $container.parent('.rex-modal-wrap'),
			$close_button: $container.find('.rex-cancel-button'),
			$apply_changes_button: $container.find('.rex-apply-button'),
			$reset_button: $container.find('.rex-reset-button'),

			$button_preview: $container.find('#rex-wpcf7-button-modal-preview'),

			$content_required_field: $container.find('#wpcf7-required-field'),
			$content_only_numbers: $container.find('#wpcf7-only-numbers'),
			$content_set_email: $container.find('#wpcf7-set-email'),
			$content_placeholder: $container.find('#wpcf7-placeholder'),
			$content_input_default_check: $container.find('#wpcf7-default-check'),
			$content_input_text_editor: $container.find('#wpcf7-text-editor'),
			$content_file_max_dimensions: $container.find('#wpcf7-file-max-dimensions'),
			$content_file_max_dimensions_unit: $container.find('#wpcf7-file-max-dimensions-unit'),
			$field_list: $container.find('#wpcf7-list-fields'),
			$add_list_field: $container.find('#rex-wpcf7-add-list-field'),
			$delete_list_field: '',

			$content_input_width: $container.find('#wpcf7-input-width'),
			$content_input_width_type: $container.find('.wpcf7-input-width-type'),
			$content_input_height: $container.find('#wpcf7-input-height'),
			$content_input_height_type: $container.find('.wpcf7-input-height-type'),
			$content_input_font_size: $container.find('#wpcf7-set-font-size'),

			$content_preview_text: $container.find('#rex-wpcf7-preview-text'),
			$content_text_color_value: $container.find('#rex-wpcf7-text-color'),
			$content_text_color_runtime: $container.find('#rex-wpcf7-text-color-runtime'),
			$content_text_color_preview: $container.find('#rex-wpcf7-text-color-preview-icon'),

			$content_text_color_palette_buttons: $self.find('#content-text-color-palette .bg-palette-selector'),

			$content_preview_text_focus: $container.find('#rex-wpcf7-preview-focus'),
			$content_text_color_focus_value: $container.find('#rex-wpcf7-focus-color'),
			$content_text_color_focus_runtime: $container.find('#rex-wpcf7-focus-color-runtime'),
			$content_text_color_focus_preview: $container.find('#rex-wpcf7-focus-color-preview-icon'),

			$content_text_color_focus_palette_buttons: $self.find('#focus-text-color-palette .bg-palette-selector'),

			$content_preview_select: $container.find('#rex-wpcf7-preview-select-text'),
			$content_select_color_value: $container.find('#rex-wpcf7-select-text-color'),
			$content_select_color_runtime: $container.find('#rex-wpcf7-select-text-color-runtime'),
			$content_select_color_preview: $container.find('#rex-wpcf7-select-text-color-preview-icon'),

			$content_select_color_palette_buttons: $self.find('#select-color-palette .bg-palette-selector'),

			$content_preview_select_after_selection: $container.find('#rex-wpcf7-preview-select-text-after-selection'),
			$content_select_color_after_selection_value: $container.find('#rex-wpcf7-select-text-color-after-selection'),
			$content_select_color_after_selection_runtime: $container.find(
				'#rex-wpcf7-select-text-color-after-selection-runtime'
			),
			$content_select_color_after_selection_preview: $container.find(
				'#rex-wpcf7-select-text-color-after-selection-preview-icon'
			),

			$content_select_color_after_selection_palette_buttons: $self.find(
				'#select-color-after-selection-palette .bg-palette-selector'
			),

			$content_preview_placeholder: $container.find('#rex-wpcf7-preview-placeholder'),
			$content_placeholder_color_value: $container.find('#rex-wpcf7-placeholder-color'),
			$content_placeholder_color_runtime: $container.find('#rex-wpcf7-placeholder-color-runtime'),
			$content_placeholder_color_preview: $container.find('#rex-wpcf7-placeholder-color-preview-icon'),

			$content_placeholder_color_palette_buttons: $self.find('#placeholder-color-palette .bg-palette-selector'),

			$content_preview_placeholder_hover: $container.find('#rex-wpcf7-preview-placeholder-hover'),
			$content_placeholder_hover_color_value: $container.find('#rex-wpcf7-placeholder-hover-color'),
			$content_placeholder_hover_color_runtime: $container.find('#rex-wpcf7-placeholder-hover-color-runtime'),
			$content_placeholder_hover_color_preview: $container.find('#rex-wpcf7-placeholder-hover-color-preview-icon'),

			$content_placeholder_hover_color_palette_buttons: $self.find(
				'#hover-placeholder-color-palette .bg-palette-selector'
			),

			$content_button_text: $container.find('#rex-wpcf7-button-text'),
			$content_button_text_font_size: $container.find('#wpcf7-button-text-font-size'),

			$content_button_height: $container.find('#wpcf7-button-height'),
			$content_button_width: $container.find('#wpcf7-button-width'),

			$content_button_border_width: $container.find('#wpcf7-button-border-width'),
			$content_button_border_radius: $container.find('#wpcf7-button-border-radius'),

			$content_button_margin_top: $container.find('#wpcf7-button-margin-top'),
			$content_button_margin_right: $container.find('#wpcf7-button-margin-right'),
			$content_button_margin_bottom: $container.find('#wpcf7-button-margin-bottom'),
			$content_button_margin_left: $container.find('#wpcf7-button-margin-left'),

			$content_button_padding_top: $container.find('#wpcf7-button-padding-top'),
			$content_button_padding_right: $container.find('#wpcf7-button-padding-right'),
			$content_button_padding_bottom: $container.find('#wpcf7-button-padding-bottom'),
			$content_button_padding_left: $container.find('#wpcf7-button-padding-left'),

			$content_button_text_color_value: $container.find('#rex-wpcf7-button-text-color'),
			$content_button_text_color_preview: $container.find('#rex-wpcf7-button-text-color-preview-icon'),

			$content_preview_button_text_color_hover: $container.find('#rex-wpcf7-preview-button-text-color-hover'),
			$content_button_text_color_hover_value: $container.find('#rex-wpcf7-button-text-color-hover'),
			$content_button_text_color_hover_runtime: $container.find('#rex-wpcf7-button-text-color-hover-runtime'),
			$content_button_text_color_hover_preview: $container.find('#rex-wpcf7-button-text-color-hover-preview-icon'),

			$content_button_hover_text_color_palette_buttons: $self.find(
				'#button-hover-text-color-palette .bg-palette-selector'
			),

			$content_preview_button_background_color: $container.find('#rex-wpcf7-preview-button-background-color'),
			$content_button_background_color_value: $container.find('#rex-wpcf7-button-background-color'),
			$content_button_background_color_preview: $container.find('#rex-wpcf7-button-background-color-preview-icon'),

			$content_preview_button_background_color_hover: $container.find(
				'#rex-wpcf7-preview-button-background-color-hover'
			),
			$content_button_background_color_hover_value: $container.find('#rex-wpcf7-button-background-color-hover'),
			$content_button_background_color_hover_runtime: $container.find(
				'#rex-wpcf7-button-background-color-hover-runtime'
			),
			$content_button_background_color_hover_preview: $container.find(
				'#rex-wpcf7-button-background-color-hover-preview-icon'
			),

			$content_button_hover_background_color_palette_buttons: $self.find(
				'#button-hover-background-color-palette .bg-palette-selector'
			),

			$content_preview_button_border_color: $container.find('#rex-wpcf7-preview-button-border-color'),
			$content_button_border_color_value: $container.find('#rex-wpcf7-button-border-color'),
			$content_button_border_color_preview: $container.find('#rex-wpcf7-button-border-color-preview-icon'),

			$content_preview_button_border_color_hover: $container.find('#rex-wpcf7-preview-button-border-color-hover'),
			$content_button_border_color_hover_value: $container.find('#rex-wpcf7-button-border-color-hover'),
			$content_button_border_color_hover_runtime: $container.find('#rex-wpcf7-button-border-color-hover-runtime'),
			$content_button_border_color_hover_preview: $container.find('#rex-wpcf7-button-border-color-hover-preview-icon'),

			$content_button_hover_border_color_palette_buttons: $self.find(
				'#button-hover-border-color-palette .bg-palette-selector'
			)
		};

		wpcf7_content_editor_properties.$field_list.sortable({
			revert: true,
			handle: '.rexwpcf7-sort',
			cursor: 'pointer',
			update: function () {
				var $listFields = wpcf7_content_editor_properties.$field_list.find('.wpcf7-select-field');

				for (var i = 0; i < $listFields.length; i++) {
					var classToRemove = /field\-[0-9]+/.exec($listFields[i].classList)[0];
					$($listFields[i]).removeClass(classToRemove);
					$($listFields[i]).addClass('field-' + (i + 1));
				}

				var listFieldsArray = [];

				for (var i = 0; i < $listFields.length; i++) {
					listFieldsArray.push($listFields[i].value);
				}

				_updateColumnContentLive({
					type: 'wpcf7-list',
					value: {
						fields: listFieldsArray,
						type: 'sorting'
					}
				});
			}
		});

		columnContentData = {
			wpcf7_required_field: '',
			wpcf7_email: '',
			wpcf7_only_numbers: '',
			wpcf7_default_check: '',
			wpcf7_placeholder: '',
			wpcf7_list_fields: [],
			wpcf7_file_max_dimensions: '',
			wpcf7_button: {
				text: '',
				font_size: '',
				height: '',
				width: '',
				border_width: '',
				border_radius: '',
				margin_top: '',
				margin_right: '',
				margin_bottom: '',
				margin_left: '',
				padding_top: '',
				padding_right: '',
				padding_bottom: '',
				padding_left: '',
				text_color: '',
				text_color_hover: '',
				background_color: '',
				background_color_hover: '',
				border_color: '',
				border_color_hover: ''
			},
			input_width: '',
			input_height: '',
			font_size: '',
			border_width: '',
			border_radius: '',
			background_color: '',
			background_color_hover: '',
			border_color: '',
			border_color_hover: '',
			placeholder_color: '',
			placeholder_hover_color: '',
			select_color_after_selection: '',
			text_color: '',
			text_color_hover: '',
			text_color_focus: '',
			text: '',
			type: '',
			field_class: '',
			input_type: '',
			target: {
				element_id: '',
				row_number: '',
				column_number: ''
			}
		};

		defaultColumnContentValues = {
			input_width: '100%',
			input_height: '100%',
			font_size: '15px'
		};

		$accordions.rexAccordion({ open: {}, close: {} });
		_linkDocumentListeners();
		_linkTextInputs();
		_linkNumberInputs();
		_linkTextColorEditor();
		_linkTextFocusColorEditor();
		_linkSelectTextColorEditor();
		_linkSelectTextColorAfterSelectionEditor();
		_linkPlaceholderColorEditor();
		_linkPlaceholderHoverColorEditor();
		_linkButtonTextColorEditor();
		_linkButtonTextColorHoverEditor();
		_linkButtonBackgroundColorEditor();
		_linkButtonBackgroundColorHoverEditor();
		_linkButtonBorderColorEditor();
		_linkButtonBorderColorHoverEditor();
	};

	return {
		init: _init,

		// Modal functions
		openColumnContentEditorModal: _openColumnContentEditorModal
	};
})(jQuery);
