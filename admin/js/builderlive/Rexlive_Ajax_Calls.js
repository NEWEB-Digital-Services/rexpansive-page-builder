/**
 * Common ajax functions to call
 * @since 2.0.0
 */
var Rexlive_Ajax_Calls = (function($) {
  "use strict";

  var _save_process_ended = function() {
    $.ajax({
      type: "POST",
      url: live_editor_obj.ajaxurl,
      data: {
        action: "rex_save_process_ended",
        nonce_param: live_editor_obj.rexnonce,
        post_ID: document.getElementById("post_ID").value
      },
      success: function(response) {
        if (response.success) {
        }
      },
      error: function(response) {
      }
    });
  };

  /**
   * Saving a color in the color palette
   * @param {Object} data object with ID and value for a color to save
   */
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
        }
      },
      error: function(response) {
      }
    });
  };

  /**
   * Delete a color palette by ID
   * @param {Object} data object with ID of the color to delete
   * @param {Object} callbacks object with a list of callbacks to call and parameter
   *                            to assign in case of success or error
   */
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
        if( "undefined" !== typeof callbacks && "function" === typeof callbacks.error.callback ) {
          callbacks.error.callback.call(this,callbacks.error.args);
        }
      }
    });
  };

  /**
   * Saving a color in the overlay palette
   * @param {Object} data object with ID and value for a overlay to save
   */
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
        }
      },
      error: function(response) {
      }
    });
  };

  /**
   * Delete an overlay palette by ID
   * @param {Object} data object with ID of the overlay to delete
   * @param {Object} callbacks object with a list of callbacks to call and parameter
   *                            to assign in case of success or error
   */
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
        if( "undefined" !== typeof callbacks && "function" === typeof callbacks.error.callback ) {
          callbacks.error.callback.call(this,callbacks.error.args);
        }
      }
    });
  };

  /**
   * Saving a gradient in the gradient palette
   * @param {Object} data object with ID and value for a gradient to save
   */
  var _savePaletteColorGradient = function( data ) {
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
          $(".palette-list__gradient").each(function(i,el) {
            var $list = $(el);
            var item = tmpl("tmpl-palette-item",{});
            var $item = $(item);

            $list.find(".palette__add-gradient").before( $item );

            $item.css("background", data.gradient_preview);
            $item.attr("data-gradient-id", data.ID);
            $item.attr("data-gradient-value", data.gradient);
          });
        }
      },
      error: function(response) {
      }
    });
  };

  /**
   * Delete a gradient palette by ID
   * @param {Object} data object with ID of the gradient to delete
   */
  var _deletePaletteColorGradient = function( data ) {
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
          $(".palette-list__gradient").find(".palette-item[data-gradient-id=" + data.ID + "]").each(function(i,el) {
            $(el).remove();
          });
        }
      },
      error: function(response) {
      }
    });
  };

  /**
   * Saving a gradient in the gradient overlay palette
   * @param {Object} data object with ID and value for a gradient to save
   */
  var _savePaletteOverlayGradient = function( data ) {
    $.ajax({
      type: "POST",
      url: live_editor_obj.ajaxurl,
      data: {
        action: "rex_save_palette_overlay_gradient",
        nonce_param: live_editor_obj.rexnonce,
        data: data,
      },
      success: function(response) {
        if (response.success) {
          $(".palette-list__overlay-gradient").each(function(i,el) {
            var $list = $(el);
            var item = tmpl("tmpl-palette-item",{});
            var $item = $(item);

            $list.find(".palette__add-gradient").before( $item );

            $item.css("background", data.gradient_preview);
            $item.attr("data-gradient-id", data.ID);
            $item.attr("data-gradient-value", data.gradient);
          });
        }
      },
      error: function(response) {
      }
    });
  };

  /**
   * Delete a gradient overlay palette by ID
   * @param {Object} data object with ID of the gradient to delete
   */
  var _deletePaletteOverlayGradient = function( data ) {
    $.ajax({
      type: "POST",
      url: live_editor_obj.ajaxurl,
      data: {
        action: "rex_delete_palette_overlay_gradient",
        nonce_param: live_editor_obj.rexnonce,
        data: data,
      },
      success: function(response) {
        if (response.success) {
          $(".palette-list__overlay-gradient").find(".palette-item[data-gradient-id=" + data.ID + "]").each(function(i,el) {
            $(el).remove();
          });
        }
      },
      error: function(response) {
      }
    });
  };

  return {
    save_process_ended: _save_process_ended,
    savePaletteColor: _savePaletteColor,
    deletePaletteColor: _deletePaletteColor,
    savePaletteOverlayColor: _savePaletteOverlayColor,
    deletePaletteOverlayColor: _deletePaletteOverlayColor,
    savePaletteColorGradient: _savePaletteColorGradient,
    deletePaletteColorGradient: _deletePaletteColorGradient,
    savePaletteOverlayGradient: _savePaletteOverlayGradient,
    deletePaletteOverlayGradient: _deletePaletteOverlayGradient
  };
})(jQuery);
