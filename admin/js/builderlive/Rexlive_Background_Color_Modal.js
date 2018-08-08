var Background_Color_Modal = (function ($) {
    'use strict';

    var background_color_properties;

    var _getData = function () {

    }

    var _updateColorModal = function (color) {
        if (color != "") {
            background_color_properties.$color_runtime_value.val(color);
            background_color_properties.$color_preview_icon.hide();
            background_color_properties.$color_value.spectrum('set', color);
        } else {
            background_color_properties.$color_runtime_value.val('');
            background_color_properties.$color_preview_icon.show();
        }
    }

    var _applyBackgroundColor = function (color) {
        var data_color = {
            eventName: "rexlive:apply_background_color_section",
            data_to_send: {
                color: color
            }
        }

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_color);
    }

    var _launchSpectrumBackgroundColor = function () {
        var changeColorEvent = {
            eventName: "rexlive:change_section_bg_color",
            data_to_send: {
                color: null
            }
        }

        background_color_properties.$color_value.spectrum({
            replacerClassName: 'btn-floating',
            preferredFormat: 'hex',
            showPalette: false,
            showAlpha: true,
            showInput: true,
            containerClassName: 'rexbuilder-materialize-wrap block-background-color-picker',
            show: function (color) {
                background_color_properties.$type_color.prop("checked", true);
                if ('' === background_color_properties.$color_runtime_value.val()) {
                    background_color_properties.$color_value.spectrum('set', '#ffffff');
                }
            },
            move: function (color) {
                background_color_properties.$color_preview_icon.hide();
                changeColorEvent.data_to_send.color = color.toRgbString();
                Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(changeColorEvent);
            },
            change: function (color) {
                background_color_properties.$color_palette_buttons.removeClass('palette-color-active');
            },
            hide: function (color) {
                _applyBackgroundColor(color.toRgbString());
            },
            cancelText: '',
            chooseText: '',
        });

        background_color_properties.$color_palette_buttons.on('click', function (event) {
            var color = $(event.currentTarget).find('.bg-palette-value').val();
            $(event.currentTarget).addClass('palette-color-active');
            background_color_properties.$color_preview_icon.hide();
            background_color_properties.$color_palette_buttons.not(event.currentTarget).removeClass('palette-color-active');
            background_color_properties.$type_color.prop("checked", true);
            background_color_properties.$color_value.spectrum('set', color);
            background_color_properties.$color_runtime_value.val(color);
            _applyBackgroundColor(color);
        });

        $('.block-background-color-picker .sp-choose').on('click', function () {
            background_color_properties.$color_preview_icon.hide();
            background_color_properties.$color_runtime_value.val(background_color_properties.$color_value.spectrum('get'));
        });

        background_color_properties.$color_preview_icon.on('click', function () {
            background_color_properties.$color_value.spectrum('show');
            return false;
        });
    }

    var _init = function ($container) {

        background_color_properties = {
            $type_color: $container.find('#background-section-value-color'),
            $color_runtime_value: $container.find('#background-section-color-runtime'),
            $color_value: $container.find('#background-section-color'),
            $color_preview: null,
            $color_preview_icon: $container.find('#background-section-preview-icon'),
            $color_palette_wrap: $container.find('#bg-section-color-palette'),
            $color_palette_buttons: $container.find('#bg-section-color-palette .bg-palette-selector'),
        }

        _launchSpectrumBackgroundColor();
    }

    return {
        init: _init,
        updateColorModal: _updateColorModal,
        getData: _getData
    };

})(jQuery);