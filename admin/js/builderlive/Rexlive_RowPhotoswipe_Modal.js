var PhotoSwipe_Modal = (function ($) {
    'use strict';

    var section_photoswipe;
    var defaultPhotoswipe;

    var _resetPhotoswipe = function () {
        section_photoswipe.$section_active_photoswipe.attr("checked", defaultPhotoswipe);
    }

    var _updatePhotoswipe = function (active) {
        section_photoswipe.$section_active_photoswipe.attr("checked", active)
    }

    var _getData = function () {
        var photoswipe = (true === section_photoswipe.$section_active_photoswipe.prop('checked') ? 'true' : 'false');
        return photoswipe;
    }

    var _linkDocumentListeners = function () {
        section_photoswipe.$section_active_photoswipe.click(function (e) {
            Rexlive_Modals.applyPhotoswipeSetting();
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