;(function() {
	"use strict";

	// Waiting until the ready of the DOM
	document.addEventListener( 'DOMContentLoaded', Rexbuilder_App.init );
	
	// Waiting for the complete load of the window
	window.addEventListener( 'load', Rexbuilder_App.load );

	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds. If `immediate` is passed, trigger the function on the
	// leading edge, instead of the trailing.
	function debounce(func, wait, immediate) {
		var timeout;
		return function () {
			var context = this;
			var args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}

	function handleResize() {
		if ( ! Rexbuilder_Util.editorMode ) {
			Rexbuilder_App.handleFrontEndResize()
		}
	}

	window.addEventListener('resize', debounce( handleResize, 100 ));

	// Preventing <video> tag bug that auto scrolls window.
	var IS_CHROME = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

	function onbeforeunloadHandler() {
		if (IS_CHROME && !Rexbuilder_Util.editorMode) {
			store.set('scrollPosition', window.pageYOffset || document.documentElement.scrollTop);
		}
	}

	window.addEventListener('beforeunload', onbeforeunloadHandler);
})();