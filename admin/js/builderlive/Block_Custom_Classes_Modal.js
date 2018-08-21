var Block_CustomClasses_Modal = (function ($) {
    'use strict';

    var custom_classes_modal_properties;
    var defaultClasses;
    var rexID;

    var _resetCustomClasses = function () {
        custom_classes_modal_properties.$classes.val(defaultClasses);
    }

    var _updateCustomClasses = function (data) {
        rexID = data.rexID;
        custom_classes_modal_properties.$classes.val(data.classes);
    }

    var _applyCustomClasses = function () {
        var newClassesString = custom_classes_modal_properties.$classes.val();
        newClassesString = newClassesString.trim();
        var classList = newClassesString.split(/\s+/);
        var data_customClasses = {
            eventName: "rexlive:apply_block_custom_classes",
            data_to_send: {
                customClasses: classList,
                rex_block_id: rexID
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