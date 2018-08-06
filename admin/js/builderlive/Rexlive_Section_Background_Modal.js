var SectionBackground_Modal = (function ($) {
    'use strict';

    var section_background_properties;
    var videoMp4SelectedData;

    var _openSectionBackgroundModal = function () {
        _clearVideoModal();
        Rexlive_Modals_Utils.openModal(section_background_properties.$self.parent('.rex-modal-wrap'));
    }

    var _closeVideoModal = function () {
        Rexlive_Modals_Utils.closeModal(section_background_properties.$self.parent('.rex-modal-wrap'));
    }

    var _clearFocusVideo = function () {
        section_background_properties.$youTubeWrap.removeClass("selected");
        section_background_properties.$vimeoWrap.removeClass("selected");
        section_background_properties.$mp4Wrap.removeClass("selected");
        section_background_properties.$radioChooseYoutube.attr("checked", false);
        section_background_properties.$radioChooseVimeo.attr("checked", false);
        section_background_properties.$radioChooseMp4.attr("checked", false);
    }

    var _clearVideoModal = function () {
        section_background_properties.$linkVimeo.val("");
        section_background_properties.$linkYoutube.val("");
        _clearFocusVideo();
    }

    var _focusYoutube = function () {
        section_background_properties.$youTubeWrap.addClass("selected");
        section_background_properties.$radioChooseYoutube.attr("checked", true);
    }

    var _focusVimeo = function () {
        section_background_properties.$vimeoWrap.addClass("selected");
        section_background_properties.$radioChooseVimeo.attr("checked", true);
    }

    var _focusMp4 = function () {
        section_background_properties.$mp4Wrap.addClass("selected");
        section_background_properties.$radioChooseMp4.attr("checked", true);
    }

    var _updateMp4VideoModal = function (videos) {
        videoMp4SelectedData = videos;
    }

    var _linkDocumentListeners = function () {
        $(document).on("click", "#rex-insert-new-video-block .input-field", function (e) {
            e.preventDefault();
            _clearFocusVideo();
            var $target = $(e.target);
            if (!$target.is("div")) {
                $target = $target.parents(".input-field");
            }
            var selectedtype = $target.attr("data-rex-video-type");
            switch (selectedtype) {
                case "youtube":
                    _focusYoutube();
                    break;
                case "vimeo":
                    _focusVimeo();
                    break;
                case "mp4":
                    _focusMp4();
                    break;
                default:
                    break;
            }
        });

        $(document).on("click", "#rex-insert-video-block-cancel", function (e) {
            e.preventDefault();
            _closeVideoModal();
        });

        $(document).on("click", ".set-video-audio-btn", function (e) {
            e.preventDefault();
            var $target = $(e.target);
            var $audioBtnWrapper = $target.parents(".set-video-audio-btn");
            var $checkBox = $audioBtnWrapper.find(".video-audio-checkbox");
            var check = $checkBox.attr("checked");
            check = !check;
            $checkBox.attr("checked", check);
        });

        $(document).on("click", ".rex-video-type-select", function (e) {
            e.preventDefault();
            _clearFocusVideo();

            var $target = $(e.target);
            if ($target.parents(".youtube-insert-wrap").length != 0) {
                _focusYoutube();
            } else if ($target.parents(".vimeo-insert-wrap").length != 0) {
                _focusVimeo();
            } else if ($target.parents(".mp4-insert-wrap").length != 0) {
                _focusMp4();
            }
        });

        $(document).on('click', "#rex-upload-mp4-video", function () {
            Rexlive_MediaUploader.openMediaUploaderVideo();
        });

        $(document).on("click", "#rex-insert-video-block-save", function (e) {
            var type;
            var urlYoutube;
            var urlVimeo;
            var videoMp4Data;
            var audio;
            var $selected = section_background_properties.$self.find(".video-insert-wrap.selected");

            if ($selected.hasClass("youtube-insert-wrap")) {
                type = "youtube";
                urlYoutube = section_background_properties.$linkYoutube.val();
            } else if ($selected.hasClass("vimeo-insert-wrap")) {
                type = "vimeo";
                urlVimeo = section_background_properties.$linkVimeo.val();
            } else if ($selected.hasClass("mp4-insert-wrap")) {
                type = "mp4";
                videoMp4Data = videoMp4SelectedData;
            }

            var data = {
                eventName: 'rexlive:update_section_background',
                data_to_send: {
                    urlYoutube: urlYoutube,
                    urlVimeo: urlVimeo,
                    videoMp4: videoMp4Data,
                    hasAudio: false,
                    typeVideo: type
                }
            };

            Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);

            _closeVideoModal();
        });
    }

    var _init = function () {
        var $videoModal = $("#rex-insert-new-video-block");

        section_background_properties = {
            $self: $videoModal,
            $linkYoutube: $videoModal.find("#rex-insert-youtube-url"),
            $linkVimeo: $videoModal.find("#rex-insert-vimeo-url"),
            $radioChooseYoutube: $videoModal.find("#rex-choose-youtube-video"),
            $radioChooseVimeo: $videoModal.find("#rex-choose-vimeo-video"),
            $radioChooseMp4: $videoModal.find("#rex-choose-mp4-video"),
            $youTubeWrap: $videoModal.find("#insert-video-block-wrap-1"),
            $vimeoWrap: $videoModal.find("#insert-video-block-wrap-2"),
            $mp4Wrap: $videoModal.find("#insert-video-block-wrap-3"),
        }

        videoMp4SelectedData = null;
        _linkDocumentListeners();
    }
    return {
        init: _init,
        openSectionBackgroundModal: _openSectionBackgroundModal,
        updateMp4VideoModal: _updateMp4VideoModal
    };

})(jQuery);