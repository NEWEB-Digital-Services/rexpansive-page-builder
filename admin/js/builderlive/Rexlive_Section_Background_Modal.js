var SectionBackground_Modal = (function ($) {
    'use strict';

    var section_background_properties;

    var _openSectionBackgroundModal = function (data) {

        Background_Section_Color_Modal.updateColorModal(data.bgColor);
        Overlay_Color_Section_Modal.updateOverlayModal(data.overlay);
        Background_Section_Image_Modal.updateImageModal(data.imageBG);
        Section_Video_Background_Modal.updateVideoModal(data.bgVideo);
        Rexlive_Modals_Utils.openModal(section_background_properties.$self.parent('.rex-modal-wrap'));
    }
    
    var _closeSectionBackgroundModal = function () {
        Background_Section_Image_Modal.resetImageModal();
        Rexlive_Modals_Utils.closeModal(section_background_properties.$self.parent('.rex-modal-wrap'));
    }

    var _linkDocumentListeners = function () {
        section_background_properties.$cancel_button.click(function (e) {
            e.preventDefault();
            _closeSectionBackgroundModal();
        });
        section_background_properties.$save_button.click(function (e) {
            e.preventDefault();
            _closeSectionBackgroundModal();
        });
    }

    var _init = function () {
        var $editSection = $("#rex-edit-background-section");
        section_background_properties = {
            $self: $editSection,
            
            $save_button: $editSection.find('#rex-edit-row-background-save'),
            $cancel_button: $editSection.find('#rex-edit-row-background-cancel'),
        }
        
        Background_Section_Color_Modal.init($editSection);
        Background_Section_Image_Modal.init($editSection);        
        Overlay_Color_Section_Modal.init($editSection);
        Section_Video_Background_Modal.init($editSection);
        _linkDocumentListeners();
    }

    return {
        init: _init,
        openSectionBackgroundModal: _openSectionBackgroundModal,
    };

})(jQuery);
