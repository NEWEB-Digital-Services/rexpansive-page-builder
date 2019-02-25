var Change_OnBeforeUnload_Modal = (function($) {
  "use strict";
  var layout_changing_props;
  var activeLayoutPage;
  var buttonData;

  var _openModal = function(data) {
    //activeLayoutPage = data.activeLayout;
    //buttonData = data.buttonData;
    Rexlive_Modals_Utils.openModal(
      layout_changing_props.$self.parent(".rex-modal-wrap")     
    );
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
        case "saveandclose":
          Rexbuilder_Util_Admin_Editor.$responsiveToolbar
            .find(".btn-save")
            .addClass("rex-saving");
          var dataSavePage = {
            eventName: "rexlive:savePage",
            data_to_send: {
              buttonData: buttonData
            }
          };
          var dataSaveModel = {
            eventName: "rexlive:saveModel",
            data_to_send: {
              buttonData: buttonData
            }
          };
          Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataSavePage);
          Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataSaveModel);
          Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage({
            eventName: "rexlive:startChangeLayout"
          });
          Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.removeClass(
            "btn-redo--active btn-undo--active"
          );
          break;
        case "cancelandclose":
          var data = {
            eventName: "rexlive:dropChanges",
            data_to_send: {
              selected: activeLayoutPage,
              eventName: "",
              buttonData: buttonData
            }
          };
          Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
          Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.removeClass(
            "btn-redo--active btn-undo--active"
          );
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
    var $self = $("#rexlive-onbeforeunload");
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