
var Rexlive_Modals_Live = (function ($) {
    'use strict';

    var $lean_overlay = $('.lean-overlay');
    /**
 * Open a modal dialog box
 * 
 * @param {jQuery Object} $target modal to open
 * 
 * @param {boolean}
 *            target_only active only the modal not the overlay
 * @param {Array}
 *            additional_class Array of additional classes
 */
    var OpenModal = function ($target, target_only, additional_class) {
        target_only = typeof target_only !== 'undefined' ? target_only
            : false;
        additional_class = typeof additional_class !== 'undefined' ? additional_class
            : [];

        if (!target_only) {
            $('body').addClass('rex-modal-open');
            $lean_overlay.show();
        } else {
            $target.addClass('rex-in--up');
        }
        $target.addClass('rex-in').show();

        if (additional_class.length) {
            for (var i = 0; i < additional_class.length; i++) {
                $target.find('.rex-modal').addClass(additional_class[i]);
            }
        }

        resetModalDimensions($target.find('.rex-modal'));
    };

    /**
     * Close a modal dialog box
     * 
     * @param {jQuery Object} $target modal to close
     */
    var CloseModal = function ($target, target_only, additional_class) {
        target_only = typeof target_only !== 'undefined' ? target_only
            : false;
        additional_class = typeof additional_class !== 'undefined' ? additional_class
            : [];

        if (!target_only && !$target.hasClass('rex-in--up')) {
            $('body').removeClass('rex-modal-open');
            $lean_overlay.hide();
        }
        $target.removeClass('rex-in').hide();
        if ($target.hasClass('rex-in--up')) {
            $target.removeClass('rex-in--up');
        }

        if (additional_class.length) {
            for (var i = 0; i < additional_class.length; i++) {
                $target.find('.rex-modal').removeClass(additional_class[i]);
            }
        }

        resetModalDimensions($target.find('.rex-modal'));
    };

    /**
     * reset a modal height to prevent dynamic content bugs
     * 
     * @param {jQuery Object} $target
     */
    var resetModalDimensions = function ($target) {
        $target.css('height', 'auto');
        $target.css('width', 'auto');
    };

    var openVideoModal = function () {
        OpenModal($('#rex-video-block').parent('.rex-modal-wrap'));
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

        CloseModal($('#rex-video-block').parent('.rex-modal-wrap'));
    });

    $(document).on("click", "#rex-video-block-cancel", function (e) {
        console.log("cancel");
        CloseModal($('#rex-video-block').parent('.rex-modal-wrap'));
    });

    return {
        openVideoModal: openVideoModal
    };

})(jQuery);