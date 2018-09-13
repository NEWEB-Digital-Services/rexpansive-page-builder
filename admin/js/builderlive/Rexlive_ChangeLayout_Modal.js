var Change_Layout_Modal = (function ($) {
    'use strict';
    var layout_changing_props;
    var activeLayoutPage;
    var buttonData;

    var _openModal = function (data) {
        activeLayoutPage = data.activeLayout;
        buttonData = data.buttonData;
        console.log("page status saved: ", data.pageSaved);
        console.log("model status saved: ", data.modelSaved);
        Rexlive_Modals_Utils.openModal(layout_changing_props.$self.parent('.rex-modal-wrap'));
    }

    var _closeModal = function () {
        Rexlive_Modals_Utils.closeModal(layout_changing_props.$self.parent('.rex-modal-wrap'));
    }

    var _linkDocumentListeners = function () {
        layout_changing_props.$button.on("click", function (e) {
            var $button = $(e.target);
            var optionSelected = $button.parents(".rex-edit-option").attr("data-rex-option");

            switch (optionSelected) {
                case "save":
                    Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find(".btn-save").addClass("rex-saving");
                    var dataSavePage = {
                        eventName: "rexlive:savePage",
                        data_to_send: {
                            buttonData: buttonData,
                        }
                    }
                    var dataSaveModel = {
                        eventName: "rexlive:saveModel",
                        data_to_send: {
                            buttonData: buttonData,
                        }
                    }
                    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataSavePage);
                    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataSaveModel);
                    break;
                case "continue":
                    var data = {
                        eventName: "rexlive:dropChanges",
                        data_to_send: {
                            selected: activeLayoutPage,
                            eventName: "",
                            buttonData: buttonData,
                        }
                    }
                    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
                    break;
                case "abort":
                    break;
                default:
                    break;
            }

            _closeModal();
        });
    }

    var _init = function () {
        var $self = $("#rex-layout-page-changed")
        var $container = $self;
        layout_changing_props = {
            $self: $self,
            $button: $container.find('.rex-button'),
        }
        _linkDocumentListeners();
    }

    return {
        init: _init,
        openModal: _openModal,
        closeModal: _closeModal
    };

})(jQuery);