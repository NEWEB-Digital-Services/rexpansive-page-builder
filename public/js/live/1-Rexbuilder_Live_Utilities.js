/**
 * Utilities functions on RexLive
 * @since 2.0.0
 */
var Rexbuilder_Live_Utilities = (function($) {
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

  /**
   * Make visibile the plus button under the container
   * @param  {Object} $s section
   * @return {void}
   */
  var _activeAddSection = function( $s ) {
    $s = 'undefined' !== typeof $s ? $s : null;
    Rexbuilder_Util.$rexContainer.parent().removeClass('add-new-section--hide');
    if ( $s ) {
      $s.removeClass("activeRowTools");
    }
  }

  var init = function() {
    
  };

  return {
    init: init,
    removeColorPicker: _removeColorPicker,
    addSpectrumCustomSaveButton: _addSpectrumCustomSaveButton,
    addSpectrumCustomCloseButton: _addSpectrumCustomCloseButton,
    activeAddSection: _activeAddSection
  };
})(jQuery);
