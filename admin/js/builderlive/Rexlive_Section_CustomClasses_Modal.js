var Section_CustomClasses_Modal = (function ($) {
    'use strict';

    var custom_classes_modal_properties;
    var defaultClasses;
    var hiddenClasses;
    var sectionTarget;
    
    var _resetCustomClasses = function () {
        //custom_classes_modal_properties.$classes.val(defaultClasses);
    }

    var _updateCustomClasses = function (data) {
        sectionTarget = data.sectionTarget;
        var newClasses = data.customClasses;
        hiddenClasses = "";
        if (newClasses.indexOf("active-large-overlay") !== -1) {
            hiddenClasses += " active-large-overlay";
            newClasses = newClasses.replace("active-large-overlay", "");
        }
        if (newClasses.indexOf("active-medium-overlay") !== -1) {
            hiddenClasses += " active-medium-overlay";
            newClasses = newClasses.replace("active-medium-overlay", "");
        }
        if (newClasses.indexOf("active-small-overlay") !== -1) {
            hiddenClasses += " active-small-overlay";
            newClasses = newClasses.replace("active-small-overlay", "");
        }

        if(data.customClasses == ""){
            custom_classes_modal_properties.$classes
                .siblings("label, .prefix")
                .removeClass("active");
                console.log('case: sectionTarget == nothing');
        }else{
            custom_classes_modal_properties.$classes
                .siblings("label, .prefix")
                .addClass("active");
                console.log('case: sectionTarget != nothing');
        }

        //console.log("stamp || newClasses:" + newClasses);
        //console.log("stamp || data.sectionTarger:" + data.sectionTarget);
        //console.log("stamp || data.customClasses:" + data.customClasses);

        custom_classes_modal_properties.$classes.val(newClasses);
        
    }

    var _applyCustomClasses = function () {
        var newClassesString = _getData();
        newClassesString = newClassesString.trim();
        var classList = newClassesString.split(/\s+/);

        console.log("passed || applyCustomClasses()");

        Rexbuilder_Util_Admin_Editor.highlightRowSetData({
            'custom_classes': classList,
        });

        var data_customClasses = {
            eventName: "rexlive:apply_section_custom_classes",
            data_to_send: {
                sectionTarget: sectionTarget,
                customClasses: classList
            }
        }

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_customClasses);
    }

    var _getData = function () {
        var newClasses = custom_classes_modal_properties.$classes.val();
        newClasses += hiddenClasses;
        return newClasses;
    }

    var _linkDocumentListeners = function () {
        custom_classes_modal_properties.$classes.blur(function (e) {
            _applyCustomClasses();
        })
    }

    var _init = function ($container) {
        custom_classes_modal_properties = {
            // ID and navigator configuration
            $classes: $container.find('#section-set-custom-class'),
        }

        defaultClasses = "";

        _resetCustomClasses();
        _linkDocumentListeners();
    }

    return {
        init: _init,
        updateCustomClasses: _updateCustomClasses,
        resetCustomClasses: _resetCustomClasses,
        getData: _getData
    };

})(jQuery);