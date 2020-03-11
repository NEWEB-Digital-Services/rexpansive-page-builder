/**
 * Utilities functions on RexLive
 * @since 2.0.0
 */
var Rexbuilder_Only_Live_Utils = (function($) {
	"use strict";

	var tippyCollection;

	var _tooltips = function() {
		tippyCollection = tippy(".tippy", {
			arrow: true,
			arrowType: "round",
			size: "small",
			// content: 'Shared content',
			// target: '.tippy',
			// livePlacement: false,
			theme: "rexlive"
		});
	};

	return {
		launchTooltips: _tooltips,
	};
})(jQuery);
