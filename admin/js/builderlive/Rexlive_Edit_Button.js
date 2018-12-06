/**
 * Editor for the buttons
 * @since 2.0.0
 */
var Button_Edit_Modal = (function ($) {
    "use strict";

    var button_editor_properties;
    var buttonData;
    var rexButtonsJSON;
    var buttonsIDsUsed;
    var defaultButtonData;
    var reverseData;
    var resetData;

    var _openButtonEditorModal = function (data) {
        _updateButtonEditorModal(data);

        Rexlive_Modals_Utils.openModal(
            button_editor_properties.$self.parent(".rex-modal-wrap")
        );
    };

    var _updateButtonEditorModal = function (data) {
        _clearButtonData();
        _updateButtonData(data);
        _updatePanel();
    };
    
    var _updateButtonData = function(data){
        if (data.separateButton.toString() == "true") {
            buttonData = jQuery.extend(true, {}, data.buttonInfo);
        } else {
            var i;
            var buttonID = data.buttonInfo.buttonTarget.button_id;
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
        console.log(buttonData);
        reverseData = jQuery.extend(true, {}, buttonData);
        resetData = jQuery.extend(true, {}, buttonData);
    }
    
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
    }

    var _buttonTextEditor = function () {
        
    }
    
    var _updateButtonName = function () {
        buttonData.buttonTarget.button_name = button_editor_properties.$button_name.val();
    }

    var _clearButtonData = function(){
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
        _updateIDs();
        _updatejsonRexButtons();
        console.log(_createCSSbutton());
        console.log(_createButtonHtml())
        console.log(buttonData.buttonTarget.button_id);
        console.log(rexButtonsJSON);

        $.ajax({
            type: "POST",
            dataType: "json",
            url: live_editor_obj.ajaxurl,
            data: {
                action: "rex_update_button",
                nonce_param: live_editor_obj.rexnonce,
                id_button: buttonData.buttonTarget.button_id,
                html_button: _createButtonHtml(),
                css_button: _createCSSbutton(),
                jsonRexButtons: JSON.stringify(rexButtonsJSON),
            },
            success: function (response) {
                // solo togliere il loader sul pulsante di salvataggio
            },
            error: function (response) { },
            complete: function (response) { }
        });
    }

    var _updateIDs = function () {
        
        /*
        inutile?

        var i;
        for (i = 0; i < buttonsIDsUsed; i++){
            if (buttonsIDsUsed[i] == buttonData.buttonTarget.button_id){
                break;
            }
        }

        if (i == buttonsIDsUsed.length){
            buttonsIDsUsed.push(buttonData.buttonTarget.button_id);
        } 
        */
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
                // solo togliere il loader sul pulsante di salvataggio
            },
            error: function () { },
            complete: function () { }
        });
    }

    var _updatejsonRexButtons = function(){
        var buttonID = buttonData.buttonTarget.button_id;
        var i;
        for(i=0; i<rexButtonsJSON.length; i++){
            if(buttonID == rexButtonsJSON[i].rexID){
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

        buttonCSS = ".rex-button-wrapper[data-rex-button-id=\""+buttonID+"\"]";
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
            text: buttonData.text,
            font_size: buttonData.font_size,
            button_height: buttonData.button_height,
            background_color: buttonData.background_color,
            hover_color: buttonData.hover_color,
            border_color: buttonData.border_color,
            border_width: buttonData.border_width,
            border_radius: buttonData.border_radius,
            margin_top: buttonData.margin_top,
            margin_bottom: buttonData.margin_bottom,
            link_taget: buttonData.link_taget,
            link_type: buttonData.link_type,
            button_name: buttonData.buttonTarget.button_name,
            id: buttonData.buttonTarget.button_id,
        });
        return buttonHTML;
    }

    var _applyData = function () {
        var buttonDataToIframe = {
            eventName: "rexlive:update_button",
            data_to_send: {
                reverseButtonData: jQuery.extend(true, {}, reverseData),
                actionButtonData: jQuery.extend(true, {}, buttonData)
            }
        };
        reverseData = jQuery.extend(true, {}, buttonDataToIframe.data_to_send.actionButtonData);
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(buttonDataToIframe);
    };

    var _removeSeparateButton = function () {
        var buttonDataToIframe = {
            eventName: "rexlive:remove_separate_button",
            data_to_send: {
                buttonTarget: buttonData.buttonTarget
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(buttonDataToIframe);
    }

    var _closeModal = function () {
        Rexlive_Modals_Utils.closeModal(
            button_editor_properties.$self.parent(".rex-modal-wrap")
        );
    };

    var _linkDocumentListeners = function () {
        // Quando chiedo se staccare il pulsante dalla sincronia -> alla chiusura del pannello col tasto in basso o in alto
        button_editor_properties.$create_new_button.on("click", function () {
            // aprire il pannello con i dati del pulsante di default, poi chiede il nome
            _openButtonEditorModal(defaultButtonData);
        });
        button_editor_properties.$close_button.on("click", function () {
            //chiudere il pannello
            console.log("close button");
            _closeModal();
        });
        button_editor_properties.$reset_button.on("click", function () {
            //resetta le modifiche (quindi serve salvare stato iniziale)
            console.log("reset button");
        });
        button_editor_properties.$add_model_button.on("click", function () {
            //recuperare nome modello inserito
            //se arriva pulsante in pagina nulla / se arriva da + creare nuovo ID
            //salvare nel db
            // chiude
            console.log("add model button");
            _saveButtonOnDB();
            _removeSeparateButton();
        });
        button_editor_properties.$apply_changes_button.on("click", function () {
            // - se ha modificato un pulsante modello si chiede all'utente se staccare o sincronizzare crea ID
            // - chiude
            console.log("apply button");
            var buttonDataToIframe = {
                eventName: "rexlive:separate_rex_button",
                data_to_send: {
                    newID: _createNewButtonID(),
                    buttonData: buttonData
                }
            };
            Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(buttonDataToIframe);
            
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
        buttonsIDsUsed.push(newID);
        _updateIDs();
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
        console.log(rexButtonsJSON);
        console.log(buttonsIDsUsed);
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
    };

    return {
        init: _init,
        openButtonEditorModal: _openButtonEditorModal,
        // servono per il debug, dopo non verranno esportate
        applyData: _applyData,
        createCSSbutton: _createCSSbutton,
        saveButtonOnDB: _saveButtonOnDB,
        buttonData: buttonData,
        createButtonHtml: _createButtonHtml,
        updateButtonName: _updateButtonName
    };
})(jQuery);
