/**
 * Add content to wpcf7 forms
 * @since x.x.x
 */
var Wpcf7_Add_Content_Modal = (function ($) {
	var wpcf7_content_adder_properties;
	var insertionPoint = {};

	////////////////////////////////////////////////////////////////////////////////////////////////////
	/// MODAL FUNCTIONS
	////////////////////////////////////////////////////////////////////////////////////////////////////

	var _openContentAdder = function (data) {
		insertionPoint = data.insertionPoint;

		Rexlive_Modals_Utils.openModal(
			wpcf7_content_adder_properties.$self.parent('.rex-modal-wrap'), // $target
			false, // target_only
			['wpcf7-adding-content'] // additional_class
		);
	};

	function _closeModal() {
		Rexlive_Modals_Utils.closeModal(
			wpcf7_content_adder_properties.$self.parent('.rex-modal-wrap'), // $target
			false, // target_only
			['wpcf7-adding-content'] // additional_class
		);
	}

	// ADDING FIELDS FUNCTIONS

	var _addField = function (fieldType) {
		var elementDataToIframe = {
			eventName: 'rexlive:wpcf7_add_field',
			data_to_send: {
				insertionPoint: insertionPoint,
				fieldType: fieldType
			}
		};
		Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(elementDataToIframe);

		_closeModal();
	};

	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////

	var _linkDocumentListeners = function () {
		wpcf7_content_adder_properties.$close_button.on('click', function () {
			_closeModal();
		});

		/**
		 * Adds a text field
		 */
		wpcf7_content_adder_properties.$wpcf7_add_text_field.on('click', function () {
			_addField('text');
		});

		/**
		 * Adds a textarea field
		 */
		wpcf7_content_adder_properties.$wpcf7_add_textarea_field.on('click', function () {
			_addField('textarea');
		});

		/**
		 * Adds a menu field
		 */
		wpcf7_content_adder_properties.$wpcf7_add_menu_field.on('click', function () {
			_addField('menu');
		});

		/**
		 * Adds a radio buttons field
		 */
		wpcf7_content_adder_properties.$wpcf7_add_radio_buttons_field.on('click', function () {
			_addField('radiobuttons');
		});

		/**
		 * Adds a checkbox field
		 */
		wpcf7_content_adder_properties.$wpcf7_add_checkbox_field.on('click', function () {
			_addField('acceptance');
		});

		/**
		 * Adds an acceptance field
		 */
		wpcf7_content_adder_properties.$wpcf7_add_file_field.on('click', function () {
			_addField('file');
		});

		/**
		 * Adds a submit button
		 */
		wpcf7_content_adder_properties.$wpcf7_add_submit_button.on('click', function () {
			_addField('submit');
		});

		wpcf7_content_adder_properties.$modal.on('rexlive:this_modal_closed', function (event) {
			Rexbuilder_Util_Admin_Editor.searchFocusedElement();
		});
	};

	var _init = function () {
		var $self = $('#rex-wpcf7-content-adder');
		var $container = $self;

		wpcf7_content_adder_properties = {
			$self: $self,
			$modal: $container.parent('.rex-modal-wrap'),
			$close_button: $container.find('.rex-cancel-button'),

			$wpcf7_add_text_field: $container.find('#rex-add-text-field'),
			$wpcf7_add_textarea_field: $container.find('#rex-add-textarea-field'),
			$wpcf7_add_menu_field: $container.find('#rex-add-menu-field'),
			$wpcf7_add_checkbox_field: $container.find('#rex-add-checkbox-field'),
			$wpcf7_add_file_field: $container.find('#rex-add-file-field'),
			$wpcf7_add_radio_buttons_field: $container.find('#rex-add-radiobuttons-field'),
			$wpcf7_add_submit_button: $container.find('#rex-add-submit-button')
		};

		_linkDocumentListeners();
	};

	return {
		init: _init,

		// Modal functions
		openContentAdder: _openContentAdder
	};
})(jQuery);
