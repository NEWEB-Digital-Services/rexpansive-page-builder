var Delete_Model_Modal = (function($) {
  "use strict";

  var delete_model_props;
  var targetInfo;

  /**
   * Open the modal window
   * @param  {Object} info data of the model to delete: {type, id}
   * @return {void}
   * @since  2.0.5
   */
  var _openModal = function(info) {
    if ( info ) {
      targetInfo = info;
    }
    Rexlive_Modals_Utils.openModal( delete_model_props.$self.parent(".rex-modal-wrap") );
  };

  var _closeModal = function() {
    targetInfo = null;
    Rexlive_Modals_Utils.closeModal( delete_model_props.$self.parent(".rex-modal-wrap") );
  };

  var _linkDocumentListeners = function() {
    delete_model_props.$button.on("click", function(event) {
      var optionSelected = event.currentTarget.getAttribute("data-rex-option");
      switch ( optionSelected ) {
        case "confirm":
          switch( targetInfo.type ) {
            case 'template':
              break;
            case 'button':
              Button_Import_Modal.deleteButton( targetInfo.element );
              break;
            case 'form':
              break;
            default:
              break;
          }
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
    var $self = $("#rex-delete-model");
    delete_model_props = {
      $self: $self,
      $button: $self.find(".rex-delete-model-option")
    };
    _linkDocumentListeners();
  };

  return {
    init: _init,
    openModal: _openModal,
    closeModal: _closeModal
  };
})(jQuery);
