/**
 * Common ajax functions to call
 * @since 2.0.0
 */
var Rexlive_Ajax_Calls = (function($) {
  "use strict";

  var _savePaletteGradient = function( data ) {
    $.ajax({
      type: "POST",
      url: live_editor_obj.ajaxurl,
      data: {
        action: "rex_save_palette_gradient",
        nonce_param: live_editor_obj.rexnonce,
        data: data,
      },
      success: function(response) {
        if (response.success) {
          console.log(response);
        }
      },
      error: function(response) {
        console.log(response);
      }
    });
  };

  return {
    savePaletteGradient: _savePaletteGradient
  };
})(jQuery);
