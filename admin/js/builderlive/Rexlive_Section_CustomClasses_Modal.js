var Section_CustomClasses_Modal = (function ($) {
    'use strict';

    var custom_classes_modal_properties;
    var defaultClasses;

    var _resetCustomClasses = function () {
        custom_classes_modal_properties.$classes.val(defaultClasses);
    }

    var _updateCustomClasses = function (newClasses) {
        custom_classes_modal_properties.$classes.val(newClasses);
    }

    var _getData = function () {
        var newClasses = custom_classes_modal_properties.$classes.val();
        return newClasses;
    }

    var _linkDocumentListeners = function () {
        custom_classes_modal_properties.$classes.blur(function (e) {
            Section_Modal.applyCustomClasses();
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