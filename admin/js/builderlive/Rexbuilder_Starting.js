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
    Rexlive_Modals_Utils.init();
    

    console.log("RICHIAMO LA FUNZIONE: Change_OnBeforeUnload_Modal.init()");
    
    // launch all the modals
    Rexlive_Modals.init();
    
    // builder backend modals: for RexSlider
    // Rexpansive_Builder_Admin_PaddingEditor.init();
    // Rexpansive_Builder_Admin_PositionEditor.init();
    Rexlive_RexSlider_TextEditor.init();

    // slider modal
    Rexbuilder_RexSlider.init();

    var bloccapopupricaricamento = function(e) {
      var messaggiodidefault = "\o/";

      (e || window.event).returnValue = messaggiodidefault; // Gecko + IE
      console.log("ATTENZIONE: Prima di chiudere la scheda in corso/prima di cambiare pagina verifica di aver salvato il tuo progetto.");
      return messaggiodidefault; // Webkit, Safari, Chrome etc.
    };
    window.addEventListener("beforeunload", bloccapopupricaricamento);

  });
})(jQuery);
