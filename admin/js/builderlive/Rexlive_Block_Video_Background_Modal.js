/**
 * Object that handles the logic of the insert/editing of the block video background
 * @since 2.0.0
 */
var Block_Video_Background_Modal = (function($) {
  "use strict";

  var video_background_properties;
  var videoChosen;
  var target;

  var _openBlockVideoBackgroundModal = function(data) {
    _updateVideoModal(data.bgVideo);
    video_background_properties.$self.attr('data-block_tools', data.bgVideo.tools);
    Rexlive_Modals_Utils.openModal(
      video_background_properties.$self.parent(".rex-modal-wrap")
    );
  };

  var _closeBlockVideoBackgroundModal = function() {
    video_background_properties.$self.attr('data-block_tools', '');
    Rexlive_Modals_Utils.closeModal(
      video_background_properties.$self.parent(".rex-modal-wrap")
    );
  };

  var _updateVideoModal = function(data) {
    _clearVideoModal();
    if (data.type == "mp4") {
      videoChosen = "mp4";
      video_background_properties.$linkVimeo.val("");
      video_background_properties.$linkYoutube.val("");
      video_background_properties.$linkMp4.val(data.mp4Data.idMp4);
      video_background_properties.$linkMp4.attr(
        "data-rex-video-bg-url",
        data.mp4Data.linkMp4
      );
      video_background_properties.$linkMp4.attr(
        "data-rex-video-bg-width",
        data.mp4Data.width
      );
      video_background_properties.$linkMp4.attr(
        "data-rex-video-bg-height",
        data.mp4Data.height
      );
      video_background_properties.$audioMp4.prop(
        "checked",
        data.audio.toString() == "true"
      );
      _focusMp4();
    } else if (data.type == "vimeo") {
      videoChosen = "vimeo";
      video_background_properties.$linkVimeo.val(data.vimeoUrl);
      video_background_properties.$linkYoutube.val("");
      video_background_properties.$linkMp4.val("");
      video_background_properties.$linkMp4.attr("data-rex-video-bg-url", "");
      video_background_properties.$audioVimeo.prop(
        "checked",
        data.audio.toString() == "true"
      );
      _focusVimeo();
    } else if (data.type == "youtube") {
      videoChosen = "youtube";
      video_background_properties.$linkVimeo.val("");
      video_background_properties.$linkYoutube.val(data.youtubeUrl);
      video_background_properties.$linkMp4.val("");
      video_background_properties.$linkMp4.attr("data-rex-video-bg-url", "");
      video_background_properties.$audioYoutube.prop(
        "checked",
        data.audio.toString() == "true"
      );
      _focusYoutube();
    }
    target = data.target;
  };

  var _clearFocusVideo = function() {
    video_background_properties.$youTubeWrap.removeClass("selected");
    video_background_properties.$vimeoWrap.removeClass("selected");
    video_background_properties.$mp4Wrap.removeClass("selected");
    video_background_properties.$checkboxChooseYoutube.attr("checked", false);
    video_background_properties.$checkboxChooseVimeo.attr("checked", false);
    video_background_properties.$checkboxChooseMp4.attr("checked", false);
    video_background_properties.$checkboxChooseYoutube.attr("disabled", false);
    video_background_properties.$checkboxChooseVimeo.attr("disabled", false);
    video_background_properties.$checkboxChooseMp4.attr("disabled", false);
  };

  var _clearVideoModal = function() {
    _clearFocusVideo();
    videoChosen = "";
    video_background_properties.$linkVimeo.val("");
    video_background_properties.$linkYoutube.val("");
  };

  var _focusYoutube = function() {
    if (video_background_properties.$youTubeWrap.hasClass("selected")) {
      video_background_properties.$youTubeWrap.removeClass("selected");
      video_background_properties.$checkboxChooseYoutube.attr("checked", false);
      video_background_properties.$checkboxChooseVimeo.attr("disabled", false);
      video_background_properties.$checkboxChooseMp4.attr("disabled", false);
      videoChosen = "";
    } else {
      video_background_properties.$checkboxChooseYoutube.attr("checked", true);
      video_background_properties.$checkboxChooseVimeo.attr("disabled", true);
      video_background_properties.$checkboxChooseMp4.attr("disabled", true);
      video_background_properties.$youTubeWrap.addClass("selected");
      videoChosen = "youtube";
    }
    video_background_properties.$vimeoWrap.removeClass("selected");
    video_background_properties.$mp4Wrap.removeClass("selected");
  };

  var _focusVimeo = function() {
    if (video_background_properties.$vimeoWrap.hasClass("selected")) {
      video_background_properties.$vimeoWrap.removeClass("selected");
      video_background_properties.$checkboxChooseVimeo.attr("checked", false);
      video_background_properties.$checkboxChooseYoutube.attr(
        "disabled",
        false
      );
      video_background_properties.$checkboxChooseMp4.attr("disabled", false);
      videoChosen = "";
    } else {
      video_background_properties.$checkboxChooseVimeo.attr("checked", true);
      video_background_properties.$checkboxChooseYoutube.attr("disabled", true);
      video_background_properties.$checkboxChooseMp4.attr("disabled", true);
      video_background_properties.$vimeoWrap.addClass("selected");
      videoChosen = "vimeo";
    }
    video_background_properties.$youTubeWrap.removeClass("selected");
    video_background_properties.$mp4Wrap.removeClass("selected");
  };

  var _focusMp4 = function() {
    if (video_background_properties.$mp4Wrap.hasClass("selected")) {
      video_background_properties.$mp4Wrap.removeClass("selected");
      video_background_properties.$checkboxChooseMp4.attr("checked", false);
      video_background_properties.$checkboxChooseYoutube.attr(
        "disabled",
        false
      );
      video_background_properties.$checkboxChooseVimeo.attr("disabled", false);
      videoChosen = "";
    } else {
      video_background_properties.$checkboxChooseMp4.attr("checked", true);
      video_background_properties.$checkboxChooseYoutube.attr("disabled", true);
      video_background_properties.$checkboxChooseVimeo.attr("disabled", true);
      video_background_properties.$mp4Wrap.addClass("selected");
      videoChosen = "mp4";
    }
    video_background_properties.$youTubeWrap.removeClass("selected");
    video_background_properties.$vimeoWrap.removeClass("selected");
  };

  var _updateVideoBackground = function() {
    var type = "";
    var audio = "";
    var urlYoutube = video_background_properties.$linkYoutube.val();
    var urlVimeo = video_background_properties.$linkVimeo.val();

    var videoMp4Data = {
      linkMp4:
        typeof video_background_properties.$linkMp4.attr(
          "data-rex-video-bg-url"
        ) == "undefined"
          ? ""
          : video_background_properties.$linkMp4.attr("data-rex-video-bg-url"),
      width:
        typeof video_background_properties.$linkMp4.attr(
          "data-rex-video-bg-width"
        ) == "undefined"
          ? ""
          : video_background_properties.$linkMp4.attr(
              "data-rex-video-bg-width"
            ),
      height:
        typeof video_background_properties.$linkMp4.attr(
          "data-rex-video-bg-height"
        ) == "undefined"
          ? ""
          : video_background_properties.$linkMp4.attr(
              "data-rex-video-bg-height"
            ),
      idMp4: video_background_properties.$linkMp4.val()
    };

    var emptyMp4Data = {
      linkMp4: "",
      idMp4: "",
      width: "",
      height: ""
    };

    var $selected = video_background_properties.$self.find(
      ".video-insert-wrap.selected"
    );

    if ($selected.hasClass("youtube-insert-wrap")) {
      type = "youtube";
      audio =
        true === video_background_properties.$audioYoutube.prop("checked")
          ? "true"
          : "false";
    } else if ($selected.hasClass("vimeo-insert-wrap")) {
      type = "vimeo";
      audio =
        true === video_background_properties.$audioVimeo.prop("checked")
          ? "true"
          : "false";
    } else if ($selected.hasClass("mp4-insert-wrap")) {
      type = "mp4";
      audio =
        true === video_background_properties.$audioMp4.prop("checked")
          ? "true"
          : "false";
    }

    var data = {
      eventName: "rexlive:update_block_background_video",
      data_to_send: {
        target: target,
        urlYoutube: type == "" || type != "youtube" ? "" : urlYoutube,
        urlVimeo: type == "" || type != "vimeo" ? "" : urlVimeo,
        videoMp4: type == "" || type != "mp4" ? emptyMp4Data : videoMp4Data,
        audio: type == "" ? "" : audio,
        typeVideo: type,
        tools: video_background_properties.$self.attr('data-block_tools')
      }
    };

    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
  };

  var _linkDocumentListeners = function() {
    video_background_properties.$chooseVideoWrapper.click(function(e) {
      e.preventDefault();
      var $target = $(e.target);

      if (
        ($target.hasClass("youtube-insert-wrap") ||
          $target.parents(".youtube-insert-wrap").length != 0) &&
        (videoChosen == "youtube" || videoChosen == "")
      ) {
        _focusYoutube();
        _updateVideoBackground();
      } else if (
        ($target.hasClass("vimeo-insert-wrap") ||
          $target.parents(".vimeo-insert-wrap").length != 0) &&
        (videoChosen == "vimeo" || videoChosen == "")
      ) {
        _focusVimeo();
        _updateVideoBackground();
      } else if (
        ($target.hasClass("mp4-insert-wrap") ||
          ($target.parents(".mp4-insert-wrap").length != 0 &&
            !$target.is("i"))) &&
        (videoChosen == "mp4" || videoChosen == "")
      ) {
        _focusMp4();
        _updateVideoBackground();
      }
    });

    video_background_properties.$uploadMp4.click(function() {
      if (video_background_properties.$mp4Wrap.hasClass("selected")) {
        Rexlive_MediaUploader.openMediaUploaderVideo(
          video_background_properties.$linkMp4,
          video_background_properties.$linkMp4.val()
        );
      }
    });

    video_background_properties.$self
      .find(".set-video-audio-btn")
      .click(function(e) {
        e.preventDefault();
        var $target = $(e.target);
        var $audioBtnWrapper = $target.parents(".set-video-audio-btn");
        var $checkBox = $audioBtnWrapper.find(".video-audio-checkbox");
        var check = $checkBox.attr("checked");
        check = !check;
        $checkBox.attr("checked", check);
        _updateVideoBackground();
      });

    video_background_properties.$close_button.on('click', function(e) {
      e.preventDefault();
      _closeBlockVideoBackgroundModal();
    });
  };

  var _init = function($container) {
    var $self = $("#video-block-editor-wrapper");
    video_background_properties = {
      $self: $self,
      $youTubeWrap: $self.find("#edit-video-block-wrap-1"),
      $vimeoWrap: $self.find("#edit-video-block-wrap-2"),
      $mp4Wrap: $self.find("#edit-video-block-wrap-3"),
      $chooseVideoWrapper: $self.find(".rex-video-type-select"),
      $linkYoutube: $self.find("#rex-youtube-video-block"),
      $linkVimeo: $self.find("#rex-vimeo-video-block"),
      $linkMp4: $self.find("#video-block-mp4-url"),
      $checkboxChooseYoutube: $self.find("#rex-choose-youtube-video-block"),
      $checkboxChooseVimeo: $self.find("#rex-choose-vimeo-video-block"),
      $checkboxChooseMp4: $self.find("#rex-choose-mp4-video-block"),
      $uploadMp4: $self.find("#rex-upload-mp4-video-block i"),
      $audioYoutube: $self.find("#rex-edit-block-video-youtube-audio"),
      $audioVimeo: $self.find("#rex-edit-block-video-vimeo-audio"),
      $audioMp4: $self.find("#rex-edit-block-video-mp4-audio"),

      $close_button: $self.find('.rex-modal__close-button'),
    };
    videoChosen = "";
    _linkDocumentListeners();
  };
  return {
    init: _init,
    clearVideoModal: _clearVideoModal,
    updateVideoModal: _updateVideoModal,
    updateVideoBackground: _updateVideoBackground,
    openBlockVideoBackgroundModal: _openBlockVideoBackgroundModal
  };
})(jQuery);
