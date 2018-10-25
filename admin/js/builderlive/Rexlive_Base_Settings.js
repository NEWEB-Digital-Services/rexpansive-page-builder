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

  function htmlDecode(value) {
    return $("<div/>").html(value).text();
  }

  function htmlEncode(value) {
    return $('<div/>').text(value).html();
  }

  var _init = function() {
    this.$document = $(document);
    _tooltips();
  };

  return {
    init: _init,
    htmlDecode: htmlDecode,
    htmlEncode: htmlEncode
  };
})(jQuery);