/**
 * Common ajax functions to call
 * @since 2.0.0
 */
var Rexlive_Ajax_Calls = (function($) {
  "use strict";

  var _savePaletteColor = function( data ) {
    $.ajax({
      type: "POST",
      url: live_editor_obj.ajaxurl,
      data: {
        action: "rex_save_palette_color",
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

  var _deletePaletteColor = function( data, callbacks ) {
    $.ajax({
      type: "POST",
      url: live_editor_obj.ajaxurl,
      data: {
        action: "rex_delete_palette_color",
        nonce_param: live_editor_obj.rexnonce,
        data: data,
      },
      success: function(response) {
        if (response.success) {
          if( "undefined" !== typeof callbacks && "function" === typeof callbacks.success.callback ) {
            callbacks.success.callback.call(this,callbacks.success.args);
          }
        }
      },
      error: function(response) {
        console.log(response);
        if( "undefined" !== typeof callbacks && "function" === typeof callbacks.error.callback ) {
          callbacks.error.callback.call(this,callbacks.error.args);
        }
      }
    });
  };

  var _savePaletteOverlayColor = function( data ) {
    $.ajax({
      type: "POST",
      url: live_editor_obj.ajaxurl,
      data: {
        action: "rex_save_palette_overlay_color",
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

  var _deletePaletteOverlayColor = function( data, callbacks ) {
    $.ajax({
      type: "POST",
      url: live_editor_obj.ajaxurl,
      data: {
        action: "rex_delete_palette_overlay_color",
        nonce_param: live_editor_obj.rexnonce,
        data: data,
      },
      success: function(response) {
        if (response.success) {
          if( "undefined" !== typeof callbacks && "function" === typeof callbacks.success.callback ) {
            callbacks.success.callback.call(this,callbacks.success.args);
          }
        }
      },
      error: function(response) {
        console.log(response);
        if( "undefined" !== typeof callbacks && "function" === typeof callbacks.error.callback ) {
          callbacks.error.callback.call(this,callbacks.error.args);
        }
      }
    });
  };

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

  var _deletePaletteGradient = function( data, callbacks ) {
    $.ajax({
      type: "POST",
      url: live_editor_obj.ajaxurl,
      data: {
        action: "rex_delete_palette_gradient",
        nonce_param: live_editor_obj.rexnonce,
        data: data,
      },
      success: function(response) {
        if (response.success) {
          if( "undefined" !== typeof callbacks && "function" === typeof callbacks.success.callback ) {
            callbacks.success.callback.call(this,callbacks.success.args);
          }
        }
      },
      error: function(response) {
        console.log(response);
        if( "undefined" !== typeof callbacks && "function" === typeof callbacks.error.callback ) {
          callbacks.error.callback.call(this,callbacks.error.args);
        }
      }
    });
  };

  return {
    savePaletteColor: _savePaletteColor,
    deletePaletteColor: _deletePaletteColor,
    savePaletteOverlayColor: _savePaletteOverlayColor,
    deletePaletteOverlayColor: _deletePaletteOverlayColor,
    savePaletteGradient: _savePaletteGradient,
    deletePaletteGradient: _deletePaletteGradient,
  };
})(jQuery);
