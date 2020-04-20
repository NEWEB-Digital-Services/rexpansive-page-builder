/**
 * Gradient palette color to append to Spectrum Picker.
 * With a button to open the gradient picker
 * 
 * @since 2.0.0
 */
var Rexbuilder_Color_Palette = (function($) {
  "use strict";

  var props;

  var _showPalette = function( data ) {
    props.$spicker = data.$target;
    props.action = data.action;
    props.object = data.object;
    props.textSelection = undefined !== data.textSelection ? data.textSelection : null;

    var $spickerContainer = props.$spicker.spectrum("container").find(".sp-picker-container");
    props.$container.show().detach().appendTo( $spickerContainer );
  };

  var _hidePalette = function() {
    props.$container.hide().detach().appendTo(Rexbuilder_Util.$rexContainer.parent());
    props.$spicker = null;
    props.action = null;
    props.object = null;
    props.textSelection = null;
  };

  var _listenEvents = function() {
    props.$add_color.on("click", function(e) {
      e.preventDefault();
      if( null !== props.$spicker ) {
        var color_value = props.$spicker.spectrum("get");
        var color_ID = Rexbuilder_Util.createRandomID(4);
        var color_to_save = color_value.toRgbString();

        var data = {
          eventName: "rexlive:savePaletteColor",
          color_data: {
            color: color_to_save,
            ID: color_ID
          }
        };
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);

        // var item = tmpl("tmpl-palette-item",{});
        // var item = '<div class="palette-item"><div class="tool-button tool-button--deactivate palette-item__delete"><i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i></div></div>';
        var item = Rexbuilder_Live_Templates.getTemplate('tmpl-palette-item');
        var $item = $(item);

        props.$add_color.before( $item );
        $item.css("background", color_to_save);
        $item.attr("data-color-id", color_ID);
        $item.attr("data-color-value", color_to_save);
      }
    });

    props.$container.on("click", ".palette-item", function(e) {
      e.preventDefault();
      var color = this.getAttribute("data-color-value");
      if( color ) {
        _setColorPicker( color, true );
      }
    });

    props.$container.on("click", ".palette-item__delete", function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      var colorEl = this.parentElement;
      var color_ID = colorEl.getAttribute("data-color-id");

      var data = {
        eventName: "rexlive:deletePaletteColor",
        color_data: {
          ID: color_ID
        }
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);

      Rexbuilder_Color_Palette.deletePaletteItem(colorEl);
    });

    props.$open_gradient_palette.on("click", function(e) {
      e.preventDefault();
      switch( props.object ) {
        case "block":
          Rexbuilder_Block_Editor.openBlockBackgroundGradient( props.$spicker.parents(".perfect-grid-item") );
          break;
        case "section":
          Rexbuilder_Section_Editor.openSectionBackgroundGradient( props.$spicker.parents(".rexpansive_section") );
          break;
        case "text":
          // to open a new modal, must handle the text differently
          TextEditor.openTextGradientColor( props.$spicker );
          break;
        default:
          break;
      }
      props.$spicker.spectrum("hide");
    });
  };

  var _deletePaletteItem = function( el ) {
    $(el).remove();
  };

  var _setColorPicker = function( color, trigger ) {
    var trigger = undefined !== typeof trigger ? trigger : false;
    if( "" !== color ) {
      props.$spicker.spectrum("set", color);
      if( trigger ) {
        props.$spicker.spectrum("container").find(".sp-input").trigger("change");
      }
    }
  }

  var init = function() {
    var $self = $('.sp-rex-color-palette');
    props = {
      $spicker: null,
      object: null,
      action: null,
      $container: $self,
      $add_color: $self.find(".palette__add-color"),
      $palette_list: $self.find(".palette-list"),
      $open_gradient_palette: $self.find(".palette__open-gradient")
    };

    _listenEvents();
  };

  return {
    init: init,
    show: _showPalette,
    hide: _hidePalette,
    deletePaletteItem: _deletePaletteItem
  }
})(jQuery);