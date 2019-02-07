/**
 * Utilities functions on RexLive
 * @since 2.0.0
 */
var Rexbuilder_Util_Editor_Utilities = (function($) {
  "use strict";
  
  var _removeColorPicker = function($elem) {
    $elem.find(".tool-button--spectrum").remove();
    $elem.find("input.spectrum-input-element").spectrum("destroy");
  };

  var _addSpectrumCustomSaveButton = function( $picker ) {
    var choose = tmpl('tmpl-tool-save', {});
    var $choose = $(choose);
    $picker.spectrum('container').append($choose);

    $choose.on('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      $picker.spectrum('container').find('.sp-choose').trigger('click');
    });
  };

  var _addSpectrumCustomCloseButton = function( $picker ) {
    var close = tmpl('tmpl-tool-close', {});
    var $close = $(close);
    $picker.spectrum('container').append($close);

    $close.on('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      $picker.attr("data-revert", true);
      $picker.spectrum('container').find('.sp-cancel').trigger('click');
    });
  };

  var init = function() {
    
  };

  return {
    init: init,
    removeColorPicker: _removeColorPicker,
    addSpectrumCustomSaveButton: _addSpectrumCustomSaveButton,
    addSpectrumCustomCloseButton: _addSpectrumCustomCloseButton
  };
})(jQuery);
