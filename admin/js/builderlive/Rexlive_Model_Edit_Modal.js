var Model_Edit_Modal = (function ($) {
    'use strict';
    var rexmodel_edit_props;

    var dataReceived;
    var layoutActive;

    var _openModal = function (data) {
        dataReceived = jQuery.extend(true, {}, data);
        layoutActive = data.layoutActive;
        rexmodel_edit_props.$self.find(".rex-edit-option").each(function (i, opt) {
            var $opt = $(opt);
            if ($opt.attr("data-rex-option") != "edit") {
                if (layoutActive != "default") {
                    $opt.addClass("rex-hide-option");
                } else {
                    $opt.removeClass("rex-hide-option");
                }
            }
        });
        Rexlive_Modals_Utils.openModal(rexmodel_edit_props.$self.parent('.rex-modal-wrap'));

    }

    var _closeModal = function () {
        Rexlive_Modals_Utils.closeModal(rexmodel_edit_props.$self.parent('.rex-modal-wrap'));
    }

    var _linkDocumentListeners = function () {
        rexmodel_edit_props.$button.on("click", function (e) {
            var $button = $(e.target);
            var optionSelected = $button.parents(".rex-edit-model-option").attr("data-rex-option");
            var data_model_modal = {
                eventName: "",
                data_to_send: dataReceived
            }

            switch (optionSelected) {
                case "remove":
                    data_model_modal.eventName = "rexlive:modelBecameSection";
                    break;
                case "edit":
                    data_model_modal.eventName = "rexlive:editModel";
                    break;
                default:
                    break;
            }

            Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_model_modal);
            _closeModal();
        });
    }

    var _init = function () {
        var $self = $("#rex-edit-model-choose")
        var $container = $self;
        rexmodel_edit_props = {
            $self: $self,
            $button: $container.find('.rex-button'),
        }
        dataReceived = {};
        _linkDocumentListeners();
    }

    return {
        init: _init,
        openModal: _openModal,
        closeModal: _closeModal
    };

})(jQuery);