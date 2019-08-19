;(function() {
  "use strict";

  var start = function() {
    // base setting: tooltips and $document caching
    Rexlive_Base_Settings.init();

    Rexlive_Color_Palette.init();
    Rexlive_Overlay_Palette.init();
    
    // communication between parent and iframe: listen to and send events
    Rexbuilder_Util_Admin_Editor.init();

    // builder config: backend utility = useless here
    // Rexpansive_Builder_Admin_Config.init();

    // modal utilities: open, close
    Change_UpdateVideoInline_Modal.init();
    Rexlive_Modals_Utils.init();
    
    // launch all the modals
    Rexlive_Modals.init();
    
    // builder backend modals: for RexSlider
    // Rexpansive_Builder_Admin_PaddingEditor.init();
    // Rexpansive_Builder_Admin_PositionEditor.init();
    Rexlive_RexSlider_TextEditor.init();

    // slider modal
    Rexbuilder_RexSlider.init();
  }

  var verify_saving = function(e){        
    if(Rexbuilder_Util_Admin_Editor.pageSaved == false){        
      e.preventDefault();
      var message = "\o/";    
      (e || window.event).returnValue = message;
      console.log("WARNING: Before closing the page verify that you have saved the changes.");
      return message;
    }
  }

  document.addEventListener('DOMContentLoaded', start);
  window.addEventListener("beforeunload", verify_saving);
})();
