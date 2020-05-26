/**
 * Object that handles the logic of the insert/editing of the row video background
 * @since 2.0.0
 */
var Section_Video_Background_Modal = (function($) {
  "use strict";

  var video_background_properties;
  var videoChosen;
  var sectionTarget;
  var resetData;

  var _openSectionVideoBackgroundModal = function(data, mousePosition) {
    resetData = data;
    _updateVideoModal(data.bgVideo);
    Rexlive_Modals_Utils.positionModal( video_background_properties.$self, mousePosition );
    Rexlive_Modals_Utils.openModal( video_background_properties.$self.parent(".rex-modal-wrap") );
  };

  var _closeSectionVideoBackgroundModal = function( reset ) {
    if ( reset ) {
      _resetSectionVideoBackgroundModal();
    }
    Rexlive_Modals_Utils.closeModal( video_background_properties.$self.parent(".rex-modal-wrap") );
    resetData = null;
  };

  var _resetSectionVideoBackgroundModal = function() {
    if( resetData ) {
      _updateVideoModal( resetData.bgVideo );
    }
    _updateVideoBackground();
  };

  var _updateVideoModal = function(data) {
    _clearVideoModal();
    sectionTarget = data.sectionTarget;
    if (data.mp4VideoID != "") {
      videoChosen = "mp4";
      video_background_properties.$linkVimeo.val("");
      video_background_properties.$linkYoutube.val("");
      video_background_properties.$linkMp4.val(data.mp4VideoID);
      video_background_properties.$linkMp4.attr("data-rex-video-bg-url", data.mp4Video);
      video_background_properties.$linkMp4Preview.val(data.mp4Video).next('label').addClass('active');
      _focusMp4();
    } else if (data.vimeoUrl != "") {
      videoChosen = "vimeo";
      video_background_properties.$linkVimeo.val(data.vimeoUrl);
      video_background_properties.$linkYoutube.val("");
      video_background_properties.$linkMp4.val("");
      video_background_properties.$linkMp4.attr("data-rex-video-bg-url", "");
      video_background_properties.$linkMp4Preview.val("").next('label').removeClass('active');
      _focusVimeo();
    } else if (data.youtubeVideo != "") {
      videoChosen = "youtube";
      video_background_properties.$linkVimeo.val("");
      video_background_properties.$linkYoutube.val(data.youtubeVideo);
      video_background_properties.$linkMp4.val("");
      video_background_properties.$linkMp4.attr("data-rex-video-bg-url", "");
      video_background_properties.$linkMp4Preview.val("").next('label').removeClass('active');
      _focusYoutube();
    }
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
    video_background_properties.$linkYoutube.next('label').removeClass('active');
    video_background_properties.$linkVimeo.next('label').removeClass('active');
    video_background_properties.$linkMp4Preview.next('label').removeClass('active');
  };

  var _clearVideoModal = function() {
    _clearFocusVideo();
    videoChosen = "";
    video_background_properties.$linkVimeo.val("");
    video_background_properties.$linkYoutube.val("");
    video_background_properties.$linkMp4.val("");
    video_background_properties.$linkMp4Preview.val("").next('label').removeClass('active');
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
      video_background_properties.$linkYoutube.next('label').addClass('active');
      video_background_properties.$linkVimeo.attr("disabled", true);
      videoChosen = "youtube";
    }
    video_background_properties.$vimeoWrap.removeClass("selected");
    video_background_properties.$mp4Wrap.removeClass("selected");
  };

  var _focusVimeo = function() {
    if (video_background_properties.$vimeoWrap.hasClass("selected")) {
      video_background_properties.$vimeoWrap.removeClass("selected");
      video_background_properties.$checkboxChooseVimeo.attr("checked", false);
      video_background_properties.$checkboxChooseYoutube.attr("disabled", false );
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
      video_background_properties.$linkVimeo.next('label').addClass('active');
      video_background_properties.$linkYoutube.attr("disabled", true);
      videoChosen = "vimeo";
    }
    video_background_properties.$youTubeWrap.removeClass("selected");
    video_background_properties.$mp4Wrap.removeClass("selected");
  };

  var _focusMp4 = function() {
    if (video_background_properties.$mp4Wrap.hasClass("selected")) {
      video_background_properties.$mp4Wrap.removeClass("selected");
      video_background_properties.$checkboxChooseMp4.attr("checked", false);
      video_background_properties.$checkboxChooseYoutube.attr("disabled", false );
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
      video_background_properties.$linkMp4Preview.next('label').addClass('active');
      video_background_properties.$linkYoutube.attr("disabled", true);
      video_background_properties.$linkVimeo.attr("disabled", true);
      videoChosen = "mp4";
    }
    video_background_properties.$youTubeWrap.removeClass("selected");
    video_background_properties.$vimeoWrap.removeClass("selected");
  };

  var _updateVideoBackground = function() {
    var type = "";
    var urlYoutube = video_background_properties.$linkYoutube.val();
    var urlVimeo = video_background_properties.$linkVimeo.val();
    var videoMp4Data = {
      linkMp4:
        typeof video_background_properties.$linkMp4.attr("data-rex-video-bg-url") == "undefined"
          ? ""
          : video_background_properties.$linkMp4.attr("data-rex-video-bg-url"),
      idMp4: video_background_properties.$linkMp4.val(),
      width: video_background_properties.$linkMp4.attr('data-rex-video-bg-width'),
      height: video_background_properties.$linkMp4.attr('data-rex-video-bg-height')
    };

    var emptyMp4Data = {
      linkMp4: "",
      idMp4: ""
    };
    var $selected = video_background_properties.$self.find( ".video-insert-wrap.selected" );

    if ($selected.hasClass("youtube-insert-wrap")) {
      type = "youtube";
    } else if ($selected.hasClass("vimeo-insert-wrap")) {
      type = "vimeo";
    } else if ($selected.hasClass("mp4-insert-wrap")) {
      type = "mp4";
    }

    // Synch top toolbar
    Rexbuilder_Util_Admin_Editor.highlightRowSetData({
      video_bg_url_section: type == "" || type != "youtube" ? "" : urlYoutube,
      video_bg_id_section: type == "" || type != "mp4" ? "" : videoMp4Data.idMp4,
      video_bg_url_vimeo_section: type == "" || type != "vimeo" ? "" : urlVimeo,
      video_mp4_url: type == "" || type != "mp4" ? "" : videoMp4Data.linkMp4,
    });
    Rexbuilder_Util_Admin_Editor.updateBkgrVidTool();

    var data = {
      eventName: "rexlive:update_section_background_video",
      data_to_send: {
        urlYoutube: type == "" || type != "youtube" ? "" : urlYoutube,
        urlVimeo: type == "" || type != "vimeo" ? "" : urlVimeo,
        videoMp4: type == "" || type != "mp4" ? emptyMp4Data : videoMp4Data,
        typeVideo: type,
        sectionTarget: sectionTarget
      }
    };

    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
  };

  var _linkDocumentListeners = function() {
    /**
     * Handle checkboxes
     */
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

    /**
     * Upload Video Mp4
     */
    video_background_properties.$uploadMp4.click(function() {
      if (video_background_properties.$mp4Wrap.hasClass("selected")) {
        Rexlive_MediaUploader.openMediaUploaderVideo(video_background_properties.$linkMp4, video_background_properties.$linkMp4.val());
      }
    });

    /**
     * Handle close modal
     * @param  {MouseEvent} Click on close icon
     * @return {null}
     * @since  2.0.0
     */
    video_background_properties.$close_button.on('click', function(e) {
      e.preventDefault();
      _closeSectionVideoBackgroundModal( true );
    });

    // confirm-refresh options
    video_background_properties.$options_buttons.on('click', function(event) {
      event.preventDefault();
      switch( this.getAttribute('data-rex-option' ) ) {
        case 'save':
          _closeSectionVideoBackgroundModal( false );
          break;
        case 'reset':
          _resetSectionVideoBackgroundModal();
          break;
        default:
          break;
      }
    });
  };

  var _updateVideoMp4Link = function( url ) {
    video_background_properties.$linkMp4Preview.val(url).next('label').addClass('active');
  };

  var _init = function() {
    var $self = $("#video-section-editor-wrapper");
    video_background_properties = {
      $self: $self,
      $linkYoutube: $self.find("#rex-youtube-video-section"),
      $linkVimeo: $self.find("#rex-vimeo-video-section"),
      $linkMp4: $self.find("#video-section-mp4-url"),
      $linkMp4Preview: $self.find('#rex-mp4-video-section-preview'),
      $checkboxChooseYoutube: $self.find("#rex-choose-youtube-video-section"),
      $checkboxChooseVimeo: $self.find("#rex-choose-vimeo-video-section"),
      $checkboxChooseMp4: $self.find("#rex-choose-mp4-video-section"),
      $chooseVideoWrapper: $self.find(".rex-video-type-select"),
      $uploadMp4: $self.find("#rex-upload-mp4-video-section"),
      $youTubeWrap: $self.find("#edit-video-row-wrap-1"),
      $vimeoWrap: $self.find("#edit-video-row-wrap-2"),
      $mp4Wrap: $self.find("#edit-video-row-wrap-3"),
      $options_buttons: $self.find('.rex-modal-option'),
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
    openSectionVideoBackgroundModal: _openSectionVideoBackgroundModal,
    updateVideoMp4Link: _updateVideoMp4Link
  };
})(jQuery);
