/**
 * Object that handles the Modal of the video inserting
 * @since 2.0.0
 */
var Insert_Video_Modal = (function($) {
  "use strict";

  var insert_video_properties;
  var videoMp4SelectedData;
  var sectionTarget;

  var _openVideoModal = function(data) {
    _clearVideoModal();
    sectionTarget = data.sectionTarget;
    Rexlive_Modals_Utils.openModal(
      insert_video_properties.$self.parent(".rex-modal-wrap")
    );
  };

  var _closeVideoModal = function() {
    Rexlive_Modals_Utils.closeModal(
      insert_video_properties.$self.parent(".rex-modal-wrap")
    );
  };

  var _clearFocusVideo = function() {
    insert_video_properties.$youTubeWrap.removeClass("selected");
    insert_video_properties.$vimeoWrap.removeClass("selected");
    insert_video_properties.$mp4Wrap.removeClass("selected");
    insert_video_properties.$radioChooseYoutube.attr("checked", false);
    insert_video_properties.$radioChooseVimeo.attr("checked", false);
    insert_video_properties.$radioChooseMp4.attr("checked", false);
  };

  var _clearVideoModal = function() {
    insert_video_properties.$linkVimeo.val("");
    insert_video_properties.$linkYoutube.val("");
    insert_video_properties.$linkMp4.val("").next('label').removeClass('active');
    _clearFocusVideo();
  };

  var _focusYoutube = function() {
    insert_video_properties.$youTubeWrap.addClass("selected");
    insert_video_properties.$radioChooseYoutube.attr("checked", true);

    insert_video_properties.$linkYoutube.trigger("focus");
    console.log("passed || [INSERT] _focusYoutube()");
    
  };

  var _focusVimeo = function() {
    insert_video_properties.$vimeoWrap.addClass("selected");
    insert_video_properties.$radioChooseVimeo.attr("checked", true);

    insert_video_properties.$linkVimeo.trigger("focus");
    console.log("passed || [INSERT] _focusVimeo()");

  };

  var _focusMp4 = function() {
    insert_video_properties.$mp4Wrap.addClass("selected");
    insert_video_properties.$radioChooseMp4.attr("checked", true);

    //insert_video_properties.$linkMp4.trigger("focus");
    //console.log("passed || [INSERT] _focusMp4()");

  };

  var _updateMp4VideoModal = function(videos) {
    videoMp4SelectedData = videos;
    insert_video_properties.$linkMp4.val(videos[0].videoUrl).next('label').addClass('active');

    insert_video_properties.$linkMp4.trigger("focus");
    console.log("passed || [INSERT] _updateMp4VideoModal())");

  };

  var _linkDocumentListeners = function() {
    insert_video_properties.$self.find(".input-field").click(function(e) {
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

    insert_video_properties
      .$close_modal_btn
      .click(function(e) {
        e.preventDefault();
        _closeVideoModal();
      });

    insert_video_properties.$self
      .find(".set-video-audio-btn")
      .click(function(e) {
        e.preventDefault();
        var $target = $(e.target);
        var $audioBtnWrapper = $target.parents(".set-video-audio-btn");
        var $checkBox = $audioBtnWrapper.find(".video-audio-checkbox");
        var check = $checkBox.attr("checked");
        check = !check;
        $checkBox.attr("checked", check);
      });

    insert_video_properties.$self
      .find(".rex-video-type-select")
      .click(function(e) {
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
    insert_video_properties.$self
      .find("#rex-upload-mp4-video")
      .click(function(e) {
        Rexlive_MediaUploader.openInsertVideoBlocksMediaUploader();
      });

    insert_video_properties.$self
      .find("#rex-insert-video-block-save")
      .click(function(e) {
        var type;
        var urlYoutube;
        var urlVimeo;
        var videoMp4Data;
        var audio;
        var $selected = insert_video_properties.$self.find(
          ".video-insert-wrap.selected"
        );

        if ($selected.hasClass("youtube-insert-wrap")) {
          type = "youtube";
          urlYoutube = insert_video_properties.$linkYoutube.val();
          audio = insert_video_properties.$audioYoutube.attr("checked");
        } else if ($selected.hasClass("vimeo-insert-wrap")) {
          type = "vimeo";
          urlVimeo = insert_video_properties.$linkVimeo.val();
          audio = insert_video_properties.$audioVimeo.attr("checked");
        } else if ($selected.hasClass("mp4-insert-wrap")) {
          type = "mp4";
          videoMp4Data = videoMp4SelectedData;
          audio = insert_video_properties.$audioMp4.attr("checked");
        }

        audio = typeof audio != "undefined" && audio == "checked";

        var data = {
          eventName: "rexlive:insert_video",
          data_to_send: {
            urlYoutube: urlYoutube,
            urlVimeo: urlVimeo,
            videoMp4: videoMp4Data,
            hasAudio: audio,
            typeVideo: type,
            sectionTarget: sectionTarget
          }
        };

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);

        _closeVideoModal();
      });
  };

  var _init = function() {
    var $videoModal = $("#rex-insert-new-video-block");

    insert_video_properties = {
      $self: $videoModal,
      $close_modal_btn: $videoModal.find('.rex-modal__close-button'),
      $linkYoutube: $videoModal.find("#rex-insert-youtube-url"),
      $linkVimeo: $videoModal.find("#rex-insert-vimeo-url"),
      $linkMp4: $videoModal.find("#rex-insert-mp4-url"),
      $audioYoutube: $videoModal.find("#rex-new-block-video-youtube-audio"),
      $audioVimeo: $videoModal.find("#rex-new-block-video-vimeo-audio"),
      $audioMp4: $videoModal.find("#rex-new-block-video-mp4-audio"),
      $radioChooseYoutube: $videoModal.find("#rex-choose-youtube-video"),
      $radioChooseVimeo: $videoModal.find("#rex-choose-vimeo-video"),
      $radioChooseMp4: $videoModal.find("#rex-choose-mp4-video"),
      $youTubeWrap: $videoModal.find("#insert-video-block-wrap-1"),
      $vimeoWrap: $videoModal.find("#insert-video-block-wrap-2"),
      $mp4Wrap: $videoModal.find("#insert-video-block-wrap-3")
    };

    videoMp4SelectedData = null;
    _linkDocumentListeners();
  };
  return {
    init: _init,
    openVideoModal: _openVideoModal,
    updateMp4VideoModal: _updateMp4VideoModal
  };
})(jQuery);
