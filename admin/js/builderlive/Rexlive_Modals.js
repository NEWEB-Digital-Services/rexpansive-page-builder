
var Rexlive_Modals = (function ($) {
    'use strict';

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

    }

    return {
        init: init,
        openVideoModal: openVideoModal
    };

})(jQuery);