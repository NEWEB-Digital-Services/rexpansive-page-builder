/**
 * Gradient palette color to append to Spectrum Picker.
 * With a button to open the gradient picker
 * 
 * @since 2.0.0
 */
var Rexbuilder_Color_Palette = (function($) {
  "use strict";

  var props;

  var _showPalette = function( $target ) {
    props.$spicker = $target;
    var $spickerContainer = $target.spectrum("container").find(".sp-picker-container");
    props.$container.show().detach().appendTo( $spickerContainer );
  };

  var _hidePalette = function() {
    props.$container.hide().detach().appendTo(Rexbuilder_Util.$rexContainer.parent());
    props.$spicker = null;
  };

  var _listenEvents = function() {
    props.$add_color.on("click", function(e) {
      e.preventDefault();
      if( null !== props.$spicker ) {
        console.log(props.$spicker.spectrum("get"));
      }
    });
  };

  var init = function() {
    var $self = $('.sp-rex-color-palette');
    props = {
      $container: $self,
      $spicker: null,
      $add_color: $self.find(".palette__add-color")
    };

    _listenEvents();
  };

  return {
    init: init,
    show: _showPalette,
    hide: _hidePalette
  }
})(jQuery);