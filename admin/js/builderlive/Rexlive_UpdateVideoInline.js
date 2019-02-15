var Change_UpdateVideoInline_Modal = (function($) {
  "use strict";
  var layout_changing_props;

  var _openModal = function(data) {
    //activeLayoutPage = data.activeLayout;
    //buttonData = data.buttonData;
    Rexlive_Modals_Utils.openModal(
      layout_changing_props.$self.parent(".rex-modal-wrap")
    );
    // Reset Input when the popup opens -A
   document.getElementById("me-insert-embed-inline-video-text").value = "";
    // Hide the text that warns the invalidity of the entered value. -A
    $("#me-insert-embed-url-isnot-valid").css("display","none");
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
            var inlinevideourlvalue = document.getElementById("me-insert-embed-inline-video-text").value;
            // This function verifies the validity of the value based on the references below. -A
            function isUrlValid(url) {
              return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
            }
            // This string checks the validity of the URL. -A
            var isUrl = isUrlValid(inlinevideourlvalue);
            // This function specifies the actions that must be performed depending on the positive or negative (true/false) value of the validation. -A
            if( isUrl == false ){
              $("#me-insert-embed-url-isnot-valid").css("display","block");
              document.getElementById("me-insert-embed-inline-video-text").value = "";
              console.log("InsertVIDEO || The value has an error, it isn't a valid URL\nValue:",inlinevideourlvalue,"\nisUrl:",isUrl);
              $("#me-insert-embed-url-isnot-valid").fadeOut(3000);
            } else {
              var settings = {
                eventName: "rexlive:mediumEditor:inlineVideoEditor",
                data_to_send: {
                  valueUrl: inlinevideourlvalue,
                }
              };
              Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(settings);
              console.log("InsertVIDEO || The value has been validated\nValue:",inlinevideourlvalue,"\nisUrl:",isUrl);
              _closeModal();
            }

        /*  Copy of the original code without adding the function to manage the validity of the URL. -A
            var settings = {
              eventName: "rexlive:mediumEditor:inlineVideoEditor",
              data_to_send: {
                valueUrl: inlinevideourlvalue,
              }
            };
            Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(settings);  */

            break;             
        case "hide":
            _closeModal();
            break;
        default:
            _closeModal();
            break;
      }
    });
  };

  var _init = function() {
    var $self = $("#rexlive-updatevideoinline");
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