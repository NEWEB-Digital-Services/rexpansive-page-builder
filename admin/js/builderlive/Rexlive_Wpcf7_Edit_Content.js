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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    /// MODAL FUNCTIONS
    ////////////////////////////////////////////////////////////////////////////////////////////////////

	var _openColumnContentEditorModal = function (data) {
		columnContentData = jQuery.extend(true, {}, data.columnContentData);
		editPoint = data.columnContentData.target;
		fieldType = data.fieldType;
		var spanDataExists = data.spanDataExists; 
		var modalClass = ["wpcf7-editing-" + fieldType]; // openModal requires an array of classes

		if (!spanDataExists) {
			_createSpanData();
		}
		
		_updateColumnContentEditorModal(columnContentData);

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

    // data = columnContentData
    var _updateColumnContentEditorModal = function (data) {
        _clearColumnContentData();
        _updateColumnContentData(data);
        _updatePanel();
    };

    var _clearColumnContentData = function () {
        columnContentData = {
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
            target: {
                element_id: "",
                row_number: "",
                column_number: "",
            },
            content: {
            	type: "",
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
        wpcf7_content_editor_properties.$content_preview_background.css("background-color", columnContentData.background_color);
        wpcf7_content_editor_properties.$content_background_color_value.val(columnContentData.background_color);
        wpcf7_content_editor_properties.$content_background_color_preview.hide();
        wpcf7_content_editor_properties.$content_background_color_value.spectrum("set", columnContentData.background_color);

        // wpcf7_content_editor_properties.$element_preview_border.css("border-color", columnContentData.border_color);
        // wpcf7_content_editor_properties.$element_border_color_value.val(columnContentData.border_color);
        // wpcf7_content_editor_properties.$element_border_color_preview.hide();
        // wpcf7_content_editor_properties.$element_border_color_value.spectrum("set", columnContentData.border_color);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    /// FUNCTIONS THAT TELL THE IFRAME WHAT TO DO
    ////////////////////////////////////////////////////////////////////////////////////////////////////

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
                content: columnContentData.content,
                propertyType: data.type,
                propertyName: data.name,
                newValue: data.value
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(elementDataToIframe);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    /// LINKING PANEL TOOLS
    ////////////////////////////////////////////////////////////////////////////////////////////////////

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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
   	////////////////////////////////////////////////////////////////////////////////////////////////////

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

        // wpcf7_form_editor_properties.$modal.on('rexlive:this_modal_closed', function() {
        //     // _updateColumnContentFromPanel();
        //     // if (needToRemoveSpanData){
        //     //     _removeSpanData();
        //     // }
        //     // _applyChanges();
        // })
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
            
            $content_preview_background: $container.find("#rex-element-preview-background"),
            $content_background_color_value: $container.find("#rex-element-background-color"),
            $content_background_color_runtime: $container.find("#rex-element-background-color-runtime"),
            $content_background_color_preview: $container.find("#rex-element-background-color-preview-icon"),

		};

		columnContentData = {
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
            target: {
                element_id: "",
                row_number: "",
                column_number: "",
            },
            content: {
            	type: "",
            }
        };

		_linkDocumentListeners();
		_linkBackgroundColorEditor();
	}

	return {
		init: _init,

		// Modal functions
		openColumnContentEditorModal: _openColumnContentEditorModal
	}
})(jQuery);	