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
		insertionPoint = data;
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
    
    var _addField = function (fieldType) {
    	var elementDataToIframe = {
    		eventName: "rexlive:wpcf7_add_field",
    		data_to_send: {
    			insertionPoint: insertionPoint,
    			fieldType: fieldType
    		}
    	};
    	Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(elementDataToIframe);

    	_closeModal();
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
        wpcf7_content_adder_properties.$wpcf7_add_text_field.on("click", function () {
            _addField("text");
        });

        /**
         * Adds a menu field
         */
        wpcf7_content_adder_properties.$wpcf7_add_menu_field.on("click", function () {
            _addField("menu");
        });

        /**
         * Adds a checkboxes field
         */
        wpcf7_content_adder_properties.$wpcf7_add_checkboxes_field.on("click", function () {
            _addField("checkboxes");
        });

        /**
         * Adds a radio buttons field
         */
        wpcf7_content_adder_properties.$wpcf7_add_radio_buttons_field.on("click", function () {
            _addField("radiobuttons");
        });

        /**
         * Adds a file field
         */
        wpcf7_content_adder_properties.$wpcf7_add_file_field.on("click", function () {
            _addField("file");
        });

        /**
         * Adds a submit button
         */
        wpcf7_content_adder_properties.$wpcf7_add_submit_button.on("click", function () {
            _addField("submit");
        });
    }

	var _init = function() {
		var $self = $("#rex-wpcf7-content-adder");
		var $container = $self;

		wpcf7_content_adder_properties = {
			$self: $self,
			$modal: $container.parent(".rex-modal-wrap"),
            $close_button: $container.find(".rex-cancel-button"),
            $wpcf7_add_text_field: $container.find(".rex-add-text-field"),
            $wpcf7_add_email_field: "",
            $wpcf7_add_url_field: "",
            $wpcf7_add_tel_field: "",
            $wpcf7_add_number_field: "",
            $wpcf7_add_date_field: "",
            $wpcf7_add_text_area_field: "",
            $wpcf7_add_menu_field: $container.find(".rex-add-menu-field"),
            $wpcf7_add_checkboxes_field: $container.find(".rex-add-checkboxes-field"),
            $wpcf7_add_radio_buttons_field: $container.find(".rex-add-radiobuttons-field"),
            $wpcf7_add_acceptance_field: "",
            $wpcf7_add_quiz_field: "",
            $wpcf7_add_file_field: $container.find(".rex-add-file-field"),
            $wpcf7_add_submit_button: $container.find(".rex-add-submit-button"),
            /*text (text)
            email (text)
            URL (text)
            tel (text)
            number (text)
            number (slider) (può essere sempre messo come text, all'inizio)
            date (text)
            text area (text)
            drop-down menu (menu)
            checkboxes (checkbox)
            radio buttons (radio)
            acceptance (checkbox?)
            quiz (text)
            file (file)
            submit (submit)*/
		}

		_linkDocumentListeners();
	}

	return {
		init: _init,

		// Modal functions
		openContentAdder: _openContentAdder,
	}
})(jQuery);	