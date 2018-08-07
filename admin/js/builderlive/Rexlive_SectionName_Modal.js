var SectionName_Modal = (function ($) {
    'use strict';

    var section_name_modal_properties;
    var defaultName;

    var _resetSectionName = function () {
        section_name_modal_properties.$section_id.val(defaultName);
    }

    var _updateSectionName = function (newName) {
        section_name_modal_properties.$section_id.val(newName);
    }

    var _getData = function () {
        var newName = section_name_modal_properties.$section_id.val();
        return newName;
    }

    var _linkDocumentListeners = function () {
        section_name_modal_properties.$section_id.keyup(function (e) {
            Section_Modal.applySectionName();
        })
    }

    var _init = function ($container) {
        section_name_modal_properties = {

            // ID and navigator configuration
            $section_id: $container.find('#sectionid-container'),
        }

        defaultName = "";

        _resetSectionName();
        _linkDocumentListeners();
    }

    return {
        init: _init,
        updateSectionName: _updateSectionName,
        resetSectionName: _resetSectionName,
        getData: _getData
    };

})(jQuery);