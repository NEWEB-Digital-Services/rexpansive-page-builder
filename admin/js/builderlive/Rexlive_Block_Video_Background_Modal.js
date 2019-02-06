/**
 * Object that handles the logic of the insert/editing of the block video background
 * @since 2.0.0
 */
var Block_Video_Background_Modal = (function($) {
  "use strict";

  var video_background_properties;
  var videoChosen;
  var target;

  var _openBlockVideoBackgroundModal = function(data, mousePosition) {
    _updateVideoModal(data.bgVideo);
    video_background_properties.$self.attr('data-block_tools', data.bgVideo.tools);  
    Rexlive_Modals_Utils.positionModal( video_background_properties.$self, mousePosition );
    Rexlive_Modals_Utils.openModal( video_background_properties.$self.parent(".rex-modal-wrap") );

    if(data.youtubeUrl == ""){
      video_background_properties.$linkYoutube
          .blur();
      console.log('focus: data.youtubeUrl == nothing');
    }else{
      video_background_properties.$linkYoutube
          .focus()
      console.log('focus: data.youtubeUrl != nothing');
    }

    if(data.vimeoUrl == ""){
      video_background_properties.$linkVimeo
          .blur();
      console.log('focus: data.vimeoUrl == nothing');
    }else{
      video_background_properties.$linkVimeo
          .focus()
      console.log('focus: data.vimeoUrl != nothing');
    }

    if(data.mp4Data.linkMp4 == ""){
      video_background_properties.$linkMp4Preview
          .blur();
      console.log('focus: data.mp4Data.linkMp4 == nothing');
    }else{
      video_background_properties.$linkMp4Preview
          .focus()
      console.log('focus: data.mp4Data.linkMp4 != nothing');
    }

    console.log("passed || openBlockVideoBackgroundModal");
  };

  var _closeBlockVideoBackgroundModal = function() {
    video_background_properties.$self.attr('data-block_tools', '');
    Rexlive_Modals_Utils.closeModal(
      video_background_properties.$self.parent(".rex-modal-wrap")
    );
    console.log("passed || closeBlockVideoBackgroundModal");
  };

  var _updateVideoModal = function(data) {
    _clearVideoModal();
    if (data.type == "mp4") {
      videoChosen = "mp4";
      video_background_properties.$linkVimeo.val("");
      video_background_properties.$linkYoutube.val("");
      video_background_properties.$linkMp4.val(data.mp4Data.idMp4);
      video_background_properties.$linkMp4.attr("data-rex-video-bg-url", data.mp4Data.linkMp4);
      video_background_properties.$linkMp4.attr("data-rex-video-bg-width", data.mp4Data.width);
      video_background_properties.$linkMp4.attr("data-rex-video-bg-height", data.mp4Data.height);
      // video_background_properties.$linkMp4Preview.val(data.mp4Data.linkMp4).next('label').addClass('active');
      video_background_properties.$audioMp4.prop(
        "checked",
        data.audio.toString() == "true"
      );
      _focusMp4();
      console.log("vdtype || data.type == mp4");

    } else if (data.type == "vimeo") {
      videoChosen = "vimeo";
      video_background_properties.$linkVimeo.val(data.vimeoUrl);
      video_background_properties.$linkYoutube.val("");
      video_background_properties.$linkMp4.val("");
      video_background_properties.$linkMp4.attr("data-rex-video-bg-url", "");
      video_background_properties.$linkMp4Preview.val("").next('label').removeClass('active');
      video_background_properties.$audioVimeo.prop("checked", data.audio.toString() == "true");
      _focusVimeo();
      console.log("vdtype || data.type == vimeo");

    } else if (data.type == "youtube") {
      videoChosen = "youtube";
      video_background_properties.$linkVimeo.val("");
      video_background_properties.$linkYoutube.val(data.youtubeUrl);
      video_background_properties.$linkMp4.val("");
      video_background_properties.$linkMp4.attr("data-rex-video-bg-url", "");
      video_background_properties.$linkMp4Preview.val("").next('label').removeClass('active');
      video_background_properties.$audioYoutube.prop("checked", data.audio.toString() == "true");
      _focusYoutube();
      console.log("vdtype || data.type == youtube");

    }

// YOUTUBE VIDEOS - Case & Focus

    if(data.youtubeUrl == ""){
      //video_background_properties.$linkYoutubeFocus
      //    .trigger('blur');
      video_background_properties.$linkYoutubeLabel
          .removeClass("active");
      console.log('case: data.youtubeUrl == nothing');
    }else{
      //video_background_properties.$linkYoutubeFocus
      //    .trigger('focus');
      video_background_properties.$linkYoutubeLabel
          .addClass("active");
      console.log('case: data.youtubeUrl != nothing');
    }

// VIMEO VIDEOS - Case & Focus

    if(data.vimeoUrl == ""){
      //video_background_properties.$linkVimeo
      //    .trigger('blur');
      video_background_properties.$linkVimeoLabel
          .removeClass("active");
      console.log('case: data.vimeoUrl == nothing');
    }else{
      //video_background_properties.$linkVimeo
      //    .trigger('focus');
      video_background_properties.$linkVimeoLabel
          .addClass("active");
      console.log('case: data.vimeoUrl != nothing');
    }

// URL VIDEOS - Case & Focus

    if(data.mp4Data.linkMp4 == ""){
      //video_background_properties.$linkMp4Preview
      //    .trigger('blur');
      video_background_properties.$linkMp4PreviewLabel
          .removeClass("active");
      console.log('case: data.mp4Data.linkMp4 == nothing');
    }else{
      //video_background_properties.$linkMp4Preview
      //    .trigger('focus');
      video_background_properties.$linkMp4PreviewLabel
          .addClass("active");
      console.log('case: data.mp4Data.linkMp4 != nothing');
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

    //video_background_properties.$linkYoutube.next('label').removeClass('active');
    //video_background_properties.$linkVimeo.next('label').removeClass('active');
    //video_background_properties.$linkMp4Preview.next('label').removeClass('active');

    console.log("passed || clearFocusVideo");
  };

  var _clearVideoModal = function() {
    _clearFocusVideo();
    videoChosen = "";
    video_background_properties.$linkVimeo.val("");
    video_background_properties.$linkYoutube.val("");
    video_background_properties.$linkMp4.val("");
    video_background_properties.$linkMp4Preview.val("").next('label').removeClass('active');
    console.log("passed || clearVideoModal");
  };

  var _focusYoutube = function() {
    if (video_background_properties.$youTubeWrap.hasClass("selected")) {
      video_background_properties.$youTubeWrap.removeClass("selected");
      video_background_properties.$checkboxChooseYoutube.attr("checked", false);
      video_background_properties.$checkboxChooseVimeo.attr("disabled", false);
      video_background_properties.$checkboxChooseMp4.attr("disabled", false);
      video_background_properties.$linkYoutube.attr("disabled", false);
      video_background_properties.$linkVimeo.attr("disabled", false);
      if("" === video_background_properties.$linkYoutube.val()) {
        video_background_properties.$linkYoutube.next('label').removeClass('active');
      }
      videoChosen = "";
    } else {
      video_background_properties.$checkboxChooseYoutube.attr("checked", true);
      video_background_properties.$checkboxChooseVimeo.attr("disabled", true);
      video_background_properties.$checkboxChooseMp4.attr("disabled", true);
      video_background_properties.$youTubeWrap.addClass("selected");
      // video_background_properties.$linkYoutube.next('label').addClass('active');
      video_background_properties.$linkVimeo.attr("disabled", true);
      videoChosen = "youtube";
    }
    video_background_properties.$vimeoWrap.removeClass("selected");
    video_background_properties.$mp4Wrap.removeClass("selected");

    console.log("passed || _focusYoutube");
  };

  var _focusVimeo = function() {
    if (video_background_properties.$vimeoWrap.hasClass("selected")) {
      video_background_properties.$vimeoWrap.removeClass("selected");
      video_background_properties.$checkboxChooseVimeo.attr("checked", false);
      video_background_properties.$checkboxChooseYoutube.attr("disabled", false);
      video_background_properties.$checkboxChooseMp4.attr("disabled", false);
      video_background_properties.$linkYoutube.attr("disabled", false);
      video_background_properties.$linkVimeo.attr("disabled", false);
      if("" === video_background_properties.$linkVimeo.val()) {
        video_background_properties.$linkVimeo.next('label').removeClass('active');
      }
      videoChosen = "";
    } else {
      video_background_properties.$checkboxChooseVimeo.attr("checked", true);
      video_background_properties.$checkboxChooseYoutube.attr("disabled", true);
      video_background_properties.$checkboxChooseMp4.attr("disabled", true);
      video_background_properties.$vimeoWrap.addClass("selected");
      // video_background_properties.$linkVimeo.next('label').addClass('active');
      video_background_properties.$linkYoutube.attr("disabled", true);
      videoChosen = "vimeo";
    }
    video_background_properties.$youTubeWrap.removeClass("selected");
    video_background_properties.$mp4Wrap.removeClass("selected");

    console.log("passed || _focusVimeo");
  };

  var _focusMp4 = function() {
    if (video_background_properties.$mp4Wrap.hasClass("selected")) {
      video_background_properties.$mp4Wrap.removeClass("selected");
      video_background_properties.$checkboxChooseMp4.attr("checked", false);
      video_background_properties.$checkboxChooseYoutube.attr("disabled", false);
      video_background_properties.$checkboxChooseVimeo.attr("disabled", false);
      video_background_properties.$linkYoutube.attr("disabled", false);
      video_background_properties.$linkVimeo.attr("disabled", false);
      if("" === video_background_properties.$linkMp4Preview.val()) {
        video_background_properties.$linkMp4Preview.next('label').removeClass('active');
      }
      videoChosen = "";
    } else {
      video_background_properties.$checkboxChooseMp4.attr("checked", true);
      video_background_properties.$checkboxChooseYoutube.attr("disabled", true);
      video_background_properties.$checkboxChooseVimeo.attr("disabled", true);
      video_background_properties.$mp4Wrap.addClass("selected");
      // video_background_properties.$linkMp4Preview.next('label').addClass('active');
      video_background_properties.$linkYoutube.attr("disabled", true);
      video_background_properties.$linkVimeo.attr("disabled", true);
      videoChosen = "mp4";
    }
    video_background_properties.$youTubeWrap.removeClass("selected");
    video_background_properties.$vimeoWrap.removeClass("selected");

    console.log("passed || _focusMp4");
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

  var _updateVideoMp4Link = function(url) {
    // video_background_properties.$linkMp4Preview.val(url).next('label').addClass('active');
  }

  var _init = function($container) {
    var $self = $("#video-block-editor-wrapper");
    video_background_properties = {
      $self: $self,
      $youTubeWrap: $self.find("#edit-video-block-wrap-1"),
      $vimeoWrap: $self.find("#edit-video-block-wrap-2"),
      $mp4Wrap: $self.find("#edit-video-block-wrap-3"),
      $chooseVideoWrapper: $self.find(".rex-video-type-select"),

      $linkYoutube: $self.find("#rex-youtube-video-block"),
      $linkYoutubeFocus: $self.find("#rex-youtube-video-block"),
      $linkYoutubeLabel: $self.find("#rex-youtube-video-block-label"),
        
      $linkVimeo: $self.find("#rex-vimeo-video-block"),
      $linkVimeoLabel: $self.find("#rex-vimeo-video-block-label"),

      $linkMp4: $self.find("#video-block-mp4-url"),
      $linkMp4Preview: $self.find('#rex-mp4-video-block-preview'),
      $linkMp4PreviewLabel: $self.find('#rex-mp4-video-block-preview-label'),

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
    openBlockVideoBackgroundModal: _openBlockVideoBackgroundModal,
    updateVideoMp4Link: _updateVideoMp4Link
  };
})(jQuery);
