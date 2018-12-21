(function($) {
  "use strict";

  /**
   * All of the code for your admin-specific JavaScript source
   * should reside in this file.
   *
   * Note that this assume you're going to use jQuery, so it prepares
   * the $ function reference to be used within the scope of this
   * function.
   *
   * From here, you're able to define handlers for when the DOM is
   * ready:
   *
   * $(function() {
   *
   * });
   *
   * Or when the window is loaded:
   *
   * $( window ).load(function() {
   *
   * });
   *
   * ...and so on.
   *
   * Remember that ideally, we should not attach any more than a single DOM-ready or window-load handler
   * for any particular page. Though other scripts in WordPress core, other plugins, and other themes may
   * be doing this, we should try to minimize doing that in our own work.
   */

  $(function() {
    var $postdivrich = $("#postdivrich");
    var $rexbuilder = $("#rexbuilder");
    var $rexbuilder_active = $("#_rexbuilder_active");
    var $builder_switch_wrap = $(".builder-heading");
		var $builder_switch = $builder_switch_wrap.find("#builder-switch");
    
    if ( "true" == _plugin_backend_settings.activate_builder && "true" == $rexbuilder_active.val() ) {
      // Check this global variable to hide the default worpdress text editor
      $postdivrich.hide();
      $rexbuilder.show();
    } else {
      $postdivrich.show();
      $rexbuilder.hide();
      $builder_switch.prop("checked", false);
    }

    $builder_switch.on("change", function() {
      if ($(this).prop("checked")) {
        $postdivrich.hide();
        $rexbuilder.show();
        $rexbuilder_active.val("true");
      } else {
        $postdivrich.show();
        $rexbuilder.hide();
        $rexbuilder_active.val("false");
        $(window).resize();
      }
    });
  });
})(jQuery);
