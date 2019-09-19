/**
 * Edit wpcf7 forms
 * @since x.x.x
 */
var Wpcf7_Edit_Form_Modal = (function ($) {
	var wpcf7_form_editor_properties;
	var formData;
	var reverseData;
	var resetData;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    /// MODAL FUNCTIONS
    ////////////////////////////////////////////////////////////////////////////////////////////////////

	var _openFormEditorModal = function (data) {
		formData = jQuery.extend(true, {}, data.formData);
		_updateFormEditorModal(formData);

		Rexlive_Modals_Utils.openModal(
            wpcf7_form_editor_properties.$self.parent(".rex-modal-wrap"),
            false
        );
	}

	var _closeModal = function () {
        Rexlive_Modals_Utils.closeModal(
        	wpcf7_form_editor_properties.$self.parent(".rex-modal-wrap"),
        	false
        );
    };

    var _applyChanges = function () {
    	var formDataToIframe = {
            eventName: "rexlive:update_wcpf7_page",
            data_to_send: {
                reverseFormData: jQuery.extend(true, {}, reverseData),
                actionFormData: jQuery.extend(true, {}, formData)
            }
        };
        reverseData = jQuery.extend(true, {}, formDataToIframe.data_to_send.actionFormData);
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(formDataToIframe);
    };


    // data = formData
    var _updateFormEditorModal = function (data) {
        _clearFormData();
        _updateFormData(data);
        _updatePanel();
    };

    var _clearFormData = function () {
        formData = {
            // Da aggiornare
            
            // text_color: "",
            // text: "",
            // font_size: "",
            background_color: "",
            // button_height: "",
            // button_width: "",
            // hover_color: "",
            // hover_border: "",
            // hover_text: "",
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
            content: {
            	// text_color: "",
	            // text: "",
	            // font_size: "",
	            background_color: "",
	            // button_height: "",
	            // button_width: "",
	            // hover_color: "",
	            // hover_border: "",
	            // hover_text: "",
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
            },
            target: {
                form_id: "",
            },
        };
    }

    // data = formData
    var _updateFormData = function (data) {
    	formData = jQuery.extend(true, {}, data);
        reverseData = jQuery.extend(true, {}, formData);
        resetData = jQuery.extend(true, {}, formData);
    };

    var _updatePanel = function () {
        // wpcf7_form_editor_properties.$element_label_text.val(formData.text);
        // wpcf7_form_editor_properties.$element_label_text_size.val(formData.font_size.replace('px', ''));
        // wpcf7_form_editor_properties.$element_height.val(formData.element_height.replace('px', ''));
        // wpcf7_form_editor_properties.$element_width.val(formData.element_width.replace('px', ''));
        // wpcf7_form_editor_properties.$element_border_width.val(formData.border_width.replace('px', ''));
        // wpcf7_form_editor_properties.$element_border_radius.val(formData.border_radius.replace('px', ''));
        // wpcf7_form_editor_properties.$element_margin_top.val(formData.margin_top.replace('px', ''));
        // wpcf7_form_editor_properties.$element_margin_right.val(formData.margin_right.replace('px', ''));
        // wpcf7_form_editor_properties.$element_margin_left.val(formData.margin_left.replace('px', ''));
        // wpcf7_form_editor_properties.$element_margin_bottom.val(formData.margin_bottom.replace('px', ''));
        // wpcf7_form_editor_properties.$element_padding_top.val(formData.padding_top.replace('px', ''));
        // wpcf7_form_editor_properties.$element_padding_right.val(formData.padding_right.replace('px', ''));
        // wpcf7_form_editor_properties.$element_padding_left.val(formData.padding_left.replace('px', ''));
        // wpcf7_form_editor_properties.$element_padding_bottom.val(formData.padding_bottom.replace('px', '')); 

        // wpcf7_form_editor_properties.$element_link_target.val(formData.link_target);
        // wpcf7_form_editor_properties.$element_link_type.val(formData.link_type);
        // wpcf7_form_editor_properties.$element_name.val(formData.elementTarget.element_name);

        // wpcf7_form_editor_properties.$element_preview_border.css("border-width", formData.border_width);

        // wpcf7_form_editor_properties.$element_label_text.css("color", formData.text_color);
        // wpcf7_form_editor_properties.$element_label_text_color_value.val(formData.text_color);
        // wpcf7_form_editor_properties.$element_label_text_color_preview.hide();
        // wpcf7_form_editor_properties.$element_label_text_color_value.spectrum("set", formData.text_color);

        // wpcf7_form_editor_properties.$element_preview_background_hover.css("background-color", formData.hover_color);
        // wpcf7_form_editor_properties.$element_background_hover_color_value.val(formData.hover_color);
        // wpcf7_form_editor_properties.$element_background_hover_color_value.spectrum("set", formData.hover_color);
        // wpcf7_form_editor_properties.$element_background_hover_color_preview.hide();

        // wpcf7_form_editor_properties.$element_preview_text_hover.css("background-color", formData.hover_text);
        // wpcf7_form_editor_properties.$element_text_hover_color_value.val(formData.hover_text);
        // wpcf7_form_editor_properties.$element_text_hover_color_value.spectrum("set", formData.hover_text);
        // wpcf7_form_editor_properties.$element_text_hover_color_preview.hide();

        // wpcf7_form_editor_properties.$element_preview_border_hover.css("background-color", formData.hover_border);
        // wpcf7_form_editor_properties.$element_border_hover_color_value.val(formData.hover_border);
        // wpcf7_form_editor_properties.$element_border_hover_color_value.spectrum("set", formData.hover_border);
        // wpcf7_form_editor_properties.$element_border_hover_color_preview.hide();
        wpcf7_form_editor_properties.$form_preview_background.css("background-color", formData.background_color);
        wpcf7_form_editor_properties.$form_background_color_value.val(formData.background_color);
        wpcf7_form_editor_properties.$form_background_color_preview.hide();
        wpcf7_form_editor_properties.$form_background_color_value.spectrum("set", formData.background_color);

        wpcf7_form_editor_properties.$form_preview_inputs_background.css("background-color", formData.content.background_color);
        wpcf7_form_editor_properties.$form_inputs_background_color_value.val(formData.content.background_color);
        wpcf7_form_editor_properties.$form_inputs_background_color_preview.hide();
        wpcf7_form_editor_properties.$form_inputs_background_color_value.spectrum("set", formData.content.background_color);

        // wpcf7_form_editor_properties.$element_preview_border.css("border-color", formData.border_color);
        // wpcf7_form_editor_properties.$element_border_color_value.val(formData.border_color);
        // wpcf7_form_editor_properties.$element_border_color_preview.hide();
        // wpcf7_form_editor_properties.$element_border_color_value.spectrum("set", formData.border_color);
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////////
    /// FUNCTIONS THAT TELL THE IFRAME WHAT TO DO
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    var _updateFormLive = function (data) {
        var formDataToIframe = {
            eventName: "rexlive:updateFormLive",
            data_to_send: {
                target: formData.target,
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
                target: formData.target,
            	propertyType: data.type,
                propertyName: data.name,
                newValue: data.value
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(formDataToIframe);
    }

	////////////////////////////////////////////////////////////////////////////////////////////////////
    /// LINKING PANEL TOOLS
    ////////////////////////////////////////////////////////////////////////////////////////////////////

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
            show: function () {
            },
            move: function (color) {
            	// if() {
            	// 	// la prima volta che modifico, cancello gli span delle colonne.
            	// 	// Poi non so come ripristinarli però...
            	// }

        		colorTEXT = color.toRgbString();
                wpcf7_form_editor_properties.$form_background_color_preview.hide();
                wpcf7_form_editor_properties.$form_preview_background.css("background-color", colorTEXT);

                _updateFormLive({
                    type: "background",
                    name: "background-color",
                    value: colorTEXT
                });
            },
            change: function (color) {
            },
            hide: function (color) {
                formData.background_color = color.toRgbString();
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
            show: function () {
            },
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
            change: function (color) {
            },
            hide: function (color) {
                formData.content.background_color = color.toRgbString();
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

    ///////////////////////////////////////////////////////////////////////////////////////////////
    /// SAVING FUNCTIONS
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var _saveFormDataOnDB = function () {
        var form_data_html = _createFormDataHTML();
        var formID = formData.target.form_id;

        $.ajax({
            type: "POST",
            dataType: "json",
            url: live_editor_obj.ajaxurl,
            data: {
                action: "rex_wpcf7_save_form_data",
                nonce_param: live_editor_obj.rexnonce,
                form_id: formID,
                form_data_html: form_data_html
            },
            beforeSend: function() {
                wpcf7_form_editor_properties.$self.addClass('rex-modal--loading');
            },
            success: function (response) {},
            error: function () {},
            complete: function (response) {
                wpcf7_form_editor_properties.$self.removeClass('rex-modal--loading');
            }
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    /// OTHER FUNCTIONS
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var _createFormDataHTML = function () {
        var formDataHTML = "";
        tmpl.arg = "form";
        
        var defaults = {}

        var data = {
            // text_color: buttonData.text_color,
            // text: defaults.text,
            // font_size: buttonData.font_size,
            // button_height: buttonData.button_height,
            // button_width: buttonData.button_width,
            background_color: formData.background_color,
            // hover_color: buttonData.hover_color,
            // hover_text: buttonData.hover_text,
            // hover_border: buttonData.hover_border,
            // border_color: buttonData.border_color,
            // border_width: buttonData.border_width,
            // border_radius: buttonData.border_radius,
            // margin_top: buttonData.margin_top,
            // margin_bottom: buttonData.margin_bottom,
            // margin_right: buttonData.margin_right,
            // margin_left: buttonData.margin_left,
            // padding_top: buttonData.padding_top,
            // padding_bottom: buttonData.padding_bottom,
            // padding_right: buttonData.padding_right,
            // padding_left: buttonData.padding_left,
            // link_target: defaults.link_target,
            // link_type: defaults.link_type,
            // button_name: buttonData.buttonTarget.button_name,
            // id: buttonData.buttonTarget.button_id,
            content: {
            	// text_color: buttonData.text_color,
	            // text: defaults.text,
	            // font_size: buttonData.font_size,
	            // button_height: buttonData.button_height,
	            // button_width: buttonData.button_width,
	            background_color: formData.content.background_color,
	            // hover_color: buttonData.hover_color,
	            // hover_text: buttonData.hover_text,
	            // hover_border: buttonData.hover_border,
	            // border_color: buttonData.border_color,
	            // border_width: buttonData.border_width,
	            // border_radius: buttonData.border_radius,
	            // margin_top: buttonData.margin_top,
	            // margin_bottom: buttonData.margin_bottom,
	            // margin_right: buttonData.margin_right,
	            // margin_left: buttonData.margin_left,
	            // padding_top: buttonData.padding_top,
	            // padding_bottom: buttonData.padding_bottom,
	            // padding_right: buttonData.padding_right,
	            // padding_left: buttonData.padding_left,
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
        	formData = jQuery.extend(true, {}, resetData);
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
            // _updateFormDataFromPanel();
            _applyChanges();
            _saveFormDataOnDB();
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
            // $wpcf7_add_text_field: $container.find(".rex-add-text-field"),
            
            $form_preview_background: $container.find("#rex-element-preview-background"),
            $form_background_color_value: $container.find("#rex-element-background-color"),
            $form_background_color_runtime: $container.find("#rex-element-background-color-runtime"),
            $form_background_color_preview: $container.find("#rex-element-background-color-preview-icon"),

            $form_preview_inputs_background: $container.find("#rex-element-preview-inputs-background"),
            $form_inputs_background_color_value: $container.find("#rex-element-inputs-background-color"),
            $form_inputs_background_color_runtime: $container.find("#rex-element-inputs-background-color-runtime"),
            $form_inputs_background_color_preview: $container.find("#rex-element-inputs-background-color-preview-icon"),
		};

		formData = {
            // Da aggiornare
            
            // text_color: "",
            // text: "",
            // font_size: "",
            background_color: "",
            // button_height: "",
            // button_width: "",
            // hover_color: "",
            // hover_border: "",
            // hover_text: "",
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
            content: {
            	// text_color: "",
	            // text: "",
	            // font_size: "",
	            background_color: "",
	            // button_height: "",
	            // button_width: "",
	            // hover_color: "",
	            // hover_border: "",
	            // hover_text: "",
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
            },
            target: {
                form_id: "",
            },
        };

		_linkDocumentListeners();
		_linkBackgroundColorEditor();
		_linkInputsBackgroundColorEditor();
	}

	return {
		init: _init,

		// Modal functions
		openFormEditorModal: _openFormEditorModal,
	}
})(jQuery);	