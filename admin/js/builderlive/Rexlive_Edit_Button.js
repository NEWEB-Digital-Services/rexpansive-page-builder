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
            switch (optionSelected) {
                case "remove":
                    _separateRexButton();
                    break;
                case "edit":
                    editingModelButton = true;
                    button_editor_properties.$add_model_button.addClass("editing-model");
                    Rexlive_Modals_Utils.openModal(
                        button_editor_properties.$self.parent(".rex-modal-wrap")
                    );
                    _staySynchronized();
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
    var reverseData;
    var resetData;
    var editingModelButton;
    var alreadyChooseToSynchronize;

    var _openButtonEditorModal = function (data) {
        alreadyChooseToSynchronize = false;
        _updateButtonEditorModal(data);
        if (!editingModelButton || alreadyChooseToSynchronize) {
            Rexlive_Modals_Utils.openModal(
                button_editor_properties.$self.parent(".rex-modal-wrap")
            );
        } else {
            _openChooseButtonEdit();
        }
    };

    var _closeModal = function () {
        Rexlive_Modals_Utils.closeModal(
            button_editor_properties.$self.parent(".rex-modal-wrap")
        );
    };

    var _updateButtonEditorModal = function (data) {
        editingModelButton = false;
        _clearButtonData();
        _updateButtonData(data);
        _updatePanel();
        _verifyTextBoxEffectsOnOpenModal();
    };        

    /* Change the status of textbox when the user change the link textbox */
    /* $("#rex-button-link-target").on("change", function() {
        var valueRefreshTargetLinkBox = $("#rex-button-link-target").val();
        if(valueRefreshTargetLinkBox == "" || valueRefreshTargetLinkBox == null || valueRefreshTargetLinkBox == undefined){
            $(".rexbutton-cont_row45").find("#rex-button-link-target").removeClass("activeinput");
        } else {
            $(".rexbutton-cont_row45").find("#rex-button-link-target").addClass("activeinput");
        }
    }); */

    /* Change the status of textbox when the user change the name model textbox */
    /* $("#rex-button__name").on("change", function() {
        var valueRefreshButtonNameBox = $("#rex-button__name").val();
        if(valueRefreshButtonNameBox == "" || valueRefreshButtonNameBox == null || valueRefreshButtonNameBox == undefined){
            $(".rexbutton-cont_row77").find("#rex-button__name").removeClass("activeinput");
        } else {
            $(".rexbutton-cont_row77").find("#rex-button__name").addClass("activeinput");
        }
    }); */

    /* Change the status of the two textbox (link, namemodel) depending on the value they contain */
    var _verifyTextBoxEffectsOnOpenModal = function () {
        var valueIntoTargetLinkBox = $("#rex-button-link-target").val();
        var valueIntoButtonNameBox = $("#rex-button__name").val();
        if(valueIntoTargetLinkBox == "" || valueIntoTargetLinkBox == null || valueIntoTargetLinkBox == undefined){
            $(".rexbutton-cont_row45").find(".prefix").removeClass("active");
            $(".rexbutton-cont_row45").find("#rex-button-link-target-label").removeClass("active");
            //$(".rexbutton-cont_row45").find("#rex-button-link-target").removeClass("activeinput");
        } else {
            $(".rexbutton-cont_row45").find(".prefix").addClass("active");
            $(".rexbutton-cont_row45").find("#rex-button-link-target-label").addClass("active");
            //$(".rexbutton-cont_row45").find("#rex-button-link-target").addClass("activeinput");
        }
        if(valueIntoButtonNameBox == "" || valueIntoButtonNameBox == null || valueIntoButtonNameBox == undefined){
            $(".rexbutton-cont_row77").find(".prefix").removeClass("active");
            $(".rexbutton-cont_row77").find("#rex-button__name-label").removeClass("active");
            //$(".rexbutton-cont_row77").find("#rex-button__name").removeClass("activeinput");
        } else {
            $(".rexbutton-cont_row77").find(".prefix").addClass("active");
            $(".rexbutton-cont_row77").find("#rex-button__name-label").addClass("active");
            //$(".rexbutton-cont_row77").find("#rex-button__name").addClass("activeinput");
        }
    }

    var _clearButtonData = function () {
        buttonData = {
            text_color: "",
            text: "",
            font_size: "",
            background_color: "",
            button_height: "",
            hover_color: "",
            hover_text: "",
            hover_border: "",
            border_color: "",
            border_width: "",
            border_radius: "",
            margin_top: "",
            margin_bottom: "",
            margin_right: "",
            margin_left: "",
            /* padding_top: "",
            padding_bottom: "",
            padding_right: "",
            padding_left: "", */
            link_target: "",
            link_type: "",
            buttonTarget: {
                button_name: "",
                button_id: "",
                button_number: 0,
            }
        };
    }

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
            buttonData.link_target = data.buttonInfo.link_target;
            buttonData.link_type = data.buttonInfo.link_type;
            for (i = 0; i < rexButtonsJSON.length; i++) {
                if (buttonID == rexButtonsJSON[i].rexID) {
                    buttonData.text_color = rexButtonsJSON[i].rules.element.text_color;
                    buttonData.font_size = rexButtonsJSON[i].rules.element.font_size;
                    buttonData.background_color = rexButtonsJSON[i].rules.element.background_color;
                    buttonData.button_height = rexButtonsJSON[i].rules.element.button_height;
                    buttonData.hover_color = rexButtonsJSON[i].rules.hover.background_color;
                    buttonData.hover_text = rexButtonsJSON[i].rules.hover.text_color;
                    buttonData.hover_border = rexButtonsJSON[i].rules.hover.border_color;
                    buttonData.border_color = rexButtonsJSON[i].rules.element.border_color;
                    buttonData.border_width = rexButtonsJSON[i].rules.element.border_width;
                    buttonData.border_radius = rexButtonsJSON[i].rules.element.border_radius;
                    buttonData.margin_top = rexButtonsJSON[i].rules.element.margin_top;
                    buttonData.margin_bottom = rexButtonsJSON[i].rules.element.margin_bottom;
                    buttonData.margin_right = rexButtonsJSON[i].rules.element.margin_right;
                    buttonData.margin_left = rexButtonsJSON[i].rules.element.margin_left;
                    /* buttonData.padding_top = rexButtonsJSON[i].rules.element.padding_top;
                    buttonData.padding_bottom = rexButtonsJSON[i].rules.element.padding_bottom;
                    buttonData.padding_right = rexButtonsJSON[i].rules.element.padding_right;
                    buttonData.padding_left = rexButtonsJSON[i].rules.element.padding_left; */
                    buttonData.buttonTarget.button_name = rexButtonsJSON[i].buttonName;
                    break;
                }
            }
            if (typeof data.buttonInfo.synchronize != "undefined") {
                alreadyChooseToSynchronize = data.buttonInfo.synchronize.toString() == "true";
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
        button_editor_properties.$button_margin_right.val(buttonData.margin_right.replace('px', ''));
        button_editor_properties.$button_margin_left.val(buttonData.margin_left.replace('px', ''));
        button_editor_properties.$button_margin_bottom.val(buttonData.margin_bottom.replace('px', ''));
        /* button_editor_properties.$button_padding_top.val(buttonData.padding_top.replace('px', ''));
        button_editor_properties.$button_padding_right.val(buttonData.padding_right.replace('px', ''));
        button_editor_properties.$button_padding_left.val(buttonData.padding_left.replace('px', ''));
        button_editor_properties.$button_padding_bottom.val(buttonData.padding_bottom.replace('px', '')); */
        button_editor_properties.$button_link_target.val(buttonData.link_target);
        button_editor_properties.$button_link_type.val(buttonData.link_type);
        button_editor_properties.$button_name.val(buttonData.buttonTarget.button_name);
        //lasciarlo aggiornato? o fixato a 5px?
        button_editor_properties.$button_preview_border.css("border-width", buttonData.border_width);

        button_editor_properties.$button_label_text.css("color", buttonData.text_color);
        button_editor_properties.$button_label_text_color_value.val(buttonData.text_color);
        button_editor_properties.$button_label_text_color_preview.hide();
        button_editor_properties.$button_label_text_color_value.spectrum("set", buttonData.text_color);

        button_editor_properties.$button_preview_background_hover.css("background-color", buttonData.hover_color);
        button_editor_properties.$button_background_hover_color_value.val(buttonData.hover_color);
        button_editor_properties.$button_background_hover_color_value.spectrum("set", buttonData.hover_color);
        button_editor_properties.$button_background_hover_color_preview.hide();

        button_editor_properties.$button_preview_text_hover.css("background-color", buttonData.hover_text);
        button_editor_properties.$button_text_hover_color_value.val(buttonData.hover_text);
        button_editor_properties.$button_text_hover_color_value.spectrum("set", buttonData.hover_text);
        button_editor_properties.$button_text_hover_color_preview.hide();

        button_editor_properties.$button_preview_border_hover.css("background-color", buttonData.hover_border);
        button_editor_properties.$button_border_hover_color_value.val(buttonData.hover_border);
        button_editor_properties.$button_border_hover_color_value.spectrum("set", buttonData.hover_border);
        button_editor_properties.$button_border_hover_color_preview.hide();

        button_editor_properties.$button_preview_background.css("background-color", buttonData.background_color);
        button_editor_properties.$button_background_color_value.val(buttonData.background_color);
        button_editor_properties.$button_background_color_preview.hide();
        button_editor_properties.$button_background_color_value.spectrum("set", buttonData.background_color);

        button_editor_properties.$button_preview_border.css("border-color", buttonData.border_color);
        button_editor_properties.$button_border_color_value.val(buttonData.border_color);
        button_editor_properties.$button_border_color_preview.hide();
        button_editor_properties.$button_border_color_value.spectrum("set", buttonData.border_color);

        if (editingModelButton) {
            if (!button_editor_properties.$add_model_button.hasClass("editing-model")) {
                button_editor_properties.$add_model_button.addClass("editing-model");
            }
        } else {
            button_editor_properties.$add_model_button.removeClass("editing-model");
        }
    };

    var _updateButtonDataFromPanel = function () {
        buttonData.font_size = button_editor_properties.$button_label_text_size.val() + "px";
        buttonData.button_height = button_editor_properties.$button_height.val() + "px";
        buttonData.border_width = button_editor_properties.$button_border_width.val() + "px";
        buttonData.border_radius = button_editor_properties.$button_border_radius.val() + "px";
        buttonData.margin_top = button_editor_properties.$button_margin_top.val() + "px";
        buttonData.margin_bottom = button_editor_properties.$button_margin_bottom.val() + "px";
        buttonData.margin_right = button_editor_properties.$button_margin_right.val() + "px";
        buttonData.margin_left = button_editor_properties.$button_margin_left.val() + "px";
        /* buttonData.padding_top = button_editor_properties.$button_padding_top.val() + "px";
        buttonData.padding_bottom = button_editor_properties.$button_padding_bottom.val() + "px";
        buttonData.padding_right = button_editor_properties.$button_padding_right.val() + "px";
        buttonData.padding_left = button_editor_properties.$button_padding_left.val() + "px"; */
        buttonData.buttonTarget.button_name = button_editor_properties.$button_name.val();
        buttonData.text = button_editor_properties.$button_label_text.val();
        buttonData.link_target = button_editor_properties.$button_link_target.val();
        buttonData.link_type = button_editor_properties.$button_link_type.val();
        //colors data are already updated
    };

    /**
     * checks if buttons properties 
     */

    var _checkEditsModel = function () {
        if (
            // border
            resetData.border_width == buttonData.border_width &&
            resetData.border_radius == buttonData.border_radius &&
            resetData.border_color == buttonData.border_color &&
            // margins
            resetData.margin_top == buttonData.margin_top &&
            resetData.margin_bottom == buttonData.margin_bottom &&
            resetData.margin_right == buttonData.margin_right &&
            resetData.margin_left == buttonData.margin_left &&
            // paddings
            /* resetData.padding_top == buttonData.padding_top &&
            resetData.padding_bottom == buttonData.padding_bottom &&
            resetData.padding_right == buttonData.padding_right &&
            resetData.padding_left == buttonData.padding_left && */
            // name
            resetData.buttonTarget.button_name == buttonData.buttonTarget.button_name &&
            // button text
            resetData.font_size == buttonData.font_size &&
            resetData.text_color == buttonData.text_color &&
            // height
            resetData.button_height == buttonData.button_height &&
            // background            
            resetData.background_color == buttonData.background_color &&
            // hover
            resetData.hover_color == buttonData.hover_color &&
            // hover
            resetData.hover_text == buttonData.hover_text &&
            // hover
            resetData.hover_border == buttonData.hover_border
        ) {
            return true;
        }
        return false;
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // Linking panel tools
    ///////////////////////////////////////////////////////////////////////////////////////////////////

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
            if (!editingModelButton) {
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

        // PADDING TOP
        /* var _updatePaddingTop = function (newPaddingTop) {
            _updateButtonLive({
                type: "container",
                name: "padding-top",
                value: newPaddingTop + "px"
            });
        };
        _linkKeyDownListenerInputNumber(button_editor_properties.$button_padding_top, false);
        _linkKeyUpListenerInputNumber(button_editor_properties.$button_padding_top, _updatePaddingTop, false); */

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

        // PADDING BOTTOM
        /* var _updatePaddingBottom = function (newPaddingBottom) {
            _updateButtonLive({
                type: "container",
                name: "padding-bottom",
                value: newPaddingBottom + "px"
            });
        };
        _linkKeyDownListenerInputNumber(button_editor_properties.$button_padding_bottom, false);
        _linkKeyUpListenerInputNumber(button_editor_properties.$button_padding_bottom, _updatePaddingBottom, false); */

        // MARGIN LEFT
        var _updateMarginLeft = function (newMarginLeft) {
            _updateButtonLive({
                type: "container",
                name: "margin-left",
                value: newMarginLeft + "px"
            });
        };
        _linkKeyDownListenerInputNumber(button_editor_properties.$button_margin_left, false);
        _linkKeyUpListenerInputNumber(button_editor_properties.$button_margin_left, _updateMarginLeft, false);

        // PADDING LEFT
        /* var _updatePaddingLeft = function (newPaddingLeft) {
            _updateButtonLive({
                type: "container",
                name: "padding-left",
                value: newPaddingLeft + "px"
            });
        };
        _linkKeyDownListenerInputNumber(button_editor_properties.$button_padding_left, false);
        _linkKeyUpListenerInputNumber(button_editor_properties.$button_padding_left, _updatePaddingLeft, false); */

        // MARGIN RIGHT
        var _updateMarginRight = function (newMarginRight) {
            _updateButtonLive({
                type: "container",
                name: "margin-right",
                value: newMarginRight + "px"
            });
        };
        _linkKeyDownListenerInputNumber(button_editor_properties.$button_margin_right, false);
        _linkKeyUpListenerInputNumber(button_editor_properties.$button_margin_right, _updateMarginRight, false);

        // PADDING RIGHT
        /* var _updatePaddingRight = function (newPaddingRight) {
            _updateButtonLive({
                type: "container",
                name: "padding-right",
                value: newPaddingRight + "px"
            });
        };
        _linkKeyDownListenerInputNumber(button_editor_properties.$button_padding_right, false);
        _linkKeyUpListenerInputNumber(button_editor_properties.$button_padding_right, _updatePaddingRight, false); */


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
        var colorTEXT;
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
                colorTEXT = color.toRgbString();
                button_editor_properties.$button_label_text_color_preview.hide();
                button_editor_properties.$button_label_text.css("color", colorTEXT);
                _updateButtonLive({
                    type: "container",
                    name: "color",
                    value: colorTEXT
                });
            },
            change: function (color) {
            },
            hide: function (color) {
                buttonData.text_color = color.toRgbString();
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
                button_editor_properties.$button_label_text_color_value.spectrum("show");
                return false;
            }
        );
    }

    var _linkBackgroundColorEditor = function () {
        var colorTEXT;
        button_editor_properties.$button_background_color_value.spectrum({
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
                button_editor_properties.$button_background_color_preview.hide();
                button_editor_properties.$button_preview_background.css("background-color", colorTEXT);
                _updateButtonLive({
                    type: "background",
                    name: "background-color",
                    value: colorTEXT
                });
            },
            change: function (color) {
            },
            hide: function (color) {
                buttonData.background_color = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        button_editor_properties.$button_background_color_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            button_editor_properties.$button_background_color_value.spectrum('hide');
        });

        button_editor_properties.$button_background_color_preview.on(
            "click",
            function () {
                button_editor_properties.$button_background_color_value.spectrum("show");
                return false;
            }
        );
    }

    var _linkBackgroundHoverColorEditor = function () {
        var colorTEXT;
        button_editor_properties.$button_background_hover_color_value.spectrum({
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
                button_editor_properties.$button_background_hover_color_preview.hide();
                button_editor_properties.$button_preview_background_hover.css("background-color", colorTEXT);
                _updateButtonLive({
                    type: "backgroundHover",
                    name: "background-color",
                    value: colorTEXT
                });
            },
            change: function (color) {
            },
            hide: function (color) {
                buttonData.hover_color = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        button_editor_properties.$button_background_hover_color_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            button_editor_properties.$button_background_hover_color_value.spectrum('hide');
        });

        button_editor_properties.$button_background_color_preview.on(
            "click",
            function () {
                button_editor_properties.$button_background_hover_color_value.spectrum("show");
                return false;
            }
        );
    }

    var _linkBorderHoverColorEditor = function () {
        var colorTEXT;
        button_editor_properties.$button_border_hover_color_value.spectrum({
            replacerClassName: "btn-floating",
            preferredFormat: "hex",
            showPalette: false,
            showAlpha: true,
            showInput: true,
            showButtons: false,
            containerClassName:
                "rexbuilder-materialize-wrap block-border-color-picker",
            show: function () {
            },
            move: function (color) {
                colorTEXT = color.toRgbString();
                button_editor_properties.$button_border_hover_color_preview.hide();
                button_editor_properties.$button_preview_border_hover.css("background-color", colorTEXT);
                _updateButtonLive({
                    type: "borderHover",
                    name: "border-color",
                    value: colorTEXT
                });
            },
            change: function (color) {
            },
            hide: function (color) {
                buttonData.hover_border = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        button_editor_properties.$button_border_hover_color_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            button_editor_properties.$button_border_hover_color_value.spectrum('hide');
        });

        button_editor_properties.$button_border_color_preview.on(
            "click",
            function () {
                button_editor_properties.$button_border_hover_color_value.spectrum("show");
                return false;
            }
        );
    }

    var _linkTextHoverColorEditor = function () {
        var colorTEXT;
        button_editor_properties.$button_text_hover_color_value.spectrum({
            replacerClassName: "btn-floating",
            preferredFormat: "hex",
            showPalette: false,
            showAlpha: true,
            showInput: true,
            showButtons: false,
            containerClassName:
                "rexbuilder-materialize-wrap block-text-color-picker",
            show: function () {
            },
            move: function (color) {
                colorTEXT = color.toRgbString();
                button_editor_properties.$button_text_hover_color_preview.hide();
                button_editor_properties.$button_preview_text_hover.css("background-color", colorTEXT);
                _updateButtonLive({
                    type: "textHover",
                    name: "color",
                    value: colorTEXT
                });
            },
            change: function (color) {
            },
            hide: function (color) {
                buttonData.hover_text = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        button_editor_properties.$button_text_hover_color_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            button_editor_properties.$button_text_hover_color_value.spectrum('hide');
        });

        button_editor_properties.$button_text_hover_color_preview.on(
            "click",
            function () {
                button_editor_properties.$button_text_hover_color_value.spectrum("show");
                return false;
            }
        );
    }

    var _linkBorderColorEditor = function () {

        var colorTEXT;
        button_editor_properties.$button_border_color_value.spectrum({
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
                button_editor_properties.$button_border_color_preview.hide();
                button_editor_properties.$button_preview_border.css("border-color", colorTEXT);
                _updateButtonLive({
                    type: "background",
                    name: "border-color",
                    value: colorTEXT
                });
            },
            change: function (color) {
            },
            hide: function (color) {
                buttonData.border_color = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        button_editor_properties.$button_border_color_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            button_editor_properties.$button_border_color_value.spectrum('hide');
        });

        button_editor_properties.$button_border_color_preview.on(
            "click",
            function () {
                button_editor_properties.$button_border_color_value.spectrum("show");
                return false;
            }
        );
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // Saving functions, here are also functions to manage ids of buttons
    /////////////////////////////////////////////////////////////////////////////////////////////////////

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

                // Updates model list tab
                Button_Import_Modal.updateButtonList({
                    html: html_button,
                    buttonData: buttonData
                });
                // If not editing a model button, it means we are creating a new model, so we need to update the button separate as a model
                if (!editingModelButton) {
                    _removeSeparateButton();
                }

                button_editor_properties.$add_model_button.removeClass("saving-rex-button");
                _closeModal();
            },
            error: function (response) { },
            complete: function (response) { }
        });
    }

    /**
     * Updates array of ids used removing the passed ID.
     * 
     * @param {string} rexID Rexbutton ID to remove
     */
    var _removeIDButton = function(rexID){
        var pos = buttonsIDsUsed.indexOf(rexID)
        if(pos != -1){
            buttonsIDsUsed.splice(pos, 1);
        }
    }
    /**
     * Updates array of ids used adding the passed ID.
     * 
     * @param {string} rexID Rexbutton ID to add
     */
    var _addIDButton = function (newID) {
        buttonsIDsUsed.push(newID);
    }

    /**
     * Creates a new ID, adds to used IDs and updates on DB the used ids
     */
    var _separateRexButton = function () {
        var newID = _createNewButtonID();
        _addIDButton(newID)
        _updateButtonsIDSUsed({
            rexID: newID,
            separate: true
        });
    }

    /**
     * Ends separtion of rexbutton: tells iframe to change id of button and opens panel to edit a separate button
     * @param {string} rexID new id of rexbutton
     */
    var _endButtonSeparation = function (rexID) {

        _separateButton(rexID);
        // the button will be the first with the new ID
        _updateTarget({
            id: rexID, 
            number: 1
        });
        editingModelButton = false;
        _updatePanel();
        Rexlive_Modals_Utils.openModal(
            button_editor_properties.$self.parent(".rex-modal-wrap")
        );
    }

    /**
     * Ajax function to update used rexbuttons ids on db.
     * If passed an object as {separate: true, rexID: id of new button} on ajax call success will be end separation of rexbutton
     * @param {Obj} data 
     */
    var _updateButtonsIDSUsed = function (data) {
        var separatingButton = typeof data != "undefined" ? data.separate : false;
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
                if (separatingButton) {
                    _endButtonSeparation(data.rexID);
                }
            },
            error: function () { },
            complete: function () { }
        })
    }

    /**
     * Updates the button target to update
     * @param {Object} data data of target to update{id, number}
     */
    var _updateTarget = function (data) {
        buttonData.buttonTarget.button_id = data.id;
        buttonData.buttonTarget.button_number = data.number;
    }

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

    /**
     * Updates array containing buttons models options, used to gain css of models
     */
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
                    margin_right: buttonData.margin_right,
                    margin_left: buttonData.margin_left,
                    /* padding_top: buttonData.padding_top,
                    padding_bottom: buttonData.padding_bottom,
                    padding_right: buttonData.padding_right,
                    padding_left: buttonData.padding_left, */
                },
                hover: {
                    background_color: buttonData.hover_color,
                    text_color: buttonData.hover_text,
                    border_color: buttonData.hover_border,
                }
            }
        }
        rexButtonsJSON.push(data);
    }

    /**
     * Creates the Css for model and returns as String
     * @returns {string} Css for rexbutton model
     */
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
        buttonCSS += "margin-left: " + buttonData.margin_left + ";";
        buttonCSS += "margin-right: " + buttonData.margin_right + ";";
        /* buttonCSS += "padding-top: " + buttonData.padding_top + ";";
        buttonCSS += "padding-bottom: " + buttonData.padding_bottom + ";";
        buttonCSS += "padding-left: " + buttonData.padding_left + ";";
        buttonCSS += "padding-right: " + buttonData.padding_right + ";"; */
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
        buttonCSS += "border-color: " + buttonData.hover_border + ";";
        buttonCSS += "color: " + buttonData.hover_text + ";";
        buttonCSS += "}";

        return buttonCSS;
    }

    var _createButtonHtml = function () {
        var buttonHTML = "";
        tmpl.arg = "button";
        
        var defaults = {
            text: "Learn More",
            link_target: "#",
            link_type: "_blank"
        }

        var data = {
            text_color: buttonData.text_color,
            text: defaults.text,
            font_size: buttonData.font_size,
            button_height: buttonData.button_height,
            background_color: buttonData.background_color,
            hover_color: buttonData.hover_color,
            hover_text: buttonData.hover_text,
            hover_border: buttonData.hover_border,
            border_color: buttonData.border_color,
            border_width: buttonData.border_width,
            border_radius: buttonData.border_radius,
            margin_top: buttonData.margin_top,
            margin_bottom: buttonData.margin_bottom,
            margin_right: buttonData.margin_right,
            margin_left: buttonData.margin_left,
            /* padding_top: buttonData.padding_top,
            padding_bottom: buttonData.padding_bottom,
            padding_right: buttonData.padding_right,
            padding_left: buttonData.padding_left, */
            link_target: defaults.link_target,
            link_type: defaults.link_type,
            button_name: buttonData.buttonTarget.button_name,
            id: buttonData.buttonTarget.button_id,
        }

        buttonHTML = tmpl("tmpl-rex-button", data);
        return buttonHTML;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions that tell to iframe what to do
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    var _staySynchronized = function () {
        var buttonDataToIframe = {
            eventName: "rexlive:lock_synchronize_on_button",
            data_to_send: {
                buttonTarget: buttonData.buttonTarget
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(buttonDataToIframe);
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

    var _separateButton = function(rexID){
        var buttonDataToIframe = {
            eventName: "rexlive:separate_rex_button",
            data_to_send: {
                newID: rexID,
                buttonData: buttonData
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(buttonDataToIframe);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //  DOCUMENT LISTENERS
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    var _linkDocumentListeners = function () {
        /**
         * Reset Panel with data when was opened, updates button in page
         */
        button_editor_properties.$reset_button.on("click", function () {
            buttonData = jQuery.extend(true, {}, resetData);
            _updatePanel();
            _applyData();
        });

        /**
         * Saves current detached button as model
         */
        button_editor_properties.$add_model_button.on("click", function () {
            _updateButtonDataFromPanel();
            _saveButtonOnDB();
        });

        /**
         * Applyes changes to button and, if button is model, updates DB
         */
        button_editor_properties.$close_button.on("click", function () {
            _updateButtonDataFromPanel();
            _applyData();
            if (editingModelButton) {
                _saveButtonOnDB();
            }
            _closeModal();
        });

        /**
         * Applyes changes to button and, if button is model, updates DB
         */
        button_editor_properties.$apply_changes_button.on("click", function () {
            _updateButtonDataFromPanel();
            _applyData();
            if (editingModelButton) {
                _saveButtonOnDB();
            }
            _closeModal();
        });
    };

    var _init = function () {
        var $self = $("#rex-button-editor");
        var $accordions = $self.find('.rexpansive-accordion');
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
            $button_background_color_value: $container.find("#rex-button-background-color"),
            $button_background_color_runtime: $container.find("#rex-button-background-color-runtime"),
            $button_background_color_preview: $container.find("#rex-button-background-color-preview-icon"),

            $button_height: $container.find("#rex-button-height"),

            $button_preview_background_hover: $container.find("#rex-button-preview-background-hover"),
            $button_background_hover_color_value: $container.find("#rex-button-background-hover-color"),
            $button_background_hover_color_runtime: $container.find("#rex-button-background-hover-color-runtime"),
            $button_background_hover_color_preview: $container.find("#rex-button-background-hover-color-preview-icon"),

            $button_preview_text_hover: $container.find("#rex-button-preview-text-hover"),
            $button_text_hover_color_value: $container.find("#rex-button-text-hover-color"),
            $button_text_hover_color_runtime: $container.find("#rex-button-text-hover-color-runtime"),
            $button_text_hover_color_preview: $container.find("#rex-button-text-hover-color-preview-icon"),

            $button_preview_border_hover: $container.find("#rex-button-preview-border-hover"),
            $button_border_hover_color_value: $container.find("#rex-button-border-hover-color"),
            $button_border_hover_color_runtime: $container.find("#rex-button-border-hover-color-runtime"),
            $button_border_hover_color_preview: $container.find("#rex-button-border-hover-color-preview-icon"),

            $button_preview_border: $container.find("#rex-button-border-preview"),
            $button_border_color_value: $container.find("#rex-button-border-color"),
            $button_border_color_runtime: $container.find("#rex-button-border-color-runtime"),
            $button_border_color_preview: $container.find("#rex-button-color-preview-icon"),

            $button_border_width: $container.find("#rex-button-border-width"),
            $button_border_radius: $container.find("#rex-button-border-radius"),

            $button_margin_top: $container.find("#rex-button-margin-top-radius"),
            $button_margin_right: $container.find("#rex-button-margin-right-radius"),
            $button_margin_bottom: $container.find("#rex-button-margin-bottom-radius"),
            $button_margin_left: $container.find("#rex-button-margin-left-radius"),

            /* $button_padding_top: $container.find("#rex-button-padding-top-radius"),
            $button_padding_right: $container.find("#rex-button-padding-right-radius"),
            $button_padding_bottom: $container.find("#rex-button-padding-bottom-radius"),
            $button_padding_left: $container.find("#rex-button-padding-left-radius"), */

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
            hover_text: "",
            hover_border: "",
            border_color: "",
            border_width: "",
            border_radius: "",
            margin_top: "",
            margin_bottom: "",
            margin_left: "",
            margin_right: "",
            /* padding_top: "",
            padding_bottom: "",
            padding_left: "",
            padding_right: "", */
            link_target: "",
            link_type: "",
            buttonTarget: {
                button_name: "",
                button_id: "",
                button_number: 0,
            }
        };

        _linkTextInputs();
        _linkNumberInputs();
        _linkDropDownMenus();

        _linkTextColorEditor();
        _linkBackgroundColorEditor();
        _linkBackgroundHoverColorEditor();
        _linkBorderHoverColorEditor();
        _linkTextHoverColorEditor();
        _linkBorderColorEditor();

        _initPanelChoose();

        $accordions.rexAccordion({open:{},close:{},});
        //console.log("$accordions:",$accordions);
    };

    return {
        init: _init,
        openButtonEditorModal: _openButtonEditorModal
    };
})(jQuery);