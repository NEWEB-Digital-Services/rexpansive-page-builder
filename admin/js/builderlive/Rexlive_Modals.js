
var Rexlive_Modals = (function ($) {
    'use strict';

    var section_config_modal_properties;

    var _openSectionModal = function (data) {
        _clearSectionModal();
        _updateSectionModal(data);
        Rexlive_Modals_Utils.openModal(section_config_modal_properties.$self.parent('.rex-modal-wrap'));
    }

    var _closeSectionModal = function () {
        _clearSectionModal();
        Rexlive_Modals_Utils.closeModal(section_config_modal_properties.$self.parent('.rex-modal-wrap'));
    }

    var _clearSectionModal = function () {
        LayoutGrid_Modal.clearLayoutModal();
        Section_Width_Modal.clearSectionWidth();
        GridSeparators_Modal.resetDistances();
        SectionMargins_Modal.resetMargins();
        PhotoSwipe_Modal.resetPhotoswipe();
        SectionName_Modal.resetSectionName();
        CustomClasses_Modal.resetCustomClasses();
    }

    var _updateSectionModal = function (data) {
        LayoutGrid_Modal.updateLayoutModal(data.activeLayout, data.fullHeight);
        Section_Width_Modal.updateSectionWidth(data.dimension, data.section_width);
        GridSeparators_Modal.updateDistances(data.rowDistances);
        SectionMargins_Modal.updateMargins(data.marginsSection);
        PhotoSwipe_Modal.updatePhotoswipe(data.photoswipe);
        SectionName_Modal.updateSectionName(data.sectionName);
        CustomClasses_Modal.updateCustomClasses(data.customClasses);
    }

    var _applySectionLayout = function () {
        var layoutData = LayoutGrid_Modal.getData();
        var sectionWidthData = Section_Width_Modal.getData();
        var gridSeparatosData = GridSeparators_Modal.getData();
        var marginsSectionData = SectionMargins_Modal.getData();

        var data_gallery = {
            eventName: "rexlive:set_gallery_layout",
            data_to_send: {
                layout: layoutData.layout,
                fullHeight: layoutData.fullHeight,
                sectionWidth: sectionWidthData,
                rowDistances: gridSeparatosData,
                sectionMargins: marginsSectionData
            }
        };

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_gallery);
    }

    var _applyPhotoswipeSetting = function () {
        var photoswipe = PhotoSwipe_Modal.getData();

        var data_photoswipe = {
            eventName: "rexlive:set_row_photoswipe",
            data_to_send: {
                photoswipe: photoswipe
            }
        }

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_photoswipe);
    }

    var _applySectionName = function () {
        var sectionName = SectionName_Modal.getData();
        var data_sectionName = {
            eventName: "rexlive:change_section_name",
            data_to_send: {
                sectionName: sectionName
            }
        }

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_sectionName);
    }

    var _applyCustomClasses = function () {
        var newClassesString = CustomClasses_Modal.getData();
        newClassesString = newClassesString.trim();
        var classList = newClassesString.split(/\s+/);
        var data_customClasses = {
            eventName: "rexlive:apply_section_custom_classes",
            data_to_send: {
                customClasses: classList
            }
        }

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_customClasses);
    }

    var _linkDocumentListenersSectionPropertiesModal = function () {
        section_config_modal_properties.$save_button.click(function (e) {
            e.preventDefault();
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
        };

        _linkDocumentListenersSectionPropertiesModal();

        // section config
        LayoutGrid_Modal.init($sectionConfigModal);
        Section_Width_Modal.init($sectionConfigModal);
        GridSeparators_Modal.init($sectionConfigModal);
        SectionMargins_Modal.init($sectionConfigModal);
        PhotoSwipe_Modal.init($sectionConfigModal);
        SectionName_Modal.init($sectionConfigModal);
        CustomClasses_Modal.init($sectionConfigModal);

        // new blocks video
        Insert_Video_Modal.init();

        // custom css
        CssEditor_Modal.init();

        //background row
        //SectionBackground_Modal.init();
    }

    return {
        init: init,
        openSectionModal: _openSectionModal,
        applySectionName: _applySectionName,
        applyPhotoswipeSetting: _applyPhotoswipeSetting,
        applySectionLayout: _applySectionLayout,
        applyCustomClasses: _applyCustomClasses
    };

})(jQuery);