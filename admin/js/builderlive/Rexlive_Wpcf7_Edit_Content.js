/**
 * Edit content of wpcf7 forms
 * @since x.x.x
 */
var Wpcf7_Edit_Content_Modal = (function ($) {
	var wpcf7_content_editor_properties;
	var editPoint = {};
	var fieldType;
	var columnContentData = [];

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    /// MODAL FUNCTIONS
    ////////////////////////////////////////////////////////////////////////////////////////////////////

	var _openContentEditorModal = function (data) {
		editPoint = data.editPoint;
		fieldType = data.fieldType;

		var modalClass = ["wpcf7-editing-" + fieldType]; // openModal requires an array of classes

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
    	console.log("Apply changes");
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    // LINKING PANEL TOOLS
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
            	// Va qua?
            	if(/*non ha lo span data*/) {
            		/* Crea lo span */
            	}

                colorTEXT = color.toRgbString();
                wpcf7_content_editor_properties.$content_background_color_preview.hide();
                wpcf7_content_editor_properties.$content_preview_background.css("background-color", colorTEXT);
                _updateElementLive({
                    type: "background",
                    name: "background-color",
                    value: colorTEXT
                });
            },
            change: function (color) {
            },
            hide: function (color) {
                // elementData.background_color = color.toRgbString();
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
            _closeModal();
        });

        /**
         * Applies changes
         */
        wpcf7_content_editor_properties.$apply_changes_button.on("click", function () {
        	_applyChanges();
            _closeModal();
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
            
            $content_preview_background: $container.find("#rex-element-preview-background"),
            $content_background_color_value: $container.find("#rex-element-background-color"),
            $content_background_color_runtime: $container.find("#rex-element-background-color-runtime"),
            $content_background_color_preview: $container.find("#rex-element-background-color-preview-icon"),

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

		_linkDocumentListeners();
		_linkBackgroundColorEditor();
	}

	return {
		init: _init,

		// Modal functions
		openContentEditor: _openContentEditor
	}
})(jQuery);	