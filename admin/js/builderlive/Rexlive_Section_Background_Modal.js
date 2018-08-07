var SectionBackground_Modal = (function ($) {
    'use strict';

    var section_background_properties;

    var _openSectionBackgroundModal = function (data) {

        Background_Color_Modal.updateColorModal(data.color);

        section_background_properties.$image_url.val(data.idImage);
        if (data.idImage != "") {
            section_background_properties.$image_preview.css('backgroundImage', 'url(' + data.imageUrl + ')')
            section_background_properties.$image_preview.find("i").css("display", "none");
        }

        Rexlive_Modals_Utils.openModal(section_background_properties.$self.parent('.rex-modal-wrap'));
    }

    var _closeSectionBackgroundModal = function () {
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

        section_background_properties.$image_upload_wrap.click(function (e) {
            Rexlive_MediaUploader.openEditImageMediaUploader(section_background_properties.$image_url, section_background_properties.$image_preview, section_background_properties.$image_url.val());
        });
    }

    var _init = function () {
        var $editSection = $("#rex-edit-background-section");
        section_background_properties = {
            $self: $editSection,

            $image_upload_wrap: $editSection.find('#bg-section-set-img-wrap'),
            $type_image: $editSection.find('#background-section-value-image'),
            $image_preview: $editSection.find('#bg-section-img-preview'),
            $image_preview_icon: $editSection.find('#bg-section-img-preview i'),
            $image_url: $editSection.find('#background-section-url'),
            $image_id: $editSection.find('#background-section-up-img'),

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
        Overlay_Color_Modal.init($editSection);
        _linkDocumentListeners();
    }

    return {
        init: _init,
        openSectionBackgroundModal: _openSectionBackgroundModal
    };

})(jQuery);
