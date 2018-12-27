var Open_Models_Warning = (function($) {
  "use strict";

  var rexmodel_open_props;

  var _openModal = function(data) {
    rexmodel_open_props.$models_list.empty();
    for(var i=0; i<data.length; i++) {
      rexmodel_open_props.$models_list.append('<span class="modal-info--highlight">' + data[i].m_name + ( i != data.length-1 ? ', ' : '' ) + '</span>');
    }
    Rexlive_Modals_Utils.openModal(
      rexmodel_open_props.$self.parent(".rex-modal-wrap")
    );
  };

  var _closeModal = function() {
    Rexlive_Modals_Utils.closeModal(
      rexmodel_open_props.$self.parent(".rex-modal-wrap")
    );
  };

  var _linkDocumentListeners = function() {
    rexmodel_open_props.$close_button.on("click", function() {
      _closeModal();
    })
  };

  var _init = function() {
    var $self = $("#rex-open-models-warning");
    var $container = $self;
    rexmodel_open_props = {
      $self: $self,
      $close_button: $container.find(".rex-modal__close-button"),
      $models_list: $container.find('.open-models-list')
    };
    _linkDocumentListeners();
  };

  return {
    init: _init,
    openModal: _openModal,
    closeModal: _closeModal
  };
})(jQuery);
