
var Button_Name_Modal = (function ($) {
    var rex_button_name_properties;

    var _openModal = function () {
        Rexlive_Modals_Utils.openModal(
            rex_button_name_properties.$self.parent(".rex-modal-wrap")
        );
    };

    var _closeModal = function () {
        Rexlive_Modals_Utils.closeModal(
            rex_button_name_properties.$self.parent(".rex-modal-wrap")
        );
    };

    var _linkDocumentListeners = function () {
        rex_button_name_properties.$close_button.on("click", function () {
            _closeModal();
        })
        rex_button_name_properties.$addModel.on("click", function () {
            var name = rex_button_name_properties.$name.val();
            if(name != ""){
                _closeModal();
                Button_Edit_Modal.createNewButton();
            }
        });
    };

    var _init = function () {
        var $self = $("#rex-add-button-name-modal");
        var $container = $self;
        rex_button_name_properties = {
            $self: $self,
            $name: $container.find("#rex-button__name_model"),
            $addModel: $container.find("#rex-button-name-add-model-wrap"),
            $close_button: $container.find(".rex-modal__close-button")
        };
        _linkDocumentListeners();
    };

    return {
        init: _init,
        openModal: _openModal
    };
})(jQuery);
