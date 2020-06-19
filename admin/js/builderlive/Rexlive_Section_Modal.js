var Section_Modal = (function($) {
  "use strict";

  var section_config_modal_properties;
  var resetData;

  var _openSectionModal = function(data, mousePosition) {
    resetData = data;
    _clearSectionModal();
    _updateSectionModal(data);
    Rexlive_Modals_Utils.positionModal( section_config_modal_properties.$self, mousePosition );
    Rexlive_Modals_Utils.openModal(
      section_config_modal_properties.$self.parent(".rex-modal-wrap")
    );
  };

  var _closeSectionModal = function( reset ) {
    if ( reset ) {
      _resetSectionModal();
    }
    Rexlive_Modals_Utils.closeModal( section_config_modal_properties.$self.parent(".rex-modal-wrap") );
    setTimeout(function() {
      _clearSectionModal();
    }, 300);
    resetData = null;
  };

  var _resetSectionModal = function() {
    if( resetData ) {
      _updateSectionModal( resetData );
    }
    _applySectionModal();

    // restore the blocks dimensions, probably changed
    var event = {
      eventName: "rexlive:update_blocks_sizes",
      data_to_send: {
        sectionTarget: resetData.sectionTarget,
        blocksState: resetData.blocksState
      }
    };

    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(event);
  };

  var _clearSectionModal = function() {
    LayoutGrid_Modal.clearLayoutModal();
    Section_Width_Modal.clearSectionWidth();
    GridSeparators_Modal.resetDistances();
    SectionMargins_Modal.resetMargins();
    PhotoSwipe_Modal.resetPhotoswipe();
    Hold_Grid_Modal.reset();
    FullHeight_Modal.reset();
    SectionName_Modal.resetSectionName();
    Section_NavLabel_Modal.resetSectionNavLabel();
    Section_CustomClasses_Modal.reset();
  };

  var _updateSectionModal = function(data) {
    LayoutGrid_Modal.updateLayoutModal(data);
    Section_Width_Modal.updateSectionWidth(data);
    GridSeparators_Modal.updateDistances(data);
    SectionMargins_Modal.updateMargins(data);
    PhotoSwipe_Modal.updatePhotoswipe(data);
		Hold_Grid_Modal.update(data);
    FullHeight_Modal.update(data);
    SectionName_Modal.updateSectionName(data);
    Section_NavLabel_Modal.updateSectionNavLabel(data);
    Section_CustomClasses_Modal.update(data);
  };

  var _applySectionModal = function() {
    LayoutGrid_Modal.applySectionLayout();
    Section_Width_Modal.applySectionWidth();
    GridSeparators_Modal.applyRowDistances();
    SectionMargins_Modal.applySectionMargins();
    PhotoSwipe_Modal.applyPhotoswipeSetting();
    Hold_Grid_Modal.apply();
    FullHeight_Modal.apply();
    SectionName_Modal.applySectionName();
    Section_NavLabel_Modal.applySectionNavLabel();
    Section_CustomClasses_Modal.apply();
  };

  var _linkDocumentListenersSectionPropertiesModal = function() {
    section_config_modal_properties.$close_button.click(function(e) {
      e.preventDefault();
      _closeSectionModal( true );
    });

    // confirm-refresh options
    section_config_modal_properties.$options_buttons.on('click', function(event) {
      event.preventDefault();
      switch( this.getAttribute('data-rex-option' ) ) {
        case 'save':
          _closeSectionModal( false );
          break;
        case 'reset':
          _resetSectionModal();
          break;
        default:
          break;
      }
    });
  };

  var init = function() {
    var $sectionConfigModal = $("#modal-background-responsive-set");
    section_config_modal_properties = {
      $self: $sectionConfigModal,
      $options_buttons: $sectionConfigModal.find('.rex-modal-option'),
      $close_button: $sectionConfigModal.find('.rex-modal__close-button'),
    };

    _linkDocumentListenersSectionPropertiesModal();

    // section config
    LayoutGrid_Modal.init($sectionConfigModal);
    Section_Width_Modal.init($sectionConfigModal);
    GridSeparators_Modal.init($sectionConfigModal);
    SectionMargins_Modal.init($sectionConfigModal);
    PhotoSwipe_Modal.init($sectionConfigModal);
    Hold_Grid_Modal.init($sectionConfigModal);
    FullHeight_Modal.init($sectionConfigModal);
    SectionName_Modal.init($sectionConfigModal);
    Section_NavLabel_Modal.init($sectionConfigModal);
    Section_CustomClasses_Modal.init($sectionConfigModal);
  };

  return {
    init: init,
    openSectionModal: _openSectionModal
  };
})(jQuery);
