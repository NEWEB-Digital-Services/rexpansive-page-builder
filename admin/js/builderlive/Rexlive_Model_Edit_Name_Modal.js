/**
 * Create a Model starting from a Row
 * @since 2.0.0
 */
var Rexlive_Model_Edit_Name_Modal = (function($) {
  "use strict";
  var rexmodel_modal_props;
  var initialTitle;

  var _openModal = function(modelData) {
    rexmodel_modal_props.model_name.value = ( modelData.name ? modelData.name : '' );
    initialTitle = ( modelData.name ? modelData.name : '' );
    Rexlive_Base_Settings.addClass( rexmodel_modal_props.model_name, 'active' );
    rexmodel_modal_props.model_name.setAttribute('data-rex-model-id', modelData.id);

    Rexlive_Modals_Utils.openModal( rexmodel_modal_props.$modal );
    rexmodel_modal_props.model_name.focus();
  };

  var _closeModal = function() {
    rexmodel_modal_props.model_name.blur();
    Rexlive_Modals_Utils.closeModal( rexmodel_modal_props.$modal );

    rexmodel_modal_props.model_name.value = '';
    initialTitle = '';
    rexmodel_modal_props.model_name.setAttribute('data-rex-model-id', '');
    Rexlive_Base_Settings.removeClass( rexmodel_modal_props.model_name, 'active' );
  };

  var _linkDocumentListeners = function() {
    rexmodel_modal_props.save_button.addEventListener('click', function(e) {
      e.preventDefault();

      if ( rexmodel_modal_props.model_name.value !== initialTitle) {
        Model_Import_Modal.editModelName({
          id: rexmodel_modal_props.model_name.getAttribute('data-rex-model-id'),
          name: rexmodel_modal_props.model_name.value
        });
      }

      _closeModal();
    });

    rexmodel_modal_props.cancel_button.addEventListener('click', function(e) {
      e.preventDefault();
      _closeModal();
    });

    /**
     * Saving a model with ENTER key
     */
    rexmodel_modal_props.$model_name.on("keyup", function(e) {
      var key = 'which' in e ? e.which : e.keyCode;
      if( key === 13 ) {
        rexmodel_modal_props.$save_button.trigger("click");
      }
    });
  };

  var _init = function() {
    var self = document.getElementById('rex-model__edit-name__modal');
    var $self = $(self);
    rexmodel_modal_props = {
      $self: $self,
      $modal: $self.parent(".rex-modal-wrap"),
      save_button: self.querySelector("#rex-model__edit-name__save"),
      $save_button: null,
      cancel_button: self.querySelector(".rex-cancel-button"),
      model_name: self.querySelector("#rex-model__edit-name"),
      $model_name: null
    };

    rexmodel_modal_props.$save_button = $(rexmodel_modal_props.save_button);
    rexmodel_modal_props.$model_name = $(rexmodel_modal_props.model_name);

    _linkDocumentListeners();
  };

  return {
    init: _init,
    openModal: _openModal,
    closeModal: _closeModal
  };
})(jQuery);
