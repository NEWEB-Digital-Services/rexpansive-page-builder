var Change_UpdateVideoInline_Modal = (function($) {
  "use strict";
  var layout_changing_props;

  var _openModal = function(data) {
    //activeLayoutPage = data.activeLayout;
    //buttonData = data.buttonData;
    Rexlive_Modals_Utils.openModal(
      layout_changing_props.$self.parent(".rex-modal-wrap")
    );
    // RESETTA LA TEXTBOX OGNI VOLTA CHE APRI IL POPUP PER L'INSERIMENTO DEL VIDEO URL
    document.getElementById("me-insert-embed-inline-video-text").value = "";
    //layout_changing_props.$layout_name_placholder.text(data.activeLayoutLabel);
  };

  var _closeModal = function() {
    Rexlive_Modals_Utils.closeModal(
      layout_changing_props.$self.parent(".rex-modal-wrap")
    );
  };

  var _linkDocumentListeners = function() {
    layout_changing_props.$button.on("click", function(e) {
      var $button = $(e.target);
      var optionSelected = $button
        .parents(".rex-change-layout-option")
        .attr("data-rex-option");

      switch (optionSelected) {
        case "uploadvideo":
            // AVVIO IL CASE: "uploadvideo", $inlinevideourlvalue assume il valore compilato dall'utent
            var inlinevideourlvalue = document.getElementById("me-insert-embed-inline-video-text").value;
            // CREO UN EVENTO PER INVIARE I DATI DA "admin" A "public"
            var settings = {
              eventName: "rexlive:mediumEditor:inlineVideoEditor",
              data_to_send: {
                valueUrl: inlinevideourlvalue,
              }
            };
            Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(settings);            
            break;
        case "hide":
            break;
        default:
            break;
      }

      _closeModal();
    });
  };

  var _init = function() {
    var $self = $("#rexlive-updatevideoinline");

    // CARICO I DATI DELL'IMPUT TRAMITE L'ID: me-insert-embed-inline-video-text
    var $inlinevideourl = document.getElementById("me-insert-embed-inline-video-text");

    var $container = $self;
    layout_changing_props = {
      $self: $self,
      $button: $container.find(".rex-button"),
      $layout_name_placholder: $container.find(".layout-name")
    };
    _linkDocumentListeners();
  };

  //console.log("CARICAMENTO COMPLETATO: ../RexLive_OnBeforeUnload.js");

  return {
    init: _init,
    openModal: _openModal,
    closeModal: _closeModal
  };

})(jQuery);