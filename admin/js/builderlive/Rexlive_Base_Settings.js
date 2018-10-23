/**
 * Setting the content positon
 * @since 2.0.0
 */
var Rexlive_Base_Settings = (function($) {
  "use strict";

  var _tooltips = function() {
    tippy(".tippy", {
      arrow: true,
      arrowType: "round",
      size: "small",
      theme: "rexlive"
    });
  };

  var _init = function() {
    this.$document = $(document);
    _tooltips();
  };

  return {
    init: _init,
  };
})(jQuery);
