var SectionBackground_Modal = (function ($) {
    'use strict';

    var section_background_properties;

    var _openSectionBackgroundModal = function (data) {

        Background_Color_Modal.updateColorModal(data.bgColor);
        Overlay_Color_Modal.updateOverlayModal(data.overlay);
        Background_Image_Modal.updateImageModal(data.imageBG);
        Rexlive_Modals_Utils.openModal(section_background_properties.$self.parent('.rex-modal-wrap'));
    }
    
    var _closeSectionBackgroundModal = function () {
        Background_Image_Modal.resetImageModal();
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

            $linkYoutube: $editSection.find("#rex-insert-youtube-url"),
            $linkVimeo: $editSection.find("#rex-insert-vimeo-url"),
            $radioChooseYoutube: $editSection.find("#rex-choose-youtube-video"),
            $radioChooseVimeo: $editSection.find("#rex-choose-vimeo-video"),
            $radioChooseMp4: $editSection.find("#rex-choose-mp4-video"),
            $youTubeWrap: $editSection.find("#insert-video-block-wrap-1"),
            $vimeoWrap: $editSection.find("#insert-video-block-wrap-2"),
            $mp4Wrap: $editSection.find("#insert-video-block-wrap-3"),

            $save_button: $editSection.find('#rex-edit-row-background-save'),
            $cancel_button: $editSection.find('#rex-edit-row-background-cancel'),
        }

        Background_Color_Modal.init($editSection);
        Background_Image_Modal.init($editSection);
        Overlay_Color_Modal.init($editSection);
        _linkDocumentListeners();
    }

    return {
        init: _init,
        openSectionBackgroundModal: _openSectionBackgroundModal,
    };

})(jQuery);
