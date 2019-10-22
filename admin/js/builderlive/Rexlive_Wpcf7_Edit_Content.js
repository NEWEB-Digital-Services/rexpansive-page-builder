/**
 * Edit content of wpcf7 forms
 * @since x.x.x
 */
var Wpcf7_Edit_Content_Modal = (function ($) {
	var wpcf7_content_editor_properties;
	var editPoint;
	var fieldType;
	var columnContentData;
	var reverseData;
	var resetData;
	var needToRemoveSpanData = true; // Needs to be set false the first time an edit happens

    /////////////////////////////////////////////////////////////////////////////////////////////////
    /// MODAL FUNCTIONS
    /////////////////////////////////////////////////////////////////////////////////////////////////

	var _openColumnContentEditorModal = function (data) {
		columnContentData = jQuery.extend(true, {}, data.columnContentData);
		editPoint = data.columnContentData.target;
		fieldType = data.fieldType;
		var spanDataExists = data.spanDataExists;
        needToRemoveSpanData = !spanDataExists; // If the data already exists, we don't have to remove it
		var modalClass = ["wpcf7-editing-" + fieldType]; // openModal requires an array of classes

		if (!spanDataExists) {
			_createSpanData();
		}
		
		_updateColumnContentEditorModal(columnContentData);

        /* Serve nascondere le varie parti del modal quando si apre il modal */

		Rexlive_Modals_Utils.openModal(
            wpcf7_content_editor_properties.$self.parent(".rex-modal-wrap"),
            false,
            modalClass
        );
	}

	var _closeModal = function () {
		var modalClass = ["wpcf7-editing-" + fieldType]; // closeModal requires an array of classes

        Rexlive_Modals_Utils.closeModal(
        	wpcf7_content_editor_properties.$self.parent(".rex-modal-wrap"),
        	false,
        	modalClass
        );
    };

    var _applyChanges = function () {
        columnContentData.wpcf7_required_field = "undefined" != typeof wpcf7_content_editor_properties.$content_required_field.attr("checked");
        columnContentData.wpcf7_only_numbers = "undefined" != typeof wpcf7_content_editor_properties.$content_only_numbers.attr("checked");
        columnContentData.wpcf7_placeholder = wpcf7_content_editor_properties.$content_placeholder.val();
        columnContentData.input_width = wpcf7_content_editor_properties.$content_input_width.val();
        columnContentData.input_height = wpcf7_content_editor_properties.$content_input_height.val();
        var widthType = wpcf7_content_editor_properties.$content_input_width_type.filter(':checked').val();
        var heightType = wpcf7_content_editor_properties.$content_input_height_type.filter(':checked').val();
        switch(widthType) {
            case "percentage":
                columnContentData.input_width = columnContentData.input_width + "%";
                break;
            case "pixel":
                columnContentData.input_width = columnContentData.input_width + "px";
        }

        switch(heightType) {
            case "percentage":
                columnContentData.input_height = columnContentData.input_height + "%";
                break;
            case "pixel":
                columnContentData.input_height = columnContentData.input_height + "px";
        }

    	var columnContentDataToIframe = {
            eventName: "rexlive:update_wcpf7_column_content_page",
            data_to_send: {
                reverseColumnContentData: jQuery.extend(true, {}, reverseData),
                actionColumnContentData: jQuery.extend(true, {}, columnContentData)
            }
        };
        reverseData = jQuery.extend(true, {}, columnContentDataToIframe.data_to_send.actionColumnContentData);
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(columnContentDataToIframe);
    };

    var _updateColumnContentEditorModal = function (data) {
        _clearColumnContentData();
        _updateColumnContentData(data);
        _updatePanel();
    };

    var _clearColumnContentData = function () {
        columnContentData = {
            wpcf7_placeholder: "",
            wpcf7_only_numbers: "",
            wpcf7_required_field: "",
            input_width: "",
            input_height: "",
            type: "",
            input_type: "",
            background_color: "",
            text_color: "",
            target: {
                element_id: "",
                row_number: "",
                column_number: "",
            }
        };
    }

    // data = columnContentData
    var _updateColumnContentData = function (data) {
    	columnContentData = jQuery.extend(true, {}, data);
        reverseData = jQuery.extend(true, {}, columnContentData);
        resetData = jQuery.extend(true, {}, columnContentData);
    };

    var _updatePanel = function () {
        // wpcf7_content_editor_properties.$element_label_text.val(columnContentData.text);
        // wpcf7_content_editor_properties.$element_label_text_size.val(columnContentData.font_size.replace('px', ''));
        // wpcf7_content_editor_properties.$element_height.val(columnContentData.element_height.replace('px', ''));
        // wpcf7_content_editor_properties.$element_width.val(columnContentData.element_width.replace('px', ''));
        // wpcf7_content_editor_properties.$element_border_width.val(columnContentData.border_width.replace('px', ''));
        // wpcf7_content_editor_properties.$element_border_radius.val(columnContentData.border_radius.replace('px', ''));
        // wpcf7_content_editor_properties.$element_margin_top.val(columnContentData.margin_top.replace('px', ''));
        // wpcf7_content_editor_properties.$element_margin_right.val(columnContentData.margin_right.replace('px', ''));
        // wpcf7_content_editor_properties.$element_margin_left.val(columnContentData.margin_left.replace('px', ''));
        // wpcf7_content_editor_properties.$element_margin_bottom.val(columnContentData.margin_bottom.replace('px', ''));
        // wpcf7_content_editor_properties.$element_padding_top.val(columnContentData.padding_top.replace('px', ''));
        // wpcf7_content_editor_properties.$element_padding_right.val(columnContentData.padding_right.replace('px', ''));
        // wpcf7_content_editor_properties.$element_padding_left.val(columnContentData.padding_left.replace('px', ''));
        // wpcf7_content_editor_properties.$element_padding_bottom.val(columnContentData.padding_bottom.replace('px', '')); 

        // wpcf7_content_editor_properties.$element_link_target.val(columnContentData.link_target);
        // wpcf7_content_editor_properties.$element_link_type.val(columnContentData.link_type);
        // wpcf7_content_editor_properties.$element_name.val(columnContentData.elementTarget.element_name);

        // wpcf7_content_editor_properties.$element_preview_border.css("border-width", columnContentData.border_width);

        // wpcf7_content_editor_properties.$element_label_text.css("color", columnContentData.text_color);
        // wpcf7_content_editor_properties.$element_label_text_color_value.val(columnContentData.text_color);
        // wpcf7_content_editor_properties.$element_label_text_color_preview.hide();
        // wpcf7_content_editor_properties.$element_label_text_color_value.spectrum("set", columnContentData.text_color);

        // wpcf7_content_editor_properties.$element_preview_background_hover.css("background-color", columnContentData.hover_color);
        // wpcf7_content_editor_properties.$element_background_hover_color_value.val(columnContentData.hover_color);
        // wpcf7_content_editor_properties.$element_background_hover_color_value.spectrum("set", columnContentData.hover_color);
        // wpcf7_content_editor_properties.$element_background_hover_color_preview.hide();

        // wpcf7_content_editor_properties.$element_preview_text_hover.css("background-color", columnContentData.hover_text);
        // wpcf7_content_editor_properties.$element_text_hover_color_value.val(columnContentData.hover_text);
        // wpcf7_content_editor_properties.$element_text_hover_color_value.spectrum("set", columnContentData.hover_text);
        // wpcf7_content_editor_properties.$element_text_hover_color_preview.hide();

        // wpcf7_content_editor_properties.$element_preview_border_hover.css("background-color", columnContentData.hover_border);
        // wpcf7_content_editor_properties.$element_border_hover_color_value.val(columnContentData.hover_border);
        // wpcf7_content_editor_properties.$element_border_hover_color_value.spectrum("set", columnContentData.hover_border);
        // wpcf7_content_editor_properties.$element_border_hover_color_preview.hide();
        
        // wpcf7_content_editor_properties.$content_preview_background.css("background-color", columnContentData.background_color);
        // wpcf7_content_editor_properties.$content_background_color_value.val(columnContentData.background_color);
        // wpcf7_content_editor_properties.$content_background_color_preview.hide();
        // wpcf7_content_editor_properties.$content_background_color_value.spectrum("set", columnContentData.background_color);

        wpcf7_content_editor_properties.$content_preview_text.css("background-color", columnContentData.text_color);
        wpcf7_content_editor_properties.$content_text_color_value.val(columnContentData.text_color);
        wpcf7_content_editor_properties.$content_text_color_preview.hide();
        wpcf7_content_editor_properties.$content_text_color_value.spectrum("set", columnContentData.text_color);

        // wpcf7_content_editor_properties.$element_preview_border.css("border-color", columnContentData.border_color);
        // wpcf7_content_editor_properties.$element_border_color_value.val(columnContentData.border_color);
        // wpcf7_content_editor_properties.$element_border_color_preview.hide();
        // wpcf7_content_editor_properties.$element_border_color_value.spectrum("set", columnContentData.border_color);
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////
    /// FUNCTIONS THAT TELL THE IFRAME WHAT TO DO
    /////////////////////////////////////////////////////////////////////////////////////////////////

    var _createSpanData = function () {
    	var columnContentDataToIframe = {
            eventName: "rexlive:wpcf7_create_column_content_span_data",
            data_to_send: {
                editPoint: editPoint
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(columnContentDataToIframe);
    }

    var _removeSpanData = function () {
    	var columnContentDataToIframe = {
            eventName: "rexlive:wpcf7_remove_column_content_span_data",
            data_to_send: {
                editPoint: editPoint
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(columnContentDataToIframe);
    }

    var _updateColumnContentLive = function (data) {
        var elementDataToIframe = {
            eventName: "rexlive:updateColumnContentLive",
            data_to_send: {
                target: columnContentData.target,
                content: columnContentData,
                propertyType: data.type,
                propertyName: data.name,
                newValue: data.value
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(elementDataToIframe);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    /// LINKING PANEL TOOLS
    /////////////////////////////////////////////////////////////////////////////////////////////////

    var _linkBackgroundColorEditor = function () {
        var colorTEXT;
        wpcf7_content_editor_properties.$content_background_color_value.spectrum({
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
            	if(needToRemoveSpanData) {
            		needToRemoveSpanData = false;
            	}

        		colorTEXT = color.toRgbString();
                wpcf7_content_editor_properties.$content_background_color_preview.hide();
                wpcf7_content_editor_properties.$content_preview_background.css("background-color", colorTEXT);
                _updateColumnContentLive({
                    type: "background",
                    name: "background-color",
                    value: colorTEXT
                });
            },
            change: function (color) {
            },
            hide: function (color) {
                columnContentData.background_color = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        wpcf7_content_editor_properties.$content_background_color_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            wpcf7_content_editor_properties.$content_background_color_value.spectrum('hide');
        });

        wpcf7_content_editor_properties.$content_background_color_preview.on(
            "click",
            function () {
                wpcf7_content_editor_properties.$content_background_color_value.spectrum("show");
                return false;
            }
        );
    }

    var _linkTextColorEditor = function () {
        var colorTEXT;
        wpcf7_content_editor_properties.$content_text_color_value.spectrum({
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
                if(needToRemoveSpanData) {
                    needToRemoveSpanData = false;
                }

                colorTEXT = color.toRgbString();
                wpcf7_content_editor_properties.$content_text_color_preview.hide();
                wpcf7_content_editor_properties.$content_preview_text.css("background-color", colorTEXT);
                _updateColumnContentLive({
                    type: "text",
                    name: "text-color",
                    value: colorTEXT
                });
            },
            change: function (color) {
            },
            hide: function (color) {
                columnContentData.text_color = color.toRgbString();
            },
            cancelText: "",
            chooseText: ""
        });

        var close = tmpl('tmpl-tool-close', {});
        var $close = $(close);
        wpcf7_content_editor_properties.$content_text_color_value.spectrum('container').append($close);

        $close.on('click', function (e) {
            e.preventDefault();
            wpcf7_content_editor_properties.$content_text_color_value.spectrum('hide');
        });

        wpcf7_content_editor_properties.$content_text_color_preview.on(
            "click",
            function () {
                wpcf7_content_editor_properties.$content_text_color_value.spectrum("show");
                return false;
            }
        );
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
   	/////////////////////////////////////////////////////////////////////////////////////////////////

	var _linkDocumentListeners = function() {
		/**
         * Closes the modal
         */
        wpcf7_content_editor_properties.$close_button.on("click", function () {
            if (needToRemoveSpanData){
                _removeSpanData();
            }
            _closeModal();
        });

        /**
         * Applies changes
         */
        wpcf7_content_editor_properties.$apply_changes_button.on("click", function () {
            if (needToRemoveSpanData){
                _removeSpanData();
            }
            _applyChanges();
            _closeModal();
        });

        wpcf7_content_editor_properties.$modal.on('rexlive:this_modal_closed', function() {
            // _updateColumnContentFromPanel();
            if (needToRemoveSpanData){
                _removeSpanData();
            }
            // _applyChanges();
        });

        wpcf7_content_editor_properties.$content_input_width_type.on("click", function () {
            var width_type = $(this).val();
            /* The attribute does not set in DOM */
            // wpcf7_content_editor_properties.$content_input_width_type.filter('[value="' + width_type + '"]').prop('checked', true);
            // console.log(wpcf7_content_editor_properties.$content_input_width_type.filter(':checked')[0]);
        });

        wpcf7_content_editor_properties.$content_input_height_type.on("click", function () {
            var height_type = $(this).val();
            // console.log(height_type);
        });
	}

	var _init = function() {
		var $self = $("#rex-wpcf7-content-editor");
		var $container = $self;

		wpcf7_content_editor_properties = {
			$self: $self,
			$modal: $container.parent(".rex-modal-wrap"),
            $close_button: $container.find(".rex-cancel-button"),
            $apply_changes_button: $container.find(".rex-apply-button"),
            // $wpcf7_add_text_field: $container.find(".rex-add-text-field"),
            
            // $content_preview_background: $container.find("#rex-element-preview-background"),
            // $content_background_color_value: $container.find("#rex-element-background-color"),
            // $content_background_color_runtime: $container.find("#rex-element-background-color-runtime"),
            // $content_background_color_preview: $container.find("#rex-element-background-color-preview-icon"),
            $content_preview_text: $container.find("#rex-element-preview-background"),
            $content_text_color_value: $container.find("#rex-element-background-color"),
            $content_text_color_runtime: $container.find("#rex-element-background-color-runtime"),
            $content_text_color_preview: $container.find("#rex-element-background-color-preview-icon"),

            $content_required_field: $container.find("#wpcf7-required-field"),
            $content_only_numbers: $container.find("#wpcf7-only-numbers"),
            $content_placeholder: $container.find("#wpcf7-placeholder"),
            $content_input_width: $container.find("#wpcf7-input-width"),
            $content_input_width_type: $container.find(".wpcf7-input-width-type"),
            $content_input_height: $container.find("#wpcf7-input-height"),
            $content_input_height_type: $container.find(".wpcf7-input-height-type"),
		};

		columnContentData = {
            wpcf7_required_field: "",
            wpcf7_only_numbers: "",
            wpcf7_placeholder: "",
            input_width: "",
            input_height: "",
            type: "",
            input_type: "",
            background_color: "",
            text_color: "",
            target: {
                element_id: "",
                row_number: "",
                column_number: "",
            }
        };

		_linkDocumentListeners();
		_linkTextColorEditor();
	}

	return {
		init: _init,

		// Modal functions
		openColumnContentEditorModal: _openColumnContentEditorModal
	}
})(jQuery);	