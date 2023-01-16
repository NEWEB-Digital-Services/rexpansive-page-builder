var Resynch_Content_Modal = (function($) {
  "use strict";

  var resynch_content_props;
  var buttonData;
  var targetInfo;

  var _openModal = function(info) {
    targetInfo = info.data.targetInfo;
    Rexlive_Modals_Utils.openModal( resynch_content_props.$self.parent(".rex-modal-wrap") );
  };

  var _closeModal = function() {
    targetInfo = null;
    Rexlive_Modals_Utils.closeModal(
      resynch_content_props.$self.parent(".rex-modal-wrap")
    );
  };

  var _linkDocumentListeners = function() {
    resynch_content_props.$button.on("click", function(event) {
      var optionSelected = event.currentTarget.getAttribute("data-rex-option");
      switch (optionSelected) {
        case "save":
          Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage({
            eventName: 'rexlive:apply_reSynchContent',
            data: {
              targetInfo: targetInfo
            }
          });
          break;
        case "abort":
          // do nothing
          break;
        default:
          break;
      }

      _closeModal();
    });
  };

  var _init = function() {
    targetInfo = null;
    var $self = $("#rex-resynch-content");
    resynch_content_props = {
      $self: $self,
      $button: $self.find(".rex-resynch-content-option")
    };
    _linkDocumentListeners();
  };

  return {
    init: _init,
    openModal: _openModal,
    closeModal: _closeModal
  };
})(jQuery);
