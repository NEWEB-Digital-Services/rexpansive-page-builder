var BlockOptions_Modal = (function ($) {
    'use strict';

    var block_options_properties;

    var _openBlockOptionsModal = function (data) {
        Background_Block_Color_Modal.updateColorModal(data.bgColor);
        Overlay_Color_block_Modal.updateOverlayModal(data.overlay);
        Background_Block_Image_Modal.updateImageModal(data.imageBG);
        Rexlive_Modals_Utils.openModal(block_options_properties.$self.parent('.rex-modal-wrap'));
    }

    var _closeBlockOptionsModal = function () {
        Rexlive_Modals_Utils.closeModal(block_options_properties.$self.parent('.rex-modal-wrap'));
    }

    var _linkDocumentListeners = function () {
        block_options_properties.$cancel_button.click(function (e) {
            e.preventDefault();
            _closeBlockOptionsModal();
        });
        block_options_properties.$save_button.click(function (e) {
            e.preventDefault();
            _closeBlockOptionsModal();
        });
    }

    var _init = function () {
        var $blockOptions = $("#rex-block-options");
        block_options_properties = {
            $self: $blockOptions,

            $save_button: $blockOptions.find('#block_options_save'),
            $cancel_button: $blockOptions.find('#block_options_cancel'),
        }

        _linkDocumentListeners();

        Background_Block_Color_Modal.init($blockOptions);
        Overlay_Color_block_Modal.init($blockOptions);
        Background_Block_Image_Modal.init($blockOptions);
    }

    return {
        init: _init,
        openBlockOptionsModal: _openBlockOptionsModal,
    };

})(jQuery);
