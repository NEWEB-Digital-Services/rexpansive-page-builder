/**
 * Modal for selecting if we want to edit an existing element
 * or if we want to create a new element from the existing one
 * @since x.x.x
 */
var Element_Choose_Modal = (function ($) {
    var rex_element_choose_panel;
    var elementData;
    var reverseData;
    var resetData;
    var alreadyChooseToSynchronize;
    var oldElementID;
    var newID;
    var blockID;
    
    var _selectModalToOpen = function (data) {
        alreadyChooseToSynchronize = false;
        blockID = data.blockID;

        _refreshElementData(data.elementData);

        if ( alreadyChooseToSynchronize ) {
            // Make an if if there are more kind of elements
            Wpcf7_Edit_Form_Modal.openFormEditorModal({
                elementData: elementData,
                blockID: blockID
            });
        } else {
            _openChooseModal();
        }
    };

    var _refreshElementData = function (data) {
        _clearElementData();
        _updateElementData(data);
    };

    var _clearElementData = function () {
        elementData = {
            synchronize: "",
            wpcf7_data: {
                background_color: "",
                border_color: "",
                border_width: "",
                margin_top: "",
                margin_left: "",
                margin_right: "",
                margin_bottom: "",
                error_message_color: "",
                error_message_font_size: "",
                send_message_color: "",
                send_message_font_size: "",
                columns: {
                    padding_top: "",
                    padding_left: "",
                    padding_right: "",
                    padding_bottom: "",
                },
                content: {
                    background_color: "",
                    background_color_hover: "",
                    text_color: "",
                    text_color_hover: "",
                    border_color: "",
                    border_color_hover: "",
                    width: "",
                    height: "",
                    font_size: "",
                    border_width: "",
                    border_radius: "",
                },
                options_different: {
                    width: true,
                    height: true,
                    font_size: true,
                    text_color: true
                }
            },
            element_target: {
                element_id: "",
                element_number: "",
            }
        };
    }

    var _updateElementData = function (data) {
    	elementData = jQuery.extend(true, {}, data.elementInfo);
		if (typeof elementData.synchronize != "undefined") {
		    alreadyChooseToSynchronize = elementData.synchronize.toString() == "true";
		}
        reverseData = jQuery.extend(true, {}, elementData);
        resetData = jQuery.extend(true, {}, elementData);
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////
    /// SAVING FUNCTIONS
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var _saveNewElementOnDB = function () {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: live_editor_obj.ajaxurl,
            data: {
                action: "rex_clone_element",
                nonce_param: live_editor_obj.rexnonce,
                old_id: oldElementID
            },
            beforeSend: function() {},
            success: function (response) {
            	newID = response.data.new_id;
            	_endElementSeparation(newID);
            },
            error: function () {},
            complete: function (response) {}
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    /// ELEMENT SEPARATION FUNCTIONS
    //////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Ends separtion of rexelement: tells iframe to change id of element
     * @param {string} rexID new id of rexelement
     */
    var _endElementSeparation = function (rexID) {
        _separateElement(rexID);

        // The element will be the first with the new ID
        _updateTarget({
            id: rexID, 
            number: 1
        });

        _refreshElement(rexID);
        Wpcf7_Edit_Form_Modal.openFormEditorModal({
            elementData: elementData,
            blockID: blockID
        });
    }

    var _separateElement = function(rexID){
        var elementDataToIframe = {
            eventName: "rexlive:separate_rex_element",
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
    var _updateTarget = function (data) {
        elementData.element_target.element_id = data.id;
        elementData.element_target.element_number = data.number;
    }

    var _refreshElement = function(rexID) {
        var elementDataToIframe = {
            eventName: "rexlive:refresh_separated_rex_element",
            data_to_send: {
                elementID: rexID,
                oldElementID: oldElementID,
                elementData: elementData
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(elementDataToIframe);
    }

    var _staySynchronized = function () {
        var elementDataToIframe = {
            eventName: "rexlive:lock_synchronize_on_element",
            data_to_send: {
                element_target: elementData.element_target
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(elementDataToIframe);
    }

    var _removeSeparateElement = function () {
        var elementDataToIframe = {
            eventName: "rexlive:remove_separate_element",
            data_to_send: {
                element_target: elementData.element_target
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(elementDataToIframe);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    /// MODAL FUNCTIONS
    /////////////////////////////////////////////////////////////////////////////////////////////////

    var _openChooseModal = function () {
        Rexlive_Modals_Utils.openModal(
            rex_element_choose_panel.$self.parent(".rex-modal-wrap"),    // $target
            false,                          // target_only
            ["wpcf7-choose-element"]      // additional_class
        );
    };

    var _closeChooseModal = function () {
        Rexlive_Modals_Utils.closeModal(
            rex_element_choose_panel.$self.parent(".rex-modal-wrap"),   // $target
            false,                      // target_only
            ["wpcf7-choose-element"]    // additional_class
        );
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////

    var _sendPageEditedMessage = function() {
        var data = {
            eventName: "rexlive:edited",
            modelEdited: false
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
    }

    var _linkDocumentListeners = function () {
        rex_element_choose_panel.$button.on("click", function (e) {
            var optionSelected = this.getAttribute("data-rex-option");
            _closeChooseModal();
            _sendPageEditedMessage();
            switch (optionSelected) {
                case "remove":      // Need to create a new element based on the current element
                    oldElementID = elementData.element_target.element_id;

                    // Saving the new element in the DB
                    _saveNewElementOnDB();
                    break;
                case "edit":        // Editing an existing element
                    Wpcf7_Edit_Form_Modal.openFormEditorModal({
                        elementData: elementData,
                        blockID: blockID
                    });

                    _staySynchronized();
                    break;
                default:
                    break;
            }
        });

        rex_element_choose_panel.$close_button.on("click", function () {
            _closeChooseModal();
        })
    };

	var _init = function() {
        var $self = $("#rex-element-choose");
        var $container = $self;

        rex_element_choose_panel = {
            $self: $self,
            $button: $container.find(".rex-button"),
            $close_button: $container.find(".rex-modal__close-button")
        };

        _linkDocumentListeners();
	}

	return {
		init: _init,
        selectModalToOpen: _selectModalToOpen,
        updateElementData: _updateElementData
	}
})(jQuery);