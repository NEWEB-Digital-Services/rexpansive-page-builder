/**
 * Handle the background color of a block
 * @since 2.0.0
 */
var Background_Block_Color_Modal = (function($) {
  "use strict";

  var background_block_color_properties;
  var colorActive;
  var bgColorActive;
  var target;
  var changeColorEvent;

  var _updateColorModal = function(data) {
    target = data.target;
    changeColorEvent.data_to_send.target = data.target;
    if (data.color != "") {
      background_block_color_properties.$color_runtime_value.val(data.color);
      background_block_color_properties.$color_preview_icon.hide();
      background_block_color_properties.$color_value.spectrum(
        "set",
        data.color
      );
    } else {
      background_block_color_properties.$color_runtime_value.val("");
      background_block_color_properties.$color_preview_icon.show();
      background_block_color_properties.$color_value.spectrum("set", "");
    }
    colorActive = data.color;
    bgColorActive = data.active.toString() == "true";
    if (bgColorActive) {
      background_block_color_properties.$color_active.prop("checked", true);
    } else {
      background_block_color_properties.$color_active.prop("checked", false);
    }
  };

  var _applyBackgroundColor = function() {
    var status =
      true === background_block_color_properties.$color_active.prop("checked");
    bgColorActive = status;

    var data_color = {
      eventName: "rexlive:apply_background_color_block",
      data_to_send: {
        color: bgColorActive ? colorActive : "",
        active: bgColorActive,
        target: target
      }
    };

    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_color);
  };

  var _launchSpectrumBackgroundColor = function() {
    changeColorEvent = {
      eventName: "rexlive:change_block_bg_color",
      data_to_send: {
        color: null,
        target: {}
      }
    };

    var flagPickerUsed;
    background_block_color_properties.$color_value.spectrum({
      replacerClassName: "btn-floating",
      preferredFormat: "hex",
      showPalette: false,
      showAlpha: true,
      showInput: true,
      showButtons: false,
      containerClassName:
        "rexbuilder-materialize-wrap block-background-color-picker",
      show: function() {
        flagPickerUsed = false;
      },
      move: function(color) {
        background_block_color_properties.$color_preview_icon.hide();
        changeColorEvent.data_to_send.color = bgColorActive
          ? color.toRgbString()
          : "";
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(changeColorEvent);
        flagPickerUsed = true;
      },
      change: function(color) {
        background_block_color_properties.$color_palette_buttons.removeClass(
          "palette-color-active"
        );
      },
      hide: function(color) {
        if (flagPickerUsed) {
          colorActive = color.toRgbString();
        }
        background_block_color_properties.$color_runtime_value.val(colorActive);
        _applyBackgroundColor();
      },
      cancelText: "",
      chooseText: ""
    });

    var close = tmpl('tmpl-tool-close', {});
    var $close = $(close);
    background_block_color_properties.$color_value.spectrum('container').append($close);

    $close.on('click', function(e) {
      e.preventDefault();
      background_block_color_properties.$color_value.spectrum('hide');
    });

    background_block_color_properties.$color_palette_buttons.on(
      "click",
      function(event) {
        var color = $(event.currentTarget)
          .find(".bg-palette-value")
          .val();
        $(event.currentTarget).addClass("palette-color-active");
        background_block_color_properties.$color_preview_icon.hide();
        background_block_color_properties.$color_palette_buttons
          .not(event.currentTarget)
          .removeClass("palette-color-active");
        background_block_color_properties.$color_value.spectrum("set", color);
        background_block_color_properties.$color_runtime_value.val(color);
        colorActive = color;
        _applyBackgroundColor();
      }
    );

    $(".block-background-color-picker .sp-choose").on("click", function() {
      background_block_color_properties.$color_preview_icon.hide();
      background_block_color_properties.$color_runtime_value.val(
        background_block_color_properties.$color_value.spectrum("get")
      );
    });

    background_block_color_properties.$color_preview_icon.on(
      "click",
      function() {
        background_block_color_properties.$color_value.spectrum("show");
        return false;
      }
    );
  };

  var _init = function($container) {
    var $self = $container.find("#background-block-set-color");

    background_block_color_properties = {
      $color_active: $self.find("#color-block-active"),
      $color_active_wrapper: $self.find(".bg-color-block-active-wrapper"),
      $color_runtime_value: $self.find("#background-block-color-runtime"),
      $color_value: $self.find("#background-block-color"),
      $color_preview_icon: $self.find("#background-block-preview-icon"),
      $color_palette_wrap: $self.find("#bg-block-color-palette"),
      $color_palette_buttons: $self.find(
        "#bg-block-color-palette .bg-palette-selector"
      )
    };

    bgColorActive = true;

    _launchSpectrumBackgroundColor();

    background_block_color_properties.$color_active_wrapper.click(function(e) {
      e.preventDefault();
      var status =
        true ===
        background_block_color_properties.$color_active.prop("checked");
      if (status) {
        background_block_color_properties.$color_active.prop("checked", false);
        colorActive = "";
      } else {
        background_block_color_properties.$color_active.prop("checked", true);
        colorActive = background_block_color_properties.$color_runtime_value.val();
      }
      _applyBackgroundColor();
    });
  };

  return {
    init: _init,
    updateColorModal: _updateColorModal
  };
})(jQuery);
