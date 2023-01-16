/**
 * Object that handles the message in case the user came from the first time from the backend
 * warning him that after the saving it can only use the builderlive to edit the page
 * @since 2.0.0
 */
var LockedOptionMask = (function($) {
  "use strict";
  var locked_option_props;
  var buttonData;

  var _openModal = function(data) {
    buttonData = data.buttonData;
    Rexlive_Modals_Utils.openModal(
      locked_option_props.$self.parent(".rex-modal-wrap")
    );
  };

  var _closeModal = function() {
    Rexlive_Modals_Utils.closeModal(
      locked_option_props.$self.parent(".rex-modal-wrap")
    );
  };

  var _linkDocumentListeners = function() {
    locked_option_props.$button.on("click", function(e) {
      var $button = $(e.target);
      var optionSelected = $button
        .parents(".rex-locked-option-wrapper")
        .attr("data-rex-option");

      switch (optionSelected) {
        case "save":
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
          break;
        case "abort":
          break;
        default:
          break;
      }

      _closeModal();
    });
  };

  var _init = function() {
    var $self = $("#rex-locked-option");
    var $container = $self;
    locked_option_props = {
      $self: $self,
      $button: $container.find(".rex-button")
    };
    _linkDocumentListeners();
  };

  return {
    init: _init,
    openModal: _openModal,
    closeModal: _closeModal
  };
})(jQuery);
