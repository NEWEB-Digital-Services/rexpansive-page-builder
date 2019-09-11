/**
 * Add content to wpcf7 forms
 * @since x.x.x
 */
var Wpcf7_Add_Content_Modal = (function ($) {
	var wpcf7_content_adder_properties;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    /// MODAL FUNCTIONS
    ////////////////////////////////////////////////////////////////////////////////////////////////////

	var _openContentAdder = function (data) {
		console.log(data);
		Rexlive_Modals_Utils.openModal(
            wpcf7_content_adder_properties.$self.parent(".rex-modal-wrap"),
        );
	}

	var _closeModal = function () {
        Rexlive_Modals_Utils.closeModal(
        	wpcf7_content_adder_properties.$self.parent(".rex-modal-wrap")
        );
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////////
    /// ADDING FIELDS FUNCTIONS
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var _addTextField = function () {
    	console.log("add text field");
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////

	var _linkDocumentListeners = function () {
    	/**
         * Closes the modal
         */
        wpcf7_content_adder_properties.$close_button.on("click", function () {
            _closeModal();
        });

        /**
         * Adds a text field
         */
        wpcf7_content_adder_properties.$wpcf7_text_field.on("click", function () {
            _addTextField();
        });
    }

	var _init = function() {
		var $self = $("#rex-wpcf7-content-adder"); // template da creare
		var $container = $self;

		wpcf7_content_adder_properties = {
			$self: $self,
			$modal: $container.parent(".rex-modal-wrap"),
            $close_button: $container.find(".rex-cancel-button"),
            $wpcf7_text_field: $container.find(".rex-add-text-field"),
            $wpcf7_email_field: "",
            $wpcf7_url_field: "",
            $wpcf7_tel_field: "",
            $wpcf7_number_field: "",
            $wpcf7_date_field: "",
            $wpcf7_text_area_field: "",
            $wpcf7_drop_down_menu_field: "",
            $wpcf7_checkboxes_field: "", // Quante?
            $wpcf7_radio_buttons_field: "", // Quanti?
            $wpcf7_acceptance_field: "",
            $wpcf7_quiz_field: "",
            $wpcf7_file_field: "",
            $wpcf7_submit_button: "",
            /*text
            email
            URL
            tel
            number
            date
            text area
            drop-down menu
            checkboxes
            radio buttons
            acceptance
            quiz
            file
            submit*/
		}

		_linkDocumentListeners();
	}

	return {
		init: _init,

		// Modal functions
		openContentAdder: _openContentAdder,
	}
})(jQuery);	