var Hold_Grid_Modal = (function ($) {
    'use strict';

    var props;
    var defaultValue;
    var sectionTarget;

    var _reset = function () {
        props.$element.attr("checked", defaultValue);
    }

    var _update = function (data) {
        sectionTarget = data.sectionTarget;
        props.$element.attr("checked", data.photoswipe)
    }

    var _getData = function () {
        return props.$element.prop('checked');
    }

    var _applySetting = function () {
        var active = _getData();
        if ( active ) {
            Section_CustomClasses_Modal.updateCustomClasses({
                sectionTarget: sectionTarget,
                customClasses: 'rex-block-grid',
            });
        }

        // Rexbuilder_Util_Admin_Editor.highlightRowSetData({
        //     'row_active_photoswipe': photoswipe,
        // });

        // var data_hold_grid = {
        //     eventName: "rexlive:set_row_photoswipe",
        //     data_to_send: {
        //         sectionTarget: sectionTarget,
        //         photoswipe: photoswipe
        //     }
        // }

        // Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_hold_grid);
    }

    var _linkDocumentListeners = function () {
        props.$element.click(function (e) {
            _applySetting();
        })
    }

    var _init = function ($container) {
        props = {
            $element: $container.find('#rx-hold-grid')
        }

        defaultValue = false;
        _reset();
        _linkDocumentListeners();
    }

    return {
        init: _init,
        update: _update,
        reset: _reset,
        getData: _getData
    };

})(jQuery);