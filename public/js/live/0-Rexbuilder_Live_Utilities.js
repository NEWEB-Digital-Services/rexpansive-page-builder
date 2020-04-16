/**
 * Utilities functions on RexLive
 * @since 2.0.0
 */
var Rexbuilder_Live_Utilities = (function($) {
	"use strict";

	var PLATFORM_IS_MAC = window.navigator.platform.match('Mac');

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

	var _addSpectrumCustomSaveButton = function( $picker ) {
		var choose = tmpl('tmpl-tool-save', {});
		var $choose = $(choose);
		$picker.spectrum('container').append($choose);

		$choose.on('click', function(e) {
			e.stopPropagation();
			e.preventDefault();
			$picker.spectrum('container').find('.sp-choose').trigger('click');
		});
	};

	var _addSpectrumCustomCloseButton = function( $picker ) {
		var close = tmpl('tmpl-tool-close', {});
		var $close = $(close);
		$picker.spectrum('container').append($close);

		$close.on('click', function(e) {
			e.stopPropagation();
			e.preventDefault();
			$picker.attr("data-revert", true);
			$picker.spectrum('container').find('.sp-cancel').trigger('click');
		});
	};

	var _removeColorPicker = function($elem) {
		$elem.find(".tool-button--spectrum").remove();
		$elem.find("input.spectrum-input-element").spectrum("destroy");
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

	var _hideAllTools = function() {
		Rexbuilder_Util_Editor.manageElement = false;
		// Rexbuilder_Util.$rexContainer.find('.rexpansive_section').removeClass('focusedRow').removeClass('activeRowTools').removeClass('highLightRow');
		Rexbuilder_Util.$rexContainer.find('.rexpansive_section').removeClass('focusedRow').removeClass('activeRowTools');
		Rexbuilder_Util.$rexContainer.find('.grid-stack-item').removeClass('focused');
		Rexbuilder_Util.$rexContainer.find('.tool-button-floating--active').removeClass('tool-button-floating--active');
	};

	var _getBackgroundUrlFromCss = function(styleBackground) {
		return styleBackground
		.replace("url(", "")
		.replace(")", "")
		.replace(/\"/gi, "");
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

			var sliderData = Rexbuilder_Live_Utilities.createSliderData($oldSlider);
			Rexbuilder_Live_Utilities.saveSliderOnDB(sliderData, true, blockID, target);
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
			Rexbuilder_Live_Utilities.updateModelBlocksTools( $el, $el.find(".rexbuilder-block-data") );
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

	var addWindowListeners = function() {
		Rexbuilder_Util.$window.click(function(e) {
			var $target = $(e.target);
			if (
				Rexbuilder_Util_Editor.editingElement &&
				$target.parents(".grid-stack-item").length == 0 &&
				$target.parents(".media-frame").length == 0 &&
				!$target.hasClass("grid-stack-item")
			) {
				Rexbuilder_Util_Editor.activateElementFocus = false;
				Rexbuilder_Util_Editor.endEditingElement();
				Rexbuilder_Util_Editor.activateElementFocus = true;
			}
		});

		function handleKeydown(e) {
			if ((PLATFORM_IS_MAC ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {
				// SAVE PAGE
				e.preventDefault();
				// Process the event here (such as click on submit button)
				var data = {
					eventName: 'rexlive:savePageWithButton'
				};
				Rexbuilder_Util_Editor.sendParentIframeMessage(data);
			} else if (
				'BODY' == e.target.nodeName &&
				(PLATFORM_IS_MAC ? e.metaKey : e.ctrlKey) &&
				!e.shiftKey &&
				e.keyCode == 90
			) {
				// UNDO
				e.preventDefault();
				var data = {
					eventName: 'rexlive:undoWithButton'
				};
				Rexbuilder_Util_Editor.sendParentIframeMessage(data);
			} else if (
				'BODY' == e.target.nodeName &&
				(((PLATFORM_IS_MAC ? e.metaKey : e.ctrlKey) && e.shiftKey && e.keyCode == 90) ||
					((PLATFORM_IS_MAC ? e.metaKey : e.ctrlKey) && e.keyCode == 89))
			) {
				// REDO
				e.preventDefault();
				var data = {
					eventName: 'rexlive:redoWithButton'
				};
				Rexbuilder_Util_Editor.sendParentIframeMessage(data);
			} else if (e.keyCode === 27) {
				// ESC pressed
				if (Rexbuilder_Util_Editor.editingGallery) {
					Rexbuilder_Util_Editor.endEditingElement();
				} else {
					var data = {
						eventName: 'rexlive:esc_pressed'
					};
					Rexbuilder_Util_Editor.sendParentIframeMessage(data);
				}
			}
		}

		document.addEventListener('keydown', handleKeydown)

		Rexbuilder_Util.$window.on("mousedown", function(event) {
			Rexbuilder_Util_Editor.mouseDown = true;
			Rexbuilder_Util_Editor.mouseUp = false;
		});

		Rexbuilder_Util.$window.on("mouseup", function(event) {
			Rexbuilder_Util_Editor.mouseDown = false;
			Rexbuilder_Util_Editor.mouseUp = true;
		});

		Rexbuilder_Util.$window[0].addEventListener( "message", receiveMessage, false );

		function receiveMessage(event) {
			if (event.data.rexliveEvent) {
				var e = jQuery.Event(event.data.eventName);
				e.settings = {};
				jQuery.extend(e.settings, event.data);
				Rexbuilder_Util.$document.trigger(e);
			}
		}
	};

	var addDocumentListeners = function() {
		/**
		* Listen a complete change layout event
		*/
		Rexbuilder_Util.$document.on("rexlive:changeLayout", function(event) {
			var data = event.settings;
			Rexbuilder_Util_Editor.undoStackArray = [];
			Rexbuilder_Util_Editor.redoStackArray = [];
			// _clearSectionsEdited();
			Rexbuilder_Util.chosenLayoutData = jQuery.extend(
				true,
				{},
				data.layoutData
			);
			Rexbuilder_Util_Editor.changedLayout = true;
			Rexbuilder_Util_Editor.clickedLayoutID = data.selectedLayoutName;
			Rexbuilder_Live_Utilities.fixToolsVisibility(data.selectedLayoutName);
		});

		Rexbuilder_Util.$document.on("rexlive:startChangeLayout", function(event) {
			Rexbuilder_Util_Editor.startLoading();
		});

		Rexbuilder_Util.$document.on("rexlive:updateLayoutsDimensions", function(e) {
			var data = e.settings.data_to_send;
			$("#layout-avaiable-dimensions").text(JSON.stringify(data.layouts));
			if (data.updateHeights) {
				Rexbuilder_Util.windowIsResizing = true;
				Rexbuilder_Util.updateGridsHeights();
				Rexbuilder_Util.windowIsResizing = false;
			}
		});

		Rexbuilder_Util.$document.on("rexlive:undo", function(e) {
			if (Rexbuilder_Util_Editor.undoStackArray.length > 0) {
				var data = {
					eventName: "rexlive:edited",
					modelEdited: false
				};
				Rexbuilder_Util_Editor.sendParentIframeMessage(data);
				var action = Rexbuilder_Util_Editor.undoStackArray.pop();
				Rexbuilder_Dom_Util.performAction(action, false);
				Rexbuilder_Util_Editor.redoStackArray.push(action);
			}
			Rexbuilder_Util_Editor.sendUndoRedoInformation();
		});

		Rexbuilder_Util.$document.on("rexlive:redo", function(e) {
			if (Rexbuilder_Util_Editor.redoStackArray.length > 0) {
				var action = Rexbuilder_Util_Editor.redoStackArray.pop();
				Rexbuilder_Dom_Util.performAction(action, true);
				Rexbuilder_Util_Editor.undoStackArray.push(action);
			}
			Rexbuilder_Util_Editor.sendUndoRedoInformation();
		});

		Rexbuilder_Util.$document.on("rexlive:updateSlider", function(e) {
			var data = e.settings;
			Rexbuilder_Dom_Util.updateSliderStack(data.data_to_send);
		});

		Rexbuilder_Util.$document.on("rexlive:change_section_bg_color", function(e) {
			var data = e.settings;
			Rexbuilder_Dom_Util.updateSectionBackgroundColorLive(
				data.data_to_send.sectionTarget,
				data.data_to_send.color
			);
		});

		Rexbuilder_Util.$document.on("rexlive:change_section_overlay_color", function(e) {
			var data = e.settings;
			Rexbuilder_Dom_Util.updateSectionOverlayColorLive(
				data.data_to_send.sectionTarget,
				data.data_to_send.color
			);
		});

		Rexbuilder_Util.$document.on("rexlive:change_block_bg_color", function(e) {
			var data = e.settings;
			Rexbuilder_Dom_Util.updateBlockBackgroundColorLive(
				data.data_to_send.target,
				data.data_to_send.color
			);
		});

		Rexbuilder_Util.$document.on("rexlive:change_block_overlay_color", function(e) {
			var data = e.settings;
			Rexbuilder_Dom_Util.updateBlockOverlayColorLive(
				data.data_to_send.target,
				data.data_to_send.color
			);
		});

		Rexbuilder_Util.$document.on("rexlive:newSliderSavedOnDB", function(e) {
			var data = e.settings;
			Rexbuilder_CreateBlocks.createSlider(data.data_to_send);
		});

		Rexbuilder_Util.$document.on("rexlive:dropChanges", function(e) {
			Rexbuilder_Util_Editor.startLoading();
			var eventData = e.settings.data_to_send;
			Rexbuilder_Util_Editor.restorePageStartingState(eventData);
		});

		Rexbuilder_Util.$document.on("rexlive:lockRows", function(e) {
			Rexbuilder_Util_Editor.lockRows();
		});

		Rexbuilder_Util.$document.on("rexlive:unlockRows", function(e) {
			Rexbuilder_Util_Editor.releaseRows();
		});

		Rexbuilder_Util.$document.on("rexlive:close_modal", function(e) {
			Rexbuilder_Live_Utilities.hideAllTools();

			var blockIDToFocusAfterClose = e.settings.blockID;

			if ( "undefined" != typeof blockIDToFocusAfterClose ) {
				setTimeout(function() {   // Necessary!
				$('#' + blockIDToFocusAfterClose)
					.dblclick()
					.addClass('item--me-focus')
					.parents('.rexpansive_section')
					.addClass('focusedRow block-editing');
				}, 0);
			}
		});

		Rexbuilder_Util.$document.on("rexlive:openCreateModelModal", function(e) {
			var eventData = e.settings.data_to_send;
			$('.rexpansive_section[data-rexlive-section-id=' + eventData.sectionTarget.sectionID + ']').find('.open-model').trigger('click');
		});
    
		// BUTTONS
		Rexbuilder_Util.$document.on("rexlive:importButton", function (e) {
			Rexbuilder_Rexbutton.fixImportedButton(e.settings.data_to_send);
		});

		Rexbuilder_Util.$document.on("rexlive:updateButtonLive", function(e){
			Rexbuilder_Rexbutton.updateButtonLive(e.settings.data_to_send);
		});

		Rexbuilder_Util.$document.on("rexlive:remove_separate_button", function (e) {
			Rexbuilder_Rexbutton.removeSeparateButton(e.settings.data_to_send);
		});

		Rexbuilder_Util.$document.on("rexlive:separate_rex_button", function (e) {
			Rexbuilder_Rexbutton.separateRexButton(e.settings.data_to_send);
		});

		Rexbuilder_Util.$document.on("rexlive:lock_synchronize_on_button", function (e) {
			Rexbuilder_Rexbutton.lockSynchronize(e.settings.data_to_send);
		});

		/* ===== Elements ===== */
		Rexbuilder_Util.$document.on('rexlive:import_element', function (e) {
			Rexbuilder_Rexelement_Editor.fixImportedElement( e.settings.data );
		});

		Rexbuilder_Util.$document.on("rexlive:complete_import_element", function ( e ) {
			Rexbuilder_Rexelement_Editor.handleCompleteImportElement( e );
		});

		Rexbuilder_Util.$document.on('rexlive:lock_synchronize_on_element', function (e) {
			Rexbuilder_Rexelement_Editor.lockSynchronize( e.settings.data_to_send );
		});

		Rexbuilder_Util.$document.on('rexlive:separate_rex_element', function (e) {
			Rexbuilder_Rexelement_Editor.separateRexElement(e.settings.data_to_send);
		});

		Rexbuilder_Util.$document.on('rexlive:refresh_separated_rex_element', function (e) {
			Rexbuilder_Rexelement_Editor.refreshSeparatedRexElement(e.settings.data_to_send);
		});

		Rexbuilder_Util.$document.on("rexlive:remove_separate_element", function (e) {
			Rexbuilder_Rexelement.removeSeparateElement(e.settings.data_to_send);
		});

		/* ===== CF7 ===== */
		Rexbuilder_Util.$document.on('rexlive:wpcf7_add_field', function (e) {
			Rexbuilder_Rexwpcf7_Editor.addField(e.settings.data_to_send);
		});

		Rexbuilder_Util.$document.on("rexlive:wpcf7_create_form_span_data", function (e) {
			Rexbuilder_Rexwpcf7.createFormSpanData(e.settings.data_to_send);
		});

		Rexbuilder_Util.$document.on('rexlive:updateFormLive', function(e){
			Rexbuilder_Rexwpcf7_Editor.updateFormLive(e.settings.data_to_send);
		});

		Rexbuilder_Util.$document.on('rexlive:updateFormContentLive', function(e){
			Rexbuilder_Rexwpcf7_Editor.updateFormContentLive(e.settings.data_to_send);
		});

		Rexbuilder_Util.$document.on('rexlive:wpcf7_create_column_content_span_data', function (e) {
			Rexbuilder_Rexwpcf7_Editor.createColumnContentSpanData(e.settings.data_to_send);
		});

		Rexbuilder_Util.$document.on('rexlive:updateColumnContentLive', function(e){
			Rexbuilder_Rexwpcf7_Editor.updateColumnContentLive(e.settings.data_to_send);
		});

		// DRAG & DROP
		Rexbuilder_Util.$document.on("rexlive:drag_drop_starded", function (e) {
			Rexbuilder_Util_Editor.dragAndDropFromParent = true;
		});

		Rexbuilder_Util.$document.on("rexlive:drag_drop_ended", function (e) {
			Rexbuilder_Util_Editor.dragAndDropFromParent = false;
		});

		// BUTTONS?
		Rexbuilder_Util.$document.on("rexlive:set_container_margins", function(e) {
			Rexbuilder_Util_Editor.updateContainerMargins(e.settings.data_to_send);
		});
	};

	/**
	* Add events to control the drag and drop of blocks between the rows
	* @since 2.0.0
	*/
	var addDnDEvents = function() {

		/** */
		Rexbuilder_Util.$rexContainer.on("dragenter", function(e) {
			if (Rexbuilder_Util_Editor.dragAndDropFromParent) {
				return;
			}
			e.stopPropagation();
		});

		Rexbuilder_Util.$rexContainer.on("dragover", function(e) {
			if (Rexbuilder_Util_Editor.dragAndDropFromParent) {
				return;
			}
			e.preventDefault();
			e.stopPropagation();
		});

		/**
		* Listen on dropping of a block inside a section
		* Add try catch to prevent listen of drop of a model
		* @since 2.0.0
		*/

		Rexbuilder_Util.$rexContainer.on("drop", function(e) {
			if (Rexbuilder_Util_Editor.dragAndDropFromParent) {
			return;
			}
			e.preventDefault();
			e.stopPropagation();
			var ev;
			if (e.isTrigger) {
				ev = triggerEvent.originalEvent;
			} else {
				ev = e.originalEvent;
			}
			var blockData = ev.dataTransfer.getData("text/plain");
			// var blockDataElement = Rexbuilder_Dom_Util.htmlToElement(blockData);
				try {
					blockData = undefined !== typeof blockData ? JSON.parse(blockData) : null;
				} catch(e) {
					blockData = null;
			}

			if(blockData) {
				var target = document.elementFromPoint(e.clientX, e.clientY);
				var $targetSection = $(target);
				var $originalElement;
				var $originalSection;

				if (blockData.modelNumber != "") {
					$originalElement = Rexbuilder_Util.$rexContainer
						.find(
							'section[data-rexlive-section-id="' +
							blockData.sectionID +
							'"][data-rexlive-model-number="' +
							blockData.modelNumber +
							'"]'
						)
						.find('div [data-rexbuilder-block-id="' + blockData.rexID + '"]');
				} else {
					$originalElement = Rexbuilder_Util.$rexContainer
					.find('section[data-rexlive-section-id="' + blockData.sectionID + '"]')
					.find('div [data-rexbuilder-block-id="' + blockData.rexID + '"]');
				}

				$originalSection = $originalElement.parents(".grid-stack-row");
				$targetSection = $targetSection.parents('.rexpansive_section').find('.grid-stack-row');
				// var $targetSection = $(target).parents('.rexpansive_section').find('.grid-stack-row');

				if( $targetSection.length > 0 && !$targetSection.is($originalSection) ) {

					Rexbuilder_CreateBlocks.moveBlockToOtherSection( $originalElement, $targetSection );
					$originalElement.find(".builder-delete-block").first().trigger("click");
				}
			}
		});
	};

	var addBuilderListeners = function() {
		addDocumentListeners();
		addWindowListeners();
		addDnDEvents();
	}

	var load = function() {
		_tooltips();
	}

	return {
		launchTooltips: _tooltips,
		addSpectrumCustomSaveButton: _addSpectrumCustomSaveButton,
		addSpectrumCustomCloseButton: _addSpectrumCustomCloseButton,
		removeColorPicker: _removeColorPicker,
		removeTextEditor: _removeTextEditor,
		removeHandles: _removeHandles,
		hideAllTools: _hideAllTools,
		getBackgroundUrlFromCss: _getBackgroundUrlFromCss,
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
		addBuilderListeners: addBuilderListeners,
		load: load
	};
})(jQuery);
