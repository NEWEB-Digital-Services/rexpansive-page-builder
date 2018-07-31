
var Rexlive_Modals = (function ($) {
    'use strict';

    var section_config_modal_properties;
    var insert_new_block_video_properties;

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
        Rexlive_Modals_Utils.openModal($('#rex-insert-new-video-block').parent('.rex-modal-wrap'));
    }

    $(document).on('click', "#rex-upload-mp4-video", function () {
        Rexlive_MediaUploader.openMediaUploaderVideo();
    });

    $(document).on("click", "#rex-insert-video-block-save", function (e) {
        var urlYoutube = insert_new_block_video_properties.$linkYoutube.val();
        var urlVimeo = insert_new_block_video_properties.$linkVimeo.val();
        var urlMp4 = insert_new_block_video_properties.$linkMp4.val();
        var idMp4 = parseInt(insert_new_block_video_properties.$linkMp4.attr("data-rex-mp4-id"));

        var audio = false;

        var data = {
            eventName: 'rexlive:insert_video',
            data_to_send: {
                urlYoutube: urlYoutube,
                urlVimeo: urlVimeo,
                urlMp4: urlMp4,
                idMp4: idMp4,
                hasAudio: audio
            }
        };

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);

        Rexlive_Modals_Utils.closeModal($('#rex-insert-new-video-block').parent('.rex-modal-wrap'));
    });

    $(document).on("click", "#rex-insert-video-block-cancel", function (e) {
        console.log("closing modal");
        e.preventDefault();
        Rexlive_Modals_Utils.closeModal($('#rex-insert-new-video-block').parent('.rex-modal-wrap'));
    });

    $(document).on("click", ".rex-video-type-select", function (e) {
        var $target = $(e.target);
        _removeFocusVideoSelected();
        if ($target.parents(".youtube-insert-wrap").length != 0) {
            insert_new_block_video_properties.$youTubeWrap.addClass("selected");
        } else if ($target.parents(".vimeo-insert-wrap").length != 0) {
            insert_new_block_video_properties.$vimeoWrap.addClass("selected");
        } else if ($target.parents(".mp4-insert-wrap").length != 0) {
            insert_new_block_video_properties.$mp4Wrap.addClass("selected");
        }
    });

    var _removeFocusVideoSelected = function () {
        insert_new_block_video_properties.$youTubeWrap.removeClass("selected");
        insert_new_block_video_properties.$vimeoWrap.removeClass("selected");
        insert_new_block_video_properties.$mp4Wrap.removeClass("selected");
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
            $linkMp4: $("#rex-insert-mp4-url"),
            $audioYoutube: $("#rex-new-block-video-youtube-audio"),
            $audioVimeo: $("#rex-new-block-video-vimeo-audio"),
            $audioMp4: $("#rex-new-block-video-mp4-audio"),
            $youTubeWrap: $(".youtube-insert-wrap"),
            $vimeoWrap: $(".vimeo-insert-wrap"),
            $mp4Wrap: $(".mp4-insert-wrap")
        }

    }

    return {
        init: init,
        openSectionModal: openSectionModal,
        openVideoModal: openVideoModal
    };

})(jQuery);