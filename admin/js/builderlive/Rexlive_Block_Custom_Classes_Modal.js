var Block_CustomClasses_Modal = (function ($) {
    'use strict';

    var custom_classes_modal_properties;
    var defaultClasses;
    var hiddenClasses;
    var newClasses;
    var targetSection;

    var _resetCustomClasses = function () {
        custom_classes_modal_properties.$classes.val(defaultClasses);
    }

    var _updateCustomClasses = function (data) {
        targetSection = data.target;
        newClasses = "";
        hiddenClasses = "";
        newClasses = data.classes;

        if (newClasses.indexOf("active-large-block-overlay") !== -1) {
            hiddenClasses += " active-large-block-overlay";
            newClasses = newClasses.replace("active-large-block-overlay", "");
        }
        if (newClasses.indexOf("active-medium-block-overlay") !== -1) {
            hiddenClasses += " active-medium-block-overlay";
            newClasses = newClasses.replace("active-medium-block-overlay", "");
        }
        if (newClasses.indexOf("active-small-block-overlay") !== -1) {
            hiddenClasses += " active-small-block-overlay";
            newClasses = newClasses.replace("active-small-block-overlay", "");
        }

        custom_classes_modal_properties.$classes.val(newClasses);
    }

    var _applyCustomClasses = function () {
        var newClassesString = custom_classes_modal_properties.$classes.val();
        newClassesString = newClassesString.trim();
        newClassesString += hiddenClasses;
        var classList = newClassesString.split(/\s+/);
        var data_customClasses = {
            eventName: "rexlive:apply_block_custom_classes",
            data_to_send: {
                customClasses: classList,
                target: targetSection
            }
        }

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_customClasses);
    }

    var _linkDocumentListeners = function () {
        custom_classes_modal_properties.$classes.blur(function (e) {
            _applyCustomClasses();
        })
    }

    var _init = function ($container) {
        var $self = $container.find(".block-custom-class-wrapper");
        custom_classes_modal_properties = {
            $classes: $self.find('#rex_block_custom_class'),
        }

        defaultClasses = "";

        _resetCustomClasses();
        _linkDocumentListeners();
    }

    return {
        init: _init,
        updateCustomClasses: _updateCustomClasses,
        resetCustomClasses: _resetCustomClasses
    };

})(jQuery);