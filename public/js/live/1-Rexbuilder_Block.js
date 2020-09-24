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

		var blockID = $elem.attr('data-rexbuilder-block-id')
		Rexbuilder_Util.$document.trigger('rexlive:deletedBlock', blockID);

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
	 * Adding the blocks' toolbar
	 */
	function _addAllBlocksToolboxes() {
		var blocks = Array.prototype.slice.call(Rexbuilder_Util.rexContainer.querySelectorAll('.perfect-grid-item'));

		for (var i = 0; i < blocks.length; i++) {
			addToolboxClean(blocks[i]);
		}
	}

	/**
	 * @param	{HTMLElement}	block
	 * @since	2.0.9
	 */
	function addToolboxClean(block) {
		if (block.querySelector('.ui-focused-element-highlight')) return;

		var data = generateToolboxData(block);
		// console.log(block, data);
		var blockTools = Rexbuilder_Live_Templates.getTemplate('tmpl-toolbox-block-wrap-clean', data);
		var blockData = block.querySelector('.rexbuilder-block-data');

		blockData.nextElementSibling.insertAdjacentHTML('afterend', blockTools);
	}

	/**
	 * @param	{HTMLElement}	block
	 * @since	2.0.9
	 */
	function addToolboxDirt(block) {
		if (block.querySelector('.ui-focused-element-highlight')) return;

		var blockTools = Rexbuilder_Live_Templates.getTemplate('tmpl-toolbox-block-wrap');
		var blockData = block.querySelector('.rexbuilder-block-data');

		blockData.nextElementSibling.insertAdjacentHTML('afterend', blockTools);
	}

	/**
	 * @param	{HTMLElement}	block
	 * @since	2.0.9
	 */
	function generateToolboxData(block) {
		var blockData;
		var textWrap;
		var data = {
			not_has_image: false,
			not_has_overlay: false,
			not_has_video: false,
			has_content: false,
			overlay: ''
		};

		blockData = block.querySelector('.rexbuilder-block-data');

		console.log(block, {
			imgActive: blockData.getAttribute('data-image_bg_elem_active'),
			overlayActive: blockData.getAttribute('data-overlay_block_color_active'),
			overlay: blockData.getAttribute('data-overlay_block_color'),
			videoBgId: blockData.getAttribute('data-video_bg_id'),
			videoBgUrl: blockData.getAttribute('data-video_bg_url'),
			videoBgUrlVimeo: blockData.getAttribute('data-video_bg_url_vimeo')
		});

		data.not_has_image =
			null === blockData.getAttribute('data-image_bg_elem_active') ||
			'true' != blockData.getAttribute('data-image_bg_elem_active') ||
			'' == blockData.getAttribute('data-id_image_bg_block');

		data.not_has_overlay =
			'true' != blockData.getAttribute('data-overlay_block_color_active') ||
			'' == blockData.getAttribute('data-overlay_block_color');

		// data.not_has_video =
		// 	'' == blockData.getAttribute('data-video_bg_id') &&
		// 	'' == blockData.getAttribute('data-video_bg_url') &&
		// 	'' == blockData.getAttribute('data-video_bg_url_vimeo');

		data.not_has_video =
			!blockData.getAttribute('data-video_bg_id') &&
			!blockData.getAttribute('data-video_bg_url') &&
			!blockData.getAttribute('data-video_bg_url_vimeo');

		textWrap = block.querySelector('.text-wrap');
		if (
			0 == textWrap.childElementCount ||
			(1 == textWrap.childElementCount && Rexbuilder_Util.hasClass(textWrap.children[0], 'text-editor-span-fix'))
		) {
			data.has_content = false;
		} else {
			data.has_content = true;
		}

		data.overlay =
			null !== blockData.getAttribute('data-overlay_block_color')
				? blockData.getAttribute('data-overlay_block_color')
				: '';

		return data;
	}

	var _addBlockToolboxListeners = function () {
		Rexbuilder_Util.$rexContainer.on('click', '.builder-delete-block', handleBuilderDeleteBlock);
		Rexbuilder_Util.$rexContainer.on("click", ".builder-edit-slider", handleBuilderEditSlider);
		Rexbuilder_Util.$rexContainer.on('click', '.builder-copy-block', handleBuilderCopyBlock);
	}

	var init = function () {
		_addAllBlocksToolboxes();
		_addBlockToolboxListeners();
	}

	return {
		init: init,
		addToolboxClean: addToolboxClean,
		addToolboxDirt: addToolboxDirt
	}

})(jQuery);