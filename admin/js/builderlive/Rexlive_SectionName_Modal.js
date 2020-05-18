var SectionName_Modal = (function ($) {
    'use strict';

    var section_name_modal_properties;
    var defaultName;
    var sectionTarget;
    
    var _resetSectionName = function () {
        section_name_modal_properties.$section_id.val(defaultName);
    };
    
    var _updateSectionName = function(data) {
        sectionTarget = data.sectionTarget;
        section_name_modal_properties.$section_id.val(data.sectionName);

        if(data.sectionName != ""){
            section_name_modal_properties.$section_id
                .focus();
        }else{
            section_name_modal_properties.$section_id
                .blur();
        }
    };

    var _getData = function () {
        var newName = section_name_modal_properties.$section_id.val();
        return newName;
    };

    var _applySectionName = function () {
        var sectionName = _getData();

        Rexbuilder_Util_Admin_Editor.highlightRowSetData({
            'section_name': sectionName,
        });

        var data_sectionName = {
            eventName: "rexlive:change_section_name",
            data_to_send: {
                sectionTarget: sectionTarget,
                sectionName: sectionName
            }
        };

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_sectionName);
    };
    
    var _linkDocumentListeners = function () {
        section_name_modal_properties.$section_id.keyup(function (e) {
            _applySectionName();
        });
    };

    var _init = function ($container) {
        section_name_modal_properties = {

            // ID and navigator configuration
            $section_id: $container.find('#sectionid-container'),
        };

        defaultName = "";

        _resetSectionName();
        _linkDocumentListeners();
    };

    return {
        init: _init,
        updateSectionName: _updateSectionName,
        resetSectionName: _resetSectionName,
        getData: _getData
    };

})(jQuery);