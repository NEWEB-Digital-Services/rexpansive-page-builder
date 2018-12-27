var PhotoSwipe_Modal = (function ($) {
    'use strict';

    var section_photoswipe;
    var defaultPhotoswipe;
    var sectionTarget;

    var _resetPhotoswipe = function () {
        section_photoswipe.$section_active_photoswipe.attr("checked", defaultPhotoswipe);
    }

    var _updatePhotoswipe = function (data) {
        sectionTarget = data.sectionTarget;
        section_photoswipe.$section_active_photoswipe.attr("checked", data.photoswipe)
    }

    var _getData = function () {
        var photoswipe = (true === section_photoswipe.$section_active_photoswipe.prop('checked') ? 'true' : 'false');
        return photoswipe;
    }

    var _applyPhotoswipeSetting = function () {
        var photoswipe = _getData();

        Rexbuilder_Util_Admin_Editor.highlightRowSetData({
            'row_active_photoswipe': photoswipe,
        });

        var data_photoswipe = {
            eventName: "rexlive:set_row_photoswipe",
            data_to_send: {
                sectionTarget: sectionTarget,
                photoswipe: photoswipe
            }
        }

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_photoswipe);
    }

    var _linkDocumentListeners = function () {
        section_photoswipe.$section_active_photoswipe.click(function (e) {
            _applyPhotoswipeSetting();
        })
    }

    var _init = function ($container) {
        section_photoswipe = {
            $section_active_photoswipe: $container.find('#section-active-photoswipe')
        }

        defaultPhotoswipe = false;
        _resetPhotoswipe();
        _linkDocumentListeners();
    }

    return {
        init: _init,
        updatePhotoswipe: _updatePhotoswipe,
        resetPhotoswipe: _resetPhotoswipe,
        getData: _getData
    };

})(jQuery);