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

  /**
   * Prepare data for a XHR request encoding it
   * @param {Object} data data to encode
   */
  var _encodeData = function( data ) {
    var urlEncodedData = "";
    var urlEncodedDataPairs = [];
    var name;
  
    // Turn the data object into an array of URL-encoded key/value pairs.
    for(name in data) {
      urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
  
    // Combine the pairs into a single string and replace all %-encoded spaces to 
    // the '+' character; matches the behaviour of browser form submissions.
    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

    return urlEncodedData;
  }

  var _init = function() {
    this.$document = $(document);
    this.$window = $(window);
    _tooltips();
  };

  return {
    init: _init,
    htmlDecode: htmlDecode,
    htmlEncode: htmlEncode,
    viewport: _viewport,
    launchTooltips: _tooltips,
    encodeData: _encodeData
  };
})(jQuery);
