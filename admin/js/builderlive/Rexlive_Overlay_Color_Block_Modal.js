var Overlay_Color_block_Modal = (function ($) {
    'use strict';

    var overlay_block_properties;
    var colorActive;
    var blockRexID;

    var _updateOverlayModal = function (data) {
        console.log(data);
        blockRexID = data.rexID;

        if (data.color != "") {
            overlay_block_properties.$overlay_color_value.val(data.color);
            overlay_block_properties.$overlay_color_preview_icon.hide();
            overlay_block_properties.$overlay_color_value.spectrum('set', data.color);
            colorActive = data.color;
        } else {
            overlay_block_properties.$overlay_color_value.val('');
            overlay_block_properties.$overlay_color_preview_icon.show();
        }
        if (data.active.toString() == "true") {
            overlay_block_properties.$overlay_active.prop('checked', true);
        } else {
            overlay_block_properties.$overlay_active.prop('checked', false);
        }
    }

    var _applyOverlay = function () {
        var status = true === overlay_block_properties.$overlay_active.prop('checked');
        var overlayData = {
            eventName: "rexlive:change_block_overlay",
            data_to_send: {
                blockRexID: blockRexID,
                color: colorActive,
                active: status
            }
        }

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(overlayData);
    }

    var _launchSpectrumOverlayColor = function () {
        var changeColorEvent = {
            eventName: "rexlive:change_block_overlay_color",
            data_to_send: {
                blockRexID: "",
                color: null
            }
        }

        overlay_block_properties.$overlay_color_value.spectrum({
            replacerClassName: 'btn-floating',
            preferredFormat: 'hex',
            showPalette: false,
            showAlpha: true,
            showInput: true,
            containerClassName: 'rexbuilder-materialize-wrap block-overlay-color-picker',
            show: function () {
                changeColorEvent.data_to_send.blockRexID = blockRexID;
            },
            move: function (color) {
                overlay_block_properties.$overlay_color_preview_icon.hide();
                changeColorEvent.data_to_send.color = color.toRgbString();
                Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(changeColorEvent);
            },
            change: function (color) {
                overlay_block_properties.$overlay_color_palette_buttons.removeClass('palette-color-active');
            },
            hide: function (color) {
                colorActive = color.toRgbString();
                _applyOverlay();
            },
            cancelText: '',
            chooseText: '',
        });

        overlay_block_properties.$overlay_color_palette_buttons.on('click', function (event) {
            var color = $(event.currentTarget).find('.bg-palette-value').val();
            $(event.currentTarget).addClass('palette-color-active');
            overlay_block_properties.$overlay_color_preview_icon.hide();
            overlay_block_properties.$overlay_color_palette_buttons.not(event.currentTarget).removeClass('palette-color-active');
            overlay_block_properties.$overlay_color_value.spectrum('set', color);
            colorActive = color;
            _applyOverlay();
        });

        $('.block-overlay-color-picker .sp-choose').on('click', function () {
            overlay_block_properties.$overlay_color_preview_icon.hide();
        });

        overlay_block_properties.$overlay_color_preview_icon.on('click', function () {
            overlay_block_properties.$overlay_color_value.spectrum('show');
            return false;
        });
    }

    var _init = function ($container) {

        var $self = $container.find("#bg-overlay-block-set-color");
        overlay_block_properties = {
            $overlay_active: $self.find("#overlay-block-active"),
            $overlay_active_wrapper: $self.find(".overlay-active-wrapper"),
            $overlay_color_value: $self.find('#overlay-color-block-value'),
            $overlay_color_preview_icon: $self.find('#overlay-block-preview-icon'),
            $overlay_color_palette_buttons: $self.find('#bg-overlay-block-color-palette .bg-palette-selector')
        }

        _launchSpectrumOverlayColor();

        overlay_block_properties.$overlay_active_wrapper.click(function (e) {
            e.preventDefault();
            var status = true === overlay_block_properties.$overlay_active.prop('checked');
            if (status) {
                overlay_block_properties.$overlay_active.prop('checked', false);
            } else {
                overlay_block_properties.$overlay_active.prop('checked', true);
            }
            _applyOverlay();
        });
    }

    return {
        init: _init,
        updateOverlayModal: _updateOverlayModal
    };

})(jQuery);