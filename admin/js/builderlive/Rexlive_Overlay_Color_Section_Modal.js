var Overlay_Color_Section_Modal = (function ($) {
    'use strict';

    var background_overlay_properties;
    var colorActive;

    var _updateOverlayModal = function (data) {
        console.log(data);
        if (data.color != "") {
            background_overlay_properties.$overlay_color_value.val(data.color);
            background_overlay_properties.$overlay_color_preview_icon.hide();
            background_overlay_properties.$overlay_color_value.spectrum('set', data.color);
            colorActive = data.color;
        } else {
            background_overlay_properties.$overlay_color_value.val('');
            background_overlay_properties.$overlay_color_preview_icon.show();
        }
        if (data.active.toString() == "true") {
            background_overlay_properties.$overlay_active.prop('checked', true);
        } else {
            background_overlay_properties.$overlay_active.prop('checked', false);
        }
    }

    var _applyOverlay = function () {
        var status = true === background_overlay_properties.$overlay_active.prop('checked');
        var overlayData = {
            eventName: "rexlive:change_section_overlay",
            data_to_send: {
                color: colorActive,
                active: status
            }
        }

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(overlayData);
    }

    var _launchSpectrumOverlayColor = function () {
        var changeColorEvent = {
            eventName: "rexlive:change_section_overlay_color",
            data_to_send: {
                color: null
            }
        }

        background_overlay_properties.$overlay_color_value.spectrum({
            replacerClassName: 'btn-floating',
            preferredFormat: 'hex',
            showPalette: false,
            showAlpha: true,
            showInput: true,
            containerClassName: 'rexbuilder-materialize-wrap block-overlay-color-picker',
            move: function (color) {
                background_overlay_properties.$overlay_color_preview_icon.hide();
                changeColorEvent.data_to_send.color = color.toRgbString();
                Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(changeColorEvent);
            },
            change: function (color) {
                background_overlay_properties.$overlay_color_palette_buttons.removeClass('palette-color-active');
            },
            hide: function (color) {
                colorActive = color.toRgbString();
                _applyOverlay();
            },
            cancelText: '',
            chooseText: '',
        });

        background_overlay_properties.$overlay_color_palette_buttons.on('click', function (event) {
            var color = $(event.currentTarget).find('.bg-palette-value').val();
            $(event.currentTarget).addClass('palette-color-active');
            background_overlay_properties.$overlay_color_preview_icon.hide();
            background_overlay_properties.$overlay_color_palette_buttons.not(event.currentTarget).removeClass('palette-color-active');
            background_overlay_properties.$overlay_color_value.spectrum('set',color);
            colorActive = color;
            _applyOverlay();
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
            $overlay_active: $container.find("#overlay-section-active"),
            $overlay_active_wrapper: $container.find(".overlay-active-wrapper"),
            $overlay_color_value: $container.find('#overlay-color-row-value'),
            $overlay_color_preview_icon: $container.find('#overlay-row-preview-icon'),
            $overlay_color_palette_buttons: $container.find('#bg-overlay-row-color-palette .bg-palette-selector')
        }

        _launchSpectrumOverlayColor();
        
        background_overlay_properties.$overlay_active_wrapper.click(function (e) {
            e.preventDefault();
            var status = true === background_overlay_properties.$overlay_active.prop('checked');
            if (status) {
                background_overlay_properties.$overlay_active.prop('checked', false);
            } else {
                background_overlay_properties.$overlay_active.prop('checked', true);
            }
            _applyOverlay();
        });
    }

    return {
        init: _init,
        updateOverlayModal: _updateOverlayModal
    };

})(jQuery);