var Rexbuilder_Section_Editor = (function($) {
  "use strict";

  var _attachEvents = function() {
    $(document).on('click', '.edit-section-width', function(e) {
      var rexID = e.target.name.split('-')[2];
      var data = {
        eventName: "rexlive:set_section_width",
        data_to_send: {
          sectionTarget: {
            sectionID: rexID,
            modelNumber: ''
          },
          sectionWidth: {
            width: '100',
            type: '%'
          },
        }
      };
      // $(document).trigger('rexlive:set_section_width', [{ data_to_send: data }]);
    });
  };

  var init = function() {
    _attachEvents();
  };

  return {
    init: init
  }
})(jQuery);