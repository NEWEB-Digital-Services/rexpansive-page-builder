var Rexlive_Top_Tools = (function ($) {
  'use strict';

  var $toogle_tools_button;

  var _cacheVariables = function() {
    $toogle_tools_button = Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.find('.rexlive-toolbox__toggle-wrap .close-toolbox');
  }
  
  var _linkDocumentListeners = function () {
    $toogle_tools_button.on('click', function(e) {
      e.preventDefault();
      Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.toggleClass('toolbox--closed');
    });
  };

  var init = function () {
    _cacheVariables();
    _linkDocumentListeners();
  }
  
  return {
    init: init,
  };

})(jQuery);