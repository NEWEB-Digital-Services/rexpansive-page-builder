/**
 * Object that handles the live text editor inside the blocks
 * upgraded using CKEditor5 plugin
 * 
 * The plugin is bundled in the CKEDITOR global object
 *
 * @since 2.2.0
 */
var CKEditor_Handler = (function ($) {
	function init() {
		console.log(CKEDITOR)
	}

	function load() {}

	return {
		init: init,
		load: load
	}
})(jQuery);