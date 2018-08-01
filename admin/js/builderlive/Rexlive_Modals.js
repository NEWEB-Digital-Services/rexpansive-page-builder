
var Rexlive_Modals = (function ($) {
    'use strict';

    var insert_new_block_video_properties;
    var videoMp4SelectedData;

    var section_config_modal_properties;
    var oldSectionWidthData;
    var defaultSectionWidthData;

    var _openSectionModal = function (data) {
        _clearSectionModal();
        _updateSectionModal(data);
        Rexlive_Modals_Utils.openModal(section_config_modal_properties.$self.parent('.rex-modal-wrap'));
    }

    var _closeSectionModal = function () {
        _resetSetionModalData();
        Rexlive_Modals_Utils.closeModal(section_config_modal_properties.$self.parent('.rex-modal-wrap'));
    }

    var _resetSetionModalData = function () {
        oldSectionWidthData.dimension = "";
        oldSectionWidthData.sectionWidth = "";
        oldSectionWidthData.widthType = "";
    }

    var _clearSectionModal = function () {
        _clearLayoutTypeSelection();
        _clearSectionWidth();
        _clearFullHeight();
    }

    var _focusLayout = function (layoutName) {
        var $layoutWrap = section_config_modal_properties.$section_layout_types_wrap.children("[data-rex-layout=\"" + layoutName + "\"]");
        $layoutWrap.addClass("selected");
        $layoutWrap.find("input").attr("checked", true);
    }

    var _clearFullHeight = function () {
        section_config_modal_properties.$is_full.prop('checked', false);
    }

    var _updateFullHeight = function (active) {
        section_config_modal_properties.$is_full.prop('checked', active == "true");
    }

    var _updateSectionWidth = function (dimension, sectionWidth) {
        _clearSectionWidth();

        var widthType = "%";
        var width = "100";

        if (dimension != "full") {
            width = parseInt(sectionWidth);
            if (sectionWidth.indexOf("%") == -1) {
                widthType = "px";
            }
        }

        oldSectionWidthData.type = dimension;
        oldSectionWidthData.sectionWidth = width;
        oldSectionWidthData.dimension = widthType;

        section_config_modal_properties.$section_boxed_width.val(width);

        var $sectionWidthWrap = section_config_modal_properties.$section_width_type.children("[data-rex-section-width=\"" + dimension + "\"]");
        $sectionWidthWrap.addClass("selected");
        $sectionWidthWrap.find("input").attr("checked", true);

        var $sectionBoxedWidthTypeWrap = section_config_modal_properties.$section_boxed_width_wrap.children("[data-rex-section-width-type=\"" + widthType + "\"]");
        $sectionBoxedWidthTypeWrap.addClass("selected");
        $sectionBoxedWidthTypeWrap.find("input").attr("checked", true);
    }

    var _updateSectionModal = function (data) {
        console.log(data);
        _focusLayout(data.activeLayout);
        _updateSectionWidth(data.dimension, data.section_width);
        _updateFullHeight(data.fullHeight);
    }

    var _clearLayoutTypeSelection = function () {
        section_config_modal_properties.$section_layout_typeWrap.each(function (i, el) {
            $(el).removeClass("selected");
            $(el).find("input").attr("checked", false);
        });
    }

    var _clearSectionWidth = function () {
        section_config_modal_properties.$section_width_type_wrap.each(function (i, el) {
            $(el).removeClass("selected");
            $(el).find("input").attr("checked", false);
        });
        section_config_modal_properties.$section_boxed_width.val("");
    }

    var _clearSectionBoxedWidthType = function () {
        section_config_modal_properties.$section_boxed_width_wrap.children().each(function (i, el) {
            $(el).removeClass("selected");
            $(el).find("input").attr("checked", false);
        });
    }

    var _updateSectionBoxedWidthData = function (data) {
        _clearSectionBoxedWidthType();
        section_config_modal_properties.$section_boxed_width.val(data.sectionWidth);
        var $sectionBoxedWidthTypeWrap = section_config_modal_properties.$section_boxed_width_wrap.children("[data-rex-section-width-type=\"" + data.dimension + "\"]");
        $sectionBoxedWidthTypeWrap.addClass("selected");
        $sectionBoxedWidthTypeWrap.find("input").attr("checked", true);
    }

    var _linkDocumentListenersSectionPropertiesModal = function () {

        $(document).on("click", "#modal-background-responsive-set .boxed-width-type-wrap", function (e) {
            e.preventDefault();
            var wasFull = section_config_modal_properties.$section_width_type.children(".selected").attr("data-rex-section-width") == "full";
            _clearSectionBoxedWidthType();
            var $sectionBoxedWidthTypeWrap = $(e.target).parents(".boxed-width-type-wrap");
            $sectionBoxedWidthTypeWrap.addClass("selected");
            $sectionBoxedWidthTypeWrap.find("input").attr("checked", true);

            if (wasFull && $sectionBoxedWidthTypeWrap.attr("data-rex-section-width-type") == "px") {
                _clearSectionWidth();
                var $sectionWidthWrap = section_config_modal_properties.$section_width_type.children("[data-rex-section-width=\"boxed\"]");
                $sectionWidthWrap.addClass("selected");
                $sectionWidthWrap.find("input").attr("checked", true);
                section_config_modal_properties.$section_boxed_width.val(defaultSectionWidthData.boxed.sectionWidth);
            }

        });

        $(document).on("click", "#modal-background-responsive-set .rexlive-section-width", function (e) {
            e.preventDefault();
            _clearSectionWidth();
            var $sectionWidthTypeWrap = $(e.target).parents(".rexlive-section-width");
            $sectionWidthTypeWrap.addClass("selected");
            $sectionWidthTypeWrap.find("input").attr("checked", true);
            var selectedType = $sectionWidthTypeWrap.attr("data-rex-section-width");
            if (selectedType != oldSectionWidthData.type) {
                if (selectedType == "boxed") {
                    _updateSectionBoxedWidthData(defaultSectionWidthData.boxed);
                } else {
                    _updateSectionBoxedWidthData(defaultSectionWidthData.full);
                }
            } else {
                _updateSectionBoxedWidthData(oldSectionWidthData);
            }
        });

        $(document).on("click", "#modal-background-responsive-set .rexlive-layout-type", function (e) {
            e.preventDefault();
            _clearLayoutTypeSelection();
            var $layoutWrap = $(e.target).parents(".rexlive-layout-type");
            $layoutWrap.addClass("selected");
            $layoutWrap.find("input").attr("checked", true);
        });

        $(document).on('click', '#backresponsive-set-save', function (e) {
            e.preventDefault();

            var $wrapLayoutType = section_config_modal_properties.$section_layout_types_wrap;
            var newLayout = $wrapLayoutType.children(".selected").attr("data-rex-layout");

            var section_width = section_config_modal_properties.$section_boxed_width.val();
            var section_width_boxed_type = section_config_modal_properties.$section_boxed_width_wrap.children(".selected").attr("data-rex-section-width-type");

            var fullHeight = (true === section_config_modal_properties.$is_full.prop('checked') ? 'true' : 'false');

            var custom_classes = $('#section-set-custom-class').val();
            var section_is_full_width = (true === section_config_modal_properties.$section_full.prop('checked') ? 'true' : 'false');
            var section_is_boxed_width = (true === section_config_modal_properties.$section_boxed.prop('checked') ? 'true' : 'false');
            var holdGrid = (true === section_config_modal_properties.$hold_grid.prop('checked') ? 'true' : 'false');
            var section_custom_name = section_config_modal_properties.$section_id.val();

            console.log(custom_classes, section_width, section_is_full_width, section_is_boxed_width, holdGrid, section_custom_name);

            var data = {
                eventName: "rexlive:set_gallery_layout",
                data_to_send: {
                    layout: newLayout,
                    fullHeight: fullHeight,
                    sectionWidth: {
                        width: section_width,
                        type: section_width_boxed_type
                    }
                }
            };

            console.log(data.data_to_send);
            Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);

            _closeSectionModal();
        });

        $(document).on('click', '#backresponsive-set-cancel', function (e) {
            e.preventDefault();
            _closeSectionModal();
        });
    }

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
        var $sectionConfigModal = $('#modal-background-responsive-set');
        section_config_modal_properties = {
            $self: $sectionConfigModal,

            $section_layout_typeWrap: $sectionConfigModal.find(".rexlive-layout-type"),
            $section_layout_types_wrap: $sectionConfigModal.find('.rex-edit-layout-wrap'),
            $section_fixed: $sectionConfigModal.find('#section-fixed'),
            $section_masonry: $sectionConfigModal.find('#section-masonry'),

            //section width options
            $section_width_type_wrap: $sectionConfigModal.find(".rexlive-section-width"),
            $section_width_type: $sectionConfigModal.find(".rex-edit-section-width"),
            $section_full: $sectionConfigModal.find('#section-full-modal'),
            $section_boxed: $sectionConfigModal.find('#section-boxed-modal'),
            $section_boxed_width: $sectionConfigModal.find('.section-set-boxed-width'),
            $section_boxed_width_type: $sectionConfigModal.find('.section-width-type'),
            $section_boxed_width_wrap: $sectionConfigModal.find('.section-set-boxed-width-wrap'),

            // FULL height configuration
            $is_full: $sectionConfigModal.find('#section-is-full'),
            // HOLD GRID config
            $hold_grid: $sectionConfigModal.find("#rx-hold-grid"),
            // ID and navigator configuration
            $section_id: $sectionConfigModal.find('#sectionid-container'),
            $save_button: $sectionConfigModal.find('#backresponsive-set-save'),

            $block_gutter: $sectionConfigModal.find('.section-set-block-gutter'),
            // Row separator
            $row_separator_top: $sectionConfigModal.find('#row-separator-top'),
            $row_separator_right: $sectionConfigModal.find('#row-separator-right'),
            $row_separator_bottom: $sectionConfigModal.find('#row-separator-bottom'),
            $row_separator_left: $sectionConfigModal.find('#row-separator-left'),

            // Row margin
            $row_margin_top: $sectionConfigModal.find('#row-margin-top'),
            $row_margin_right: $sectionConfigModal.find('#row-margin-right'),
            $row_margin_bottom: $sectionConfigModal.find('#row-margin-bottom'),
            $row_margin_left: $sectionConfigModal.find('#row-margin-left'),

            // Row zoom
            $section_active_photoswipe: $sectionConfigModal.find('#section-active-photoswipe'),
            section_photoswipe_changed: false,
        };

        defaultSectionWidthData = {
            boxed: {
                type: "boxed",
                dimension: "%",
                sectionWidth: "80"
            },
            full: {
                type: "full",
                dimension: "%",
                sectionWidth: "100"
            }
        }

        oldSectionWidthData = {
            dimension: "",
            sectionWidth: "",
            widthType: ""
        }

        var $videoModal = $("#rex-insert-new-video-block");

        insert_new_block_video_properties = {
            $self: $videoModal,
            $linkYoutube: $videoModal.find("#rex-insert-youtube-url"),
            $linkVimeo: $videoModal.find("#rex-insert-vimeo-url"),
            $audioYoutube: $videoModal.find("#rex-new-block-video-youtube-audio"),
            $audioVimeo: $videoModal.find("#rex-new-block-video-vimeo-audio"),
            $audioMp4: $videoModal.find("#rex-new-block-video-mp4-audio"),
            $radioChooseYoutube: $videoModal.find("#rex-choose-youtube-video"),
            $radioChooseVimeo: $videoModal.find("#rex-choose-vimeo-video"),
            $radioChooseMp4: $videoModal.find("#rex-choose-mp4-video"),
            $youTubeWrap: $videoModal.find("#insert-video-block-wrap-1"),
            $vimeoWrap: $videoModal.find("#insert-video-block-wrap-2"),
            $mp4Wrap: $videoModal.find("#insert-video-block-wrap-3"),
        }

        videoMp4SelectedData = null;
        _linkDocumentListenersVideoInsertModal();
        _linkDocumentListenersSectionPropertiesModal();
    }

    return {
        init: init,
        openSectionModal: _openSectionModal,
        openVideoModal: openVideoModal,
        updateMp4VideoModal: _updateMp4VideoModal
    };

})(jQuery);