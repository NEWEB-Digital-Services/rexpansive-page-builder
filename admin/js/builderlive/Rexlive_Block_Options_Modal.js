var BlockOptions_Modal = (function ($) {
    'use strict';

    var block_options_properties;

    var _openBlockOptionsModal = function (data) {
        Background_Block_Color_Modal.updateColorModal(data.bgColor);
        Overlay_Color_block_Modal.updateOverlayModal(data.overlay);
        Background_Block_Image_Modal.updateImageModal(data.imageBG);
        Block_Video_Background_Modal.updateVideoModal(data.bgVideo);
        BlockPaddings_Modal.updatePaddings(data.paddings);
        Block_Content_Positions_Modal.updatePosition(data.flexPosition);
        Block_CustomClasses_Modal.updateCustomClasses(data.customClasses);
        Block_Url_Modal.updateBlockUrl(data.linkBlock);
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
        Block_Video_Background_Modal.init($blockOptions);
        BlockPaddings_Modal.init($blockOptions);
        Block_Content_Positions_Modal.init($blockOptions);
        Block_CustomClasses_Modal.init($blockOptions);
        Block_Url_Modal.init($blockOptions);
    }

    return {
        init: _init,
        openBlockOptionsModal: _openBlockOptionsModal,
    };

})(jQuery);
