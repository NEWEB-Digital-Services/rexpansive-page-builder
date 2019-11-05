/**
 * Edit wpcf7 forms
 * @since x.x.x
 */
var Wpcf7_Edit_Form_Modal = (function ($) {
	var wpcf7_form_editor_properties;
    var elementData;
	var formData;
	var reverseData;
	var resetData;

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

    //////////////////////////////////////////////////////////////////////////////////////////////////
    /// MODAL FUNCTIONS
    //////////////////////////////////////////////////////////////////////////////////////////////////

	var _openFormEditorModal = function (data) {
        elementData = data;
		_updateFormEditorModal(elementData);

		Rexlive_Modals_Utils.openModal(wpcf7_form_editor_properties.$self.parent(".rex-modal-wrap"),false);
	}

	var _closeModal = function () {
        Rexlive_Modals_Utils.closeModal(wpcf7_form_editor_properties.$self.parent(".rex-modal-wrap"),false);
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

    // var _clearFormData = function () {
    //     formData = {
    //         background_color: "",
    //         content: {
	   //          background_color: "",
    //         },
    //         element_target: {
    //             element_id: "",
    //             element_name: ""
    //         },
    //     };
    // }

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
                columns: {
                    padding_top: "",
                    padding_left: "",
                    padding_right: "",
                    padding_bottom: "",
                },
                content: {
                    background_color: "",
                }
            },
            element_target: {
                element_id: "",
                element_number: "",
            }
        };
    }

    // var _updateFormData = function (data) {
    // 	formData = jQuery.extend(true, {}, data);
    //     reverseData = jQuery.extend(true, {}, formData);
    //     resetData = jQuery.extend(true, {}, formData);
    // };

    var _updateElementData = function (data) {
        elementData = jQuery.extend(true, {}, data);
        reverseData = jQuery.extend(true, {}, elementData);
        resetData = jQuery.extend(true, {}, elementData);
    };

    var _updatePanel = function () {
        // Background color
        wpcf7_form_editor_properties.$form_preview_background.css("background-color", elementData.wpcf7_data.background_color);
        wpcf7_form_editor_properties.$form_background_color_value.val(elementData.wpcf7_data.background_color);
        wpcf7_form_editor_properties.$form_background_color_preview.hide();
        wpcf7_form_editor_properties.$form_background_color_value.spectrum("set", elementData.wpcf7_data.background_color);

        // Border color
        wpcf7_form_editor_properties.$form_preview_border_color.css("background-color", elementData.wpcf7_data.border_color);
        wpcf7_form_editor_properties.$form_border_color_value.val(elementData.wpcf7_data.border_color);
        wpcf7_form_editor_properties.$form_border_color_preview.hide();
        wpcf7_form_editor_properties.$form_border_color_value.spectrum("set", elementData.wpcf7_data.border_color);

        // Border width
        wpcf7_form_editor_properties.$form_border_width.val(/[0-9]+/.exec(elementData.wpcf7_data.border_width));

        // Margin
        wpcf7_form_editor_properties.$form_margin_top.val(/[0-9]+/.exec(elementData.wpcf7_data.margin_top));
        wpcf7_form_editor_properties.$form_margin_left.val(/[0-9]+/.exec(elementData.wpcf7_data.margin_left));
        wpcf7_form_editor_properties.$form_margin_right.val(/[0-9]+/.exec(elementData.wpcf7_data.margin_right));
        wpcf7_form_editor_properties.$form_margin_bottom.val(/[0-9]+/.exec(elementData.wpcf7_data.margin_bottom));

        // Columns padding
        wpcf7_form_editor_properties.$form_columns_padding_top.val(/[0-9]+/.exec(elementData.wpcf7_data.columns.padding_top));
        wpcf7_form_editor_properties.$form_columns_padding_left.val(/[0-9]+/.exec(elementData.wpcf7_data.columns.padding_left));
        wpcf7_form_editor_properties.$form_columns_padding_right.val(/[0-9]+/.exec(elementData.wpcf7_data.columns.padding_tright));
        wpcf7_form_editor_properties.$form_columns_padding_bottom.val(/[0-9]+/.exec(elementData.wpcf7_data.columns.padding_bottom));

        // Inputs color
        wpcf7_form_editor_properties.$form_preview_inputs_background.css("background-color", elementData.wpcf7_data.content.background_color);
        wpcf7_form_editor_properties.$form_inputs_background_color_value.val(elementData.wpcf7_data.content.background_color);
        wpcf7_form_editor_properties.$form_inputs_background_color_preview.hide();
        wpcf7_form_editor_properties.$form_inputs_background_color_value.spectrum("set", elementData.wpcf7_data.content.background_color);
    };

    var _updateFormDataFromPanel = function () {
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
        
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    /// FUNCTIONS THAT TELL THE IFRAME WHAT TO DO
    //////////////////////////////////////////////////////////////////////////////////////////////////

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

    var _updateFormInputsLive = function (data) {
        var formDataToIframe = {
            eventName: "rexlive:updateFormInputsLive",
            data_to_send: {
                target: formData.element_target,
            	propertyType: data.type,
                propertyName: data.name,
                newValue: data.value
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(formDataToIframe);
    }

	//////////////////////////////////////////////////////////////////////////////////////////////////
    /// LINKING PANEL TOOLS
    //////////////////////////////////////////////////////////////////////////////////////////////////

    var _linkNumberInputs = function () {
        var outputString = "";

        // BORDER SIZE
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

        // MARGIN TOP
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

        // MARGIN LEFT
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

        // MARGIN RIGHT
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

        // MARGIN BOTTOM
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

        // COLUMNS PADDING TOP
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

        // COLUMNS PADDING LEFT
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

        // COLUMNS PADDING RIGHT
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

        // COLUMNS PADDING BOTTOM
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

    var _linkInputsBackgroundColorEditor = function () {
        var colorTEXT;
        wpcf7_form_editor_properties.$form_inputs_background_color_value.spectrum({
            replacerClassName: "btn-floating",
            preferredFormat: "hex",
            showPalette: false,
            showAlpha: true,
            showInput: true,
            showButtons: false,
            containerClassName:
                "rexbuilder-materialize-wrap block-inputs-background-color-picker",
            show: function () {},
            move: function (color) {
        		colorTEXT = color.toRgbString();
                wpcf7_form_editor_properties.$form_inputs_background_color_preview.hide();
                wpcf7_form_editor_properties.$form_preview_inputs_background.css("background-color", colorTEXT);

                _updateFormInputsLive({
                    type: "background",
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
        wpcf7_form_editor_properties.$form_inputs_background_color_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            wpcf7_form_editor_properties.$form_inputs_background_color_value.spectrum('hide');
        });

        wpcf7_form_editor_properties.$form_inputs_background_color_preview.on(
            "click",
            function () {
                wpcf7_form_editor_properties.$form_inputs_background_color_value.spectrum("show");
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

    ///////////////////////////////////////////////////////////////////////////////////////////////
    /// SAVING FUNCTIONS
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

    // Necessario? Penso di no
    // var _saveFormDataOnDB = function () {
    //     var form_data_html = _createFormDataHTML();
    //     var formID = elementData.element_target.element_id;

    //     $.ajax({
    //         type: "POST",
    //         dataType: "json",
    //         url: live_editor_obj.ajaxurl,
    //         data: {
    //             action: "rex_wpcf7_save_form_data",
    //             nonce_param: live_editor_obj.rexnonce,
    //             form_id: formID,
    //             form_data_html: form_data_html
    //         },
    //         beforeSend: function() {
    //             wpcf7_form_editor_properties.$self.addClass('rex-modal--loading');
    //         },
    //         success: function (response) {},
    //         error: function () {},
    //         complete: function (response) {
    //             wpcf7_form_editor_properties.$self.removeClass('rex-modal--loading');
    //         }
    //     });
    // }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    /// OTHER FUNCTIONS
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
    
	var _linkDocumentListeners = function () {
		/**
         * Closes the modal
         */
        wpcf7_form_editor_properties.$close_button.on("click", function () {
        	elementData = jQuery.extend(true, {}, resetData);
            _updatePanel();
            _closeModal();
        });

        /**
         * Applies changes
         */
        wpcf7_form_editor_properties.$apply_changes_button.on("click", function () {
            _closeModal();
        });

        wpcf7_form_editor_properties.$modal.on('rexlive:this_modal_closed', function() {
            _updateFormDataFromPanel();
            _saveElementSpanDataOnDB();
            _applyChanges();
        });
	}

	var _init = function () {
		var $self = $("#rex-wpcf7-form-editor");
		var $container = $self;

		wpcf7_form_editor_properties = {
			$self: $self,
			$modal: $container.parent(".rex-modal-wrap"),
            $close_button: $container.find(".rex-cancel-button"),
            $apply_changes_button: $container.find(".rex-apply-button"),
            
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

            $form_preview_inputs_background: $container.find("#rex-wpcf7-preview-inputs-background"),
            $form_inputs_background_color_value: $container.find("#rex-wpcf7-inputs-background-color"),
            $form_inputs_background_color_runtime: $container.find("#rex-wpcf7-inputs-background-color-runtime"),
            $form_inputs_background_color_preview: $container.find("#rex-wpcf7-inputs-background-color-preview-icon"),
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
                columns: {
                    padding_top: "",
                    padding_left: "",
                    padding_right: "",
                    padding_bottom: "",
                },
                content: {
                    background_color: "",
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
		_linkInputsBackgroundColorEditor();
	}

	return {
		init: _init,

		// Modal functions
		openFormEditorModal: _openFormEditorModal,
	}
})(jQuery);	