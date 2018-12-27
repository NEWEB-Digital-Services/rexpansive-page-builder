var FullHeight_Modal = (function ($) {
    'use strict';

    var section_layout_modal_properties;
    var defaultFullHeight;
    var sectionTarget;

    var _resetFullHeight = function () {
        section_layout_modal_properties.$is_full.prop('checked', defaultFullHeight);
    }

    var _updateFullHeight = function (data) {
        sectionTarget = data.sectionTarget;
        section_layout_modal_properties.$is_full.prop("checked", data.fullHeight == "true")
    }

    var _getData = function () {
        var fullHeight = (true === section_layout_modal_properties.$is_full.prop('checked') ? 'true' : 'false');
        return fullHeight;
    }

    var _applyFullHeight = function () {
        var fullHeight = _getData();

        Rexbuilder_Util_Admin_Editor.highlightRowSetData({
            'full_height': fullHeight,
        });

        var data_fullHeight = {
            eventName: "rexlive:set_row_fullHeight",
            data_to_send: {
                sectionTarget: sectionTarget,
                fullHeight: fullHeight
            }
        }

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_fullHeight);
    }

    var _linkDocumentListeners = function () {
        section_layout_modal_properties.$is_full.click(function () {
            _applyFullHeight();
        });
    }

    var _init = function ($container) {
        section_layout_modal_properties = {
            // FULL height configuration
            $is_full: $container.find('#section-is-full'),
        }

        defaultFullHeight = false;
        _resetFullHeight();
        _linkDocumentListeners();
    }

    return {
        init: _init,
        updateFullHeight: _updateFullHeight,
        resetFullHeight: _resetFullHeight,
    };

})(jQuery);