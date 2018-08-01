
var Rexlive_Modals = (function ($) {
    'use strict';

    var section_config_modal_properties;
    var insert_new_block_video_properties;
    var videoMp4SelectedData;

    var openSectionModal = function () {
        Rexlive_Modals_Utils.openModal($('#modal-background-responsive-set').parent('.rex-modal-wrap'));
    }

    $(document).on('click', '#backresponsive-set-cancel', function (e) {
        e.preventDefault();
        Rexlive_Modals_Utils.closeModal($('#modal-background-responsive-set').parent('.rex-modal-wrap'));
    });

    $(document).on('click', '#backresponsive-set-save', function (e) {
        e.preventDefault();
        // console.log(this);
        //@todo manca lettura layout 
        var newLayout = section_config_modal_properties.$section_layout_type.filter(':checked').val();
        var fullHeight = (true === section_config_modal_properties.$is_full.prop('checked') ? 'true' : 'false');

        //recuperare dati
        /*
        var section_id = $(this).attr('data-section_id'),
            color = $('.backresponsive-color-section').spectrum('get'),
            opacity = $('.backresponsive-opacity-section').val(),
            gutter = $('.section-set-block-gutter').val(),
            custom_classes = $('#section-set-custom-class').val(),
            section_width = '',
            section_is_full_width = (true === section_config_modal_properties.$section_full.prop('checked') ? 'true' : 'false'),
            section_is_boxed_width = (true === section_config_modal_properties.$section_boxed.prop('checked') ? 'true' : 'false'),
            isFull = (true === section_config_modal_properties.$is_full.prop('checked') ? 'true' : ''),
            holdGrid = (true === section_config_modal_properties.$hold_grid.prop('checked') ? 'true' : 'false'),
            //has_small_overlay = ( true  === 	section_config_modal_properties.$has_overlay_small.prop('checked') ? 'true' : '' ), 
            //has_medium_overlay = ( true === section_config_modal_properties.$has_overlay_medium.prop('checked') ? 'true' : '' ), 
            //has_large_overlay = ( true === section_config_modal_properties.$has_overlay_large.prop('checked') ? 'true' : '' ), 
            section_custom_name = section_config_modal_properties.$section_id.val(),
            layout = section_config_modal_properties.$section_layout_type.filter(':checked').val();
            */
        //var $row = $('.builder-row[data-count=' + 	section_id + ']'); $row.attr('data-layout', layout);

        var data = {
            eventName: "rexlive:set_gallery_layout",
            data_to_send: {
                newLayout: newLayout,
                fullHeight: fullHeight
            }
        };

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);

        Rexlive_Modals_Utils.closeModal($('#modal-background-responsive-set').parent('.rex-modal-wrap'));
    });


    var openVideoModal = function () {
        _clearVideoModal();
        Rexlive_Modals_Utils.openModal(insert_new_block_video_properties.$self.parent('.rex-modal-wrap'));
    }

    var _closeVideoModal = function () {
        Rexlive_Modals_Utils.closeModal(insert_new_block_video_properties.$self.parent('.rex-modal-wrap'));
    }

    var _focusYoutube = function () {
        insert_new_block_video_properties.$youTubeWrap.addClass("selected");
        insert_new_block_video_properties.$radioChooseYoutube.attr("checked", true);
    }

    var _focusVimeo = function () {
        insert_new_block_video_properties.$vimeoWrap.addClass("selected");
        insert_new_block_video_properties.$radioChooseVimeo.attr("checked", true);
    }
    var _focusMp4 = function () {
        insert_new_block_video_properties.$mp4Wrap.addClass("selected");
        insert_new_block_video_properties.$radioChooseMp4.attr("checked", true);
    }

    var _clearFocusVideo = function () {
        insert_new_block_video_properties.$youTubeWrap.removeClass("selected");
        insert_new_block_video_properties.$vimeoWrap.removeClass("selected");
        insert_new_block_video_properties.$mp4Wrap.removeClass("selected");
        insert_new_block_video_properties.$radioChooseYoutube.attr("checked", false);
        insert_new_block_video_properties.$radioChooseVimeo.attr("checked", false);
        insert_new_block_video_properties.$radioChooseMp4.attr("checked", false);
    }

    var _clearVideoModal = function () {
        insert_new_block_video_properties.$linkVimeo.val("");
        insert_new_block_video_properties.$linkYoutube.val("");
        _clearFocusVideo();
    }

    var _updateMp4VideoModal = function (videos) {
        videoMp4SelectedData = videos;
    }

    var _linkDocumentListenersVideoInsertModal = function () {
        $(document).on("click", ".input-field", function (e) {
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
            var $selected = insert_new_block_video_properties.$self.find(".video-insert-wrap.selected");

            if ($selected.hasClass("youtube-insert-wrap")) {
                type = "youtube";
                urlYoutube = insert_new_block_video_properties.$linkYoutube.val();
                audio = insert_new_block_video_properties.$audioYoutube.attr("checked");
            } else if ($selected.hasClass("vimeo-insert-wrap")) {
                type = "vimeo";
                urlVimeo = insert_new_block_video_properties.$linkVimeo.val();
                audio = insert_new_block_video_properties.$audioVimeo.attr("checked");
            } else if ($selected.hasClass("mp4-insert-wrap")) {
                type = "mp4";
                videoMp4Data = videoMp4SelectedData;
                audio = insert_new_block_video_properties.$audioMp4.attr("checked");
            }

            audio = typeof audio != "undefined" && audio == "checked";

            var data = {
                eventName: 'rexlive:insert_video',
                data_to_send: {
                    urlYoutube: urlYoutube,
                    urlVimeo: urlVimeo,
                    videoMp4: videoMp4Data,
                    hasAudio: audio,
                    typeVideo: type
                }
            };

            Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);

            _closeVideoModal();
        });
    }

    var init = function () {
        section_config_modal_properties = {
            $section_layout_type: $('.rex-edit-layout-wrap'),
            $section_fixed: $('#section-fixed'),
            $section_masonry: $('#section-masonry'),
            $section_full: $('#section-full-modal'),
            $section_boxed: $('#section-boxed-modal'),
            $section_boxed_width: $('.section-set-boxed-width'),
            $section_boxed_width_type: $('.section-width-type'),

            // FULL height configuration
            $is_full: $('#section-is-full'),
            // HOLD GRID config
            $hold_grid: $("#rx-hold-grid"),
            // ID and navigator configuration
            $section_id: $('#sectionid-container'),
            $save_button: $('#backresponsive-set-save'),

            $block_gutter: $('.section-set-block-gutter'),
            // Row separator
            $row_separator_top: $('#row-separator-top'),
            $row_separator_right: $('#row-separator-right'),
            $row_separator_bottom: $('#row-separator-bottom'),
            $row_separator_left: $('#row-separator-left'),

            // Row margin
            $row_margin_top: $('#row-margin-top'),
            $row_margin_right: $('#row-margin-right'),
            $row_margin_bottom: $('#row-margin-bottom'),
            $row_margin_left: $('#row-margin-left'),

            // Row zoom
            $section_active_photoswipe: $('#section-active-photoswipe'),
            section_photoswipe_changed: false,
        };

        insert_new_block_video_properties = {
            $self: $("#rex-insert-new-video-block"),
            $linkYoutube: $("#rex-insert-youtube-url"),
            $linkVimeo: $("#rex-insert-vimeo-url"),
            $audioYoutube: $("#rex-new-block-video-youtube-audio"),
            $audioVimeo: $("#rex-new-block-video-vimeo-audio"),
            $audioMp4: $("#rex-new-block-video-mp4-audio"),
            $radioChooseYoutube: $("#rex-choose-youtube-video"),
            $radioChooseVimeo: $("#rex-choose-vimeo-video"),
            $radioChooseMp4: $("#rex-choose-mp4-video"),
            $youTubeWrap: $(".youtube-insert-wrap"),
            $vimeoWrap: $(".vimeo-insert-wrap"),
            $mp4Wrap: $(".mp4-insert-wrap")
        }

        videoMp4SelectedData = null;
        _linkDocumentListenersVideoInsertModal();
    }

    return {
        init: init,
        openSectionModal: openSectionModal,
        openVideoModal: openVideoModal,
        updateMp4VideoModal: _updateMp4VideoModal
    };

})(jQuery);