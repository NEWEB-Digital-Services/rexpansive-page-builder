
var Rexlive_Modals = (function ($) {
    'use strict';

    var section_config_modal_properties;

    var _openSectionModal = function (data) {
        _clearSectionModal();
        _updateSectionModal(data);
        Rexlive_Modals_Utils.openModal(section_config_modal_properties.$self.parent('.rex-modal-wrap'));
    }

    var _closeSectionModal = function () {
        _resetSectionModalData();
        Rexlive_Modals_Utils.closeModal(section_config_modal_properties.$self.parent('.rex-modal-wrap'));
    }

    var _resetSectionModalData = function () {
        Section_Width_Modal.resetOldWidthData();
    }

    var _clearSectionModal = function () {
        LayoutGrid_Modal.clearLayoutModal();
        Section_Width_Modal.clearSectionWidth();
        GridSeparators_Modal.resetDistances();
        SectionMargins_Modal.resetMargins();
        PhotoSwipe_Modal.resetPhotoswipe();
    }

    var _updateSectionModal = function (data) {
        console.log(data);
        LayoutGrid_Modal.updateLayoutModal(data.activeLayout, data.fullHeight);
        Section_Width_Modal.updateSectionWidth(data.dimension, data.section_width);
        GridSeparators_Modal.updateDistances(data.rowDistances);
        SectionMargins_Modal.updateMargins(data.marginsSection);
        PhotoSwipe_Modal.updatePhotoswipe(data.photoswipe);
    }

    var _linkDocumentListenersSectionPropertiesModal = function () {
        section_config_modal_properties.$save_button.click(function (e) {
            e.preventDefault();

            var layoutData = LayoutGrid_Modal.getData();
            var sectionWidthData = Section_Width_Modal.getData();
            var gridSeparatosData = GridSeparators_Modal.getData();
            var marginsSectionData = SectionMargins_Modal.getData();
            var photoswipe = PhotoSwipe_Modal.getData();

            var custom_classes = $('#section-set-custom-class').val();
            var holdGrid = (true === section_config_modal_properties.$hold_grid.prop('checked') ? 'true' : 'false');
            var section_custom_name = section_config_modal_properties.$section_id.val();

            var data = {
                eventName: "rexlive:set_gallery_layout",
                data_to_send: {
                    layout: layoutData.layout,
                    fullHeight: layoutData.fullHeight,
                    sectionWidth: sectionWidthData,
                    rowDistances: gridSeparatosData,
                    sectionMargins: marginsSectionData,
                    photoswipe: photoswipe
                }
            };

            Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);

            _closeSectionModal();
        });

        section_config_modal_properties.$cancel_button.click(function (e) {
            e.preventDefault();
            _closeSectionModal();
        });
    }


    var init = function () {
        var $sectionConfigModal = $('#modal-background-responsive-set');
        section_config_modal_properties = {
            $self: $sectionConfigModal,

            $save_button: $sectionConfigModal.find('#backresponsive-set-save'),
            $cancel_button: $sectionConfigModal.find('#backresponsive-set-cancel'),

            // HOLD GRID config
            $hold_grid: $sectionConfigModal.find("#rx-hold-grid"),

            // ID and navigator configuration
            $section_id: $sectionConfigModal.find('#sectionid-container'),


        };

        _linkDocumentListenersSectionPropertiesModal();

        LayoutGrid_Modal.init($sectionConfigModal);
        Section_Width_Modal.init($sectionConfigModal);
        GridSeparators_Modal.init($sectionConfigModal);
        SectionMargins_Modal.init($sectionConfigModal);
        PhotoSwipe_Modal.init($sectionConfigModal);

        Insert_Video_Modal.init();
    }

    return {
        init: init,
        openSectionModal: _openSectionModal,
    };

})(jQuery);