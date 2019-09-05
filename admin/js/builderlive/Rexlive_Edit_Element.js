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
            rex_edit_model_element_panel_properties.$self.parent(".rex-modal-wrap")
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
                case "remove":
                    _separateRexElement();
                    break;
                case "edit":
                	// Da vedere
                    // editingModelElement = true;
                    // element_editor_properties.$self.addClass("editing-model");
                    // Rexlive_Modals_Utils.openModal(
                    //     element_editor_properties.$self.parent(".rex-modal-wrap")
                    // );
                    // _staySynchronized();
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
    var rexElementsJSON; //@todelete
    var elementssIDsUsed;
    var reverseData;
    var resetData;
    var editingModelElement;
    var alreadyChooseToSynchronize;
    var defaultElementValues;
    
    var _openElementEditorModal = function (data) {
        alreadyChooseToSynchronize = false;
        _updateElementEditorModal(data);
        if (!editingModelElement || alreadyChooseToSynchronize) {
            Rexlive_Modals_Utils.openModal(
                element_editor_properties.$self.parent(".rex-modal-wrap")
            );
        } else {
            _openChooseElementEdit();
        }
    };

    var _closeModal = function () {
        Rexlive_Modals_Utils.closeModal( element_editor_properties.$self.parent(".rex-modal-wrap") );
    };

    var _updateElementEditorModal = function (data) {
        editingModelElement = false;
        _clearElementData();
        _updateElementData(data);
        _updatePanel();
        // _verifyTextBoxEffectsOnOpenModal();
    };

    var _clearElementData = function () {
        elementData = {
            // text_color: "",
            // text: "",
            // font_size: "",
            // background_color: "",
            // element_height: "",
            // element_width: "",
            // hover_color: "",
            // hover_text: "",
            // hover_border: "",
            // border_color: "",
            // border_width: "",
            // border_radius: "",
            // margin_top: "",
            // margin_bottom: "",
            // margin_right: "",
            // margin_left: "",
            // padding_top: "",
            // padding_bottom: "",
            // padding_right: "",
            // padding_left: "",
            // link_target: "",
            // link_type: "",
            elementTarget: {
                element_name: "",
                element_id: "",
                element_number: 0,
            }
        };
    }

    var _updateElementData = function (data) {
        // if element is separate element, data will be obtained from it
        // if element is a model, data will be obtained from rexElementsJSON array
        if (data.separateElement.toString() == "true") {
            elementData = jQuery.extend(true, {}, data.elementInfo);
            editingModelElement = false;
        } else {
            var i;
            var elementID = data.elementInfo.elementTarget.element_id;
            editingModelElement = true;
            elementData.elementTarget = jQuery.extend(true, {}, data.elementInfo.elementTarget);
            // elementData.text = data.elementInfo.text;
            elementData.link_target = data.elementInfo.link_target;
            // elementData.link_type = data.elementInfo.link_type;
            for (i = 0; i < rexElementsJSON.length; i++) {
                if (elementID == rexElementsJSON[i].rexID) {
                    // elementData.text_color = typeof rexElementsJSON[i].rules.element.text_color === "undefined" ? "" : rexElementsJSON[i].rules.element.text_color;
                    // elementData.font_size = typeof rexElementsJSON[i].rules.element.font_size === "undefined" ? "" : rexElementsJSON[i].rules.element.font_size;
                    elementData.background_color = typeof rexElementsJSON[i].rules.element.background_color === "undefined" ? "" : rexElementsJSON[i].rules.element.background_color;
                    // elementData.element_height = typeof rexElementsJSON[i].rules.element.element_height === "undefined" ? "" : rexElementsJSON[i].rules.element.element_height;
                    // elementData.element_width = typeof rexElementsJSON[i].rules.element.element_width === "undefined" ? "" : rexElementsJSON[i].rules.element.element_width;
                    // elementData.hover_color = typeof rexElementsJSON[i].rules.hover.background_color === "undefined" ? "" : rexElementsJSON[i].rules.hover.background_color;
                    // elementData.hover_text = typeof rexElementsJSON[i].rules.hover.text_color === "undefined" ? "" : rexElementsJSON[i].rules.hover.text_color;
                    // elementData.hover_border = typeof rexElementsJSON[i].rules.hover.border_color === "undefined" ? "" : rexElementsJSON[i].rules.hover.border_color;
                    // elementData.border_color = typeof rexElementsJSON[i].rules.element.border_color === "undefined" ? "" : rexElementsJSON[i].rules.element.border_color;
                    // elementData.border_width = typeof rexElementsJSON[i].rules.element.border_width === "undefined" ? "" : rexElementsJSON[i].rules.element.border_width;
                    // elementData.border_radius = typeof rexElementsJSON[i].rules.element.border_radius === "undefined" ? "" : rexElementsJSON[i].rules.element.border_radius;
                    // elementData.margin_top = typeof rexElementsJSON[i].rules.element.margin_top === "undefined" ? "" : rexElementsJSON[i].rules.element.margin_top;
                    // elementData.margin_bottom = typeof rexElementsJSON[i].rules.element.margin_bottom === "undefined" ? "" : rexElementsJSON[i].rules.element.margin_bottom;
                    // elementData.margin_right = typeof rexElementsJSON[i].rules.element.margin_right === "undefined" ? "" : rexElementsJSON[i].rules.element.margin_right;
                    // elementData.margin_left = typeof rexElementsJSON[i].rules.element.margin_left === "undefined" ? "" : rexElementsJSON[i].rules.element.margin_left;
                    // elementData.padding_top = typeof rexElementsJSON[i].rules.element.padding_top === "undefined" ? "" : rexElementsJSON[i].rules.element.padding_top;
                    // elementData.padding_bottom = typeof rexElementsJSON[i].rules.element.padding_bottom === "undefined" ? "" : rexElementsJSON[i].rules.element.padding_bottom;
                    // elementData.padding_right = typeof rexElementsJSON[i].rules.element.padding_right === "undefined" ? "" : rexElementsJSON[i].rules.element.padding_right;
                    // elementData.padding_left = typeof rexElementsJSON[i].rules.element.padding_left === "undefined" ? "" : rexElementsJSON[i].rules.element.padding_left;
                    elementData.elementTarget.element_name = rexElementsJSON[i].elementName;
                    break;
                }
            }
            if (typeof data.elementInfo.synchronize != "undefined") {
                alreadyChooseToSynchronize = data.elementInfo.synchronize.toString() == "true";
            }
        }
        reverseData = jQuery.extend(true, {}, elementData);
        resetData = jQuery.extend(true, {}, elementData);
    };

    var _updatePanel = function () {
        // element_editor_properties.$element_label_text.val(elementData.text);
        // element_editor_properties.$element_label_text_size.val(elementData.font_size.replace('px', ''));
        // element_editor_properties.$element_height.val(elementData.element_height.replace('px', ''));
        // element_editor_properties.$element_width.val(elementData.element_width.replace('px', ''));
        // element_editor_properties.$element_border_width.val(elementData.border_width.replace('px', ''));
        // element_editor_properties.$element_border_radius.val(elementData.border_radius.replace('px', ''));
        // element_editor_properties.$element_margin_top.val(elementData.margin_top.replace('px', ''));
        // element_editor_properties.$element_margin_right.val(elementData.margin_right.replace('px', ''));
        // element_editor_properties.$element_margin_left.val(elementData.margin_left.replace('px', ''));
        // element_editor_properties.$element_margin_bottom.val(elementData.margin_bottom.replace('px', ''));
        // element_editor_properties.$element_padding_top.val(elementData.padding_top.replace('px', ''));
        // element_editor_properties.$element_padding_right.val(elementData.padding_right.replace('px', ''));
        // element_editor_properties.$element_padding_left.val(elementData.padding_left.replace('px', ''));
        // element_editor_properties.$element_padding_bottom.val(elementData.padding_bottom.replace('px', '')); 

        // element_editor_properties.$element_link_target.val(elementData.link_target);
        // element_editor_properties.$element_link_type.val(elementData.link_type);
        // element_editor_properties.$element_name.val(elementData.elementTarget.element_name);

        // element_editor_properties.$element_preview_border.css("border-width", elementData.border_width);

        // element_editor_properties.$element_label_text.css("color", elementData.text_color);
        // element_editor_properties.$element_label_text_color_value.val(elementData.text_color);
        // element_editor_properties.$element_label_text_color_preview.hide();
        // element_editor_properties.$element_label_text_color_value.spectrum("set", elementData.text_color);

        // element_editor_properties.$element_preview_background_hover.css("background-color", elementData.hover_color);
        // element_editor_properties.$element_background_hover_color_value.val(elementData.hover_color);
        // element_editor_properties.$element_background_hover_color_value.spectrum("set", elementData.hover_color);
        // element_editor_properties.$element_background_hover_color_preview.hide();

        // element_editor_properties.$element_preview_text_hover.css("background-color", elementData.hover_text);
        // element_editor_properties.$element_text_hover_color_value.val(elementData.hover_text);
        // element_editor_properties.$element_text_hover_color_value.spectrum("set", elementData.hover_text);
        // element_editor_properties.$element_text_hover_color_preview.hide();

        // element_editor_properties.$element_preview_border_hover.css("background-color", elementData.hover_border);
        // element_editor_properties.$element_border_hover_color_value.val(elementData.hover_border);
        // element_editor_properties.$element_border_hover_color_value.spectrum("set", elementData.hover_border);
        // element_editor_properties.$element_border_hover_color_preview.hide();

        element_editor_properties.$element_preview_background.css("background-color", elementData.background_color);
        element_editor_properties.$element_background_color_value.val(elementData.background_color);
        element_editor_properties.$element_background_color_preview.hide();
        element_editor_properties.$element_background_color_value.spectrum("set", elementData.background_color);

        // element_editor_properties.$element_preview_border.css("border-color", elementData.border_color);
        // element_editor_properties.$element_border_color_value.val(elementData.border_color);
        // element_editor_properties.$element_border_color_preview.hide();
        // element_editor_properties.$element_border_color_value.spectrum("set", elementData.border_color);

        if (editingModelElement) {
            // if (!element_editor_properties.$add_model_element.hasClass("editing-model")) {
                element_editor_properties.$self.addClass("editing-model");
            // }
        } else {
            element_editor_properties.$self.removeClass("editing-model");
        }
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
        
        //colors data are already updated
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // LINKING PANEL TOOLS
    ///////////////////////////////////////////////////////////////////////////////////////////////////

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
                // _updateButtonLive({//@tostudy
                //     type: "background",
                //     name: "background-color",
                //     value: colorTEXT
                // });
            },
            change: function (color) {
            },
            hide: function (color) {
                elementData.background_color = color.toRgbString();
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
    
    // var _saveElementOnDB = function () {

    //     _updatejsonRexButtons(); // da vedere

    //     var html_element = _createButtonHtml(); // da fare
    //     var css_element = _createCSSbutton(); // da fare
    //     var jsonRexElements = JSON.stringify(rexElementsJSON);
    //     var elementID = elementData.elementTarget.element_id;

    //     element_editor_properties.$add_model_button.addClass("saving-rex-element");
    //     $.ajax({
    //         type: "POST",
    //         dataType: "json",
    //         url: live_editor_obj.ajaxurl,
    //         data: {
    //             action: "rex_update_button",//da fare
    //             nonce_param: live_editor_obj.rexnonce,
    //             id_button: elementID,
    //             html_button: html_button,
    //             css_button: css_button,
    //             jsonRexButtons: jsonRexButtons,
    //         },
    //         beforeSend: function() {
    //             button_editor_properties.$self.addClass('rex-modal--loading');
    //         },
    //         success: function (response) {

    //             // Updates model list tab
    //             Button_Import_Modal.updateButtonList({
    //                 html: html_button,
    //                 buttonData: buttonData
    //             });
    //             // If not editing a model button, it means we are creating a new model, so we need to update the button separate as a model
    //             if (!editingModelButton) {
    //                 _removeSeparateButton();
    //             }

    //             button_editor_properties.$add_model_button.removeClass("saving-rex-button");
    //             // _closeModal();
    //         },
    //         error: function (response) { },
    //         complete: function (response) {
    //             button_editor_properties.$self.removeClass('rex-modal--loading');
    //         }
    //     });
    // }

    /**
     * Updates array of ids used adding the passed ID.
     * 
     * @param {string} newID Rexelement ID to add
     */
    var _addIDElement = function (newID) {
        elementsIDsUsed.push(newID);
    }

    /**
     * Ends separtion of rexelement: tells iframe to change id of element and opens panel to edit a separate element
     * @param {string} rexID new id of rexbutton
     */
    var _endElementSeparation = function (rexID) {
        _separateElement(rexID);
        // the element will be the first with the new ID
        _updateTarget({
            id: rexID, 
            number: 1
        });
        editingModelElement = false;
        _updatePanel();
        Rexlive_Modals_Utils.openModal(
            element_editor_properties.$self.parent(".rex-modal-wrap")
        );
    }

    /**
     * Ajax function to update used rexelements ids on db.
     * If passed an object as {separate: true, rexID: id of new element} on ajax call success will be end separation of rexelement
     * @param {Obj} data 
     */
    var _updateElementsIDSUsed = function (data) {
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
            error: function () { },
            complete: function () { }
        })
    }

    /**
     * Updates the element target to update
     * @param {Object} data data of target to update{id, number}
     */
    var _updateTarget = function (data) {
        elementData.elementTarget.element_id = data.id;
        elementData.elementTarget.element_number = data.number;
    }

    /**
     * Creates a new ID, adds to used IDs and updates on DB the used ids
     */
    var _separateRexElement = function () {
        var newID = _createNewElementID();
        _addIDElement(newID);
        _updateElementsIDSUsed({
            rexID: newID,
            separate: true
        });
    }

    // L'ID dovrebbe essere numerico, ma per ora lo lascio alfanumerico random
    var _createNewElementID = function () {
        var newID = "";
        var flag;
        var i;
        do {
            flag = true;
            newID = Rexbuilder_Util_Admin_Editor.createRandomID(4);
            for (i = 0; i < elementsIDsUsed.length; i++) {
                if (newID == elementsIDsUsed[i]) {
                    flag = false;
                    break;
                }
            }
        } while (!flag);
        return newID;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    /// FUNCTIONS THAT TELL THE IFRAME WHAT TO DO
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    var _staySynchronized = function () {
        var elementDataToIframe = {
            eventName: "rexlive:lock_synchronize_on_element",
            data_to_send: {
                elementTarget: elementData.elementTarget
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    var _linkDocumentListeners = function () {
    	/**
         * Reset Panel with data when was opened, updates button in page
         */
        // element_editor_properties.$reset_button.on("click", function () {
        //     buttonData = jQuery.extend(true, {}, resetData);
        //     _updatePanel();
        //     _applyData();
        // });

        /**
         * Saves current detached button as model
         */
        // element_editor_properties.$add_model_button.on("click", function () {
        //     _updateButtonDataFromPanel();
        //     _saveButtonOnDB();
        // });

        /**
         * Applyes changes to button and, if button is model, updates DB
         */
        element_editor_properties.$close_button.on("click", function () {
            // _updateButtonDataFromPanel();
            // _applyData();
            // if (editingModelButton) {
            //     _saveButtonOnDB();
            // }
            _closeModal();
        });

        /**
         * Applyes changes to button and, if button is model, updates DB
         */
        // element_editor_properties.$apply_changes_button.on("click", function () {
        //     // _updateButtonDataFromPanel();
        //     // _applyData();
        //     // if (editingModelButton) {
        //     //     _saveButtonOnDB();
        //     // }
        //     _closeModal();
        // });
    	// closing window by click on the screen
        element_editor_properties.$modal.on('rexlive:this_modal_closed', function() {
            _updateElementDataFromPanel();
            _applyData();
            if (editingModelElement) {
                _saveElementOnDB();
            }
        });
    };

	var _init = function() {
		var $self = $("#rex-element-editor");
        // var $accordions = $self.find('.rexpansive-accordion');
        var $container = $self;

        element_editor_properties = {
        	$self: $self,
        	$modal: $container.parent(".rex-modal-wrap"),
            $close_button: $container.find(".rex-cancel-button"),
            $reset_button: $container.find(".rex-reset-button"),
            $create_new_element: $("#rex-add-new-element"),
            $add_model_element: $container.find(".add-rex-element-model"),
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
		
		rexElementsJSON = JSON.parse($("#rex-elements-json-css").text());
		elementsIDsUsed = JSON.parse($("#rex-elements-ids-used").text());
		_linkDocumentListeners();
		// Qua ci andranno i valori di default degli stili che verranno scelti
        defaultElementValues = {
            // Prova
            input: {
                text: {
                    "border-color": "#c935bd",
                }
            }
        };
		elementData = {
			// text_color: "",
			// text: "",
			// font_size: "",
			background_color: "",
            // button_height: "",
            // button_width: "",
            // hover_color: "",
            // hover_text: "",
            // hover_border: "",
            // border_color: "",
            // border_width: "",
            // border_radius: "",
            // margin_top: "",
            // margin_bottom: "",
            // margin_left: "",
            // margin_right: "",
            // padding_top: "",
            // padding_bottom: "",
            // padding_left: "",
            // padding_right: "",
            // link_target: "",
            // link_type: "",
            elementTarget: {
                element_name: "",
                element_id: "",
                element_number: 0,
            }
		};

		// _linkTextInputs();
  //       _linkNumberInputs();
  //       _linkDropDownMenus();

  //       _linkTextColorEditor();
        _linkBackgroundColorEditor();
  //       _linkBackgroundHoverColorEditor();
  //       _linkBorderHoverColorEditor();
  //       _linkTextHoverColorEditor();
  //       _linkBorderColorEditor();

		_initPanelChoose();

        // $accordions.rexAccordion({open:{},close:{},});

	}

	return {
		init: _init,
        openElementEditorModal: _openElementEditorModal,
        // removeIDElement: _removeIDElement,
        // removeIDElementSoft: _removeIDElementSoft
	}
})(jQuery);