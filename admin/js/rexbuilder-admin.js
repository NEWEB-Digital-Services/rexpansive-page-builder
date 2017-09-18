;(function( $ ) {
	'use strict';

	/**
	 * All of the code for your admin-specific JavaScript source
	 * should reside in this file.
	 *
	 * Note that this assume you're going to use jQuery, so it prepares
	 * the $ function reference to be used within the scope of this
	 * function.
	 *
	 * From here, you're able to define handlers for when the DOM is
	 * ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * Or when the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and so on.
	 *
	 * Remember that ideally, we should not attach any more than a single DOM-ready or window-load handler
	 * for any particular page. Though other scripts in WordPress core, other plugins, and other themes may
	 * be doing this, we should try to minimize doing that in our own work.
	 */

	$(function() {
		if( ( 'true' == _plugin_backend_settings.activate_builder ) && 
			( 'true' == $('#_rexbuilder_active').val() ) ) {	// Check this global variable to hide the default worpdress text editor
			$('#postdivrich').hide();
			$('#rexbuilder').show();
		} else {
			$('#postdivrich').show();
			$('#rexbuilder').hide();
			$('#builder-switch').prop('checked', false);
		}

		$('#builder-switch').on('change', function() {
			if( $(this).prop('checked') ) {
				$('#postdivrich').hide();
				$('#rexbuilder').show();
				$('#_rexbuilder_active').val('true');
			} else {
				$('#postdivrich').show();
				$('#rexbuilder').hide();
				$('#_rexbuilder_active').val('false');
				//var ed = tinyMCE.get('content');
				//console.log(ed);
				$(window).resize();
			}
		});
	});

})( jQuery );
