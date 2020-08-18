var Rexbuilder_Block = (function ($) {
	'use strict';

	function handleBuilderDeleteBlock(e) {
		e.preventDefault();
		e.stopPropagation();
		Rexbuilder_Util_Editor.removingBlocks = true;
		var $elem = $(e.target).parents(".grid-stack-item");
		var gridGalleryInstance = $elem.parent().data().plugin_perfectGridGalleryEditor;
		var $section = gridGalleryInstance.$section;
		gridGalleryInstance.deleteBlock($elem);

		$elem.attr("data-rexlive-element-edited", true);

		Rexbuilder_Util_Editor.removingBlocks = false;

		// WPCF7 operations
		if ( 0 !== $elem.find('.wpcf7-form:not(.no-builder-form)').length ) {
			var formID = $elem.find('.rex-element-wrapper').attr('data-rex-element-id');
			Rexbuilder_Rexwpcf7_Editor.removeFormInPage(formID);
		}

		// RexButtons operations
		Rexbuilder_Rexbutton.refreshNumbers();
		Rexbuilder_Rexbutton.updateButtonListInPage();

		if ( 0 === $section.find('.perfect-grid-item').not('.rex-hide-element').length ) {
			$section.addClass('empty-section');
		} else {
			$section.removeClass('empty-section');
		}

		var data = {
			eventName: "rexlive:edited",
			modelEdited: $section.hasClass("rex-model-section"),
		};
		Rexbuilder_Util_Editor.sendParentIframeMessage(data);
	}

	function handleBuilderEditSlider(e) {
		e.preventDefault();
		e.stopPropagation();
		var $elem = $(e.target).parents(".grid-stack-item");
		var $section = $elem.parents(".rexpansive_section");

		var rex_block_id = $elem.attr('data-rexbuilder-block-id');
		var sectionID = $section.attr("data-rexlive-section-id");
		var modelNumber = typeof $section.attr("data-rexlive-model-number") != "undefined" ? $section.attr("data-rexlive-model-number") : "";

		var targetToEdit= {
			sectionID: sectionID,
			modelNumber: modelNumber,
			rexID: rex_block_id,
			sliderNumber: 0
		}

		var $sliderWrap = $elem.find(".rex-slider-wrap[data-rex-slider-active=\"true\"]");
		if ($sliderWrap.length > 0) {
			targetToEdit.sliderNumber = $sliderWrap.attr("data-rex-slider-number");

			var sliderID = $sliderWrap.attr("data-slider-id");
			var blockID = $elem.attr("id");
			var shortCodeSlider = '[RexSlider slider_id="' + sliderID + '"]';

			var data = {
				eventName: "rexlive:editSlider",
				sliderID: sliderID,
				blockID: blockID,
				shortCodeSlider: shortCodeSlider,
				target: targetToEdit
			}

			Rexbuilder_Util_Editor.sendParentIframeMessage(data);
		}
	}

	function handleBuilderCopyBlock(e) {
		e.preventDefault();
		e.stopPropagation();

		Rexbuilder_Util_Editor.blockCopying = true;
		var $elem = $(e.currentTarget).parents('.grid-stack-item');

		Rexbuilder_CreateBlocks.createCopyBlock($elem);
		Rexbuilder_Util_Editor.blockCopying = false;
	}

	/**
	 * Adding the block toolbar via js
	 */
	function _addToolbox() {
		var blocks = Array.prototype.slice.call( Rexbuilder_Util.rexContainer.querySelectorAll('.perfect-grid-item') );
		var tot_blocks = blocks.length;
		var blockData;
	    var i;

	    var not_has_image, not_has_overlay, not_has_video;
	    var data = {
	    	not_has_image: false,
	    	not_has_overlay: false,
	    	not_has_video: false,
	    	has_content: false,
	    	overlay: ''
	    };

	    var textWrap;
	    var blockTools;

	    for (i=0; i < tot_blocks; i++) {
	    	blockData = blocks[i].querySelector('.rexbuilder-block-data');
	    	data.not_has_image = ( null === blockData.getAttribute('data-image_bg_elem_active') || 'true' != blockData.getAttribute('data-image_bg_elem_active') || '' == blockData.getAttribute('data-id_image_bg_block') );

	    	data.not_has_overlay = ( 'true' != blockData.getAttribute('data-overlay_block_color_active') || '' == blockData.getAttribute('data-overlay_block_color'))

	    	data.not_has_video = ( '' == blockData.getAttribute('data-video_bg_id') && '' == blockData.getAttribute('data-video_bg_url') && '' == blockData.getAttribute('data-video_bg_url_vimeo') );

	    	textWrap = blocks[i].querySelector('.text-wrap');
	    	if ( 0 == textWrap.childElementCount || ( 1 == textWrap.childElementCount && Rexbuilder_Util.hasClass( textWrap.children[0], 'text-editor-span-fix' ) ) ) {
	    		data.has_content = false;
	    	} else {
				data.has_content = true;
	    	}

	    	data.overlay = ( null !== blockData.getAttribute('data-overlay_block_color') ? blockData.getAttribute('data-overlay_block_color') : '' );

	    	blockTools = Rexbuilder_Live_Templates.getTemplate( 'tmpl-toolbox-block-wrap-clean', data );

	    	blockData.nextElementSibling.insertAdjacentHTML('afterend', blockTools);
	    }
	}

	var _addBlockToolboxListeners = function () {
		Rexbuilder_Util.$rexContainer.on('click', '.builder-delete-block', handleBuilderDeleteBlock);
		Rexbuilder_Util.$rexContainer.on("click", ".builder-edit-slider", handleBuilderEditSlider);
		Rexbuilder_Util.$rexContainer.on('click', '.builder-copy-block', handleBuilderCopyBlock);
	}

	var init = function () {
		_addToolbox();
		_addBlockToolboxListeners();
	}

	return {
		init: init
	}

})(jQuery);