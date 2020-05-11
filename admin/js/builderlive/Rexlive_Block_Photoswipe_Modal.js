/**
 * Handling Photoswipe activation/deactivation on a single block
 * @return {Object}    exposed functions
 * @since  2.0.5
 */
var Block_Photoswipe_Modal = (function($) {
	'use strict';

	var block_photoswipe_properties;
	var photoswipe_status;
	var target;

	/**
	 * Listen on photoswipe checkbox change
	 */
	function _addDocumentListeners() {
		block_photoswipe_properties.$is_photoswipe.click(function(e) {
			e.preventDefault();
			var status = true === block_photoswipe_properties.$checkboxPhotoswipe.prop("checked");
			if (status) {
				block_photoswipe_properties.$checkboxPhotoswipe.prop( "checked", false );
			} else {
				block_photoswipe_properties.$checkboxPhotoswipe.prop( "checked", true );
			}
			updateBlockPhotoswipe();
		});
	}

	/**
	 * Get photoswipe active/deactive value
	 * @return {void}
	 */
	function _tracePhotoswipeStatus() {
		photoswipe_status.imagePswpActive = true === block_photoswipe_properties.$checkboxPhotoswipe.prop("checked") ? "true" : "false";
	}

	/**
	 * Reset photoswipe tool
	 * @return {void}
	 */
	function resetPhotoswipeModal() {
		block_photoswipe_properties.$checkboxPhotoswipe.prop( "checked", false );
	}

	/**
	 * Synchronize the photoswipe tool with the block info
	 * @param  {Object} data block data
	 * @return {void}
	 */
	function updatePhotoswipeModal( data ) {
		resetPhotoswipeModal();

		target = data.target;
		block_photoswipe_properties.$checkboxPhotoswipe.prop( "checked", data.photoswipe.toString() == "true" );

		_tracePhotoswipeStatus();
	}

	/**
	 * Launch the event to the iframe
	 * @return {void}
	 */
	function updateBlockPhotoswipe() {
		var photoswipe =
		true === block_photoswipe_properties.$checkboxPhotoswipe.prop("checked") ? "true" : "false";

		// @todo LISTEN THE EVENT
		var data_image = {
			eventName: "rexlive:apply_photoswipe_block",
			data_to_send: {
				photoswipe: photoswipe,
				target: target
			}
		};

		Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_image);

		_tracePhotoswipeStatus();
	}

	function init($container) {
		var $self = $container.find(".background_set_image");

		block_photoswipe_properties = {
			$is_photoswipe: $self.find("#bg-set-photoswipe"),
      		$checkboxPhotoswipe: $self.find("#background_photoswipe")
		};

		photoswipe_status = {
			imagePswpActive: false
		};

		target = null;

		_addDocumentListeners();
	}

	return {
		init: init,
		updatePhotoswipeModal: updatePhotoswipeModal,
		resetPhotoswipeModal: resetPhotoswipeModal,
		updateBlockPhotoswipe: updateBlockPhotoswipe
	};
})(jQuery);