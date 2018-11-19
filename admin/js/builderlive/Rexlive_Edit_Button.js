/**
 * Set the overlay color of a row
 * @since 2.0.0
 */
var Button_Edit_Modal = (function ($) {
    "use strict";

    var button_editor_properties;
    var sectionTarget;

    var _openButtonEditorModal = function (data) {
        console.log(data);
        _updateButtonEditorModal(data);
        Rexlive_Modals_Utils.openModal(
            button_editor_properties.$self.parent(".rex-modal-wrap")
        );
    };

    var _updateButtonEditorModal = function (data) {
        ;
    };

    var _applyData = function () {
        var buttonData = {
            eventName: "rexlive:update_button",
            data_to_send: {
                text_color: "",
                text: "",
                font_size: "",
                background_color: "",
                button_height: "",
                hover_color: "",
                border_color: "",
                border_width: "",
                border_radius: "",
                button_position: "",
                margin_top: "",
                margin_bottom: "",
                link_taget: "",
                link_type: "",
                button_name: "",
                button_id: "",
                sectionTarget: sectionTarget
            }
        };

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(buttonData);
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

        _linkDocumentListeners();
    };

    return {
        init: _init,
        openButtonEditorModal: _openButtonEditorModal
    };
})(jQuery);
