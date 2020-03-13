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

	var _removeTextEditor = function($elem) {
		var $textWrap = $elem.find(".text-wrap");
		var textWrapContent;
		var $div;
		var css;

		if ($textWrap.length != 0 && $textWrap.hasClass("medium-editor-element")) {
			textWrapContent = $textWrap.html();
			$div = $(document.createElement("div"));
			css = $textWrap.attr("style");
			$div.appendTo($textWrap.parent());
			$div.addClass("text-wrap");
			if ($textWrap.hasClass("rex-content-resizable")) {
				$div.addClass("rex-content-resizable");
			}

			$textWrap.remove();
			$div.attr("style", css);
			$div.html(textWrapContent);
			$div.find(".text-editor-span-fix").remove();
			$div.find(".medium-insert-buttons").remove();
		}

		$textWrap = undefined;
		textWrapContent = undefined;
		$div = undefined;
		css = undefined;
	};

	var _removeHandles = function($elem) {
		$elem.children(".ui-resizable-handle").each(function(i, handle) {
			$(handle).remove();
		});
	};

	var _generateElementNewIDs = function($elem, blockNumber, sectionNumber) {
		var newBlockID = "block_" + sectionNumber + "_" + blockNumber;
		var $elData = $elem.children(".rexbuilder-block-data");
		var newRexID = Rexbuilder_Util.createBlockID();

		$elem.attr("data-rexbuilder-block-id", newRexID);
		$elData.attr("data-rexbuilder_block_id", newRexID);
		$elem.attr("id", newBlockID);
		$elData.attr("data-id", newBlockID);
		$elData.attr("id", newBlockID + "-builder-data");
	};

	var _fixCopiedElementSlider = function($elem) {
		if ($elem.hasClass("block-has-slider")) {
			var $textWrap = $elem.find(".text-wrap");
			var blockID = $elem.attr("data-rexbuilder-block-id");
			var $oldSlider = $textWrap.children( '.rex-slider-wrap[data-rex-slider-active="true"]' );
			$textWrap.children().remove();

			var $section = $elem.parents('.rexpansive_section');
			var sectionID = $section.attr("data-rexlive-section-id");
			var modelNumber = typeof $section.attr("data-rexlive-model-number") != "undefined" ? $section.attr("data-rexlive-model-number") : "";

			var target = {
				sectionID: sectionID,
				modelNumber: modelNumber,
				rexID: blockID
			};

			var sliderData = Rexbuilder_Only_Live_Utils.createSliderData($oldSlider);
			Rexbuilder_Only_Live_Utils.saveSliderOnDB(sliderData, true, blockID, target);
		}
	};

	var removeDeletedBlocks = function($gallery) {
		$gallery.children(".removing_block").each(function() {
			$(this).remove();
		});
	};

	var _createSliderData = function($sliderWrapper) {
		var auto_start = $sliderWrapper.attr("data-rex-slider-animation").toString() == "true";
		var prev_next = $sliderWrapper.attr("data-rex-slider-prev-next").toString() == "1";
		var dots = $sliderWrapper.attr("data-rex-slider-dots").toString() == "1";

		var data = {
			id: parseInt($sliderWrapper.attr("data-slider-id")),
			settings: {
				auto_start: auto_start,
				prev_next: prev_next,
				dots: dots
			},
			slides: []
		};

		var slides = $sliderWrapper.find(".rex-slider-element");

		for (var i = 0; i < slides.length; i++) {
			var $slide = $(slides[i]);

			var slide = {
				slide_image_id: "",
				slide_image_url: "",
				slide_url: "",
				slide_text: "",
				slide_video: "",
				slide_videoMp4Url: "",
				slide_video_audio: "",
				slide_video_type: ""
			};

			slide.slide_image_id = isNaN( parseInt($slide.attr("data-rex-slide-image-id")) )
				? ""
				: parseInt($slide.attr("data-rex-slide-image-id"));

			var backgroundImageUrl = Rexbuilder_Live_Utilities.getBackgroundUrlFromCss(
				$slide.css("background-image")
			);
			if (backgroundImageUrl != "none") {
				slide.slide_image_url = backgroundImageUrl;
			}

			var $linkDiv = $slide.children("a");
			if ($linkDiv.length != 0) {
				slide.slide_url = $linkDiv.attr("href");
			}

			var $textContent = $slide.find(".rex-slider-element-title");
			if ($textContent.length != 0) {
				if ($textContent.html().trim().length != 0) {
					slide.slide_text = $textContent.html();
				}
			}

			var $videoMp4Wrap = $slide.find(".mp4-player");
			var $videoVimeoWrap = $slide.find(".vimeo-player");
			var $videoYoutubeWrap = $slide.find(".youtube-player");

			if ($videoMp4Wrap.length != 0) {
				slide.slide_video = parseInt(
					$videoMp4Wrap
						.children(".rex-video-wrap")
						.attr("data-rex-video-mp4-id")
						);
				slide.slide_videoMp4Url = $videoMp4Wrap.find("source").attr("src");
				slide.slide_video_audio =
					$videoMp4Wrap.children(".rex-video-toggle-audio").length != 0;
				slide.slide_video_type = "mp4";
			}

			if ($videoVimeoWrap.length != 0) {
				var $iframe = $videoVimeoWrap.find("iframe");
				slide.slide_video = $iframe.attr("src").split("?")[0];
				slide.slide_video_audio =
					$videoVimeoWrap.children(".rex-video-toggle-audio").length != 0;
				slide.slide_video_type = "vimeo";
			}

			if ($videoYoutubeWrap.length != 0) {
				var $ytpPlayer = $videoYoutubeWrap.find(".rex-youtube-wrap");
				var elemData = jQuery.extend(
					true,
					{},
					eval("(" + $ytpPlayer.attr("data-property") + ")")
				);
				slide.slide_video = elemData.videoURL;
				slide.slide_video_audio =
				$videoYoutubeWrap.children(".rex-video-toggle-audio").length != 0;
				slide.slide_video_type = "youtube";
			}

			data.slides.push(slide);
		}
		return data;
	};

	/**
	 * @param {*} sliderData Data of the slider
	 * @param {*} newSliderFlag true if save as new slider, false otherwise
	 */
	var _saveSliderOnDB = function(
		sliderData,
		newSliderFlag,
		newBlockID,
		targetToEdit
		) {
		var data = {
			eventName: "rexlive:uploadSliderFromLive",
			sliderInfo: {
				slider: sliderData,
				newSlider: newSliderFlag,
				blockID: newBlockID,
				target: targetToEdit
			}
		};

		Rexbuilder_Util_Editor.sendParentIframeMessage(data);
	};

	var _getElementsPhotoswipe = function($gallery) {
		var elementsPhotoswipe = [];
		$gallery
			.children(".grid-stack-item:not(.removing_block)")
			.each(function(i, el) {
				var $el = $(el);
				var $elData = $el.children(".rexbuilder-block-data");

				var elPW = {
					$data: $elData,
					photoswipe: false
				};

				if ($elData.attr("data-photoswipe").toString() == "true") {
					elPW.photoswipe = true;
				}

				elementsPhotoswipe.push(elPW);
		});

		return elementsPhotoswipe;
	};

	/**
	* Add class on live container to hide some tools on layouts different from default
	* 
	* @param {string} activeLayout layout
	* @since 2.0.0
	*/
	var _fixToolsVisibility = function(activeLayout) {
		if (activeLayout == "default") {
			Rexbuilder_Util.$rexContainer.removeClass("rex-hide-responsive-tools");
			Rexbuilder_Util.$rexContainer
				.parent()
				.removeClass("rex-hide-responsive-tools");
		} else {
			Rexbuilder_Util.$rexContainer
				.parent()
				.addClass("rex-hide-responsive-tools");
			Rexbuilder_Util.$rexContainer.addClass("rex-hide-responsive-tools");
		}
	};

	var setEndOfContenteditable = function(contentEditableElement) {
		var range, selection;
		if (document.createRange) {
			//Firefox, Chrome, Opera, Safari, IE 9+
			range = document.createRange(); //Create a range (a range is a like the selection but invisible)
			range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
			range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
			selection = window.getSelection(); //get the selection object (allows you to change selection)
			selection.removeAllRanges(); //remove any selections already made
			selection.addRange(range); //make the range you have just created the visible selection
		} else if (document.selection) {
			//IE 8 and lower
			range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
			range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
			range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
			range.select(); //Select the range (make it the visible selection
		}
	};

	/**
	 * Updating section and block tools for the model
	 * Preventing animation bug
	 * @param {jQuery Object} $section model section
	 * @param {jQuery Object} $section_data model data
	 * @todo grid layout tool
	 * @todo grid width tool
	 */
	var _updateModelSectionTools = function( $section, $section_data ) {
		var sectionDataObj = Rexbuilder_Util_Editor.rowAttrsObj( $section_data[0] );

		var bgImgOptions = {
			idImage: "undefined" != typeof sectionDataObj.id_image_bg_section ? sectionDataObj.id_image_bg_section : "",
			urlImage: "undefined" != typeof sectionDataObj.image_bg_section ? sectionDataObj.image_bg_section : "",
		};

		var sectionColor = "undefined" != typeof sectionDataObj.color_bg_section ? sectionDataObj.color_bg_section : "";
		var sectionOverlayOptions = {
			active: "undefined" != typeof sectionDataObj.row_overlay_active ? sectionDataObj.row_overlay_active : "",
			color: "undefined" != typeof sectionDataObj.row_overlay_color ? sectionDataObj.row_overlay_color : "",
		}

		var videoOptions = {
			typeVideo: ""
			};
		if ( "undefined" != typeof sectionDataObj.video_mp4_url && sectionDataObj.video_mp4_url != "") {
			videoOptions.typeVideo = "mp4";
		} else if ( "undefined" != typeof sectionDataObj.video_bg_url_vimeo_section && sectionDataObj.video_bg_url_vimeo_section != "") {
			videoOptions.typeVideo = "vimeo";
		} else if ( "undefined" != typeof sectionDataObj.video_bg_url_section && sectionDataObj.video_bg_url_section != "") {
			videoOptions.typeVideo = "youtube";
		}

		Rexbuilder_Section_Editor.updateRowTools( $section );
		Rexbuilder_Section_Editor.updateSectionDimensionTool( $section, sectionDataObj );
		Rexbuilder_Section_Editor.updateSectionLayoutTool( $section, sectionDataObj );

		if( "" !== bgImgOptions.idImage ) {
			Rexbuilder_Section_Editor.updateRowBackgroundImageTool( $section, bgImgOptions );
		} else {
			Rexbuilder_Section_Editor.resetRowBackgroundImageTool( $section );
		}

		if( -1 === sectionColor.indexOf("gradient") ) {
			Rexbuilder_Section_Editor.updateRowBackgroundColorTool( $section, sectionColor );
		} else {
			Rexbuilder_Section_Editor.updateRowBackgroundGradientTool( $section, sectionColor );
		}

		if( -1 === sectionOverlayOptions.color.indexOf("gradient") ) {
			// Must update also the view of the overlay
			Rexbuilder_Dom_Util.updateSectionOverlay( $section, sectionOverlayOptions );
			Rexbuilder_Section_Editor.updateRowOverlayColorTool( $section, sectionOverlayOptions );
		} else {
			// Must update also the view of the overlay
			Rexbuilder_Dom_Util.updateSectionOverlayGradient( $section, sectionOverlayOptions );
			Rexbuilder_Section_Editor.updateRowOverlayGradientTool( $section, sectionOverlayOptions );
		}

		Rexbuilder_Section_Editor.updateRowBackgroundVideo( $section, videoOptions );
		Rexbuilder_Block_Editor.updateBlockToolsOnRow( $section );

		$section.find(".perfect-grid-item").each(function(i,el) {
			var $el = $(el);
			Rexbuilder_Only_Live_Utils.updateModelBlocksTools( $el, $el.find(".rexbuilder-block-data") );
		});
	};

	/**
	 * Updating single block tools
	 * Preventing animation bug
	 * @param {jQuery Object} $block block
	 * @param {jQuery Object} $blockData block data
	 * @todo  All tools
	 */
	var _updateModelBlocksTools = function( $block, $blockData ) {
		var blockDataObj = Rexbuilder_Util_Editor.blockAttrsObj( $blockData[0] );
		$block.removeClass("has-rs-animation");
	};

	var load = function() {
		_tooltips();
	}

	return {
		launchTooltips: _tooltips,
		removeTextEditor: _removeTextEditor,
		removeHandles: _removeHandles,
		generateElementNewIDs: _generateElementNewIDs,
		fixCopiedElementSlider: _fixCopiedElementSlider,
		removeDeletedBlocks: removeDeletedBlocks,
		createSliderData: _createSliderData,
		saveSliderOnDB: _saveSliderOnDB,
		getElementsPhotoswipe: _getElementsPhotoswipe,
		fixToolsVisibility: _fixToolsVisibility,
		setEndOfContenteditable: setEndOfContenteditable,
		updateModelSectionTools: _updateModelSectionTools,
		updateModelBlocksTools: _updateModelBlocksTools,
		load: load
	};
})(jQuery);
