var Overlay_Color_Modal = (function ($) {
    'use strict';

    var background_overlay_properties;

    var _getData = function () {

    }

    var _launchSpectrumOverlayColor = function () {
        background_overlay_properties.$overlay_color_value.spectrum({
            replacerClassName: 'btn-floating',
            preferredFormat: 'hex',
            showPalette: false,
            showAlpha: true,
            showInput: true,
            containerClassName: 'rexbuilder-materialize-wrap block-overlay-color-picker',
            move: function (color) {
                background_overlay_properties.$overlay_color_preview_icon.hide();
            },
            change: function (color) {
                background_overlay_properties.$overlay_color_palette_buttons.removeClass('palette-color-active');
            },
            cancelText: '',
            chooseText: '',
        });

        background_overlay_properties.$overlay_color_palette_buttons.on('click', function (event) {
            $(event.currentTarget).addClass('palette-color-active');
            background_overlay_properties.$overlay_color_preview_icon.hide();
            background_overlay_properties.$overlay_color_palette_buttons.not(event.currentTarget).removeClass('palette-color-active');
            background_overlay_properties.$overlay_color_value.spectrum('set', $(event.currentTarget).find('.bg-palette-value').val());
        });

        $('.block-overlay-color-picker .sp-choose').on('click', function () {
            background_overlay_properties.$overlay_color_preview_icon.hide();
        });

        background_overlay_properties.$overlay_color_preview_icon.on('click', function () {
            background_overlay_properties.$overlay_color_value.spectrum('show');
            return false;
        });
    }

    var _init = function ($container) {

        background_overlay_properties = {
            $overlay_color_value: $container.find('#overlay-color-row-value'),
            $overlay_color_palette_buttons: $container.find('#bg-overlay-row-color-palette .bg-palette-selector'),
            $overlay_color_preview_icon: $container.find('#overlay-row-preview-icon'),
        }

        _launchSpectrumOverlayColor();
    }

    return {
        init: _init,

        getData: _getData
    };

})(jQuery);