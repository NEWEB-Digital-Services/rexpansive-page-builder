(function($) {
  "use strict";

  $(document).ready(function() {
    // base setting: tooltips and $document caching
    Rexlive_Base_Settings.init();
    
    // communication between parent and iframe: listen to and send events
    Rexbuilder_Util_Admin_Editor.init();

    // builder config: backend utility = useless here
    // Rexpansive_Builder_Admin_Config.init();

    // modal utilities: open, close
    Rexlive_Modals_Utils.init();

    // launch all the modals
    Rexlive_Modals.init();
    
    // builder backend modals: useless here
    // Rexpansive_Builder_Admin_PaddingEditor.init();
    // Rexpansive_Builder_Admin_PositionEditor.init();
    // Rexpansive_Builder_Admin_TextEditor.init();

    Rexbuilder_RexSlider.init();
  });
})(jQuery);
