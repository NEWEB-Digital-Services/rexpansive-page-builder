/**
 * Modal for selecting if we want to edit an existing element
 * or if we want to create a new element from the existing one
 * @since 2.0.2
 */
var Element_Choose_Modal = (function ($) {
	var rex_element_choose_panel;
	var elementData;
	var reverseData;
	var resetData;
	var alreadyChooseToSynchronize;
	var oldElementID;
	var newID;
	var clearFormOutlines;

	function selectModalToOpen(receivedData) {
		alreadyChooseToSynchronize = false;
		clearFormOutlines = true;

		_refreshElementData(receivedData.elementData);

		if (alreadyChooseToSynchronize) {
			// Make an if if there are more kind of elements
			Wpcf7_Edit_Form_Modal.openFormEditorModal({
				elementData: elementData
			});
		} else {
			_openChooseModal();
		}
	}

	function _refreshElementData(newElementData) {
		_clearElementData();
		_updateElementData(newElementData);
	}

	function _clearElementData() {
		elementData = {
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
	}

	function _updateElementData(newElementData) {
		elementData = jQuery.extend(true, {}, newElementData);
		if (typeof elementData.synchronize != 'undefined') {
			alreadyChooseToSynchronize = elementData.synchronize.toString() == 'true';
		}
		reverseData = jQuery.extend(true, {}, elementData);
		resetData = jQuery.extend(true, {}, elementData);
	}

	// ELEMENT SEPARATION FUNCTIONS

	function _cloneElement() {
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: live_editor_obj.ajaxurl,
			data: {
				action: 'rex_separate_element',
				nonce_param: live_editor_obj.rexnonce,
				old_id: oldElementID
			},
			beforeSend: function () {},
			success: function (response) {
				newID = response.data.new_id;
				_endElementSeparation(newID);
			}
		});
	}

	/**
	 * Ends separtion of rexelement: tells iframe to change id of element
	 * @param {string} rexID new id of rexelement
	 */
	function _endElementSeparation(rexID) {
		_separateElement(rexID);

		// The element will be the first with the new ID
		_updateTarget({
			id: rexID,
			number: 1
		});

		_refreshElement(rexID);
		Wpcf7_Edit_Form_Modal.openFormEditorModal({
			elementData: elementData
		});
	}

	function _separateElement(rexID) {
		var elementDataToIframe = {
			eventName: 'rexlive:separate_rex_element',
			data_to_send: {
				newID: rexID,
				elementData: elementData
			}
		};
		Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(elementDataToIframe);
	}

	/**
	 * Updates the element target to update
	 * @param {Object} data data of target to update{id, number}
	 */
	function _updateTarget(data) {
		elementData.element_target.element_id = data.id;
		elementData.element_target.element_number = data.number;
	}

	function _refreshElement(rexID) {
		var elementDataToIframe = {
			eventName: 'rexlive:refresh_separated_rex_element',
			data_to_send: {
				elementID: rexID,
				oldElementID: oldElementID,
				elementData: elementData
			}
		};
		Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(elementDataToIframe);
	}

	function _staySynchronized() {
		var elementDataToIframe = {
			eventName: 'rexlive:lock_synchronize_on_element',
			data_to_send: {
				element_target: elementData.element_target
			}
		};
		Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(elementDataToIframe);
	}

	function _removeSeparateElement() {
		var elementDataToIframe = {
			eventName: 'rexlive:remove_separate_element',
			data_to_send: {
				element_target: elementData.element_target
			}
		};
		Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(elementDataToIframe);
	}

	// MODAL FUNCTIONS

	function _openChooseModal() {
		Rexlive_Modals_Utils.openModal(
			rex_element_choose_panel.$self.parent('.rex-modal-wrap'), // $target
			false, // target_only
			['wpcf7-choose-element'] // additional_class
		);
	}

	function _closeChooseModal() {
		Rexlive_Modals_Utils.closeModal(
			rex_element_choose_panel.$self.parent('.rex-modal-wrap'), // $target
			false, // target_only
			['wpcf7-choose-element'] // additional_class
		);
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////

	function _sendPageEditedMessage() {
		var data = {
			eventName: 'rexlive:edited',
			modelEdited: false
		};
		Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
	}

	function _linkDocumentListeners() {
		rex_element_choose_panel.$button.on('click', function (e) {
			clearFormOutlines = false;

			var optionSelected = this.getAttribute('data-rex-option');
			_closeChooseModal();
			_sendPageEditedMessage();
			switch (optionSelected) {
				case 'remove': // Need to create a new element based on the current element
					oldElementID = elementData.element_target.element_id;

					// Saving the new element in the DB
					_cloneElement();
					break;
				case 'edit': // Editing an existing element
					Wpcf7_Edit_Form_Modal.openFormEditorModal({
						elementData: elementData
					});

					_staySynchronized();
					break;
				default:
					break;
			}
		});

		rex_element_choose_panel.$close_button.on('click', function () {
			_closeChooseModal();
		});

		rex_element_choose_panel.$modal.on('rexlive:this_modal_closed', function (event) {
			if (clearFormOutlines) {
				Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage({ eventName: 'rexlive:clearFormOutlines' });
			}
			Rexbuilder_Util_Admin_Editor.searchFocusedElement();
		});
	}

	function init() {
		var $self = $('#rex-element-choose');
		var $container = $self;

		rex_element_choose_panel = {
			$self: $self,
			$modal: $container.parent('.rex-modal-wrap'),
			$button: $container.find('.rex-button'),
			$close_button: $container.find('.rex-modal__close-button')
		};

		_linkDocumentListeners();
	}

	return {
		init: init,
		selectModalToOpen: selectModalToOpen
	};
})(jQuery);
