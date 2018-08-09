var Background_Section_Color_Modal = (function ($) {
    'use strict';

    var background_section_color_properties;
    var colorActive;
    var bgColorActive;

    var _updateColorModal = function (data) {
        if (data.color != "") {
            background_section_color_properties.$color_runtime_value.val(data.color);
            background_section_color_properties.$color_preview_icon.hide();
            background_section_color_properties.$color_value.spectrum('set', data.color);
        } else {
            background_section_color_properties.$color_runtime_value.val('');
            background_section_color_properties.$color_preview_icon.show();
            background_section_color_properties.$color_value.spectrum('set', "");
        }
        colorActive = data.color;
        bgColorActive = data.active.toString() == "true";
        if (bgColorActive) {
            background_section_color_properties.$color_active.prop('checked', true);
        } else {
            background_section_color_properties.$color_active.prop('checked', false);
        }
    }

    var _applyBackgroundColor = function () {
        var status = true === background_section_color_properties.$color_active.prop('checked');
        bgColorActive = status;
        var data_color = {
            eventName: "rexlive:apply_background_color_section",
            data_to_send: {
                color: bgColorActive ? colorActive : "",
                active: bgColorActive
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

        background_section_color_properties.$color_value.spectrum({
            replacerClassName: 'btn-floating',
            preferredFormat: 'hex',
            showPalette: false,
            showAlpha: true,
            showInput: true,
            containerClassName: 'rexbuilder-materialize-wrap block-background-color-picker',
            move: function (color) {
                background_section_color_properties.$color_preview_icon.hide();
                changeColorEvent.data_to_send.color = bgColorActive ? color.toRgbString() : "";
                Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(changeColorEvent);
            },
            change: function (color) {
                background_section_color_properties.$color_palette_buttons.removeClass('palette-color-active');
            },
            hide: function (color) {
                colorActive = color.toRgbString();
                _applyBackgroundColor();
            },
            cancelText: '',
            chooseText: '',
        });

        background_section_color_properties.$color_palette_buttons.on('click', function (event) {
            var color = $(event.currentTarget).find('.bg-palette-value').val();
            $(event.currentTarget).addClass('palette-color-active');
            background_section_color_properties.$color_preview_icon.hide();
            background_section_color_properties.$color_palette_buttons.not(event.currentTarget).removeClass('palette-color-active');
            background_section_color_properties.$color_value.spectrum('set', color);
            background_section_color_properties.$color_runtime_value.val(color);
            colorActive = color;
            _applyBackgroundColor();
        });

        $('.block-background-color-picker .sp-choose').on('click', function () {
            background_section_color_properties.$color_preview_icon.hide();
            background_section_color_properties.$color_runtime_value.val(background_section_color_properties.$color_value.spectrum('get'));
        });

        background_section_color_properties.$color_preview_icon.on('click', function () {
            background_section_color_properties.$color_value.spectrum('show');
            return false;
        });
    }

    var _init = function ($container) {

        var $self = $container.find("#background-section-set-color");

        background_section_color_properties = {
            $color_active: $self.find("#color-section-active"),
            $color_active_wrapper: $self.find(".bg-color-section-active-wrapper"),
            $color_runtime_value: $self.find('#background-section-color-runtime'),
            $color_value: $self.find('#background-section-color'),
            $color_preview_icon: $self.find('#background-section-preview-icon'),
            $color_palette_wrap: $self.find('#bg-section-color-palette'),
            $color_palette_buttons: $self.find('#bg-section-color-palette .bg-palette-selector'),
        }

        bgColorActive = true;

        _launchSpectrumBackgroundColor();
        background_section_color_properties.$color_active_wrapper.click(function (e) {
            e.preventDefault();
            var status = true === background_section_color_properties.$color_active.prop('checked');
            if (status) {
                background_section_color_properties.$color_active.prop('checked', false);
                colorActive = "";
            } else {
                background_section_color_properties.$color_active.prop('checked', true);
                colorActive = background_section_color_properties.$color_runtime_value.val();
            }
            _applyBackgroundColor();
        });
    }

    return {
        init: _init,
        updateColorModal: _updateColorModal
    };

})(jQuery);