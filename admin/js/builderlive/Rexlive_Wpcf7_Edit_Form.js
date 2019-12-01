/**
 * Edit wpcf7 forms
 * @since x.x.x
 */
var Wpcf7_Edit_Form_Modal = (function ($) {
    "use strict";
    var wpcf7_form_editor_properties;
    var elementData;
    var formData;
    var reverseData;
    var resetData;
    var formMailSettings;
    var formMessages;

    ///////////////////////////////////////////////////////////////////////////////////////////////
    /// AJAX Calls
    
    var _getFormSettings = function (formID) {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: live_editor_obj.ajaxurl,
            data: {
              action: "rex_wpcf7_get_mail_settings",
              nonce_param: live_editor_obj.rexnonce,
              form_id: formID
            },
            beforeSend: function() {
                wpcf7_form_editor_properties.$self.addClass('rex-modal--loading');
            },
            success: function(response) {
              if (response.success) {
                formMailSettings = response.data.mail_settings[0];
                formMessages = response.data.messages[0];

                wpcf7_form_editor_properties.$form_mail_to.val(formMailSettings.recipient);
                if (wpcf7_form_editor_properties.$form_mail_to.val() != "") {
                    wpcf7_form_editor_properties.$form_mail_to
                    .siblings("label, .prefix")
                    .addClass('active');
                }
                wpcf7_form_editor_properties.$form_error_message.val(formMessages.validation_error);
                if (wpcf7_form_editor_properties.$form_error_message.val() != "") {
                    wpcf7_form_editor_properties.$form_error_message
                    .siblings("label, .prefix")
                    .addClass('active');
                }
                wpcf7_form_editor_properties.$form_send_message.val(formMessages.mail_sent_ok);
                if (wpcf7_form_editor_properties.$form_send_message.val() != "") {
                    wpcf7_form_editor_properties.$form_send_message
                    .siblings("label, .prefix")
                    .addClass('active');
                }
              }
            },
            error: function(response) {},
            complete: function (response) {
                wpcf7_form_editor_properties.$self.removeClass('rex-modal--loading');
            }
        });
    }

    var _saveFormSettings = function () {
        var formID = elementData.element_target.element_id;

        // Mail settings
        formMailSettings.recipient = wpcf7_form_editor_properties.$form_mail_to.val();

        // Messages
        formMessages.validation_error = wpcf7_form_editor_properties.$form_error_message.val();
        formMessages.mail_sent_ok = wpcf7_form_editor_properties.$form_send_message.val();

        $.ajax({
            type: "POST",
            dataType: "json",
            url: live_editor_obj.ajaxurl,
            data: {
              action: "rex_wpcf7_save_mail_settings",
              nonce_param: live_editor_obj.rexnonce,
              form_id: formID,
              new_mail_settings: formMailSettings,
              new_messages: formMessages
            },
            success: function(response) {
              if (response.success) {}
            },
            error: function(response) {}
        });
    }

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

    /////////////////////////////////////////////////////////////////////////////////////////////////
    /// Modal Functions
    /////////////////////////////////////////////////////////////////////////////////////////////////

    var blockID;

    var _openFormEditorModal = function (data) {
        elementData = data.elementData;
        blockID = data.blockID;

        _updateFormEditorModal(elementData);

        var formID = elementData.element_target.element_id;
        _getFormSettings(formID);
        Rexlive_Modals_Utils.openModal(wpcf7_form_editor_properties.$self.parent(".rex-modal-wrap"), false);
    }

    var _closeModal = function () {
        Rexlive_Modals_Utils.closeModal(
            wpcf7_form_editor_properties.$self.parent(".rex-modal-wrap"),
            false,
            [],
            blockID
        );
    };

    var _applyChanges = function () {
        var formDataToIframe = {
            eventName: "rexlive:update_wcpf7_page",
            data_to_send: {
                reverseFormData: jQuery.extend(true, {}, reverseData),
                actionFormData: jQuery.extend(true, {}, elementData)
            }
        };
        reverseData = jQuery.extend(true, {}, formDataToIframe.data_to_send.actionFormData);
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(formDataToIframe);
    };

    var _updateFormEditorModal = function (data) {
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
        elementData = jQuery.extend(true, {}, data);
        reverseData = jQuery.extend(true, {}, elementData);
        resetData = jQuery.extend(true, {}, elementData);
    };

    var _updatePanel = function () {
        /* Whole Form Options */
        // E-Mail
        if (wpcf7_form_editor_properties.$form_mail_to.val() != "") {
            wpcf7_form_editor_properties.$form_mail_to
                .siblings("label, .prefix")
                .addClass('active');
        }

        // Input Preview
        wpcf7_form_editor_properties.$input_preview.css({
            color: elementData.wpcf7_data.content.text_color,
            'font-size': elementData.wpcf7_data.content.font_size,
            'background-color': elementData.wpcf7_data.content.background_color,
            'border-color': elementData.wpcf7_data.content.border_color,
            'border-width': elementData.wpcf7_data.content.border_width,
            'border-radius': elementData.wpcf7_data.content.border_radius
        });

        wpcf7_form_editor_properties.$input_preview.hover(function() {
            $(this).css({
                color: elementData.wpcf7_data.content.text_color_hover,
                'background-color': elementData.wpcf7_data.content.background_color_hover,
                'border-color': elementData.wpcf7_data.content.border_color_hover
            });
        }, function() {
            $(this).css({
                color: elementData.wpcf7_data.content.text_color,
                'background-color': elementData.wpcf7_data.content.background_color,
                'border-color': elementData.wpcf7_data.content.border_color
            });
        });

        // Background Color
        wpcf7_form_editor_properties.$form_preview_background.css("background-color", elementData.wpcf7_data.background_color);
        wpcf7_form_editor_properties.$form_background_color_value.val(elementData.wpcf7_data.background_color);
        wpcf7_form_editor_properties.$form_background_color_preview.hide();
        wpcf7_form_editor_properties.$form_background_color_value.spectrum("set", elementData.wpcf7_data.background_color);

        // Border Color
        wpcf7_form_editor_properties.$form_preview_border_color.css("background-color", elementData.wpcf7_data.border_color);
        wpcf7_form_editor_properties.$form_border_color_value.val(elementData.wpcf7_data.border_color);
        wpcf7_form_editor_properties.$form_border_color_preview.hide();
        wpcf7_form_editor_properties.$form_border_color_value.spectrum("set", elementData.wpcf7_data.border_color);

        // Border Width
        wpcf7_form_editor_properties.$form_border_width.val(/[0-9]+/.exec(elementData.wpcf7_data.border_width));

        // Margin
        wpcf7_form_editor_properties.$form_margin_top.val(/[0-9]+/.exec(elementData.wpcf7_data.margin_top));
        wpcf7_form_editor_properties.$form_margin_left.val(/[0-9]+/.exec(elementData.wpcf7_data.margin_left));
        wpcf7_form_editor_properties.$form_margin_right.val(/[0-9]+/.exec(elementData.wpcf7_data.margin_right));
        wpcf7_form_editor_properties.$form_margin_bottom.val(/[0-9]+/.exec(elementData.wpcf7_data.margin_bottom));

        // Columns Padding
        wpcf7_form_editor_properties.$form_columns_padding_top.val(/[0-9]+/.exec(elementData.wpcf7_data.columns.padding_top));
        wpcf7_form_editor_properties.$form_columns_padding_left.val(/[0-9]+/.exec(elementData.wpcf7_data.columns.padding_left));
        wpcf7_form_editor_properties.$form_columns_padding_right.val(/[0-9]+/.exec(elementData.wpcf7_data.columns.padding_right));
        wpcf7_form_editor_properties.$form_columns_padding_bottom.val(/[0-9]+/.exec(elementData.wpcf7_data.columns.padding_bottom));

        // Error Message
        // wpcf7_form_editor_properties.$form_preview_border_color.css("background-color", elementData.error_message_color);
        wpcf7_form_editor_properties.$form_error_message_color_value.val(elementData.wpcf7_data.error_message_color);
        wpcf7_form_editor_properties.$form_error_message_color_preview.hide();
        wpcf7_form_editor_properties.$form_error_message_color_value.spectrum("set", elementData.wpcf7_data.error_message_color);

        wpcf7_form_editor_properties.$form_error_message_font_size.val(/[0-9]+/.exec(elementData.wpcf7_data.error_message_font_size));

        if (wpcf7_form_editor_properties.$form_error_message.val() != "") {
            wpcf7_form_editor_properties.$form_error_message
                .siblings("label, .prefix")
                .addClass('active');
        }

        // Send Message
        // wpcf7_form_editor_properties.$form_preview_border_color.css("background-color", elementData.send_message_color);
        wpcf7_form_editor_properties.$form_send_message_color_value.val(elementData.send_message_color);
        wpcf7_form_editor_properties.$form_send_message_color_preview.hide();
        wpcf7_form_editor_properties.$form_send_message_color_value.spectrum("set", elementData.send_message_color);

        wpcf7_form_editor_properties.$form_send_message_font_size.val(/[0-9]+/.exec(elementData.wpcf7_data.send_message_font_size));

        if (wpcf7_form_editor_properties.$form_send_message.val() != "") {
            wpcf7_form_editor_properties.$form_send_message
                .siblings("label, .prefix")
                .addClass('active');
        }

        /* Content Options */
        // Content width
        if (elementData.wpcf7_data.options_different.width) {
            wpcf7_form_editor_properties.$content_width.val('');
            wpcf7_form_editor_properties.$content_width.attr('placeholder', /[0-9]+/.exec(elementData.wpcf7_data.content.width));
        } else {
            wpcf7_form_editor_properties.$content_width.val(/[0-9]+/.exec(elementData.wpcf7_data.content.width));
            var widthType = (null != /[a-z]{2}|\%/.exec(elementData.wpcf7_data.content.width)) ? /[a-z]{2}|\%/.exec(elementData.wpcf7_data.content.width)[0] : "%";
            switch (widthType) {
                case "px":
                    wpcf7_form_editor_properties.$content_width_type.filter('[value=pixel]').prop("checked", true);
                    break;
                case "%":
                default:
                    wpcf7_form_editor_properties.$content_width_type.filter('[value=percentage]').prop("checked", true);
                    break;
            }
            if (wpcf7_form_editor_properties.$content_width.val() != "") {
                wpcf7_form_editor_properties.$content_width
                .siblings("label, .prefix")
                .addClass('active');
            }
        }


        // Content Height
        if (elementData.wpcf7_data.options_different.height) {
            wpcf7_form_editor_properties.$content_height.val('');
            wpcf7_form_editor_properties.$content_height.attr('placeholder', /[0-9]+/.exec(elementData.wpcf7_data.content.height));
        } else {
            wpcf7_form_editor_properties.$content_height.val(/[0-9]+/.exec(elementData.wpcf7_data.content.height));
            var heightType = (null != /[a-z]{2}|\%/.exec(elementData.wpcf7_data.content.height)) ? /[a-z]{2}|\%/.exec(elementData.wpcf7_data.content.height)[0] : "%";
            switch (heightType) {
                case "px":
                wpcf7_form_editor_properties.$content_height.filter('[value=pixel]').prop("checked", true);
                break;
                case "%":
                default:
                wpcf7_form_editor_properties.$content_height.filter('[value=percentage]').prop("checked", true);
                break;
            }
            if (wpcf7_form_editor_properties.$content_height.val() != "") {
                wpcf7_form_editor_properties.$content_height
                .siblings("label, .prefix")
                .addClass('active');
            }
        }

        // Content Font Size
        if (elementData.wpcf7_data.options_different.font_size) {
            wpcf7_form_editor_properties.$content_set_font_size.val('');
            wpcf7_form_editor_properties.$content_set_font_size.attr('placeholder', /[0-9]+/.exec(elementData.wpcf7_data.content.font_size));
        } else {
            wpcf7_form_editor_properties.$content_set_font_size.val(/[0-9]+/.exec(elementData.wpcf7_data.content.font_size));
        }

        // Content Border Width
        wpcf7_form_editor_properties.$content_set_border_width.val(/[0-9]+/.exec(elementData.wpcf7_data.content.border_width));

        // Content Border Radius
        wpcf7_form_editor_properties.$content_set_border_radius.val(/[0-9]+/.exec(elementData.wpcf7_data.content.border_radius));

        // Content Text Color
        if (elementData.wpcf7_data.options_different.text_color) {
            wpcf7_form_editor_properties.$content_text_color_value.parent().prepend(tmpl('tmpl-color-picker-overlay', {}));
            wpcf7_form_editor_properties.$color_picker_overlay = wpcf7_form_editor_properties.$self.find('.wpcf7-modal-color-picker-overlay');

            wpcf7_form_editor_properties.$color_picker_overlay.on('click', function() {
                wpcf7_form_editor_properties.$color_picker_overlay.remove();
            })
        }
        // wpcf7_form_editor_properties.$content_preview_text_color.css("background-color", elementData.wpcf7_data.content.text_color);
        wpcf7_form_editor_properties.$content_text_color_value.val(elementData.wpcf7_data.content.text_color);
        wpcf7_form_editor_properties.$content_text_color_preview.hide();
        wpcf7_form_editor_properties.$content_text_color_value.spectrum("set", elementData.wpcf7_data.content.text_color);

        // Content Text Color Hover
        // wpcf7_form_editor_properties.$content_preview_text_color_hover.css("background-color", elementData.wpcf7_data.content.text_color_hover);
        wpcf7_form_editor_properties.$content_text_color_hover_value.val(elementData.wpcf7_data.content.text_color_hover);
        wpcf7_form_editor_properties.$content_text_color_hover_preview.hide();
        wpcf7_form_editor_properties.$content_text_color_hover_value.spectrum("set", elementData.wpcf7_data.content.text_color_hover);

        // Content background color
        wpcf7_form_editor_properties.$content_preview_background_color.css("background-color", elementData.wpcf7_data.content.background_color);
        wpcf7_form_editor_properties.$content_background_color_value.val(elementData.wpcf7_data.content.background_color);
        wpcf7_form_editor_properties.$content_background_color_preview.hide();
        wpcf7_form_editor_properties.$content_background_color_value.spectrum("set", elementData.wpcf7_data.content.background_color);

        // Content background color hover
        wpcf7_form_editor_properties.$content_preview_background_color_hover.css("background-color", elementData.wpcf7_data.content.background_color_hover);
        wpcf7_form_editor_properties.$content_background_color_hover_value.val(elementData.wpcf7_data.content.background_color_hover);
        wpcf7_form_editor_properties.$content_background_color_hover_preview.hide();
        wpcf7_form_editor_properties.$content_background_color_hover_value.spectrum("set", elementData.wpcf7_data.content.background_color_hover);

        // Content border color
        wpcf7_form_editor_properties.$content_preview_border_color.css("background-color", elementData.wpcf7_data.content.border_color);
        wpcf7_form_editor_properties.$content_border_color_value.val(elementData.wpcf7_data.content.border_color);
        wpcf7_form_editor_properties.$content_border_color_preview.hide();
        wpcf7_form_editor_properties.$content_border_color_value.spectrum("set", elementData.wpcf7_data.content.border_color);

        // Content border color hover
        wpcf7_form_editor_properties.$content_preview_border_color_hover.css("background-color", elementData.wpcf7_data.content.border_color_hover);
        wpcf7_form_editor_properties.$content_border_color_value.val(elementData.wpcf7_data.content.border_color_hover);
        wpcf7_form_editor_properties.$content_border_color_hover_preview.hide();
        wpcf7_form_editor_properties.$content_border_color_hover_value.spectrum("set", elementData.wpcf7_data.content.border_color_hover);
    };

    var _updateFormDataFromPanel = function () {
        /* WHOLE FORM */
        // Border width
        elementData.wpcf7_data.border_width = wpcf7_form_editor_properties.$form_border_width.val() + "px";

        // Margin
        elementData.wpcf7_data.margin_top = wpcf7_form_editor_properties.$form_margin_top.val() + "px";
        elementData.wpcf7_data.margin_left = wpcf7_form_editor_properties.$form_margin_left.val() + "px";
        elementData.wpcf7_data.margin_right = wpcf7_form_editor_properties.$form_margin_right.val() + "px";
        elementData.wpcf7_data.margin_bottom = wpcf7_form_editor_properties.$form_margin_bottom.val() + "px";

        // Columns padding
        elementData.wpcf7_data.columns.padding_top = wpcf7_form_editor_properties.$form_columns_padding_top.val() + "px";
        elementData.wpcf7_data.columns.padding_left = wpcf7_form_editor_properties.$form_columns_padding_left.val() + "px";
        elementData.wpcf7_data.columns.padding_right = wpcf7_form_editor_properties.$form_columns_padding_right.val() + "px";
        elementData.wpcf7_data.columns.padding_bottom = wpcf7_form_editor_properties.$form_columns_padding_bottom.val() + "px";

        // Error Message Font Size
        elementData.wpcf7_data.error_message_font_size = wpcf7_form_editor_properties.$form_error_message_font_size.val() + "px";

        // Send Message Font Size
        elementData.wpcf7_data.send_message_font_size = wpcf7_form_editor_properties.$form_send_message_font_size.val() + "px";

        /* CONTENT */
        // Content width
        elementData.wpcf7_data.content.width = wpcf7_form_editor_properties.$content_width.val();
        if (elementData.wpcf7_data.content.width == '') {
            elementData.wpcf7_data.content.width = wpcf7_form_editor_properties.$content_width.attr('placeholder');
        }

        var widthType = wpcf7_form_editor_properties.$content_width_type.filter(':checked').val();

        switch (widthType) {
            case "percentage":
                elementData.wpcf7_data.content.width = elementData.wpcf7_data.content.width + "%";
                break;
            case "pixel":
                elementData.wpcf7_data.content.width = elementData.wpcf7_data.content.width + "px";
                break;
        }

        // Content height
        elementData.wpcf7_data.content.height = wpcf7_form_editor_properties.$content_height.val();
        if (elementData.wpcf7_data.content.height == '') {
            elementData.wpcf7_data.content.height = wpcf7_form_editor_properties.$content_height.attr('placeholder');
        }

        var heightType = wpcf7_form_editor_properties.$content_height_type.filter(':checked').val();

        switch(widthType) {
            case "percentage":
                elementData.wpcf7_data.content.height = elementData.wpcf7_data.content.height + "%";
                break;
            case "pixel":
                elementData.wpcf7_data.content.height = elementData.wpcf7_data.content.height + "px";
                break;
        }
        
        // Content Font Size
        elementData.wpcf7_data.content.font_size = wpcf7_form_editor_properties.$content_set_font_size.val() + "px";
        if (elementData.wpcf7_data.content.font_size == 'px') {
            elementData.wpcf7_data.content.font_size = wpcf7_form_editor_properties.$content_set_font_size.attr('placeholder') + 'px';
        }

        // Content Border Width
        elementData.wpcf7_data.content.border_width = wpcf7_form_editor_properties.$content_set_border_width.val() + "px";

        // Content Border Radius
        elementData.wpcf7_data.content.border_radius = wpcf7_form_editor_properties.$content_set_border_radius.val() + "px";
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    /// FUNCTIONS THAT TELL THE IFRAME WHAT TO DO
    /////////////////////////////////////////////////////////////////////////////////////////////////

    var _updateFormLive = function (data) {
        var formDataToIframe = {
            eventName: "rexlive:updateFormLive",
            data_to_send: {
                element_target: elementData.element_target,
                propertyType: data.type,
                propertyName: data.name,
                newValue: data.value
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(formDataToIframe);
    }

    var _updateFormContentLive = function (data) {
        var formDataToIframe = {
            eventName: "rexlive:updateFormContentLive",
            data_to_send: {
                element_target: elementData.element_target,
                propertyType: data.type,
                propertyName: data.name,
                newValue: data.value
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(formDataToIframe);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    /// LINKING PANEL TOOLS
    /////////////////////////////////////////////////////////////////////////////////////////////////

    var _linkNumberInputs = function () {
        var outputString = "";

        // Border Width
        var _updateBorderWidth = function (newBorderSize) {
            // outputString = isNaN(parseInt(newFontSize)) ? defaultColumnContentValues.font_size : newFontSize + "px";
            outputString = newBorderSize + "px";
            _updateFormLive ({
                type: "border-width",
                name: "border-width",
                value: outputString
            });
        };
        _linkKeyDownListenerInputNumber(wpcf7_form_editor_properties.$form_border_width, false);
        _linkKeyUpListenerInputNumber(wpcf7_form_editor_properties.$form_border_width, _updateBorderWidth, false);

        // Margin Top
        var _updateMarginTop = function (newMarginTop) {
            // outputString = isNaN(parseInt(newFontSize)) ? defaultColumnContentValues.font_size : newFontSize + "px";
            outputString = newMarginTop + "px";
            _updateFormLive ({
                type: "margin",
                name: "margin-top",
                value: outputString
            });
        };
        _linkKeyDownListenerInputNumber(wpcf7_form_editor_properties.$form_margin_top, false);
        _linkKeyUpListenerInputNumber(wpcf7_form_editor_properties.$form_margin_top, _updateMarginTop, false);

        // Margin Left
        var _updateMarginLeft = function (newMarginLeft) {
            // outputString = isNaN(parseInt(newFontSize)) ? defaultColumnContentValues.font_size : newFontSize + "px";
            outputString = newMarginLeft + "px";
            _updateFormLive ({
                type: "margin",
                name: "margin-left",
                value: outputString
            });
        };
        _linkKeyDownListenerInputNumber(wpcf7_form_editor_properties.$form_margin_left, false);
        _linkKeyUpListenerInputNumber(wpcf7_form_editor_properties.$form_margin_left, _updateMarginLeft, false);

        // Margin Right
        var _updateMarginRight = function (newMarginRight) {
            // outputString = isNaN(parseInt(newFontSize)) ? defaultColumnContentValues.font_size : newFontSize + "px";
            outputString = newMarginRight + "px";
            _updateFormLive ({
                type: "margin",
                name: "margin-right",
                value: outputString
            });
        };
        _linkKeyDownListenerInputNumber(wpcf7_form_editor_properties.$form_margin_right, false);
        _linkKeyUpListenerInputNumber(wpcf7_form_editor_properties.$form_margin_right, _updateMarginRight, false);

        // Margin Bottom
        var _updateMarginBottom = function (newMarginBottom) {
            // outputString = isNaN(parseInt(newFontSize)) ? defaultColumnContentValues.font_size : newFontSize + "px";
            outputString = newMarginBottom + "px";
            _updateFormLive ({
                type: "margin",
                name: "margin-bottom",
                value: outputString
            });
        };
        _linkKeyDownListenerInputNumber(wpcf7_form_editor_properties.$form_margin_bottom, false);
        _linkKeyUpListenerInputNumber(wpcf7_form_editor_properties.$form_margin_bottom, _updateMarginBottom, false);

        // Columns Padding Top
        var _updateColumnsPaddingTop = function (newColumnsPaddingTop) {
            // outputString = isNaN(parseInt(newFontSize)) ? defaultColumnContentValues.font_size : newFontSize + "px";
            outputString = newColumnsPaddingTop + "px";
            _updateFormLive ({
                type: "columns-padding",
                name: "padding-top",
                value: outputString
            });
        };
        _linkKeyDownListenerInputNumber(wpcf7_form_editor_properties.$form_columns_padding_top, false);
        _linkKeyUpListenerInputNumber(wpcf7_form_editor_properties.$form_columns_padding_top, _updateColumnsPaddingTop, false);

        // Columns Padding Left
        var _updateColumnsPaddingLeft = function (newColumnsPaddingLeft) {
            // outputString = isNaN(parseInt(newFontSize)) ? defaultColumnContentValues.font_size : newFontSize + "px";
            outputString = newColumnsPaddingLeft + "px";
            _updateFormLive ({
                type: "columns-padding",
                name: "padding-left",
                value: outputString
            });
        };
        _linkKeyDownListenerInputNumber(wpcf7_form_editor_properties.$form_columns_padding_left, false);
        _linkKeyUpListenerInputNumber(wpcf7_form_editor_properties.$form_columns_padding_left, _updateColumnsPaddingLeft, false);

        // Columns Padding Right
        var _updateColumnsPaddingRight = function (newColumnsPaddingRight) {
            // outputString = isNaN(parseInt(newFontSize)) ? defaultColumnContentValues.font_size : newFontSize + "px";
            outputString = newColumnsPaddingRight + "px";
            _updateFormLive ({
                type: "columns-padding",
                name: "padding-right",
                value: outputString
            });
        };
        _linkKeyDownListenerInputNumber(wpcf7_form_editor_properties.$form_columns_padding_right, false);
        _linkKeyUpListenerInputNumber(wpcf7_form_editor_properties.$form_columns_padding_right, _updateColumnsPaddingRight, false);

        // Columns Padding Bottom
        var _updateColumnsPaddingBottom = function (newColumnsPaddingBottom) {
            // outputString = isNaN(parseInt(newFontSize)) ? defaultColumnContentValues.font_size : newFontSize + "px";
            outputString = newColumnsPaddingBottom + "px";
            _updateFormLive ({
                type: "columns-padding",
                name: "padding-bottom",
                value: outputString
            });
        };
        _linkKeyDownListenerInputNumber(wpcf7_form_editor_properties.$form_columns_padding_bottom, false);
        _linkKeyUpListenerInputNumber(wpcf7_form_editor_properties.$form_columns_padding_bottom, _updateColumnsPaddingBottom, false);

        // Error Message Font Size
        var _updateErrorMessageFontSize = function (newErrorMessageFontSize) {
            // outputString = isNaN(parseInt(newFontSize)) ? defaultColumnContentValues.font_size : newFontSize + "px";
            outputString = newErrorMessageFontSize + "px";
            _updateFormLive ({
                type: "validation-error",
                name: "font-size",
                value: outputString
            });
        };
        _linkKeyDownListenerInputNumber(wpcf7_form_editor_properties.$form_error_message_font_size, false);
        _linkKeyUpListenerInputNumber(wpcf7_form_editor_properties.$form_error_message_font_size, _updateErrorMessageFontSize, false);

        // Send Message Font Size
        var _updateSendMessageFontSize = function (newSendMessageFontSize) {
            // outputString = isNaN(parseInt(newFontSize)) ? defaultColumnContentValues.font_size : newFontSize + "px";
            outputString = newSendMessageFontSize + "px";
            _updateFormLive ({
                type: "send-message",
                name: "font-size",
                value: outputString
            });
        };
        _linkKeyDownListenerInputNumber(wpcf7_form_editor_properties.$form_send_message_font_size, false);
        _linkKeyUpListenerInputNumber(wpcf7_form_editor_properties.$form_send_message_font_size, _updateSendMessageFontSize, false);

        // Content Width
        var _updateContentWidth = function (newContentWidth) {
            // outputString = isNaN(parseInt(newFontSize)) ? defaultColumnContentValues.font_size : newFontSize + "px";
            var widthType = wpcf7_form_editor_properties.$content_width_type.filter(':checked').val();

            switch(widthType) {
                case "percentage":
                    outputString = newContentWidth + "%";
                    break;
                case "pixel":
                    outputString = newContentWidth + "px";
                    break;
            }

            _updateFormContentLive({
                type: "width",
                name: "width",
                value: outputString
            });

            elementData.wpcf7_data.options_different.width = false;
        };
        _linkKeyDownListenerInputNumber(wpcf7_form_editor_properties.$content_width, false);
        _linkKeyUpListenerInputNumber(wpcf7_form_editor_properties.$content_width, _updateContentWidth, false);

        // Content Height
        var _updateContentHeight = function (newContentHeight) {
            // outputString = isNaN(parseInt(newFontSize)) ? defaultColumnContentValues.font_size : newFontSize + "px";
            var heightType = wpcf7_form_editor_properties.$content_height_type.filter(':checked').val();

            switch(heightType) {
                case "percentage":
                    outputString = newContentHeight + "%";
                    break;
                case "pixel":
                    outputString = newContentHeight + "px";
                    break;
            }

            _updateFormContentLive({
                type: "height",
                name: "height",
                value: outputString
            });

            elementData.wpcf7_data.options_different.height = false;
        };
        _linkKeyDownListenerInputNumber(wpcf7_form_editor_properties.$content_height, false);
        _linkKeyUpListenerInputNumber(wpcf7_form_editor_properties.$content_height, _updateContentHeight, false);

        // Content Font Size
        var _updateContentFontSize = function (newContentFontSize) {
            // outputString = isNaN(parseInt(newFontSize)) ? defaultColumnContentValues.font_size : newFontSize + "px";
            outputString = newContentFontSize + "px";
            _updateFormContentLive ({
                type: "font-size",
                name: "font-size",
                value: outputString
            });

            wpcf7_form_editor_properties.$input_preview.css({
                'font-size': outputString
            });

            elementData.wpcf7_data.options_different.font_size = false;
        };
        _linkKeyDownListenerInputNumber(wpcf7_form_editor_properties.$content_set_font_size, false);
        _linkKeyUpListenerInputNumber(wpcf7_form_editor_properties.$content_set_font_size, _updateContentFontSize, false);

        // Content Border Width
        var _updateContentBorderWidth = function (newContentBorderWidth) {
            // outputString = isNaN(parseInt(newFontSize)) ? defaultColumnContentValues.font_size : newFontSize + "px";
            outputString = newContentBorderWidth + "px";
            _updateFormContentLive ({
                type: "border-width",
                name: "border-width",
                value: outputString
            });

            wpcf7_form_editor_properties.$input_preview.css({
                'border-width': outputString
            });
        };
        _linkKeyDownListenerInputNumber(wpcf7_form_editor_properties.$content_set_border_width, false);
        _linkKeyUpListenerInputNumber(wpcf7_form_editor_properties.$content_set_border_width, _updateContentBorderWidth, false);

        // Content Border Radius
        var _updateContentBorderRadius = function (newContentBorderRadius) {
            // outputString = isNaN(parseInt(newFontSize)) ? defaultColumnContentValues.font_size : newFontSize + "px";
            outputString = newContentBorderRadius + "px";
            _updateFormContentLive ({
                type: "border-radius",
                name: "border-radius",
                value: outputString
            });

            wpcf7_form_editor_properties.$input_preview.css({
                'border-radius': outputString
            });
        };
        _linkKeyDownListenerInputNumber(wpcf7_form_editor_properties.$content_set_border_radius, false);
        _linkKeyUpListenerInputNumber(wpcf7_form_editor_properties.$content_set_border_radius, _updateContentBorderRadius, false);
    }

    var _linkBackgroundColorEditor = function () {
        var colorTEXT;
        wpcf7_form_editor_properties.$form_background_color_value.spectrum({
            replacerClassName: "btn-floating",
            preferredFormat: "hex",
            showPalette: false,
            showAlpha: true,
            showInput: true,
            showButtons: false,
            containerClassName:
                "rexbuilder-materialize-wrap block-background-color-picker",
            show: function () {},
            move: function (color) {

                colorTEXT = color.toRgbString();
                wpcf7_form_editor_properties.$form_background_color_preview.hide();
                wpcf7_form_editor_properties.$form_preview_background.css("background-color", colorTEXT);

                _updateFormLive({
                    type: "background",
                    name: "background-color",
                    value: colorTEXT
                });
            },
            change: function (color) {},
            hide: function (color) {
                elementData.wpcf7_data.background_color = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        wpcf7_form_editor_properties.$form_background_color_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            wpcf7_form_editor_properties.$form_background_color_value.spectrum('hide');
        });

        wpcf7_form_editor_properties.$form_background_color_preview.on(
            "click",
            function () {
                wpcf7_form_editor_properties.$form_background_color_value.spectrum("show");
                return false;
            }
        );
    }

    var _linkBorderColorEditor = function () {
        var colorTEXT;
        wpcf7_form_editor_properties.$form_border_color_value.spectrum({
            replacerClassName: "btn-floating",
            preferredFormat: "hex",
            showPalette: false,
            showAlpha: true,
            showInput: true,
            showButtons: false,
            containerClassName:
                "rexbuilder-materialize-wrap block-border-color-picker",
            show: function () {},
            move: function (color) {

                colorTEXT = color.toRgbString();
                wpcf7_form_editor_properties.$form_border_color_preview.hide();
                wpcf7_form_editor_properties.$form_preview_border_color.css("background-color", colorTEXT);

                _updateFormLive({
                    type: "border",
                    name: "border-color",
                    value: colorTEXT
                });
            },
            change: function (color) {},
            hide: function (color) {
                elementData.wpcf7_data.border_color = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        wpcf7_form_editor_properties.$form_border_color_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            wpcf7_form_editor_properties.$form_border_color_value.spectrum('hide');
        });

        wpcf7_form_editor_properties.$form_border_color_preview.on(
            "click",
            function () {
                wpcf7_form_editor_properties.$form_border_color_value.spectrum("show");
                return false;
            }
        );
    }

    var _linkContentTextColorEditor = function () {
        var colorTEXT;
        wpcf7_form_editor_properties.$content_text_color_value.spectrum({
            replacerClassName: "btn-floating",
            preferredFormat: "hex",
            showPalette: false,
            showAlpha: true,
            showInput: true,
            showButtons: false,
            containerClassName:
                "rexbuilder-materialize-wrap block-content-text-color-picker",
            show: function () {},
            move: function (color) {
                colorTEXT = color.toRgbString();
                wpcf7_form_editor_properties.$content_text_color_preview.hide();
                wpcf7_form_editor_properties.$content_preview_text_color.css("background-color", colorTEXT);
                wpcf7_form_editor_properties.$input_preview.css({
                    color: colorTEXT
                });

                _updateFormContentLive({
                    type: "text-color",
                    name: "text-color",
                    value: colorTEXT
                });

                elementData.wpcf7_data.options_different.text_color = false;
            },
            change: function (color) {},
            hide: function (color) {
                elementData.wpcf7_data.content.text_color = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        wpcf7_form_editor_properties.$content_text_color_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            wpcf7_form_editor_properties.$content_text_color_value.spectrum('hide');
        });

        wpcf7_form_editor_properties.$content_text_color_preview.on(
            "click",
            function () {
                wpcf7_form_editor_properties.$content_text_color_value.spectrum("show");
                return false;
            }
        );
    }

    var _linkContentTextColorHoverEditor = function () {
        var colorTEXT;
        wpcf7_form_editor_properties.$content_text_color_hover_value.spectrum({
            replacerClassName: "btn-floating",
            preferredFormat: "hex",
            showPalette: false,
            showAlpha: true,
            showInput: true,
            showButtons: false,
            containerClassName:
                "rexbuilder-materialize-wrap block-content-text-color-hover-picker",
            show: function () {},
            move: function (color) {
                colorTEXT = color.toRgbString();
                wpcf7_form_editor_properties.$content_text_color_hover_preview.hide();
                wpcf7_form_editor_properties.$content_preview_text_color_hover.css("background-color", colorTEXT);
                wpcf7_form_editor_properties.$input_preview.hover(function() {
                    $(this).css({
                        color: colorTEXT
                    });
                }, function() {
                    $(this).css({
                        color: elementData.wpcf7_data.content.text_color
                    });
                });

                _updateFormContentLive({
                    type: "text-color-hover",
                    name: "text-color",
                    value: colorTEXT
                });
            },
            change: function (color) {},
            hide: function (color) {
                elementData.wpcf7_data.content.text_color_hover = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        wpcf7_form_editor_properties.$content_text_color_hover_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            wpcf7_form_editor_properties.$content_text_color_hover_value.spectrum('hide');
        });

        wpcf7_form_editor_properties.$content_text_color_hover_preview.on(
            "click",
            function () {
                wpcf7_form_editor_properties.$content_text_color_hover_value.spectrum("show");
                return false;
            }
        );
    }

    var _linkContentBackgroundColorEditor = function () {
        var colorTEXT;
        wpcf7_form_editor_properties.$content_background_color_value.spectrum({
            replacerClassName: "btn-floating",
            preferredFormat: "hex",
            showPalette: false,
            showAlpha: true,
            showInput: true,
            showButtons: false,
            containerClassName:
                "rexbuilder-materialize-wrap block-content-background-color-picker",
            show: function () {},
            move: function (color) {
                colorTEXT = color.toRgbString();
                wpcf7_form_editor_properties.$content_background_color_preview.hide();
                wpcf7_form_editor_properties.$content_preview_background_color.css("background-color", colorTEXT);
                wpcf7_form_editor_properties.$input_preview.css({
                    'background-color': colorTEXT
                });

                _updateFormContentLive({
                    type: "background-color",
                    name: "background-color",
                    value: colorTEXT
                });
            },
            change: function (color) {},
            hide: function (color) {
                elementData.wpcf7_data.content.background_color = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        wpcf7_form_editor_properties.$content_background_color_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            wpcf7_form_editor_properties.$content_background_color_value.spectrum('hide');
        });

        wpcf7_form_editor_properties.$content_background_color_preview.on(
            "click",
            function () {
                wpcf7_form_editor_properties.$content_background_color_value.spectrum("show");
                return false;
            }
        );
    }

    var _linkContentBackgroundColorHoverEditor = function () {
        var colorTEXT;
        wpcf7_form_editor_properties.$content_background_color_hover_value.spectrum({
            replacerClassName: "btn-floating",
            preferredFormat: "hex",
            showPalette: false,
            showAlpha: true,
            showInput: true,
            showButtons: false,
            containerClassName:
                "rexbuilder-materialize-wrap block-content-background-color-hover-picker",
            show: function () {},
            move: function (color) {
                colorTEXT = color.toRgbString();
                wpcf7_form_editor_properties.$content_background_color_hover_preview.hide();
                wpcf7_form_editor_properties.$content_preview_background_color_hover.css("background-color", colorTEXT);
                wpcf7_form_editor_properties.$input_preview.hover(function() {
                    $(this).css({
                        'background-color': colorTEXT
                    });
                }, function() {
                    $(this).css({
                        'background-color': elementData.wpcf7_data.content.background_color
                    });
                });

                _updateFormContentLive({
                    type: "background-color-hover",
                    name: "background-color",
                    value: colorTEXT
                });
            },
            change: function (color) {},
            hide: function (color) {
                elementData.wpcf7_data.content.background_color_hover = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        wpcf7_form_editor_properties.$content_background_color_hover_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            wpcf7_form_editor_properties.$content_background_color_hover_value.spectrum('hide');
        });

        wpcf7_form_editor_properties.$content_background_color_hover_preview.on(
            "click",
            function () {
                wpcf7_form_editor_properties.$content_background_color_hover_value.spectrum("show");
                return false;
            }
        );
    }

    var _linkContentBorderColorEditor = function () {
        var colorTEXT;
        wpcf7_form_editor_properties.$content_border_color_value.spectrum({
            replacerClassName: "btn-floating",
            preferredFormat: "hex",
            showPalette: false,
            showAlpha: true,
            showInput: true,
            showButtons: false,
            containerClassName:
                "rexbuilder-materialize-wrap block-content-border-color-picker",
            show: function () {},
            move: function (color) {
                colorTEXT = color.toRgbString();
                wpcf7_form_editor_properties.$content_border_color_preview.hide();
                wpcf7_form_editor_properties.$content_preview_border_color.css("background-color", colorTEXT);
                wpcf7_form_editor_properties.$input_preview.css({
                    'border-color': colorTEXT
                });

                _updateFormContentLive({
                    type: "border-color",
                    name: "border-color",
                    value: colorTEXT
                });
            },
            change: function (color) {},
            hide: function (color) {
                elementData.wpcf7_data.content.border_color = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        wpcf7_form_editor_properties.$content_border_color_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            wpcf7_form_editor_properties.$content_border_color_value.spectrum('hide');
        });

        wpcf7_form_editor_properties.$content_border_color_preview.on(
            "click",
            function () {
                wpcf7_form_editor_properties.$content_border_color_value.spectrum("show");
                return false;
            }
        );
    }

    var _linkContentBorderColorHoverEditor = function () {
        var colorTEXT;
        wpcf7_form_editor_properties.$content_border_color_hover_value.spectrum({
            replacerClassName: "btn-floating",
            preferredFormat: "hex",
            showPalette: false,
            showAlpha: true,
            showInput: true,
            showButtons: false,
            containerClassName:
                "rexbuilder-materialize-wrap block-content-border-color-hover-picker",
            show: function () {},
            move: function (color) {
                colorTEXT = color.toRgbString();
                wpcf7_form_editor_properties.$content_border_color_hover_preview.hide();
                wpcf7_form_editor_properties.$content_preview_border_color_hover.css("background-color", colorTEXT);
                wpcf7_form_editor_properties.$input_preview.hover(function() {
                    $(this).css({
                        'border-color': colorTEXT
                    });
                }, function() {
                    $(this).css({
                        'border-color': elementData.wpcf7_data.content.border_color
                    });
                });

                _updateFormContentLive({
                    type: "border-color-hover",
                    name: "border-color",
                    value: colorTEXT
                });
            },
            change: function (color) {},
            hide: function (color) {
                elementData.wpcf7_data.content.border_color_hover = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        wpcf7_form_editor_properties.$content_border_color_hover_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            wpcf7_form_editor_properties.$content_border_color_hover_value.spectrum('hide');
        });

        wpcf7_form_editor_properties.$content_border_color_hover_preview.on(
            "click",
            function () {
                wpcf7_form_editor_properties.$content_border_color_hover_value.spectrum("show");
                return false;
            }
        );
    }

    var _linkErrorMessageColorEditor = function () {
        var colorTEXT;
        wpcf7_form_editor_properties.$form_error_message_color_value.spectrum({
            replacerClassName: "btn-floating",
            preferredFormat: "hex",
            showPalette: false,
            showAlpha: true,
            showInput: true,
            showButtons: false,
            containerClassName:
                "rexbuilder-materialize-wrap error-message-color-picker",
            show: function () {},
            move: function (color) {
                colorTEXT = color.toRgbString();
                wpcf7_form_editor_properties.$form_error_message_color_preview.hide();
                // wpcf7_form_editor_properties.$form_preview_border_color.css("background-color", colorTEXT);

                _updateFormLive({
                    type: "validation-error",
                    name: "text-color",
                    value: colorTEXT
                });
            },
            change: function (color) {},
            hide: function (color) {
                elementData.wpcf7_data.error_message_color = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        wpcf7_form_editor_properties.$form_error_message_color_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            wpcf7_form_editor_properties.$form_error_message_color_value.spectrum('hide');
        });

        wpcf7_form_editor_properties.$form_error_message_color_preview.on(
            "click",
            function () {
                wpcf7_form_editor_properties.$form_error_message_color_value.spectrum("show");
                return false;
            }
        );
    }

    var _linkSendMessageColorEditor = function () {
        var colorTEXT;
        wpcf7_form_editor_properties.$form_send_message_color_value.spectrum({
            replacerClassName: "btn-floating",
            preferredFormat: "hex",
            showPalette: false,
            showAlpha: true,
            showInput: true,
            showButtons: false,
            containerClassName:
                "rexbuilder-materialize-wrap send-message-color-picker",
            show: function () {},
            move: function (color) {
                colorTEXT = color.toRgbString();
                wpcf7_form_editor_properties.$form_send_message_color_preview.hide();
                // wpcf7_form_editor_properties.$form_preview_border_color.css("background-color", colorTEXT);

                _updateFormLive({
                    type: "send-message",
                    name: "text-color",
                    value: colorTEXT
                });
            },
            change: function (color) {},
            hide: function (color) {
                elementData.wpcf7_data.send_message_color = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        wpcf7_form_editor_properties.$form_send_message_color_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            wpcf7_form_editor_properties.$form_send_message_color_value.spectrum('hide');
        });

        wpcf7_form_editor_properties.$form_send_message_color_preview.on(
            "click",
            function () {
                wpcf7_form_editor_properties.$form_error_message_color_value.spectrum("show");
                return false;
            }
        );
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    /// Saving Functions
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var _saveElementSpanDataOnDB = function () {
        var element_data_html = _createElementDataHTML();
        var elementID = elementData.element_target.element_id;

        // element_editor_properties.$add_model_button.addClass("saving-rex-element");
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
                // element_editor_properties.$self.addClass('rex-modal--loading');
            },
            success: function (response) {
                // element_editor_properties.$add_model_button.removeClass("saving-rex-element");
            },
            error: function () {},
            complete: function (response) {
                // element_editor_properties.$self.removeClass('rex-modal--loading');
            }
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    /// Other Functions
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var _createElementDataHTML = function () {
        var elementHTML = "";
        tmpl.arg = "element";
        
        var defaults = {}

        var data = {
            wpcf7_data: {
                background_color: elementData.wpcf7_data.background_color,
                border_color: elementData.wpcf7_data.border_color,
                border_width: elementData.wpcf7_data.border_width,
                content: {
                    background_color: elementData.wpcf7_data.content.background_color,
                }
            }
        }

        elementHTML = tmpl("tmpl-rex-element-data", data);
        elementHTML = elementHTML.trim();
        return elementHTML;
    }

    var _createFormDataHTML = function () {
        var formDataHTML = "";
        tmpl.arg = "form";
        
        var defaults = {}

        var data = {
            background_color: elementData.wpcf7_data.background_color,
            content: {
                background_color: elementData.wpcf7_data.content.background_color,
            }
        }

        formDataHTML = tmpl("tmpl-rex-wpcf7-form-data", data);
        formDataHTML = formDataHTML.trim();
        return formDataHTML;
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var needToSave = false;

    var _linkDocumentListeners = function () {
        wpcf7_form_editor_properties.$close_button.on("click", function () {
            needToSave = false;
            _closeModal();
        });

        wpcf7_form_editor_properties.$reset_button.on("click", function () {
            needToSave = false;
            elementData = jQuery.extend(true, {}, resetData);
            console.log('resetData al click', elementData);
            _updatePanel();
            _applyChanges();
        });

        wpcf7_form_editor_properties.$apply_changes_button.on("click", function () {
            needToSave = true;
            _closeModal();
        });

        wpcf7_form_editor_properties.$modal.on('rexlive:this_modal_closed', function() {
            /* This event is triggered also when clicking out of the modal. 
            In that case it's considered like a "don't want to save" action */
            if (needToSave) {
                _saveFormSettings();
                _updateFormDataFromPanel();
                _saveElementSpanDataOnDB();
                _applyChanges();
            } else {
                elementData = jQuery.extend(true, {}, resetData);
                _updatePanel();
                _applyChanges();
            }
            
        });

        wpcf7_form_editor_properties.$content_width_type.on("click", function () {
            var widthValue = wpcf7_form_editor_properties.$content_width.val();
            var widthType = $(this).val();

            switch(widthType) {
                case "percentage":
                    widthValue = widthValue + "%";
                    break;
                case "pixel":
                    widthValue = widthValue + "px";
                    break;
            }

            _updateFormContentLive({
                type: "width",
                name: "width",
                value: widthValue
            });
        });

        wpcf7_form_editor_properties.$content_height_type.on("click", function () {
            var heightValue = wpcf7_form_editor_properties.$content_height.val();
            var heightType = $(this).val();

            switch(heightType) {
                case "percentage":
                    heightValue = heightValue + "%";
                    break;
                case "pixel":
                    heightValue = heightValue + "px";
                    break;
            }

            _updateFormContentLive({
                type: "height",
                name: "height",
                value: heightValue
            });
        });

        // Text Color Palette
        wpcf7_form_editor_properties.$content_text_color_palette_buttons.on("click", function(event) {
            var color = $(event.currentTarget).find(".bg-palette-value").val();

            $(event.currentTarget).addClass("palette-color-active");
            wpcf7_form_editor_properties.$content_preview_text_color.hide();
            wpcf7_form_editor_properties.$content_text_color_palette_buttons
              .not(event.currentTarget)
              .removeClass("palette-color-active");
            wpcf7_form_editor_properties.$content_text_color_value.spectrum("set", color);
            wpcf7_form_editor_properties.$content_text_color_runtime.val(color);

            elementData.wpcf7_data.content.text_color = color;

            _updateFormContentLive({
                type: "text-color",
                name: "text-color",
                value: color
            });

            wpcf7_form_editor_properties.$input_preview.css({
                color: color
            });

            elementData.wpcf7_data.options_different.text_color = false;
            wpcf7_form_editor_properties.$color_picker_overlay.remove();
          }
        );

        // Hover Text Color Palette
        wpcf7_form_editor_properties.$content_hover_text_color_palette_buttons.on("click", function(event) {
            var color = $(event.currentTarget).find(".bg-palette-value").val();

            $(event.currentTarget).addClass("palette-color-active");
            wpcf7_form_editor_properties.$content_preview_text_color_hover.hide();
            wpcf7_form_editor_properties.$content_hover_text_color_palette_buttons
              .not(event.currentTarget)
              .removeClass("palette-color-active");
            wpcf7_form_editor_properties.$content_text_color_hover_value.spectrum("set", color);
            wpcf7_form_editor_properties.$content_text_color_hover_runtime.val(color);

            elementData.wpcf7_data.content.text_color_hover = color;

            _updateFormContentLive({
                type: "text-color-hover",
                name: "text-color",
                value: color
            });

            wpcf7_form_editor_properties.$input_preview.hover(function() {
                $(this).css({
                    color: color
                });
            }, function() {
                $(this).css({
                    color: elementData.wpcf7_data.content.text_color
                });
            });
          }
        );

        // Background Color Palette
        wpcf7_form_editor_properties.$content_background_color_palette_buttons.on("click", function(event) {
            var color = $(event.currentTarget).find(".bg-palette-value").val();

            $(event.currentTarget).addClass("palette-color-active");
            wpcf7_form_editor_properties.$content_preview_background_color.hide();
            wpcf7_form_editor_properties.$content_background_color_palette_buttons
              .not(event.currentTarget)
              .removeClass("palette-color-active");
            wpcf7_form_editor_properties.$content_background_color_value.spectrum("set", color);
            wpcf7_form_editor_properties.$content_background_color_runtime.val(color);
            
            elementData.wpcf7_data.content.background_color = color;

            _updateFormContentLive({
                type: "background-color",
                name: "background-color",
                value: color
            });

            wpcf7_form_editor_properties.$input_preview.css({
                'background-color': color
            });
          }
        );

        // Hover Background Color Palette
        wpcf7_form_editor_properties.$content_hover_background_color_palette_buttons.on("click", function(event) {
            var color = $(event.currentTarget).find(".bg-palette-value").val();

            $(event.currentTarget).addClass("palette-color-active");
            wpcf7_form_editor_properties.$content_preview_background_color_hover.hide();
            wpcf7_form_editor_properties.$content_hover_background_color_palette_buttons
              .not(event.currentTarget)
              .removeClass("palette-color-active");
            wpcf7_form_editor_properties.$content_background_color_hover_value.spectrum("set", color);
            wpcf7_form_editor_properties.$content_background_color_hover_runtime.val(color);
            
            elementData.wpcf7_data.content.background_color_hover = color;

            _updateFormContentLive({
                type: "background-color-hover",
                name: "background-color",
                value: color
            });

            wpcf7_form_editor_properties.$input_preview.hover(function() {
                $(this).css({
                    'background-color': color
                });
            }, function() {
                $(this).css({
                    'background-color': elementData.wpcf7_data.content.background_color
                });
            });
          }
        );

        // Hover Border Color Palette
        wpcf7_form_editor_properties.$content_hover_border_color_palette_buttons.on("click", function(event) {
            var color = $(event.currentTarget).find(".bg-palette-value").val();

            $(event.currentTarget).addClass("palette-color-active");
            wpcf7_form_editor_properties.$content_preview_border_color_hover.hide();
            wpcf7_form_editor_properties.$content_hover_border_color_palette_buttons
              .not(event.currentTarget)
              .removeClass("palette-color-active");
            wpcf7_form_editor_properties.$content_border_color_hover_value.spectrum("set", color);
            wpcf7_form_editor_properties.$content_border_color_hover_runtime.val(color);

            elementData.wpcf7_data.content.border_color_hover = color;
            
            _updateFormContentLive({
                type: "border-color-hover",
                name: "border-color",
                value: color
            });

            wpcf7_form_editor_properties.$input_preview.hover(function() {
                $(this).css({
                    'border-color': color
                });
            }, function() {
                $(this).css({
                    'border-color': elementData.wpcf7_data.content.border_color
                });
            });
          }
        );
    }

    var _init = function () {
        var $self = $("#rex-wpcf7-form-editor");
        var $outerAccordion = $self.find('.rexpansive-accordion-outer');
        var $accordions = $self.find('.rexpansive-accordion');
        var $container = $self;

        $outerAccordion.rexAccordion({open:{},close:{}, selectors: {
            toggle: '.rex-accordion-outer--toggle',
            content: '.rex-accordion-outer--content'
        },});
        $accordions.rexAccordion({open:{},close:{},});

        wpcf7_form_editor_properties = {
            $self: $self,
            $modal: $container.parent(".rex-modal-wrap"),
            $close_button: $container.find(".rex-cancel-button"),
            $apply_changes_button: $container.find(".rex-apply-button"),
            $reset_button: $container.find(".rex-reset-button"),

            $input_preview: $container.find('.rex-wpcf7-text-modal-preview'),

            $form_mail_to: $container.find("#rex-wpcf7-mail-to"),
            $form_error_message: $container.find("#rex-wpcf7-error-message"),
            $form_send_message: $container.find("#rex-wpcf7-send-message"),
            
            $form_preview_background: $container.find("#rex-wpcf7-preview-background"),
            $form_background_color_value: $container.find("#rex-wpcf7-background-color"),
            $form_background_color_runtime: $container.find("#rex-wpcf7-background-color-runtime"),
            $form_background_color_preview: $container.find("#rex-wpcf7-background-color-preview-icon"),

            $form_preview_border_color: $container.find("#rex-wpcf7-preview-border"),
            $form_border_color_value: $container.find("#rex-wpcf7-border-color"),
            $form_border_color_runtime: $container.find("#rex-wpcf7-border-color-runtime"),
            $form_border_color_preview: $container.find("#rex-wpcf7-border-color-preview-icon"),

            $form_border_width: $container.find("#rex-wpcf7-set-border-width"),

            $form_margin_top: $container.find("#rex-wpcf7-margin-top"),
            $form_margin_left: $container.find("#rex-wpcf7-margin-left"),
            $form_margin_right: $container.find("#rex-wpcf7-margin-right"),
            $form_margin_bottom: $container.find("#rex-wpcf7-margin-bottom"),

            $form_columns_padding_top: $container.find("#rex-wpcf7-columns-padding-top"),
            $form_columns_padding_left: $container.find("#rex-wpcf7-columns-padding-left"),
            $form_columns_padding_right: $container.find("#rex-wpcf7-columns-padding-right"),
            $form_columns_padding_bottom: $container.find("#rex-wpcf7-columns-padding-bottom"),

            $content_width: $container.find("#rex-wpcf7-content-width"),
            $content_width_type: $container.find(".rex-wpcf7-content-width-type"),
            $content_height: $container.find("#rex-wpcf7-content-height"),
            $content_height_type: $container.find(".rex-wpcf7-content-height-type"),

            $content_set_font_size: $container.find("#rex-wpcf7-set-content-font-size"),
            $content_set_border_width: $container.find("#rex-wpcf7-set-content-border-width"),
            $content_set_border_radius: $container.find("#rex-wpcf7-set-content-border-radius"),

            $content_preview_text_color: $container.find("#rex-wpcf7-content-preview-text-color"),
            $content_text_color_value: $container.find("#rex-wpcf7-content-text-color"),
            $content_text_color_runtime: $container.find("#rex-wpcf7-content-text-color-runtime"),
            $content_text_color_preview: $container.find("#rex-wpcf7-content-text-color-preview-icon"),

            $content_text_color_palette_buttons: $self.find("#text-color-palette .bg-palette-selector"),

            $content_preview_text_color_hover: $container.find("#rex-wpcf7-content-preview-text-color-hover"),
            $content_text_color_hover_value: $container.find("#rex-wpcf7-content-text-color-hover"),
            $content_text_color_hover_runtime: $container.find("#rex-wpcf7-content-text-color-hover-runtime"),
            $content_text_color_hover_preview: $container.find("#rex-wpcf7-content-text-color-hover-preview-icon"),

            $content_hover_text_color_palette_buttons: $self.find("#hover-text-color-palette .bg-palette-selector"),

            $content_preview_background_color: $container.find("#rex-wpcf7-content-preview-background-color"),
            $content_background_color_value: $container.find("#rex-wpcf7-content-background-color"),
            $content_background_color_runtime: $container.find("#rex-wpcf7-content-background-color-runtime"),
            $content_background_color_preview: $container.find("#rex-wpcf7-content-background-color-preview-icon"),

            $content_background_color_palette_buttons: $self.find("#background-color-palette .bg-palette-selector"),

            $content_preview_background_color_hover: $container.find("#rex-wpcf7-content-preview-background-color-hover"),
            $content_background_color_hover_value: $container.find("#rex-wpcf7-content-background-color-hover"),
            $content_background_color_hover_runtime: $container.find("#rex-wpcf7-content-background-color-hover-runtime"),
            $content_background_color_hover_preview: $container.find("#rex-wpcf7-content-background-color-hover-preview-icon"),

            $content_hover_background_color_palette_buttons: $self.find("#hover-background-color-palette .bg-palette-selector"),

            $content_preview_border_color: $container.find("#rex-wpcf7-content-preview-border-color"),
            $content_border_color_value: $container.find("#rex-wpcf7-content-border-color"),
            $content_border_color_runtime: $container.find("#rex-wpcf7-content-border-color-runtime"),
            $content_border_color_preview: $container.find("#rex-wpcf7-content-border-color-preview-icon"),

            $content_preview_border_color_hover: $container.find("#rex-wpcf7-content-preview-border-color-hover"),
            $content_border_color_hover_value: $container.find("#rex-wpcf7-content-border-color-hover"),
            $content_border_color_hover_runtime: $container.find("#rex-wpcf7-content-border-color-hover-runtime"),
            $content_border_color_hover_preview: $container.find("#rex-wpcf7-content-border-color-hover-preview-icon"),

            $content_hover_border_color_palette_buttons: $self.find("#hover-border-color-palette .bg-palette-selector"),

            $form_error_message_font_size: $container.find('#rex-wpcf7-set-error-message-font-size'),
            $form_send_message_font_size: $container.find('#rex-wpcf7-set-send-message-font-size'),

            // $form_preview_error_message_color: $container.find("#rex-wpcf7-content-preview-border-color"),
            $form_error_message_color_value: $container.find("#rex-wpcf7-error-message-color"),
            $form_error_message_color_runtime: $container.find("#rex-wpcf7-error-message-color-runtime"),
            $form_error_message_color_preview: $container.find("#rex-wpcf7-error-message-color-preview-icon"),

            // $form_preview_send_message_color: $container.find("#rex-wpcf7-content-preview-border-color"),
            $form_send_message_color_value: $container.find("#rex-wpcf7-send-message-color"),
            $form_send_message_color_runtime: $container.find("#rex-wpcf7-send-message-color-runtime"),
            $form_send_message_color_preview: $container.find("#rex-wpcf7-send-message-color-preview-icon"),
        };

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

        _linkDocumentListeners();
        _linkNumberInputs();
        _linkBackgroundColorEditor();
        _linkBorderColorEditor();
        _linkContentTextColorEditor();
        _linkContentTextColorHoverEditor();
        _linkContentBackgroundColorEditor();
        _linkContentBackgroundColorHoverEditor();
        _linkContentBorderColorEditor();
        _linkContentBorderColorHoverEditor();
        _linkErrorMessageColorEditor();
        _linkSendMessageColorEditor();
    }

    return {
        init: _init,

        // Modal functions
        openFormEditorModal: _openFormEditorModal
    }
})(jQuery); 