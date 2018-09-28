/**
 * Object that handles all the live events triggered on a row
 * To edit a selected row
 * @since 2.0.0
 */
var Rexbuilder_Section_Editor = (function($) {
  "use strict";

  var $row_backgrond_color_pickers = null;

  var _cache_elements = function() {
    $row_backgrond_color_pickers = $('input[name=edit-row-color-background]');
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

    $(document).on('click', '.deactivate-row-color-background', function(e) {
      
    });
  };

  /**
   * Setting the row live color pickers
   * @since 2.0.0
   */
  var _setRowColorBackgroundPicker = function() {
    $row_backgrond_color_pickers.each(function(i,el) {
      var $picker = $(el);

      var $section = $picker.parents(".rexpansive_section");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var bgColorActive = true;
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
        replacerClassName: "btn-floating",
        preferredFormat: "hex",
        showPalette: false,
        showAlpha: true,
        showInput: true,
        containerClassName: "rexbuilder-materialize-wrap block-background-color-picker",
        // flat: true,
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
    })
  };

  var _setTools = function() {
    _setRowColorBackgroundPicker();
  };

  var init = function() {
    _cache_elements();
    _attachEvents();
    _setTools();
  };

  return {
    init: init
  }
})(jQuery);