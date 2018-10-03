/**
 * Object that handles all the live events triggered on a block
 * To edit a selected block
 * @since 2.0.0
 */
var Rexbuilder_Block_Editor = (function($) {
  "use strict";

  /**
   * Attaching events for block editing buttons
   * @since 2.0.0
   */
  var _attachEvents = function() {
    /**
     * Edit a block background image
     * @since 2.0.0
     */
    $(document).on('click', '.edit-block-image', function(e) {
      var $elem = $(e.target).parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";
      var $elemData = $elem.children(".rexbuilder-block-data");
      var $itemContent = $elem.find(".grid-item-content");

      var idImage =
        typeof $elemData.attr("data-id_image_bg_block") == "undefined"
          ? ""
          : $elemData.attr("data-id_image_bg_block");
      var imageUrl =
        typeof $elemData.attr("data-image_bg_block") == "undefined"
          ? ""
          : $elemData.attr("data-image_bg_block");
      var width =
        typeof $itemContent.attr("data-background_image_width") == "undefined"
          ? ""
          : $itemContent.attr("data-background_image_width");
      var height =
        typeof $itemContent.attr("data-background_image_height") == "undefined"
          ? ""
          : $itemContent.attr("data-background_image_height");
      var activeImage =
        typeof $elemData.attr("data-image_bg_elem_active") != "undefined"
          ? $elemData.attr("data-image_bg_elem_active")
          : true;
      var defaultTypeImage =
        $elem.parents(".grid-stack-row").attr("data-layout") == "fixed"
          ? "full"
          : "natural";
      var typeBGimage =
        ( typeof $elemData.attr("data-type_bg_block") == "undefined" || "" == $elemData.attr("data-type_bg_block") )
          ? defaultTypeImage
          : $elemData.attr("data-type_bg_block");
      var activePhotoswipe =
        typeof $elemData.attr("data-photoswipe") == "undefined"
          ? ""
          : $elemData.attr("data-photoswipe");

      var activeImage = true;

      var data = {
        eventName: "rexlive:openLiveImageUploader",
        live_uploader_data: {
          idImage: activeImage ? idImage : "",
          urlImage: activeImage ? imageUrl : "",
          width: activeImage ? width : "",
          height: activeImage ? height : "",
          typeBGimage: activeImage ? typeBGimage : "",
          photoswipe: activeImage ? activePhotoswipe : "",
          active: activeImage,
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber,
            rexID: rex_block_id
          },
          returnEventName: "rexlive:apply_background_image_block",
          data_to_send: {
            idImage: activeImage ? idImage : "",
            urlImage: activeImage ? imageUrl : "",
            width: activeImage ? width : "",
            height: activeImage ? height : "",
            typeBGimage: activeImage ? typeBGimage : "",
            photoswipe: activeImage ? activePhotoswipe : "",
            active: activeImage,
            sectionTarget: {
              sectionID: sectionID,
              modelNumber: modelNumber,
              rexID: rex_block_id
            },
          }
        },
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    /**
     * Edit a block background video
     * @since 2.0.0
     */
    $(document).on('click', '.edit-block-video-background', function(e) {
      var $elem = $(e.target).parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";
      var $elemData = $elem.children(".rexbuilder-block-data");
      var $itemContent = $elem.find(".grid-item-content");

      var mp4Video =
        typeof $elemData.attr("data-video_mp4_url") == "undefined"
          ? ""
          : $elemData.attr("data-video_mp4_url");
      var mp4VideoID =
        typeof $elemData.attr("data-video_bg_id") == "undefined"
          ? ""
          : $elemData.attr("data-video_bg_id");
      var youtubeUrl =
        typeof $elemData.attr("data-video_bg_url") == "undefined"
          ? ""
          : $elemData.attr("data-video_bg_url");
      var vimeoUrl =
        typeof $elemData.attr("data-video_bg_url_vimeo") == "undefined"
          ? ""
          : $elemData.attr("data-video_bg_url_vimeo");
      var $videoMp4Wrap = $itemContent.children(".rex-video-wrap");
      var mp4VideoWidth = "";
      var mp4VideoHeight = "";
      if ($videoMp4Wrap.length != 0) {
        mp4VideoWidth = parseInt($videoMp4Wrap.attr("data-rex-video-width"));
        mp4VideoHeight = parseInt($videoMp4Wrap.attr("data-rex-video-height"));
      }

      var type = "";
      var audio = $itemContent.children(".rex-video-toggle-audio").length != 0;

      if (mp4VideoID != "") {
        type = "mp4";
      } else if (youtubeUrl != "") {
        type = "youtube";
      } else if (vimeoUrl != "") {
        type = "vimeo";
      }

      var data = {
        eventName: "rexlive:editBlockVideoBackground",
        activeBlockData: {
          bgVideo: {
            type: type,
            mp4Data: {
              idMp4: mp4VideoID,
              linkMp4: mp4Video,
              width: mp4VideoWidth,
              height: mp4VideoHeight
            },
            vimeoUrl: vimeoUrl,
            youtubeUrl: youtubeUrl,
            audio: audio,
            target: {
              sectionID: sectionID,
              modelNumber: modelNumber,
              rexID: rex_block_id
            }
          }
        }
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    /**
     * Deactivate a block image
     * @since 2.0.0
     */
    $(document).on('click', '.deactivate-block-image-background', function(e) {
      var $elem = $(e.target).parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var settings = {
        data_to_send: {
          target: {
            sectionID: sectionID,
            modelNumber: modelNumber,
            rexID: rex_block_id
          },
          idImage: "",
          urlImage: "",
          width: "",
          height: "",
          typeBGimage: "",
          photoswipe: "",
          active: false,
        },
      };

      var event = jQuery.Event("rexlive:apply_background_image_block");
      event.settings = settings;
      $(document).trigger(event);
    });

    /**
     * Deactivate a block color
     * @since 2.0.0
     */
    $(document).on('click', '.deactivate-block-color-background', function(e) {
      var $elem = $(e.target).parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";
      // var $elemData = $elem.children(".rexbuilder-block-data");
      // var bgColorActive = $elemData.attr('data-color_bg_block_active');

      var settings = {
        data_to_send: {
          color: "",
          active: false,
          target: {
            sectionID: sectionID,
            modelNumber: modelNumber,
            rexID: rex_block_id
          },
        }
      };

      var event = jQuery.Event("rexlive:apply_background_color_block");
      event.settings = settings;
      $(document).trigger(event);
    });

    /**
     * Deactivate an overlay color
     * @since 2.0.0
     */
    $(document).on('click', '.deactivate-block-overlay-color', function(e) {
      var $elem = $(e.target).parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var settings = {
        data_to_send: {
          color: null,
          active: false,
          target: {
            sectionID: sectionID,
            modelNumber: modelNumber,
            rexID: rex_block_id
          },
        }
      };

      var event = jQuery.Event("rexlive:change_block_overlay");
      event.settings = settings;
      $(document).trigger(event);
    });

  };

  /**
   * Launching the spectrum color picker on an input element, for the block background color
   * @param {DOM element} el input element in which launch the color picker
   * @since 2.0.0
   */
  var _launchSpectrumPickerBackgorundColorBlock = function( el ) {
    var $picker = $(el);

    var $elem = $picker.parents(".grid-stack-item");
    var $section = $elem.parents(".rexpansive_section");
    var rex_block_id = $elem.attr("data-rexbuilder-block-id");
    var sectionID = $section.attr("data-rexlive-section-id");
    var modelNumber =
      typeof $section.attr("data-rexlive-model-number") != "undefined"
        ? $section.attr("data-rexlive-model-number")
        : "";
    var $elemData = $elem.children(".rexbuilder-block-data");

    var bgColorActive = $elemData.attr('data-color_bg_block_active');
    var colorActive = $elemData.attr('data-color_bg_block');

    var flagPickerUsed;

    var settings = {
      data_to_send: {
        color: bgColorActive ? colorActive : "",
        active: bgColorActive,
        target: {
          sectionID: sectionID,
          modelNumber: modelNumber,
          rexID: rex_block_id
        },
      }
    };

    $picker.spectrum({
      replacerClassName: "tool-button tool-button--inline tool-button--empty tool-button--color tool-button--spectrum",
      preferredFormat: "hex",
      showPalette: false,
      showAlpha: true,
      showInput: true,
      show: function() {
        flagPickerUsed = false;
      },
      move: function(color) {
        settings.data_to_send.color = settings.data_to_send.active
          ? color.toRgbString()
          : "";

        var event = jQuery.Event("rexlive:change_block_bg_color");
        event.settings = settings;
        $(document).trigger(event);

        flagPickerUsed = true;
      },
      change: function(color) {
        // 
      },
      hide: function(color) {
        if (flagPickerUsed) {
          colorActive = color.toRgbString();
        }

        settings.data_to_send.color = colorActive;

        var event = jQuery.Event("rexlive:apply_background_color_block");
        event.settings = settings;
        $(document).trigger(event);
      },
    });
  };

  /**
   * Launching spcetrum color picker on an input element, for the block overlay color
   * @param {DOM Element} el input element on which launch spectrum
   * @since 2.0.0
   */
  var _launchSpectrumPickerOverlayColorBlock = function( el ) {
    var $picker = $(el);

    var $elem = $picker.parents(".grid-stack-item");
    var $section = $elem.parents(".rexpansive_section");
    var rex_block_id = $elem.attr("data-rexbuilder-block-id");
    var sectionID = $section.attr("data-rexlive-section-id");
    var modelNumber =
      typeof $section.attr("data-rexlive-model-number") != "undefined"
        ? $section.attr("data-rexlive-model-number")
        : "";
    var $elemData = $elem.children(".rexbuilder-block-data");

    var flagPickerUsed = false;

    var overlayActive;
    if (
      $elem.hasClass("active-large-block-overlay") ||
      $elem.hasClass("active-medium-block-overlay") ||
      $elem.hasClass("active-small-block-overlay")
    ) {
      overlayActive = false;
    } else {
      overlayActive =
        typeof $elemData.attr("data-overlay_block_color_active") !=
        "undefined"
          ? JSON.parse( $elemData.attr("data-overlay_block_color_active") )
          : false;
    }

    if (!overlayActive) {
      if (
        Rexbuilder_Util.activeLayout == "default" &&
        $elem.hasClass("active-large-block-overlay")
      ) {
        overlayActive = true;
      }
      if (
        Rexbuilder_Util.activeLayout == "tablet" &&
        $elem.hasClass("active-medium-block-overlay")
      ) {
        overlayActive = true;
      }
      if (
        Rexbuilder_Util.activeLayout == "mobile" &&
        $elem.hasClass("active-small-block-overlay")
      ) {
        overlayActive = true;
      }
    }

    var settings = {
      data_to_send: {
        color: null,
        active: false,
        target: {
          sectionID: sectionID,
          modelNumber: modelNumber,
          rexID: rex_block_id
        },
      }
    };

    $picker.spectrum({
      replacerClassName: "tool-button tool-button--inline tool-button--empty tool-button--color tool-button--spectrum",
      preferredFormat: "hex",
      showPalette: false,
      showAlpha: true,
      showInput: true,
      show: function() {
        flagPickerUsed = false;
      },
      move: function(color) {
        settings.data_to_send.active = true;
        settings.data_to_send.color =  color.toRgbString();

        if( overlayActive ) {
          var event = jQuery.Event("rexlive:change_block_overlay_color");
        } else {
          var event = jQuery.Event("rexlive:change_block_overlay");
        }
        
        event.settings = settings;
        $(document).trigger(event);

        flagPickerUsed = true;
      },
      change: function(color) {
        // 
      },
      hide: function(color) {
        if (flagPickerUsed) {
          settings.data_to_send.active = true;
          settings.data_to_send.color = color.toRgbString();

          var event = jQuery.Event("rexlive:change_block_overlay");
          event.settings = settings;
          $(document).trigger(event);
        }

        flagPickerUsed = false;
      },
    });
  };

  /**
   * Setting the block live color pickers for the background
   * @since 2.0.0
   */
  var _setBlockColorBackgroundPicker = function() {
    $('input[name=edit-block-color-background]').each(function(i, el) {
      _launchSpectrumPickerBackgorundColorBlock( el );
    });
  };

  /**
   * Setting the block live colore pickers for the overlay
   * @since 2.0.0
   */
  var _setBlockOverlayColorPicker = function() {
    $('input[name=edit-block-overlay-color]').each(function(i, el) {
      _launchSpectrumPickerOverlayColorBlock( el );
    });
  };

  /**
   * Set the block tools that need some logic
   * @since 2.0.0
   */
  var _setTools = function() {
    _setBlockColorBackgroundPicker();
    _setBlockOverlayColorPicker();
  };

  /**
   * Initing the block toolbar
   */
  var init = function() {
    _attachEvents();
    _setTools();
  };

  return {
    init: init,
    launchSpectrumPickerBackgorundColorBlock: _launchSpectrumPickerBackgorundColorBlock,
    launchSpectrumPickerOverlayColorBlock: _launchSpectrumPickerOverlayColorBlock
  }
})(jQuery);