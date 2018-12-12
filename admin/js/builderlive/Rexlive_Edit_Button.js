/**
 * Editor for the buttons
 * @since 2.0.0
 */
var Button_Edit_Modal = (function ($) {
    "use strict";

    ///////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 
     * @param {jQuery} $target input field
     * @param {Boolean} negativeNumbers true if allow negative numbers
     */
    var _linkKeyDownListenerInputNumber = function ($target, negativeNumbers) {
        negativeNumbers = typeof negativeNumbers === "undefined" ? false : negativeNumbers.toString() == "true";
        $target.keydown(function (e) {
            var $input = $(e.target);
            // Allow: backspace, delete, tab, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 13, 110]) !== -1 ||
                // Allow: Ctrl+A, Command+A
                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40) ||
                // Allow: -
                (e.key == "-")) {

                // if negative numbers are not allowed
                if (!negativeNumbers && e.key == "-") {
                    e.preventDefault();
                }
                // let it happen, don't do anything
                if (e.keyCode == 38) { // up
                    e.preventDefault();
                    $input.val(isNaN(parseInt($input.val())) ? 0 : parseInt($input.val()) + 1);
                }

                if (e.keyCode == 40) { //down
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
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
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
        negativeNumbers = typeof negativeNumbers === "undefined" ? false : negativeNumbers.toString() == "true";
        $target.keyup(function (e) {
            if (//Numbers
                (e.keyCode >= 48 && e.keyCode <= 57) ||
                (e.keyCode >= 96 && e.keyCode <= 105) ||
                // arrow up, arrow down, back, -
                (e.keyCode == 38) || (e.keyCode == 40) || (e.keyCode == 8) || e.key == "-") {
                e.preventDefault();
                if (negativeNumbers || !(e.key == "-")) {
                    callbackFunction.call(this, parseInt(e.target.value));
                }
            }
        });
    };
    ///////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Panel for choose if edit button or model
     */

    var rex_edit_model_button_panel_properties;

    var _openChooseButtonEdit = function () {
        Rexlive_Modals_Utils.openModal(
            rex_edit_model_button_panel_properties.$self.parent(".rex-modal-wrap")
        );
    };

    var _closeChooseButtonEdit = function () {
        Rexlive_Modals_Utils.closeModal(
            rex_edit_model_button_panel_properties.$self.parent(".rex-modal-wrap")
        );
    };

    var _linkDocumentPanelChooseListeners = function () {
        rex_edit_model_button_panel_properties.$button.on("click", function (e) {
            var optionSelected = $(this).parents(".rex-edit-button-model-option").attr("data-rex-option");
            console.log(optionSelected);
            switch (optionSelected) {
                case "remove":
                    console.log("STACCAH STACCAH");
                    _separateButton();
                    break;
                case "edit":
                    console.log("MANTIENIH");
                    _saveButtonOnDB();
                    break;
                default:
                    break;
            }
            _closeChooseButtonEdit();
        });

        rex_edit_model_button_panel_properties.$close_button.on("click", function () {
            _closeChooseButtonEdit();
        })
    };

    var _initPanelChoose = function () {
        var $self = $("#rex-button-model-choose");
        var $container = $self;
        rex_edit_model_button_panel_properties = {
            $self: $self,
            $button: $container.find(".rex-button"),
            $close_button: $container.find(".rex-modal__close-button")
        };
        _linkDocumentPanelChooseListeners();
    };
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var button_editor_properties;
    var buttonData;
    var rexButtonsJSON;
    var buttonsIDsUsed;
    var defaultButtonData;
    var reverseData;
    var resetData;
    var editingModelButton;
    var addingNewButton;

    var _openButtonEditorModal = function (data) {
        _updateButtonEditorModal(data);

        Rexlive_Modals_Utils.openModal(
            button_editor_properties.$self.parent(".rex-modal-wrap")
        );
    };

    var _updateButtonEditorModal = function (data) {
        editingModelButton = false;
        addingNewButton = false;
        _clearButtonData();
        _updateButtonData(data);
        _updatePanel();
    };

    var _updateButtonData = function (data) {
        if (data.separateButton.toString() == "true") {
            buttonData = jQuery.extend(true, {}, data.buttonInfo);
            editingModelButton = false;
        } else {
            var i;
            var buttonID = data.buttonInfo.buttonTarget.button_id;
            editingModelButton = true;
            buttonData.buttonTarget = jQuery.extend(true, {}, data.buttonInfo.buttonTarget);
            buttonData.text = data.buttonInfo.text;
            buttonData.link_taget = data.buttonInfo.link_taget;
            buttonData.link_type = data.buttonInfo.link_type;
            for (i = 0; i < rexButtonsJSON.length; i++) {
                if (buttonID == rexButtonsJSON[i].rexID) {
                    buttonData.text_color = rexButtonsJSON[i].rules.element.text_color;
                    buttonData.font_size = rexButtonsJSON[i].rules.element.font_size;
                    buttonData.background_color = rexButtonsJSON[i].rules.element.background_color;
                    buttonData.button_height = rexButtonsJSON[i].rules.element.button_height;
                    buttonData.hover_color = rexButtonsJSON[i].rules.hover.background_color;
                    buttonData.border_color = rexButtonsJSON[i].rules.element.border_color;
                    buttonData.border_width = rexButtonsJSON[i].rules.element.border_width;
                    buttonData.border_radius = rexButtonsJSON[i].rules.element.border_radius;
                    buttonData.margin_top = rexButtonsJSON[i].rules.element.margin_top;
                    buttonData.margin_bottom = rexButtonsJSON[i].rules.element.margin_bottom;
                    buttonData.buttonTarget.button_name = rexButtonsJSON[i].buttonName;
                    break;
                }
            }
        }
        reverseData = jQuery.extend(true, {}, buttonData);
        resetData = jQuery.extend(true, {}, buttonData);
    };

    var _updatePanel = function () {
        button_editor_properties.$button_label_text.val(buttonData.text);
        button_editor_properties.$button_label_text_size.val(buttonData.font_size.replace('px', ''));
        button_editor_properties.$button_height.val(buttonData.button_height.replace('px', ''));
        button_editor_properties.$button_border_width.val(buttonData.border_width.replace('px', ''));
        button_editor_properties.$button_border_radius.val(buttonData.border_radius.replace('px', ''));
        button_editor_properties.$button_margin_top.val(buttonData.margin_top.replace('px', ''));
        button_editor_properties.$button_margin_bottom.val(buttonData.margin_bottom.replace('px', ''));
        button_editor_properties.$button_link_target.val(buttonData.link_taget);
        button_editor_properties.$button_link_type.val(buttonData.link_type);
        button_editor_properties.$button_name.val(buttonData.buttonTarget.button_name);

        button_editor_properties.$button_label_text.css("color", buttonData.text_color);
        button_editor_properties.$button_preview_background_hover.css("background-color", buttonData.hover_color);
        button_editor_properties.$button_preview_background.css("background-color", buttonData.background_color);
        button_editor_properties.$button_preview_border.css("border-color", buttonData.border_color);
        //lasciarlo aggiornato? o fixato a 5px?
        button_editor_properties.$button_preview_border.css("border-width", buttonData.border_width);
    };

    var _updateButtonDataFromPanel = function () {
        buttonData.font_size = button_editor_properties.$button_label_text_size.val() + "px";
        buttonData.button_height = button_editor_properties.$button_height.val() + "px";
        buttonData.border_width = button_editor_properties.$button_border_width.val() + "px";
        buttonData.border_radius = button_editor_properties.$button_border_radius.val() + "px";
        buttonData.margin_top = button_editor_properties.$button_margin_top.val() + "px";
        buttonData.margin_bottom = button_editor_properties.$button_margin_bottom.val() + "px";

        buttonData.buttonTarget.button_name = button_editor_properties.$button_name.val();
        /* 
                buttonData.hover_color = ;
                buttonData.background_color = ;
                buttonData.border_color = ; 
                buttonData.text_color = ;
                    */

        buttonData.text = button_editor_properties.$button_label_text.val();
        buttonData.link_taget = button_editor_properties.$button_link_target.val();
        buttonData.link_type = button_editor_properties.$button_link_type.val();
    };

    /**
     * If one of this properties is different means that model has to be update on db
     */
    var _checkEditsModel = function () {
        return resetData.font_size == buttonData.font_size &&
            resetData.button_height == buttonData.button_height &&
            resetData.border_width == buttonData.border_width &&
            resetData.border_radius == buttonData.border_radius &&
            resetData.margin_top == buttonData.margin_top &&
            resetData.margin_bottom == buttonData.margin_bottom &&
            resetData.buttonTarget.button_name == buttonData.buttonTarget.button_name &&
            resetData.hover_color == buttonData.hover_color &&
            resetData.background_color == buttonData.background_color &&
            resetData.border_color == buttonData.border_color &&
            resetData.text_color == buttonData.text_color;
    };

    var _linkTextInputs = function () {
        // LABEL
        button_editor_properties.$button_label_text.on("keyup", function (e) {
            _updateButtonLive({
                type: "button",
                name: "button_label",
                value: button_editor_properties.$button_label_text.val()
            });
        });

        // LINK TARGET
        button_editor_properties.$button_link_target.on("keyup", function (e) {
            _updateButtonLive({
                type: "button",
                name: "link_target",
                value: button_editor_properties.$button_link_target.val()
            });
        });

        // BUTTON NAME
        button_editor_properties.$button_name.on("keyup", function (e) {
            if(!editingModelButton){
                _updateButtonLive({
                    type: "button",
                    name: "button_name",
                    value: button_editor_properties.$button_name.val()
                });
            }
        });
    };

    var _linkNumberInputs = function () {
        // FONT SIZE
        var _updateFontSizeButton = function (newFontSize) {
            _updateButtonLive({
                type: "container",
                name: "font-size",
                value: newFontSize + "px"
            });
        };
        _linkKeyDownListenerInputNumber(button_editor_properties.$button_label_text_size, false);
        _linkKeyUpListenerInputNumber(button_editor_properties.$button_label_text_size, _updateFontSizeButton, false);

        // BUTTON HEIGHT
        var _updateButtonHeight = function (newButtonHeight) {
            _updateButtonLive({
                type: "container",
                name: "height",
                value: newButtonHeight + "px"
            });
        };
        _linkKeyDownListenerInputNumber(button_editor_properties.$button_height, false);
        _linkKeyUpListenerInputNumber(button_editor_properties.$button_height, _updateButtonHeight, false);

        // BORDER WIDTH
        var _updateBorderWidth = function (newBorderWidth) {
            _updateButtonLive({
                type: "background",
                name: "border-width",
                value: newBorderWidth + "px"
            });
        };
        _linkKeyDownListenerInputNumber(button_editor_properties.$button_border_width, false);
        _linkKeyUpListenerInputNumber(button_editor_properties.$button_border_width, _updateBorderWidth, false);

        // BORDER RADIUS
        var _updateBorderRadius = function (newBorderRadius) {
            _updateButtonLive({
                type: "background",
                name: "border-radius",
                value: newBorderRadius + "px"
            });
        };
        _linkKeyDownListenerInputNumber(button_editor_properties.$button_border_radius, false);
        _linkKeyUpListenerInputNumber(button_editor_properties.$button_border_radius, _updateBorderRadius, false);

        // MARGIN TOP
        var _updateMarginTop = function (newMarginTop) {
            _updateButtonLive({
                type: "container",
                name: "margin-top",
                value: newMarginTop + "px"
            });
        };
        _linkKeyDownListenerInputNumber(button_editor_properties.$button_margin_top, false);
        _linkKeyUpListenerInputNumber(button_editor_properties.$button_margin_top, _updateMarginTop, false);

        // MARGIN BOTTOM
        var _updateMarginBottom = function (newMarginBottom) {
            _updateButtonLive({
                type: "container",
                name: "margin-bottom",
                value: newMarginBottom + "px"
            });
        };
        _linkKeyDownListenerInputNumber(button_editor_properties.$button_margin_bottom, false);
        _linkKeyUpListenerInputNumber(button_editor_properties.$button_margin_bottom, _updateMarginBottom, false);
    }
    
    var _linkDropDownMenus = function () {
        button_editor_properties.$button_link_type.on("change", function (e) {
            _updateButtonLive({
                type: "button",
                name: "link_type",
                value: button_editor_properties.$button_link_type.val()
            });
        });
    }

    var _linkTextColorEditor = function () {
        button_editor_properties.$button_label_text_color_value.spectrum({
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
                button_editor_properties.$button_label_text_color_preview.hide();
                _updateButtonLive({
                    type: "container",
                    name: "color",
                    value: color.toRgbString()
                });
            },
            change: function (color) {
            },
            hide: function (color) {
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        button_editor_properties.$button_label_text_color_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            button_editor_properties.$button_label_text_color_value.spectrum('hide');
        });

        button_editor_properties.$button_label_text_color_preview.on(
            "click",
            function () {
                console.log("dovrei aprirmi");
                button_editor_properties.$button_label_text_color_value.spectrum("show");
                return false;
            }
        );
    }

    var _clearButtonData = function () {
        buttonData = {
            text_color: "",
            text: "",
            font_size: "",
            background_color: "",
            button_height: "",
            hover_color: "",
            border_color: "",
            border_width: "",
            border_radius: "",
            margin_top: "",
            margin_bottom: "",
            link_taget: "",
            link_type: "",
            buttonTarget: {
                button_name: "",
                button_id: "",
                button_number: 0,
            }
        };
    }

    var _saveButtonOnDB = function () {

        _updatejsonRexButtons();

        var html_button = _createButtonHtml();
        var css_button = _createCSSbutton();
        var jsonRexButtons = JSON.stringify(rexButtonsJSON);
        var buttonID = buttonData.buttonTarget.button_id;
        button_editor_properties.$add_model_button.addClass("saving-rex-button");
        $.ajax({
            type: "POST",
            dataType: "json",
            url: live_editor_obj.ajaxurl,
            data: {
                action: "rex_update_button",
                nonce_param: live_editor_obj.rexnonce,
                id_button: buttonID,
                html_button: html_button,
                css_button: css_button,
                jsonRexButtons: jsonRexButtons,
            },
            success: function (response) {
                // aggiornare lista modelli nella tab
                Button_Import_Modal.updateButtonList({
                    html: html_button,
                    buttonData: buttonData
                });
                if (!editingModelButton){
                    _removeSeparateButton();
                }
                // togliere loader
                button_editor_properties.$add_model_button.removeClass("saving-rex-button");
                // chiudi
                _closeModal();
            },
            error: function (response) { },
            complete: function (response) { }
        });
    }

    var _createNewButton = function (name) {
        _updateButtonsIDSUsed({
            id: "",
            name: name
        });
    };

    var _updateButtonsIDSUsed = function (data) {
        var newID = data.id;
        if (addingNewButton) {
            newID = _createNewButtonID();
            buttonData.buttonTarget.button_id = newID;
            buttonData.button_name = data.name;
        }

        buttonsIDsUsed.push(newID);
        $.ajax({
            type: "POST",
            dataType: "json",
            url: live_editor_obj.ajaxurl,
            data: {
                action: "rex_update_buttons_ids",
                nonce_param: live_editor_obj.rexnonce,
                ids_used: JSON.stringify(buttonsIDsUsed),
            },
            success: function () {
                // aggiorna in live
                if (editingModelButton){
                    var buttonDataToIframe = {
                        eventName: "rexlive:separate_rex_button",
                        data_to_send: {
                            newID: newID,
                            buttonData: buttonData
                        }
                    };
                    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(buttonDataToIframe); 
                    _closeModal();
                }
                if (addingNewButton){
                    _saveButtonOnDB();
                }
            },
            error: function () { },
            complete: function () { }
        })
    }

    var _updatejsonRexButtons = function () {
        var buttonID = buttonData.buttonTarget.button_id;
        var i;
        for (i = 0; i < rexButtonsJSON.length; i++) {
            if (buttonID == rexButtonsJSON[i].rexID) {
                break;
            }
        }

        if (i != rexButtonsJSON.length) {
            rexButtonsJSON.splice(i, 1);
        }

        var data = {
            rexID: buttonID,
            buttonName: buttonData.buttonTarget.button_name,
            rules: {
                element: {
                    text_color: buttonData.text_color,
                    font_size: buttonData.font_size,
                    background_color: buttonData.background_color,
                    button_height: buttonData.button_height,
                    border_color: buttonData.border_color,
                    border_width: buttonData.border_width,
                    border_radius: buttonData.border_radius,
                    margin_top: buttonData.margin_top,
                    margin_bottom: buttonData.margin_bottom,
                },
                hover: {
                    background_color: buttonData.hover_color,
                }
            }
        }
        rexButtonsJSON.push(data);
    }

    var _createCSSbutton = function () {
        var buttonID = buttonData.buttonTarget.button_id;
        var buttonCSS = "";

        buttonCSS = ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"]";
        buttonCSS += " .rex-button-container{";
        buttonCSS += "font-size: " + buttonData.font_size + ";";
        buttonCSS += "color: " + buttonData.text_color + ";";
        buttonCSS += "height: " + buttonData.button_height + ";";
        buttonCSS += "margin-top: " + buttonData.margin_top + ";";
        buttonCSS += "margin-bottom: " + buttonData.margin_bottom + ";";
        buttonCSS += "}";

        buttonCSS += ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"]";
        buttonCSS += " .rex-button-background{";
        buttonCSS += "background-color: " + buttonData.background_color + ";";
        //background-image
        //background-gradient
        buttonCSS += "border-width: " + buttonData.border_width + ";";
        buttonCSS += "border-color: " + buttonData.border_color + ";";
        buttonCSS += "border-radius: " + buttonData.border_radius + ";";
        buttonCSS += "border-style: solid;";
        buttonCSS += "}";

        buttonCSS += ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"]";
        buttonCSS += " .rex-button-background:hover{";
        buttonCSS += "background-color: " + buttonData.hover_color + ";";
        buttonCSS += "}";
        return buttonCSS;
    }

    var _createButtonHtml = function () {
        var buttonHTML = "";
        tmpl.arg = "button";
        buttonHTML = tmpl("tmpl-rex-button", {
            text_color: buttonData.text_color,
            text: "Rex Button", //Cosa ci metto altrimenti? è il testo del modello
            font_size: buttonData.font_size,
            button_height: buttonData.button_height,
            background_color: buttonData.background_color,
            hover_color: buttonData.hover_color,
            border_color: buttonData.border_color,
            border_width: buttonData.border_width,
            border_radius: buttonData.border_radius,
            margin_top: buttonData.margin_top,
            margin_bottom: buttonData.margin_bottom,
            link_taget: "#",
            link_type: "_blank",
            button_name: buttonData.buttonTarget.button_name,
            id: buttonData.buttonTarget.button_id,
        });
        return buttonHTML;
    }

    var _applyData = function () {
        var buttonDataToIframe = {
            eventName: "rexlive:update_button_page",
            data_to_send: {
                reverseButtonData: jQuery.extend(true, {}, reverseData),
                actionButtonData: jQuery.extend(true, {}, buttonData)
            }
        };
        reverseData = jQuery.extend(true, {}, buttonDataToIframe.data_to_send.actionButtonData);
        console.log(buttonDataToIframe);
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(buttonDataToIframe);
    };

    var _updateButtonLive = function (data) {
        var buttonDataToIframe = {
            eventName: "rexlive:updateButtonLive",
            data_to_send: {
                buttonTarget: buttonData.buttonTarget,
                propertyType: data.type,
                propertyName: data.name,
                newValue: data.value
            }
        };
        console.log(buttonDataToIframe);
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(buttonDataToIframe);
    }

    var _removeSeparateButton = function () {
        var buttonDataToIframe = {
            eventName: "rexlive:remove_separate_button",
            data_to_send: {
                buttonTarget: buttonData.buttonTarget
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(buttonDataToIframe);
    }

    var _separateButton = function () {
        var newID = _createNewButtonID();
        _updateButtonsIDSUsed({id: newID});
    }

    var _closeModal = function () {
        Rexlive_Modals_Utils.closeModal(
            button_editor_properties.$self.parent(".rex-modal-wrap")
        );
    };

    var _linkDocumentListeners = function () {
        button_editor_properties.$create_new_button.on("click", function () {
            // aprire il pannello con i dati del pulsante di default, poi chiede il nome
            addingNewButton = true;
            editingModelButton = false;
            _clearButtonData();
            _updateButtonData(defaultButtonData);
            _updatePanel();
            Rexlive_Modals_Utils.openModal(
                button_editor_properties.$self.parent(".rex-modal-wrap")
            );
        });
        
        button_editor_properties.$reset_button.on("click", function () {
            //resetta le modifiche (quindi serve salvare stato iniziale)
            buttonData = jQuery.extend(true, {}, resetData);
            _updatePanel();
            _applyData();
            //resettare anche il pulsante in live? si
        });
        
        button_editor_properties.$add_model_button.on("click", function () {
            //recuperare nome modello inserito
            //se arriva pulsante in pagina nulla / se arriva da + creare nuovo ID
            //salvare nel db
            // chiude
            console.log("add model button");
            _updateButtonDataFromPanel();
            if (!addingNewButton){
                if (!editingModelButton){
                    _saveButtonOnDB();
                } else {
                    //crea nuovo modello?
                }
            }
        });

        // Quando chiedo se staccare il pulsante dalla sincronia -> alla chiusura del pannello col tasto in basso o in alto
        button_editor_properties.$close_button.on("click", function () {
            //chiudere il pannello
            console.log("close button");
            if (!addingNewButton) {
                _updateButtonDataFromPanel();
                if (editingModelButton && !(_checkEditsModel())) {
                    _openChooseButtonEdit();
                } else {
                    _applyData();
                    _closeModal();
                }
            } else {
                _closeModal();
            }
        });

        button_editor_properties.$apply_changes_button.on("click", function () {
            // - se ha modificato un pulsante modello si chiede all'utente se staccare o sincronizzare crea ID
            // - chiude
            if (!addingNewButton) {
                console.log("apply button");
                _updateButtonDataFromPanel();
                if (editingModelButton && !(_checkEditsModel())) {
                    _openChooseButtonEdit();
                } else {
                    _applyData();
                    _closeModal();
                }
            } else {
                Button_Name_Modal.openModal();
            }
        });
    };

    var _createNewButtonID = function () {
        var newID = "";
        var flag;
        var i;
        do {
            flag = true;
            newID = Rexbuilder_Util_Admin_Editor.createRandomID(4);
            for (i = 0; i < buttonsIDsUsed.length; i++) {
                if (newID == buttonsIDsUsed[i]) {
                    flag = false;
                    break;
                }
            }
        } while (!flag);
        return newID;
    }

    var _init = function () {
        var $self = $("#rex-button-editor");
        var $container = $self;
        button_editor_properties = {
            $self: $self,
            $close_button: $container.find(".rex-cancel-button"),
            $reset_button: $container.find(".rex-reset-button"),
            $create_new_button: $("#rex-add-new-button"),
            $add_model_button: $container.find(".add-rex-button-model"),
            $apply_changes_button: $container.find(".rex-apply-button"),

            $button_label_text: $container.find("#rex-button__label"),
            $button_label_text_size: $container.find("#rex-button_text_font_size"),
            $button_label_text_color_value: $container.find("#rex-button-text-color"),
            $button_label_text_color_runtime: $container.find("#rex-button-text-color-runtime"),
            $button_label_text_color_preview: $container.find("#rex-button-text-color-preview-icon"),

            $button_preview_background: $container.find("#rex-button-preview-background"),

            $button_height: $container.find("#rex-button-height"),

            $button_preview_background_hover: $container.find("#rex-button-preview-background-hover"),

            $button_preview_border: $container.find("#rex-button-border-preview"),
            $button_border_width: $container.find("#rex-button-border-width"),
            $button_border_radius: $container.find("#rex-button-border-radius"),

            $button_margin_top: $container.find("#rex-button-margin-top-radius"),
            $button_margin_bottom: $container.find("#rex-button-margin-bottom-radius"),

            $button_link_target: $container.find("#rex-button-link-target"),
            $button_link_type: $container.find("#rex-button-link-type"),

            $button_name: $container.find("#rex-button__name")
        };

        rexButtonsJSON = JSON.parse($("#rex-buttons-json-css").text());
        buttonsIDsUsed = JSON.parse($("#rex-buttons-ids-used").text());
        _linkDocumentListeners();

        buttonData = {
            text_color: "",
            text: "",
            font_size: "",
            background_color: "",
            button_height: "",
            hover_color: "",
            border_color: "",
            border_width: "",
            border_radius: "",
            margin_top: "",
            margin_bottom: "",
            link_taget: "",
            link_type: "",
            buttonTarget: {
                button_name: "",
                button_id: "",
                button_number: 0,
            }
        };

        defaultButtonData = {
            separateButton: true,
            buttonInfo: {
                text_color: "white",
                text: "LABEL",
                font_size: "24px",
                background_color: "#ff6868",
                button_height: "60px",
                hover_color: "#003fff",
                border_color: "rgb(0,120,255)",
                border_width: "5px",
                border_radius: "30px",
                margin_top: "0px",
                margin_bottom: "10px",
                link_taget: "",
                link_type: "_parent",
                buttonTarget: {
                    button_name: "",
                    button_id: "",
                    button_number: 0,
                }
            }
        }

        _linkTextInputs();
        _linkNumberInputs();
        _linkDropDownMenus();
        _linkTextColorEditor();
        
        _initPanelChoose();
    };

    return {
        init: _init,
        openButtonEditorModal: _openButtonEditorModal,
        createNewButton: _createNewButton,
        // servono per il debug, dopo non verranno esportate
        applyData: _applyData,
        createCSSbutton: _createCSSbutton,
        createButtonHtml: _createButtonHtml
    };
})(jQuery);
