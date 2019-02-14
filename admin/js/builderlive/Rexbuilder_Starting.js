(function($) {
  "use strict";

  $(document).ready(function() {
    // base setting: tooltips and $document caching
    Rexlive_Base_Settings.init();

    Rexlive_Color_Palette.init();
    Rexlive_Overlay_Palette.init();
    
    // communication between parent and iframe: listen to and send events
    Rexbuilder_Util_Admin_Editor.init();

    // builder config: backend utility = useless here
    // Rexpansive_Builder_Admin_Config.init();

    // modal utilities: open, close
    Change_OnBeforeUnload_Modal.init();
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

    var verificasalvataggio;
    verificasalvataggio = function(e){        
      if(Rexbuilder_Util_Admin_Editor.pageSaved == false){        
        //Change_OnBeforeUnload_Modal.openModal();        
        e.preventDefault();
        var message = "\o/";    
        (e || window.event).returnValue = message;
        console.log("ATTENTION: Before closing the page verify that you have saved the changes.");
        return message;
      }
    }    
    window.addEventListener("beforeunload", verificasalvataggio);

  });
})(jQuery);
