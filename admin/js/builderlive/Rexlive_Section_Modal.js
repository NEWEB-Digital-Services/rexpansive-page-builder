var Section_Modal = (function($) {
  "use strict";

  var section_config_modal_properties;

  var _openSectionModal = function(data, mousePosition) {
    _clearSectionModal();
    _updateSectionModal(data);
    Rexlive_Modals_Utils.positionModal( section_config_modal_properties.$self, mousePosition );
    Rexlive_Modals_Utils.openModal(
      section_config_modal_properties.$self.parent(".rex-modal-wrap")
    );
  };

  var _closeSectionModal = function() {
    Rexlive_Modals_Utils.closeModal( section_config_modal_properties.$self.parent(".rex-modal-wrap") );
    setTimeout(function() {
      _clearSectionModal();
    }, 300);
  };

  var _clearSectionModal = function() {
    LayoutGrid_Modal.clearLayoutModal();
    Section_Width_Modal.clearSectionWidth();
    GridSeparators_Modal.resetDistances();
    SectionMargins_Modal.resetMargins();
    PhotoSwipe_Modal.resetPhotoswipe();
    FullHeight_Modal.resetFullHeight();
    SectionName_Modal.resetSectionName();
    Section_CustomClasses_Modal.resetCustomClasses();
  };

  var _updateSectionModal = function(data) {
    LayoutGrid_Modal.updateLayoutModal(data);
    Section_Width_Modal.updateSectionWidth(data);
    GridSeparators_Modal.updateDistances(data);
    SectionMargins_Modal.updateMargins(data);
    PhotoSwipe_Modal.updatePhotoswipe(data);
    FullHeight_Modal.updateFullHeight(data);
    SectionName_Modal.updateSectionName(data);
    Section_CustomClasses_Modal.updateCustomClasses(data);
  };

  var _linkDocumentListenersSectionPropertiesModal = function() {
    section_config_modal_properties.$close_button.click(function(e) {
      e.preventDefault();
      _closeSectionModal();
    });
  };

  var init = function() {
    var $sectionConfigModal = $("#modal-background-responsive-set");
    section_config_modal_properties = {
      $self: $sectionConfigModal,
      
      $close_button: $sectionConfigModal.find('.rex-modal__close-button'),
    };

    _linkDocumentListenersSectionPropertiesModal();

    // section config
    LayoutGrid_Modal.init($sectionConfigModal);
    Section_Width_Modal.init($sectionConfigModal);
    GridSeparators_Modal.init($sectionConfigModal);
    SectionMargins_Modal.init($sectionConfigModal);
    PhotoSwipe_Modal.init($sectionConfigModal);
    FullHeight_Modal.init($sectionConfigModal);
    SectionName_Modal.init($sectionConfigModal);
    Section_CustomClasses_Modal.init($sectionConfigModal);
  };

  return {
    init: init,
    openSectionModal: _openSectionModal
  };
})(jQuery);
