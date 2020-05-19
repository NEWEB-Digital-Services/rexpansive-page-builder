var Section_NavLabel_Modal = (function ($) {
    'use strict';

    var section_nav_label_modal_properties;
    var defaultNavLabel;
    var sectionTarget;
    
    var _resetSectionNavLabel = function () {
        section_nav_label_modal_properties.$section_label.val(defaultNavLabel);
    };
    
    var _updateSectionNavLabel = function(data) {
        sectionTarget = data.sectionTarget;
        section_nav_label_modal_properties.$section_label.val(data.sectionNavLabel);

        if ( '' !== data.sectionNavLabel ) {
            section_nav_label_modal_properties.$section_label.siblings("label, .prefix").addClass("active");
        } else {
            section_nav_label_modal_properties.$section_label.siblings("label, .prefix").removeClass("active");
        }
    };

    var _getData = function () {
        var newName = section_nav_label_modal_properties.$section_label.val();
        return newName;
    };

    var _applySectionNavLabel = function () {
        var sectionNavLabel = _getData();

        Rexbuilder_Util_Admin_Editor.highlightRowSetData({
            'section_nav_label': sectionNavLabel,
        });

        var data_sectionNavLabel = {
            eventName: "rexlive:change_section_nav_label",
            data_to_send: {
                sectionTarget: sectionTarget,
                sectionNavLabel: sectionNavLabel
            }
        };

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_sectionNavLabel);
    };
    
    var _linkDocumentListeners = function () {
        section_nav_label_modal_properties.$section_label.keyup(function (e) {
            _applySectionNavLabel();
        });
    };

    var _init = function ($container) {
        section_nav_label_modal_properties = {

            // ID and navigator configuration
            $section_label: $container.find('#section-nav-label'),
        };

        defaultNavLabel = "";

        _resetSectionNavLabel();
        _linkDocumentListeners();
    };

    return {
        init: _init,
        updateSectionNavLabel: _updateSectionNavLabel,
        resetSectionNavLabel: _resetSectionNavLabel,
        getData: _getData
    };

})(jQuery);