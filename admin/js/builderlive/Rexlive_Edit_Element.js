/**
 * Editor for the elements (contact forms, ...)
 * @since x.x.x
 */
var Element_Edit_Modal = (function ($) {

	///////////////////////////////////////////////////////////////////////////////////////////////
    /// PANEL FOR CHOSE IF EDIT ELEMENT OR ELEMENT MODEL
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var rex_edit_model_element_panel_properties;

    var _openChooseElementEdit = function () {
        Rexlive_Modals_Utils.openModal(
            rex_edit_model_element_panel_properties.$self.parent(".rex-modal-wrap"),    // $target
            false,          // target_only
            undefined,      // additional_class
            undefined,      // set_position
            blockID         // blockIDToFocusAfterClose
        );
    };

    var _closeChooseElementEdit = function () {
        Rexlive_Modals_Utils.closeModal(
            rex_edit_model_element_panel_properties.$self.parent(".rex-modal-wrap")
        );
    };

    var _linkDocumentPanelChooseListeners = function () {
        rex_edit_model_element_panel_properties.$button.on("click", function (e) {
            var optionSelected = this.getAttribute("data-rex-option");
            switch (optionSelected) {
                case "remove":      // Need to create a new element based on the current element
                    element_editor_properties.$self.addClass("editing-model");
                	oldElementModelID = elementData.element_target.element_id;

                    // Saving the new element in the DB
                    _saveNewElementOnDB();
                    break;
                case "edit":        // Editing an existing element
                    element_editor_properties.$self.addClass("editing-model");
                    
                    // Selezionare il modal in base al tipo di elemento che abbiamo
                    Wpcf7_Edit_Form_Modal.openFormEditorModal({
                        elementData: elementData,
                        blockID: blockID
                    });
                    _staySynchronized();
                    break;
                default:
                    break;
            }
            _closeChooseElementEdit();
        });

        rex_edit_model_element_panel_properties.$close_button.on("click", function () {
            _closeChooseElementEdit();
        })
    };

    var _initPanelChoose = function () {
        var $self = $("#rex-element-model-choose");
        var $container = $self;
        rex_edit_model_element_panel_properties = {
            $self: $self,
            $button: $container.find(".rex-button"),
            $close_button: $container.find(".rex-modal__close-button")
        };
        _linkDocumentPanelChooseListeners();
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////

    var element_editor_properties;
    var elementData;
    var reverseData;
    var resetData;
    var alreadyChooseToSynchronize;
    var defaultElementValues;
    var oldElementModelID;
    var newID;
    var blockID;
    
    var _openElementEditorModal = function (data) {
        alreadyChooseToSynchronize = false;
        blockID = data.blockID;
        _updateElementEditorModal(data.elementData);
        if (alreadyChooseToSynchronize) {
            // Make an if if there are more kind of elements
            Wpcf7_Edit_Form_Modal.openFormEditorModal({
                elementData: elementData,
                blockID: blockID
            });
        } else {
            _openChooseElementEdit();
        }
    };

    var _closeModal = function () {
        Rexlive_Modals_Utils.closeModal(element_editor_properties.$self.parent(".rex-modal-wrap"));
    };

    var _updateElementEditorModal = function (data) {
        _clearElementData();
        _updateElementData(data);
        _updatePanel();
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

    var _updatePanel = function () {
        element_editor_properties.$element_preview_background.css("background-color", elementData.background_color);
        element_editor_properties.$element_background_color_value.val(elementData.background_color);
        element_editor_properties.$element_background_color_preview.hide();
        element_editor_properties.$element_background_color_value.spectrum("set", elementData.background_color);

        element_editor_properties.$self.addClass("editing-model");
    };

    var _updateElementDataFromPanel = function () {
        // elementData.font_size = button_editor_properties.$button_label_text_size.val() + "px";
        // elementData.button_height = button_editor_properties.$button_height.val() + "px";
        // elementData.button_width = button_editor_properties.$button_width.val() + "px";
        // elementData.border_width = button_editor_properties.$button_border_width.val() + "px";
        // elementData.border_radius = button_editor_properties.$button_border_radius.val() + "px";
        // elementData.margin_top = button_editor_properties.$button_margin_top.val() + "px";
        // elementData.margin_bottom = button_editor_properties.$button_margin_bottom.val() + "px";
        // elementData.margin_right = button_editor_properties.$button_margin_right.val() + "px";
        // elementData.margin_left = button_editor_properties.$button_margin_left.val() + "px";
        // elementData.padding_top = button_editor_properties.$button_padding_top.val() + "px";
        // elementData.padding_bottom = button_editor_properties.$button_padding_bottom.val() + "px";
        // elementData.padding_right = button_editor_properties.$button_padding_right.val() + "px";
        // elementData.padding_left = button_editor_properties.$button_padding_left.val() + "px";
        // elementData.buttonTarget.button_name = button_editor_properties.$button_name.val();
        // elementData.text = button_editor_properties.$button_label_text.val();
        // elementData.link_target = button_editor_properties.$button_link_target.val();
        // elementData.link_type = button_editor_properties.$button_link_type.val();
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////
    /// LINKING PANEL TOOLS
    /////////////////////////////////////////////////////////////////////////////////////////////////

    var _linkBackgroundColorEditor = function () {
        var colorTEXT;
        element_editor_properties.$element_background_color_value.spectrum({
            replacerClassName: "btn-floating",
            preferredFormat: "hex",
            showPalette: false,
            showAlpha: true,
            showInput: true,
            showButtons: false,
            containerClassName:
                "rexbuilder-materialize-wrap block-background-color-picker",
            show: function () {
            },
            move: function (color) {
                colorTEXT = color.toRgbString();
                element_editor_properties.$element_background_color_preview.hide();
                element_editor_properties.$element_preview_background.css("background-color", colorTEXT);
                // _updateElementLive({
                //     type: "background",
                //     name: "background-color",
                //     value: colorTEXT
                // });
            },
            change: function (color) {
            },
            hide: function (color) {
                // elementData.background_color = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        element_editor_properties.$element_background_color_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            element_editor_properties.$element_background_color_value.spectrum('hide');
        });

        element_editor_properties.$element_background_color_preview.on(
            "click",
            function () {
                element_editor_properties.$element_background_color_value.spectrum("show");
                return false;
            }
        );
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    /// SAVING FUNCTIONS
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var _saveElementUpdatesOnDB = function () {
        var element_data_html = _createElementDataHTML();
        var elementID = elementData.element_target.element_id;

        element_editor_properties.$add_model_button.addClass("saving-rex-element");
        $.ajax({
            type: "POST",
            dataType: "json",
            url: live_editor_obj.ajaxurl,
            data: {
                action: "rex_update_element",
                nonce_param: live_editor_obj.rexnonce,
                element_id: elementID,
                element_data_html: element_data_html
            },
            beforeSend: function() {
                element_editor_properties.$self.addClass('rex-modal--loading');
            },
            success: function (response) {
            	element_editor_properties.$add_model_button.removeClass("saving-rex-element");
            },
            error: function () {},
            complete: function (response) {
                element_editor_properties.$self.removeClass('rex-modal--loading');
            }
        });
    }

    var _saveNewElementOnDB = function () {
        element_editor_properties.$add_model_button.addClass("saving-rex-element");
        $.ajax({
            type: "POST",
            dataType: "json",
            url: live_editor_obj.ajaxurl,
            data: {
                action: "rex_clone_element",
                nonce_param: live_editor_obj.rexnonce,
                old_id: oldElementModelID
            },
            beforeSend: function() {
                element_editor_properties.$self.addClass('rex-modal--loading');
            },
            success: function (response) {
            	newID = response.data.new_id;
            	_endElementSeparation(newID);

            	element_editor_properties.$add_model_button.removeClass("saving-rex-element");
            },
            error: function () {},
            complete: function (response) {
                element_editor_properties.$self.removeClass('rex-modal--loading');
            }
        });
    }

    /**
     * Updates array of ids used adding the passed ID.
     * 
     * @param {string} newID Rexelement ID to add
     */
    var _addIDElement = function (newID) {
        elementsIDsUsed.push(newID);
    }

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
        // _updatePanel();
        Wpcf7_Edit_Form_Modal.openFormEditorModal({
            elementData: elementData,
            blockID: blockID
        });
    }

    /**
     * Ajax function to update used rexelements ids on db.
     * If passed an object as {separate: true, rexID: id of new element} on ajax call success will be end separation of rexelement
     * @param {Obj} data 
     */
    var _updateElementsIDsUsed = function (data) {
        var separatingElement = typeof data != "undefined" ? data.separate : false;
        $.ajax({
            type: "POST",
            dataType: "json",
            url: live_editor_obj.ajaxurl,
            data: {
                action: "rex_update_elements_ids",
                nonce_param: live_editor_obj.rexnonce,
                ids_used: JSON.stringify(elementsIDsUsed),
            },
            success: function () {
                if (separatingElement) {
                    _endElementSeparation(data.rexID);
                }
            },
            error: function () {},
            complete: function () { }
        })
    }

    /**
     * Updates the element target to update
     * @param {Object} data data of target to update{id, number}
     */
    var _updateTarget = function (data) {
        elementData.element_target.element_id = data.id;
        elementData.element_target.element_number = data.number;
    }

    var _createElementDataHTML = function () {
        var elementHTML = "";
        tmpl.arg = "element";
        
        var defaults = {}

        var data = {
            wpcf7_data: {
                background_color: elementData.wpcf7_data.background_color,
                content: {
                    background_color: elementData.wpcf7_data.content.background_color,
                }
            }
        }

        elementHTML = tmpl("tmpl-rex-element-data", data);
        elementHTML = elementHTML.trim();
        return elementHTML;
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    /// FUNCTIONS THAT TELL THE IFRAME WHAT TO DO
    /////////////////////////////////////////////////////////////////////////////////////////////////

    var _staySynchronized = function () {
        var elementDataToIframe = {
            eventName: "rexlive:lock_synchronize_on_element",
            data_to_send: {
                element_target: elementData.element_target
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(elementDataToIframe);
    }

    var _applyData = function () {
        var elementDataToIframe = {
            eventName: "rexlive:update_element_page",
            data_to_send: {
                reverseElementData: jQuery.extend(true, {}, reverseData),
                actionElementData: jQuery.extend(true, {}, elementData)
            }
        };
        reverseData = jQuery.extend(true, {}, elementDataToIframe.data_to_send.actionElementData);
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(elementDataToIframe);
    };

    /**
     * @param {Object} data 
     * @param {String} data.type Container type to update
     * @param {String} data.propertyName Css rule to update
     * @param {*} data.newValue New value of css rule
     */
    var _updateElementLive = function (data) {
        var elementDataToIframe = {
            eventName: "rexlive:updateElementLive",
            data_to_send: {
                element_target: elementData.element_target,
                propertyType: data.type,
                propertyName: data.name,
                newValue: data.value
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(elementDataToIframe);
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

    var _refreshElement = function(rexID) {
    	var elementDataToIframe = {
    		eventName: "rexlive:refresh_separated_rex_element",
    		data_to_send: {
    			elementID: rexID,
    			oldElementModelID: oldElementModelID,
    			elementData: elementData
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

    var _linkDocumentListeners = function () {
    	/**
         * Reset Panel with data when was opened, updates element in page
         */
        element_editor_properties.$reset_button.on("click", function () {
            elementData = jQuery.extend(true, {}, resetData);
            _updatePanel();
            _applyData();
        });

        /**
         * Saves current detached element as model
         */
        element_editor_properties.$add_model_button.on("click", function () {
            _updateElementDataFromPanel();
            // _saveElementOnDB();
        });

        /**
         * Resets changes to element and closes the modal
         */
        element_editor_properties.$close_button.on("click", function () {
        	elementData = jQuery.extend(true, {}, resetData);
            _updatePanel();
            _applyData();
            _closeModal();
        });

        /**
         * Applyes changes to element and, if element is model, updates DB
         */
        element_editor_properties.$apply_changes_button.on("click", function () {
            _closeModal();
        });

        element_editor_properties.$modal.on('rexlive:this_modal_closed', function() {
            _updateElementDataFromPanel();
            _applyData();
            _saveElementUpdatesOnDB();
        });
    };

	var _init = function() {
		var $self = $("#rex-element-editor");
        var $accordions = $self.find('.rexpansive-accordion');
        var $container = $self;

        element_editor_properties = {
        	$self: $self,
        	$modal: $container.parent(".rex-modal-wrap"),
            $close_button: $container.find(".rex-cancel-button"),
            $reset_button: $container.find(".rex-reset-button"),
            $create_new_element: $("#rex-add-new-element"),
            $add_model_button: $container.find(".add-rex-element-model"),
            $apply_changes_button: $container.find(".rex-apply-button"),

            $element_label_text: $container.find("#rex-element__label"),
            $element_label_text_size: $container.find("#rex-element_text_font_size"),
            $element_label_text_color_value: $container.find("#rex-element-text-color"),
            $element_label_text_color_runtime: $container.find("#rex-element-text-color-runtime"),
            $element_label_text_color_preview: $container.find("#rex-element-text-color-preview-icon"),

            $element_preview_background: $container.find("#rex-element-preview-background"),
            $element_background_color_value: $container.find("#rex-element-background-color"),
            $element_background_color_runtime: $container.find("#rex-element-background-color-runtime"),
            $element_background_color_preview: $container.find("#rex-element-background-color-preview-icon"),

            $element_height: $container.find("#rex-element-height"),
            $element_width: $container.find("#rex-element-width"),

            $element_preview_background_hover: $container.find("#rex-element-preview-background-hover"),
            $element_background_hover_color_value: $container.find("#rex-element-background-hover-color"),
            $element_background_hover_color_runtime: $container.find("#rex-element-background-hover-color-runtime"),
            $element_background_hover_color_preview: $container.find("#rex-element-background-hover-color-preview-icon"),

            $element_preview_text_hover: $container.find("#rex-element-preview-text-hover"),
            $element_text_hover_color_value: $container.find("#rex-element-text-hover-color"),
            $element_text_hover_color_runtime: $container.find("#rex-element-text-hover-color-runtime"),
            $element_text_hover_color_preview: $container.find("#rex-element-text-hover-color-preview-icon"),

            $element_preview_border_hover: $container.find("#rex-element-preview-border-hover"),
            $element_border_hover_color_value: $container.find("#rex-element-border-hover-color"),
            $element_border_hover_color_runtime: $container.find("#rex-element-border-hover-color-runtime"),
            $element_border_hover_color_preview: $container.find("#rex-element-border-hover-color-preview-icon"),

            $element_preview_border: $container.find("#rex-element-border-preview"),
            $element_border_color_value: $container.find("#rex-element-border-color"),
            $element_border_color_runtime: $container.find("#rex-element-border-color-runtime"),
            $element_border_color_preview: $container.find("#rex-element-color-preview-icon"),

            $element_border_width: $container.find("#rex-element-border-width"),
            $element_border_radius: $container.find("#rex-element-border-radius"),

            $element_margin_top: $container.find("#rex-element-margin-top-radius"),
            $element_margin_right: $container.find("#rex-element-margin-right-radius"),
            $element_margin_bottom: $container.find("#rex-element-margin-bottom-radius"),
            $element_margin_left: $container.find("#rex-element-margin-left-radius"),

            $element_padding_top: $container.find("#rex-element-padding-top-radius"),
            $element_padding_right: $container.find("#rex-element-padding-right-radius"),
            $element_padding_bottom: $container.find("#rex-element-padding-bottom-radius"),
            $element_padding_left: $container.find("#rex-element-padding-left-radius"),

            $element_link_target: $container.find("#rex-element-link-target"),
            $element_link_type: $container.find("#rex-element-link-type"),

            $element_name: $container.find("#rex-element__name")
        }
		
		elementsIDsUsed = JSON.parse($("#rex-elements-ids-used").text());
		_linkDocumentListeners();
		// Qua ci andranno i valori di default degli stili che verranno scelti
        defaultElementValues = {
            // Prova
            input: {
                text: {
                    "border-color": "",
                }
            }
        };
		elementData = {
            synchronize: "",
            wpcf7_data: {
                background_color: "",
                content: {
                    background_color: "",
                }
            },
            element_target: {
                element_id: "",
                element_number: "",
            }
        };

		// _linkTextInputs();
        // _linkNumberInputs();
        // _linkDropDownMenus();

        // _linkTextColorEditor();
        _linkBackgroundColorEditor();
        // _linkBackgroundHoverColorEditor();
        // _linkBorderHoverColorEditor();
        // _linkTextHoverColorEditor();
        // _linkBorderColorEditor();

		_initPanelChoose();

        $accordions.rexAccordion({open:{},close:{},});

	}

	return {
		init: _init,
        openElementEditorModal: _openElementEditorModal,
        updateElementData: _updateElementData,
        saveElementUpdatesOnDB: _saveElementUpdatesOnDB,
        // removeIDElement: _removeIDElement,
        // removeIDElementSoft: _removeIDElementSoft
	}
})(jQuery);