;(function() {
	"use strict";

	// Waiting until the ready of the DOM
	// document.addEventListener('DOMContentLoaded', Rexbuilder_App.init );
	// document.addEventListener('load', Rexbuilder_App.init );

	// Waiting for the complete load of the window
	window.addEventListener('load', function () {
		Rexbuilder_App.init();
		Rexbuilder_App.load();
	} );

	window.addEventListener('resize', function () {
		// RexGrid handler
		if ( RexGrid ) {
			RexGrid.prototype.handleResizeEvent();
		}
	});
})();