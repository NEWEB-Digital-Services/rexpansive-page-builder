/**
 * Object that handles all the live events triggered on a row
 * To edit a selected row
 * @since 2.0.0
 */
var Rexbuilder_Section_Editor = (function($) {
  "use strict";

  // var $row_backgrond_color_pickers = null;
  // var $row_overlay_color_pickers = null;

  /**
   * Caching some elements
   * @since 2.0.0
   * @deprecated  decide if useless
   */
  var _cache_elements = function() {
    // $row_backgrond_color_pickers = $('input[name=edit-row-color-background]');
    // $row_overlay_color_pickers = $('input[name=edit-row-overlay-color]');
  };

  var _attachEvents = function() {
    /**
     * Event attached on change row dimension radio buttons
     * 
     * At the width selection, create a rexlive:set_section_width event with all the needed data
     * @since 2.0.0
     */
    $(document).on('change', '.edit-row-width', function(e) {
      // var rexID = e.target.name.split('-')[2];
      // var $section_data = $(e.target).parents('.rexpansive_section').children('.section-data');
      var $section = $(e.target).parents(".rexpansive_section");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var width = '';
      var type = '';
      var vals = e.target.value.trim().split(/(\d+)/);
      width = vals[1];
      type = vals[2];
      
      var settings = {
        data_to_send: {
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          },
          sectionWidth: {
            width: width,
            type: type
          },
        },
        forged: true
      };

      var event = jQuery.Event("rexlive:set_section_width");
      event.settings = settings;
      $(document).trigger(event);
    });

    /**
     * Event attached on row layout changed
     * @since 2.0.0
     */
    $(document).on('change', '.edit-row-layout', function(e) {
      var $section = $(e.target).parents(".rexpansive_section");
      // var $section_data = $section.children('.section-data');
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var settings = {
        data_to_send: {
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          },
          layout: e.target.value
        },
        forged: true
      };

      var event = jQuery.Event("rexlive:set_gallery_layout");
      event.settings = settings;
      $(document).trigger(event);
    });

    /**
     * Event attached on background image button
     * 
     * Create a rexlive:openLiveImageUploader message to send to iframe parent
     * @since 2.0.0
     */
    $(document).on('click', '.edit-row-image-background', function(e) {
      var $section = $(this).parents(".rexpansive_section");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var data = {
        eventName: "rexlive:openLiveImageUploader",
        live_uploader_data: {
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          },
          idImage: this.getAttribute('value'),
          returnEventName: 'rexlive:apply_background_image_section',
          data_to_send: {
            active: true
          }
        }
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    /**
     * De-selecting the image on a background row
     * @since 2.0.0
     */
    $(document).on('click', '.deactivate-row-image-background', function(e) {
      var $section = $(e.target).parents(".rexpansive_section");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";
      var $section_data = $section.children('.section-data');

      var idImage = $section_data.attr('data-id_image_bg_section');

      if( "" !== idImage) {
        var settings = {
          data_to_send: {
            sectionTarget: {
              sectionID: sectionID,
              modelNumber: modelNumber
            },
            active: false,
            idImage: idImage,
            urlImage: $section_data.attr('data-image_bg_section'),
            width: $section.attr('data-background_image_width'),
            height: $section.attr('data-background_image_height'),
          },
        };
        var event = jQuery.Event("rexlive:apply_background_image_section");
        event.settings = settings;
        $(document).trigger(event);
      }
    });

    /**
     * De-selecting the color on a background row
     * @since 2.0.0
     */
    $(document).on('click', '.deactivate-row-color-background', function(e) {
      var $section = $(e.target).parents(".rexpansive_section");
      // var $section_data = $section.children('.section-data');
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var settings = {
        data_to_send: {
          color: "",
          active: false,
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          }
        },
      }; 

      var event = jQuery.Event("rexlive:apply_background_color_section");
      event.settings = settings;
      $(document).trigger(event);
    });

    /**
     * De-selecting the overlay color on a background row
     */
    $(document).on('click', '.deactivate-row-overlay-color', function(e) {
      var $section = $(e.target).parents(".rexpansive_section");
      var $section_data = $section.children('.section-data');
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var settings = {
        data_to_send: {
          color: $section_data.attr('data-row_overlay_color'),
          active: false,
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          }
        }
      }

      var event = jQuery.Event("rexlive:change_section_overlay");
      event.settings = settings;
      $(document).trigger(event);
    });

    /**
     * Editing or insert a background video on a row, in a separate modal
     * @since 2.0.0
     */
    $(document).on('click', '.edit-row-video-background', function(e) {
      e.preventDefault();
      var $section = $(e.target).parents(".rexpansive_section");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";
      var $sectionData = $section.children(".section-data");

      var mp4Video =
        typeof $sectionData.attr("data-video_mp4_url") == "undefined"
          ? ""
          : $sectionData.attr("data-video_mp4_url");
      var youtubeVideo =
        typeof $sectionData.attr("data-video_bg_url_section") == "undefined"
          ? ""
          : $sectionData.attr("data-video_bg_url_section");
      var mp4VideoID =
        typeof $sectionData.attr("data-video_bg_id_section") == "undefined"
          ? ""
          : $sectionData.attr("data-video_bg_id_section");
      var vimeoUrl =
        typeof $sectionData.attr("data-video_bg_url_vimeo_section") ==
        "undefined"
          ? ""
          : $sectionData.attr("data-video_bg_url_vimeo_section");

      var data = {
        eventName: "rexlive:editRowVideoBackground",
        activeBG: {
          bgVideo: {
            sectionTarget: {
              sectionID: sectionID,
              modelNumber: modelNumber
            },
            youtubeVideo: youtubeVideo,
            vimeoUrl: vimeoUrl,
            mp4Video: mp4Video,
            mp4VideoID: mp4VideoID
          }
        }
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });
  };

  /**
   * Setting the row live color pickers for the background
   * @since 2.0.0
   */
  var _setRowColorBackgroundPicker = function() {
    $('input[name=edit-row-color-background]').each(function(i, el) {
      _launchSpectrumPickerBackgorundColorRow( el );
    });
  };

  /**
   * Setting the row live color pickers for the overlay
   * @since 2.0.0
   */
  var _setRowOverlayColorPicker = function() {
    $('input[name=edit-row-overlay-color]').each(function(i, el) {
      _launchSpectrumPickerOverlayColorRow( el );
    });
  };

  /**
   * Launching the spectrum color picker on an input element, for the row background color
   * @param {DOM element} el input element in which launch the color picker
   * @since 2.0.0
   */
  var _launchSpectrumPickerBackgorundColorRow = function( el ) {
    var $picker = $(el);

    var $section = $picker.parents(".rexpansive_section");
    var $section_data = $section.children('.section-data');
    var sectionID = $section.attr("data-rexlive-section-id");
    var modelNumber =
      typeof $section.attr("data-rexlive-model-number") != "undefined"
        ? $section.attr("data-rexlive-model-number")
        : "";

    var bgColorActive = $section_data.attr('data-color_bg_section_active');
    var colorActive = $section_data.attr('data-color_bg_section');
    var settings = {
      // eventName: "rexlive:change_section_bg_color",
      data_to_send: {
        color: null,
        sectionTarget: {
          sectionID: sectionID,
          modelNumber: modelNumber
        }
      },
    };

    var flagPickerUsed = false;

    $picker.spectrum({
      replacerClassName: "tool-button tool-button--inline tool-button--empty tool-button--color tool-button--spectrum",
      preferredFormat: "hex",
      showPalette: false,
      showAlpha: true,
      showInput: true,
      // containerClassName: "rexbuilder-materialize-wrap block-background-color-picker",
      show: function() {
        flagPickerUsed = false;
      },
      move: function(color) {
        settings.data_to_send.color = bgColorActive
          ? color.toRgbString()
          : "";
        
        var event = jQuery.Event("rexlive:change_section_bg_color");
        event.settings = settings;
        $(document).trigger(event);

        flagPickerUsed = true;
      },
      change: function(color) {
        // background_section_color_properties.$color_palette_buttons.removeClass(
        //   "palette-color-active"
        // );
      },
      hide: function(color) {
        if (flagPickerUsed) {
          colorActive = color.toRgbString();
          
          var data_color = {
            data_to_send: {
              color: bgColorActive ? colorActive : "",
              active: bgColorActive,
              sectionTarget: settings.data_to_send.sectionTarget
            }
          };
  
          settings.data_to_send = data_color.data_to_send;
  
          var event = jQuery.Event("rexlive:apply_background_color_section");
          event.settings = settings;
          $(document).trigger(event);
        }

        flagPickerUsed = false;
      },
      // cancelText: "",
      // chooseText: ""
    });

    $picker.prev('.edit-row-color-background').on('click', function() {
      $picker.spectrum('show');
    });
  };

  /**
   * Launching the spectrum color picker on an input element, for the row overlay color
   * @param {DOM element} el input element in which launch the color picker
   * @since 2.0.0
   */
  var _launchSpectrumPickerOverlayColorRow = function( el ) {
    var $picker = $(el);

    var $section = $picker.parents(".rexpansive_section");
    var $section_data = $section.children('.section-data');
    var sectionID = $section.attr("data-rexlive-section-id");
    var modelNumber =
      typeof $section.attr("data-rexlive-model-number") != "undefined"
        ? $section.attr("data-rexlive-model-number")
        : "";
    
    var flagPickerUsed = false;

    var overlayColorActive = JSON.parse( ( 'undefined' !== typeof $section_data.attr('data-row_overlay_active') ? $section_data.attr('data-row_overlay_active') : false ) );
    var changeColorEvent = {
      eventName: "rexlive:change_section_overlay_color",
      data_to_send: {
        color: null,
        active: false,
        sectionTarget: {
          sectionID: sectionID,
          modelNumber: modelNumber
        }
      }
    };
    
    $picker.spectrum({
      replacerClassName: "tool-button tool-button--inline tool-button--empty tool-button--color tool-button--spectrum",
      preferredFormat: "hex",
      showPalette: false,
      showAlpha: true,
      showInput: true,
      // containerClassName: "rexbuilder-materialize-wrap block-overlay-color-picker",
      show: function() {
        flagPickerUsed = false;
      },
      move: function(color) {
        changeColorEvent.data_to_send.active = true;
        changeColorEvent.data_to_send.color = color.toRgbString();
        if( overlayColorActive ) {
          var event = jQuery.Event("rexlive:change_section_overlay_color");
        } else {
          var event = jQuery.Event("rexlive:change_section_overlay");
        }
        event.settings = changeColorEvent;
        $(document).trigger(event);

        flagPickerUsed = true;
      },
      change: function(color) {
        //
      },
      hide: function(color) {
        if(flagPickerUsed) {
          changeColorEvent.data_to_send.color = color.toRgbString();
          changeColorEvent.data_to_send.active = true;

          var event = jQuery.Event("rexlive:change_section_overlay");
          event.settings = changeColorEvent;
          $(document).trigger(event);
        }

        flagPickerUsed = false;
      },
      // cancelText: "",
      // chooseText: ""
    });
  };

  /**
   * Setting the row tools that need some logic
   * @since 2.0.0
   */
  var _setTools = function() {
    _setRowColorBackgroundPicker();
    _setRowOverlayColorPicker();
  };

  /**
   * Launch the row tools
   * @param {jQuery element} $row new row
   */
  var _updateRowTools = function( $row ) {
    _launchSpectrumPickerBackgorundColorRow($row.find('input[name=edit-row-color-background]')[0]);
    _launchSpectrumPickerOverlayColorRow($row.find('input[name=edit-row-overlay-color]')[0]);
  };

  /**
   * Initing the row toolbar
   */
  var init = function() {
    // _cache_elements();
    _attachEvents();
    _setTools();
  };

  return {
    init: init,
    launchSpectrumPickerBackgorundColorRow: _launchSpectrumPickerBackgorundColorRow,
    launchSpectrumPickerOverlayColorRow: _launchSpectrumPickerOverlayColorRow,
    updateRowTools: _updateRowTools
  }
})(jQuery);