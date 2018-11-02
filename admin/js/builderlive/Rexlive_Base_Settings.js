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

  // function to detect the viewport size
  var _viewport = function() {
    var e = window,
      a = "inner";
    if (!("innerWidth" in window)) {
      a = "client";
      e = document.documentElement || document.body;
    }
    return { width: e[a + "Width"], height: e[a + "Height"] };
  };

  var _init = function() {
    this.$document = $(document);
    this.$window = $(window);
    _tooltips();
  };

  return {
    init: _init,
    htmlDecode: htmlDecode,
    htmlEncode: htmlEncode,
    viewport: _viewport
  };
})(jQuery);
