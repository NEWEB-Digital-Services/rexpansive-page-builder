
var Rexlive_Modals = (function ($) {
    'use strict';
    
    var section_config_modal_properties;

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
        Rexlive_Modals_Utils.openModal($('#rex-video-block').parent('.rex-modal-wrap'));
    }

    $(document).on('click', "#rex-upload-mp4", function () {
        Rexlive_MediaUploader.openMediaUploaderVideo();
    });

    $(document).on("click", "#rex-video-block-save", function (e) {
        var urlYoutube = $("#rex-youtube-url").val();
        var urlVimeo = $("#rex-vimeo-url").val();
        var videoMp4Data = typeof e.videoData == "undefined" ? "" : e.videoData;
        var audio = false;

        var data = {
            eventName: 'rexlive:insert_video',
            data_to_send: {
                urlYoutube: urlYoutube,
                urlVimeo: urlVimeo,
                videoMp4: videoMp4Data,
                hasAudio: audio
            }
        };

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);

        Rexlive_Modals_Utils.closeModal($('#rex-video-block').parent('.rex-modal-wrap'));
    });

    $(document).on("click", "#rex-video-block-cancel", function (e) {
        e.preventDefault();
        Rexlive_Modals_Utils.closeModal($('#rex-video-block').parent('.rex-modal-wrap'));
    });

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
    }

    return {
        init: init,
        openSectionModal: openSectionModal,
        openVideoModal: openVideoModal
    };

})(jQuery);