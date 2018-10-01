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
    $(document).on('click', '.edit-row-width', function(e) {
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
     * Event attached on background image button
     * 
     * Create a rexlive:openSectionBackgroundImageUploader message to send to iframe parent
     * @since 2.0.0
     */
    $(document).on('click', '.edit-row-image-background', function(e) {
      var $section = $(e.target).parents(".rexpansive_section");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var data = {
        eventName: "rexlive:openSectionBackgroundImageUploader",
        live_uploader_data: {
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          },
          idImage: e.target.value,
          returnEventName: 'rexlive:apply_background_image_section'
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
      replacerClassName: "tool-button tool-button--inline tool-button--empty edit-row-color-background tool-button--color",
      preferredFormat: "hex",
      showPalette: false,
      showAlpha: true,
      showInput: true,
      // containerClassName: "rexbuilder-materialize-wrap block-background-color-picker",
      show: function() {
        flagPickerUsed = false;
      },
      move: function(color) {
        // background_section_color_properties.$color_preview_icon.hide();
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
        }
        // console.log(colorActive);
        // var status =
        //   true ===
        //   background_section_color_properties.$color_active.prop("checked");
        // bgColorActive = status;
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

        // Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_color);
        // background_section_color_properties.$color_runtime_value.val(
        //   colorActive
        // );
        // _applyBackgroundColor();
      },
      cancelText: "",
      chooseText: ""
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

    var overlayColorActive = $section_data.attr('data-row_overlay_active');
    var changeColorEvent = {
      eventName: "rexlive:change_section_overlay_color",
      data_to_send: {
        color: null,
        active: overlayColorActive,
        sectionTarget: {
          sectionID: sectionID,
          modelNumber: modelNumber
        }
      }
    };
    
    $picker.spectrum({
      replacerClassName: "tool-button tool-button--inline tool-button--empty edit-row-overlay-color tool-button--color",
      preferredFormat: "hex",
      showPalette: false,
      showAlpha: true,
      showInput: true,
      // containerClassName: "rexbuilder-materialize-wrap block-overlay-color-picker",
      move: function(color) {
        changeColorEvent.data_to_send.color = color.toRgbString();
        var event = jQuery.Event("rexlive:change_section_overlay_color");
        event.settings = changeColorEvent;
        $(document).trigger(event);
        // Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(changeColorEvent);
      },
      change: function(color) {
        // background_overlay_properties.$overlay_color_palette_buttons.removeClass(
        //   "palette-color-active"
        // );
      },
      hide: function(color) {
        changeColorEvent.data_to_send.color = color.toRgbString();
        changeColorEvent.data_to_send.active = true;
        var event = jQuery.Event("rexlive:change_section_overlay");
        event.settings = changeColorEvent;
        $(document).trigger(event);
      },
      cancelText: "",
      chooseText: ""
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
    launchSpectrumPickerOverlayColorRow: _launchSpectrumPickerOverlayColorRow
  }
})(jQuery);