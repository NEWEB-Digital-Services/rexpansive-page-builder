/**
 * Editor for the buttons
 * @since 2.0.0
 */
var Button_Edit_Modal = (function ($) {
    "use strict";

    var button_editor_properties;
    var buttonData;
    var rexButtonsJSON;

    var _openButtonEditorModal = function (data) {
        console.log(data);
        _updateButtonEditorModal(data);
        Rexlive_Modals_Utils.openModal(
            button_editor_properties.$self.parent(".rex-modal-wrap")
        );
    };

    var _updateButtonEditorModal = function (data) {
        _clearButtonData();
        _updateButtonData(data);
        //aggiornare il pannello
    };
    
    var _updateButtonData = function(data){
        if (data.separateButton.toString() == "true") {
            buttonData = jQuery.extend(true, {}, data.buttonInfo);
        } else {
            var i;
            var buttonID = data.buttonInfo.buttonTarget.button_id
            for (i = 0; i < rexButtonsJSON.length; i++) {
                if (buttonID == rexButtonsJSON[i].rexID) {
                    buttonData.buttonTarget = jQuery.extend(true, {}, data.buttonInfo.buttonTarget);
                    buttonData.text_color = rexButtonsJSON[i].rules.element.text_color;
                    buttonData.text = data.buttonInfo.text;
                    buttonData.font_size = rexButtonsJSON[i].rules.element.font_size;
                    buttonData.background_color = rexButtonsJSON[i].rules.element.background_color;
                    buttonData.button_height = rexButtonsJSON[i].rules.element.button_height;
                    buttonData.hover_color = rexButtonsJSON[i].rules.hover.background_color;
                    buttonData.border_color = rexButtonsJSON[i].rules.element.border_color;
                    buttonData.border_width = rexButtonsJSON[i].rules.element.border_width;
                    buttonData.border_radius = rexButtonsJSON[i].rules.element.border_radius;
                    buttonData.margin_top = rexButtonsJSON[i].rules.element.margin_top;
                    buttonData.margin_bottom = rexButtonsJSON[i].rules.element.margin_bottom;
                    buttonData.link_taget = data.buttonInfo.link_taget;
                    buttonData.link_type = data.buttonInfo.link_type;
                    break;
                }
            }
        }
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
        _updateJSONCSS();
        $.ajax({
            type: "POST",
            dataType: "json",
            url: live_editor_obj.ajaxurl,
            data: {
                action: "rex_update_button",
                nonce_param: live_editor_obj.rexnonce,
                id_button: data.buttonTarget.button_id,
                html_button: buttonData.html,
                css_button: _createCSSbutton(),
                name_button: buttonData.buttonTarget.button_name,
                jsonCSS: JSON.stringify(rexButtonsJSON)
            },
            success: function (response) {
                // solo togliere il loader sul pulsante di salvataggio
            },
            error: function (response) { },
            complete: function (response) { }
        });
    }

    var _updateJSONCSS = function(){
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

        buttonCSS += "." + buttonID + "-rex-button-container{";
        buttonCSS += "font-size: " + buttonData.font_size + ";";
        buttonCSS += "color: " + buttonData.text_color + ";";
        buttonCSS += "background-color: " + buttonData.background_color + ";";
        buttonCSS += "height: " + buttonData.button_height + ";";
        buttonCSS += "border-width: " + buttonData.border_width + ";";
        buttonCSS += "border-color: " + buttonData.border_color + ";";
        buttonCSS += "border-radius: " + buttonData.border_radius + ";";
        buttonCSS += "margin-top: " + buttonData.margin_top + ";";
        buttonCSS += "margin-bottom: " + buttonData.margin_bottom + ";";
        buttonCSS += "}"
        
        buttonCSS += "." + buttonID + "-rex-button-container:hover{";
        buttonCSS += "background-color: " + buttonData.hover_color + ";";
        buttonCSS += "color: " + buttonData.text_color + ";";
        buttonCSS += "}";
        return buttonCSS;
    }

    var _applyData = function () {
        var buttonDataToIframe = {
            eventName: "rexlive:update_button",
            data_to_send: jQuery.extend(true, {}, buttonData)
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(buttonDataToIframe);
    };

    var _closeModal = function () {
        Rexlive_Modals_Utils.closeModal(
            button_editor_properties.$self.parent(".rex-modal-wrap")
        );
    };

    var _linkDocumentListeners = function () {
        button_editor_properties.$close_button.on("click", function () {
            _closeModal();
        });
        button_editor_properties.$cancel_button.on("click", function () {
            _closeModal();
        })
    };

    var _init = function () {
        var $self = $("#rex-button-editor");
        var $container = $self;
        button_editor_properties = {
            $self: $self,
            $close_button: $container.find(".rex-modal__close-button"),
            $cancel_button: $container.find(".rex-cancel-button")
        };
        rexButtonsJSON = JSON.parse($("#rex-buttons-json-css").text());

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
    };

    return {
        init: _init,
        openButtonEditorModal: _openButtonEditorModal,
        // servono per il debug, dopo non verranno esportate
        applyData: _applyData,
        createCSSbutton: _createCSSbutton,
        saveButtonOnDB: _saveButtonOnDB,
        buttonData: buttonData
    };
})(jQuery);
