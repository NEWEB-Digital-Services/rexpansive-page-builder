/**
 * Object that handles all the live events triggered on a row
 * To edit a selected row
 * @since 2.0.0
 */
var Rexbuilder_Section_Editor = (function($) {
  "use strict";

  var _attachEvents = function() {
    /**
     * Event attached on change row dimension radio buttons
     * 
     * At the width selection, create a rexlive:set_section_width event with all the needed data
     * @since 2.0.0
     */
    $(document).on('click', '.edit-section-width', function(e) {
      var rexID = e.target.name.split('-')[2];
      // var $section_data = $(e.target).parents('.rexpansive_section').children('.section-data');

      var width = '';
      var type = '';
      var vals = e.target.value.trim().split(/(\d+)/);
      width = vals[1];
      type = vals[2];
      
      var settings = {
        data_to_send: {
          sectionTarget: {
            sectionID: rexID,
            modelNumber: ''
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
    $(document).on('click', '.edit-section-image-background', function(e) {
      var data = {
        eventName: "rexlive:openSectionBackgroundImageUploader",
        section_background_image: {
          $data: null,
          $preview: null,
          image_id: e.value
        }
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });
  };

  var init = function() {
    _attachEvents();
  };

  return {
    init: init
  }
})(jQuery);