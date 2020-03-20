;(function() {
	"use strict";

	// Waiting until the ready of the DOM
	document.addEventListener( 'DOMContentLoaded', Rexbuilder_App.init );
	window.addEventListener( 'load', Rexbuilder_App.load );

	// Waiting for the complete load of the window
	// window.addEventListener('load', function () {
	// 	Rexbuilder_App.init();
	// 	Rexbuilder_App.load();
	// } );

	function debounce(func, wait, immediate) {
		var timeout
		return function() {
			var context = this
			var args = arguments
			var later = function() {
				timeout = null
				if (!immediate) func.apply(context, args)
			}
			var callNow = immediate && !timeout
			clearTimeout(timeout)
			timeout = setTimeout(later, wait)
			if (callNow) func.apply(context, args)
		}
	}

	function handleResize() {
		if ( ! Rexbuilder_Util.editorMode ) {
			Rexbuilder_App.handleFrontEndResize()
		}
	}

	window.addEventListener('resize', debounce( handleResize, 100 ));
})();