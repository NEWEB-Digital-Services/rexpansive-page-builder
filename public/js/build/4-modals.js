;
(function ($) {
	'use strict';

	$(function () {
		// Prepare the variables that holds the Frame Uploaders
		var image_uploader_frame, image_block_edit_frame, navigator_media_frame, video_uploader_frame, video_block_edit_frame, textfill_image_upload_frame;

		var setBuilderTimeStamp = function () {
			/* 
			var timestamp = new Date();
			console.log(timestamp); 
			*/
		};

		$(document).on("rexlive:set_gallery_layout", function (e) {
			var data = e.settings.data_to_send;

			var $section = Rexbuilder_Util_Editor.sectionChangingOptionsObj;
			var $gallery = $section.find(".grid-stack-row");
			var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);

			//reverseData: STATO PRIMA
			var oldDisposition = galleryInstance.createActionDataMoveBlocksGrid();

			var oldRowDistances = {
				gutter: parseInt($gallery.attr("data-separator")),
				top: parseInt($gallery.attr("data-row-separator-top")),
				bottom: parseInt($gallery.attr("data-row-separator-bottom")),
				right: parseInt($gallery.attr("data-row-separator-right")),
				left: parseInt($gallery.attr("data-row-separator-left"))
			}

			var section_margin_top = parseInt($section.css("margin-top").split("px")[0]);
			var section_margin_right = parseInt($section.css("margin-right").split("px")[0]);
			var section_margin_bottom = parseInt($section.css("margin-bottom").split("px")[0]);
			var section_margin_left = parseInt($section.css("margin-left").split("px")[0]);

			var oldMargins = {
				top: isNaN(section_margin_top) ? 0 : section_margin_top,
				right: isNaN(section_margin_right) ? 0 : section_margin_right,
				bottom: isNaN(section_margin_bottom) ? 0 : section_margin_bottom,
				left: isNaN(section_margin_left) ? 0 : section_margin_left,
			}

			var reverseData = {
				marginsSection: oldMargins,
				rowDistances: oldRowDistances,
				fullHeight: $gallery.attr("data-full-height"),
				layout: $gallery.attr("data-layout"),
				section_width: $gallery.parent().css("max-width"),
				dimension: $gallery.parent().hasClass("full-disposition") ? "full" : "boxed",
				collapse_grid: $section.attr("data-rex-collapse-grid"),
				blocksDisposition: $.extend(true, {}, oldDisposition)
			}

			setBuilderTimeStamp();

			Rexbuilder_Dom_Util.updateGridDomProperties($gallery, data);
			Rexbuilder_Dom_Util.updateSectionMargins($section, data.sectionMargins);

			var newDisposition = galleryInstance.updateGridSettingsModalUndoRedo({
				'layout': data.layout,
				'fullHeight': data.fullHeight,
				'section_width': "" + data.sectionWidth.width + data.sectionWidth.type,
				'rowDistances': data.rowDistances
			});

			//actionData: STATO DOPO
			var actionData = {
				marginsSection: data.sectionMargins,
				rowDistances: data.rowDistances,
				fullHeight: data.fullHeight,
				layout: data.layout,
				section_width: $gallery.parent().css("max-width"),
				dimension: $gallery.parent().hasClass("full-disposition") ? "full" : "boxed",
				collapse_grid: $section.attr("data-rex-collapse-grid"),
				blocksDisposition: $.extend(true, {}, newDisposition)
			}

			Rexbuilder_Util_Editor.pushAction($section, "updateSection", actionData, reverseData);
		});

		$(document).on("rexlive:set_row_photoswipe", function (e) {
			var data = e.settings.data_to_send;
			if (data.photoswipe.toString() == "true") {

				var $section = Rexbuilder_Util_Editor.sectionChangingOptionsObj;
				var $gallery = $section.find(".grid-stack-row");

				var elementsBefore = Rexbuilder_Util_Editor.getElementsPhotoswipe($gallery);
				var reverseData = {
					elements: elementsBefore
				}

				Rexbuilder_Dom_Util.enablePhotoswipeAllBlocksSection($section);

				//actionData: STATO DOPO
				var elementsAfter = Rexbuilder_Util_Editor.getElementsPhotoswipe($gallery);
				var actionData = {
					elements: elementsAfter
				}
				Rexbuilder_Util_Editor.pushAction($section, "updateSectionPhotoswipe", actionData, reverseData);
			}
		});

		$(document).on("rexlive:change_section_name", function (e) {
			var data = e.settings.data_to_send;
			var $section = Rexbuilder_Util_Editor.sectionChangingOptionsObj;
			var reverseData = {
				sectionName: $section.attr("data-rexlive-section-name")
			}

			Rexbuilder_Dom_Util.updateSectionName($section, data.sectionName);

			var actionData = {
				sectionName: data.sectionName
			}

			Rexbuilder_Util_Editor.pushAction($section, "updateSectionName", actionData, reverseData);
		});

		$(document).on("rexlive:apply_section_custom_classes", function (e) {
			var data = e.settings.data_to_send;

			var $section = Rexbuilder_Util_Editor.sectionChangingOptionsObj;
			var oldClasses = $section.children(".section-data").attr("data-custom_classes");

			var reverseData = {
				$target: $section,
				classes: oldClasses
			}

			Rexbuilder_Dom_Util.updateCustomClasses($section, data.customClasses);

			var actionData = {
				$target: $section,
				classes: data.customClasses
			}

			Rexbuilder_Util_Editor.pushAction($section, "updateCustomClasses", actionData, reverseData);
		});

		$(document).on("rexlive:SetCustomCSS", function (e) {
			var data = e.settings.data_to_send;

			var oldCSS = Rexbuilder_Util_Editor.$styleElement.text();

			var reverseData = {
				css: oldCSS
			}

			Rexbuilder_Dom_Util.updateCustomCSS(data.customCSS);

			var actionData = {
				css: data.customCSS
			}

			Rexbuilder_Util_Editor.pushAction("document", "updateCustomCSS", actionData, reverseData);
		});

		$(document).on("rexlive:apply_background_color_section", function (e) {
			var data = e.settings.data_to_send;

			var $section = Rexbuilder_Util_Editor.sectionEditingBackgroundObj;
			var $dataSection = $section.children(".section-data");
			var oldColor = $dataSection.attr("data-color_bg_section");
			var oldActive = $dataSection.attr("data-color_bg_section_active");

			var reverseData = {
				color: oldColor,
				active: oldActive
			}

			Rexbuilder_Dom_Util.updateSectionBackgroundColor($section, data);

			var actionData = {
				color: data.color,
				active: data.active
			}

			Rexbuilder_Util_Editor.pushAction($section, "updateSectionBackgroundColor", actionData, reverseData);
		});

		$(document).on("rexlive:change_section_overlay", function (e) {
			var data = e.settings.data_to_send;

			var $section = Rexbuilder_Util_Editor.sectionEditingBackgroundObj;
			var $dataSection = $section.children(".section-data");
			var oldColor = $dataSection.attr("data-row_overlay_color");
			var oldActive = $dataSection.attr("data-row_overlay_active");

			var reverseData = {
				color: oldColor,
				active: oldActive
			}

			Rexbuilder_Dom_Util.updateSectionOverlay($section, data);

			var actionData = {
				color: data.color,
				active: data.active
			}

			Rexbuilder_Util_Editor.pushAction($section, "updateSectionOverlay", actionData, reverseData);
		});

		$(document).on("rexlive:apply_background_image_section", function (e) {
			var data = e.settings.data_to_send;

			var $section = Rexbuilder_Util_Editor.sectionEditingBackgroundObj;
			var $sectionData = $section.children(".section-data");

			var idImage = typeof $sectionData.attr("data-id_image_bg_section") == "undefined" ? "" : $sectionData.attr("data-id_image_bg_section");
			var imageUrl = typeof $sectionData.attr("data-image_bg_section") == "undefined" ? "" : $sectionData.attr("data-image_bg_section");
			var width = typeof $section.attr("data-background_image_width") == "undefined" ? "" : $section.attr("data-background_image_width");
			var height = typeof $section.attr("data-background_image_height") == "undefined" ? "" : $section.attr("data-background_image_height");
			var activeImage = typeof $sectionData.attr("data-image_bg_section_active") != "undefined" ? $sectionData.attr("data-image_bg_section_active") : true;


			var reverseData = {
				active: activeImage,
				idImage: idImage,
				urlImage: imageUrl,
				width: width,
				height: height,
			}

			Rexbuilder_Dom_Util.updateImageBG($section, data);

			var actionData = {
				active: data.active,
				idImage: data.idImage,
				urlImage: data.urlImage,
				width: data.width,
				height: data.height
			}

			Rexbuilder_Util_Editor.pushAction($section, "updateSectionImageBG", actionData, reverseData);
		});

		$(document).on("rexlive:update_section_background_video", function (e) {
			var data = e.settings.data_to_send;
			console.log(data);

			var $section = Rexbuilder_Util_Editor.sectionEditingBackgroundObj;
			var $sectionData = $section.children(".section-data");

			var mp4Video = typeof $sectionData.attr('data-video_mp4_url') == "undefined" ? "" : $sectionData.attr('data-video_mp4_url');
			var youtubeVideo = typeof $sectionData.attr('data-video_bg_url_section') == "undefined" ? "" : $sectionData.attr('data-video_bg_url_section');
			var mp4VideoID = typeof $sectionData.attr('data-video_bg_id_section') == "undefined" ? "" : $sectionData.attr('data-video_bg_id_section');
			var vimeoUrl = typeof $sectionData.attr('data-video_bg_url_vimeo_section') == "undefined" ? "" : $sectionData.attr('data-video_bg_url_vimeo_section');

			var reverseData = {
				targetData: $sectionData,
				target: $section,
				idMp4: mp4VideoID,
				urlMp4: mp4Video,
				urlVimeo: vimeoUrl,
				urlYoutube: youtubeVideo,
				targetType: "section",
				hasAudio: false
			}

			var videoOptions = {
				targetData: $sectionData,
				target: $section,
				idMp4: data.videoMp4.idMp4,
				urlMp4: data.videoMp4.linkMp4,
				urlVimeo: data.urlVimeo,
				urlYoutube: data.urlYoutube,
				targetType: "section",
				hasAudio: false
			}

			Rexbuilder_Util.updateVideos(videoOptions);

			var actionData = {
				targetData: $sectionData,
				target: $section,
				idMp4: data.videoMp4.idMp4,
				urlMp4: data.videoMp4.linkMp4,
				urlVimeo: data.urlVimeo,
				urlYoutube: data.urlYoutube,
				targetType: "section",
				hasAudio: false
			}

			Rexbuilder_Util_Editor.pushAction($section, "updateSectionVideoBG", actionData, reverseData);
		});

		$(document).on("rexlive:apply_background_color_block", function (e) {
			var data = e.settings.data_to_send;

			var rex_block_id = data.blockRexID;
			var $elem = Rexbuilder_Util.$rexContainer.find("div [data-rexbuilder-block-id=\"" + rex_block_id + "\"]");
			var $elemData = $elem.children(".rexbuilder-block-data");
			var $section = $elem.parents(".rexpansive_section");
			var oldColor = $elemData.attr("data-color_bg_block");
			var oldActive = typeof $elemData.attr("data-color_bg_elem_active") != "undefined" ? $elemData.attr("data-color_bg_elem_active") : true;

			var reverseData = {
				blockRexID: rex_block_id,
				color: oldColor,
				active: oldActive
			}

			Rexbuilder_Dom_Util.updateBlockBackgroundColor(data);

			var actionData = {
				blockRexID: rex_block_id,
				color: data.color,
				active: data.active
			}

			Rexbuilder_Util_Editor.pushAction($section, "updateBlockBackgroundColor", actionData, reverseData);
		});

		$(document).on("rexlive:change_block_overlay", function (e) {
			var data = e.settings.data_to_send;

			var rex_block_id = data.blockRexID;
			var $elem = Rexbuilder_Util.$rexContainer.find("div [data-rexbuilder-block-id=\"" + rex_block_id + "\"]");
			var $elemData = $elem.children(".rexbuilder-block-data");
			var $section = $elem.parents(".rexpansive_section");
			var oldOverlayColor = typeof $elemData.attr("data-overlay_block_color") != "undefined" ? $elemData.attr("data-overlay_block_color") : "";
			var oldOverlayActive = typeof $elemData.attr("data-overlay_block_color_active") != "undefined" ? $elemData.attr("data-overlay_block_color_active") : false;

			var reverseData = {
				blockRexID: rex_block_id,
				color: oldOverlayColor,
				active: oldOverlayActive
			}

			Rexbuilder_Dom_Util.updateBlockOverlay(data);

			var actionData = {
				blockRexID: rex_block_id,
				color: data.color,
				active: data.active
			}

			Rexbuilder_Util_Editor.pushAction($section, "updateBlockOverlay", actionData, reverseData);
		});

		$(document).on("rexlive:apply_background_image_block", function (e) {
			var data = e.settings.data_to_send;
			console.log(data);
			return;

			var rex_block_id = data.blockRexID;
			var $elem = Rexbuilder_Util.$rexContainer.find("div [data-rexbuilder-block-id=\"" + rex_block_id + "\"]");
			var $itemContent = $elem.find(".grid-item-content");
			var $elemData = $elem.children(".rexbuilder-block-data");
			var $section = $elem.parents(".rexpansive_section");
			var galleryEditorInstance = Rexbuilder_Util.getGalleryInstance($section);

			var old_idImage = typeof $elemData.attr("data-id_image_bg_block") == "undefined" ? "" : $elemData.attr("data-id_image_bg_block");
			var old_imageUrl = typeof $elemData.attr("data-image_bg_block") == "undefined" ? "" : $elemData.attr("data-image_bg_block");
			var old_width = typeof $itemContent.attr("data-background_image_width") == "undefined" ? "" : $itemContent.attr("data-background_image_width");
			var old_height = typeof $itemContent.attr("data-background_image_height") == "undefined" ? "" : $itemContent.attr("data-background_image_height");
			var old_activeImage = typeof $elemData.attr("data-image_bg_elem_active") != "undefined" ? $elemData.attr("data-image_bg_elem_active") : true;
			
			var defaultTypeImage;
			if (old_activeImage.toString() == "true") {
				defaultTypeImage = $elem.parents(".grid-stack-row").attr("data-layout") == "fixed" ? "full" : "natural";
			} else {
				defaultTypeImage = "";
			}

			var old_typeBGimage = typeof $elemData.attr('data-type_bg_block') == "undefined" ? defaultTypeImage : $elemData.attr('data-type_bg_block');

			var reverseData = {
				$itemContent: $itemContent,
				imageOpt: {
					active: old_activeImage,
					idImage: old_idImage,
					urlImage: old_imageUrl,
					width: old_width,
					height: old_height,
					typeBGimage: old_typeBGimage
				}
			}

			var imageOpt = {
				active: data.active,
				idImage: data.idImage,
				urlImage: data.urlImage,
				width: data.width,
				height: data.height,
				typeBGimage: data.typeBGImage
			}

			Rexbuilder_Dom_Util.updateImageBG($itemContent, imageOpt);
			if (galleryEditorInstance.settings.galleryLayout == "masonry") {
				galleryEditorInstance.updateElementHeight($itemContent.parents(".grid-stack-item"));
			}

			var actionData = {
				$itemContent: $itemContent,
				imageOpt: imageOpt
			}

			Rexbuilder_Util_Editor.pushAction($section, "updateBlockImageBG", actionData, reverseData);
		});

		////////////////////////////////////////////////////////////////

		$(document).on('click', '.builder-section-config', function (e) {
			e.preventDefault();
			var $rexpansiveSection = $(e.target).parents('.rexpansive_section');
			var sectionID = $rexpansiveSection.attr("data-rexlive-section-id");
			var $gridElement = $rexpansiveSection.find(".grid-stack-row");
			$('#backresponsive-set-save').attr('data-section_id', sectionID);
			$('#backresponsive-set-reset').attr('data-section_id', sectionID);

			e.preventDefault();
			var $section = $(e.target).parents(".rexpansive_section");
			var s_id = $section.attr('data-rexlive-section-id');

			var activeLayout = $gridElement.attr("data-layout");
			var fullHeight = $gridElement.attr("data-full-height");
			var section_width = $gridElement.parent().css("max-width");
			var dimension = section_width === "100%" || section_width == "none" ? "full" : "boxed";
			var paddingsRow = {
				gutter: parseInt($gridElement.attr("data-separator")),
				top: parseInt($gridElement.attr("data-row-separator-top")),
				bottom: parseInt($gridElement.attr("data-row-separator-bottom")),
				right: parseInt($gridElement.attr("data-row-separator-right")),
				left: parseInt($gridElement.attr("data-row-separator-left"))
			}

			var marginsSection = {
				top: parseInt($rexpansiveSection.css("margin-top").split("px")[0]),
				right: parseInt($rexpansiveSection.css("margin-right").split("px")[0]),
				bottom: parseInt($rexpansiveSection.css("margin-bottom").split("px")[0]),
				left: parseInt($rexpansiveSection.css("margin-left").split("px")[0])
			}

			var photoswipe = true;

			//i blocchi che possono avere photoswipe
			var imageBloks = [];

			$gridElement.children(".grid-stack-item:not(.removing_block)").each(function (i, el) {
				var $el = $(el);
				var $elData = $el.children(".rexbuilder-block-data");
				var textWrapLength = Rexbuilder_Util_Editor.getTextWrapLength($el);
				if ($elData.attr("data-image_bg_block") != "" && $elData.attr("data-image_bg_block") != "" && textWrapLength == 0) {
					imageBloks.push($elData);
				}
			});

			if (imageBloks.length > 0) {
				for (var i = 0; i < imageBloks.length; i++) {
					if ((imageBloks[i].attr("data-photoswipe").toString() != "true")) {
						photoswipe = false;
					}
				}
			} else {
				photoswipe = false;
			}

			var nameSection = $section.attr("data-rexlive-section-name");
			var customClasses = $section.children(".section-data").attr("data-custom_classes");
			var data = {
				eventName: "rexlive:openSectionModal",
				section_options_active: {
					activeLayout: activeLayout,
					fullHeight: fullHeight,

					section_width: section_width,
					dimension: dimension,

					rowDistances: paddingsRow,

					marginsSection: marginsSection,
					photoswipe: photoswipe,

					sectionName: nameSection,
					customClasses: customClasses
				}
			};

			Rexbuilder_Util_Editor.sectionChangingOptionsRexID = s_id;
			Rexbuilder_Util_Editor.sectionChangingOptionsObj = $section;

			Rexbuilder_Util_Editor.sendParentIframeMessage(data);
		});

		// Launch to the iframe parent the event to open the Media Uploader
		$(document).on("click", ".add-new-block-image", function (e) {
			e.preventDefault();
			var $section = $(e.target).parents(".rexpansive_section");
			var rex_section_id = $section.attr('data-rexlive-section-id');
			var data = {
				eventName: "rexlive:openMediaUploader",
			};

			Rexbuilder_Util_Editor.sectionAddingElementRexID = rex_section_id;
			Rexbuilder_Util_Editor.sectionAddingElementObj = $section;

			Rexbuilder_Util_Editor.sendParentIframeMessage(data);
		});

		// Launch to the iframe parent the event to open the CSS editor
		$(document).on("click", "#rex-open-ace-css-editor", function (e) {
			e.preventDefault();
			var currentStyle = $("#rexpansive-builder-style-inline-css").text().replace(/^\s+|\s+$/g, '');
			var data = {
				eventName: "rexlive:openCssEditor",
				currentStyle: currentStyle
			};

			Rexbuilder_Util_Editor.sendParentIframeMessage(data);
		});

		// Launch to the iframe parent the event to open the add video modal
		$(document).on("click", ".add-new-block-video", function (e) {
			e.preventDefault();
			var $section = $(e.target).parents(".rexpansive_section");
			var rex_section_id = $section.attr('data-rexlive-section-id');
			var data = {
				eventName: "rexlive:addNewBlockVideo",
			};

			Rexbuilder_Util_Editor.sectionAddingElementRexID = rex_section_id;
			Rexbuilder_Util_Editor.sectionAddingElementObj = $section;

			Rexbuilder_Util_Editor.sendParentIframeMessage(data);
		});

		$(document).on("click", ".add-new-block-slider", function (e) {
			e.preventDefault();
			var $section = $(e.target).parents(".rexpansive_section");
			var rex_section_id = $section.attr('data-rexlive-section-id');
			var data = {
				eventName: "rexlive:addNewSlider",
			};

			Rexbuilder_Util_Editor.sectionAddingElementRexID = rex_section_id;
			Rexbuilder_Util_Editor.sectionAddingElementObj = $section;

			Rexbuilder_Util_Editor.sendParentIframeMessage(data);
		});

		$(document).on('click', '.edit-background-section', function (e) {
			e.preventDefault();
			var $section = $(e.target).parents(".rexpansive_section");
			var rex_section_id = $section.attr('data-rexlive-section-id');
			var $sectionData = $section.children(".section-data");

			var color = $sectionData.attr("data-color_bg_section");
			var colorActive = typeof $sectionData.attr("data-color_bg_section_active") != "undefined" ? $sectionData.attr("data-color_bg_section_active") : true;
			var overlayColor = typeof $sectionData.attr("data-row_overlay_color") != "undefined" ? $sectionData.attr("data-row_overlay_color") : "";
			var overlayActive = typeof $sectionData.attr("data-row_overlay_active") != "undefined" ? $sectionData.attr("data-row_overlay_active") : false;

			var idImage = typeof $sectionData.attr("data-id_image_bg_section") == "undefined" ? "" : $sectionData.attr("data-id_image_bg_section");
			var imageUrl = typeof $sectionData.attr("data-image_bg_section") == "undefined" ? "" : $sectionData.attr("data-image_bg_section");
			var width = typeof $section.attr("data-background_image_width") == "undefined" ? "" : $section.attr("data-background_image_width");
			var height = typeof $section.attr("data-background_image_height") == "undefined" ? "" : $section.attr("data-background_image_height");
			var activeImage = typeof $sectionData.attr("data-image_bg_section_active") != "undefined" ? $sectionData.attr("data-image_bg_section_active") : true;

			var mp4Video = typeof $sectionData.attr('data-video_mp4_url') == "undefined" ? "" : $sectionData.attr('data-video_mp4_url');
			var youtubeVideo = typeof $sectionData.attr('data-video_bg_url_section') == "undefined" ? "" : $sectionData.attr('data-video_bg_url_section');
			var mp4VideoID = typeof $sectionData.attr('data-video_bg_id_section') == "undefined" ? "" : $sectionData.attr('data-video_bg_id_section');
			var vimeoUrl = typeof $sectionData.attr('data-video_bg_url_vimeo_section') == "undefined" ? "" : $sectionData.attr('data-video_bg_url_vimeo_section');

			var currentBackgroundData = {
				bgColor: {
					color: color,
					active: colorActive
				},
				imageBG: {
					idImage: idImage,
					imageUrl: imageUrl,
					width: width,
					height: height,
					active: activeImage
				},
				bgVideo: {
					youtubeVideo: youtubeVideo,
					vimeoUrl: vimeoUrl,
					mp4Video: mp4Video,
					mp4VideoID: mp4VideoID
				},
				overlay: {
					color: overlayColor,
					active: overlayActive
				}
			}

			var data = {
				eventName: "rexlive:editBackgroundSection",
				activeBG: currentBackgroundData
			};

			Rexbuilder_Util_Editor.sectionEditingBackgroundID = rex_section_id;
			Rexbuilder_Util_Editor.sectionEditingBackgroundObj = $section;

			Rexbuilder_Util_Editor.sendParentIframeMessage(data);
		});

		$(document).on('click', '.builder-edit-block', function (e) {
			e.preventDefault();

			var $elem = $(e.target).parents(".grid-stack-item");
			var rex_block_id = $elem.attr('data-rexbuilder-block-id');
			var $elemData = $elem.children(".rexbuilder-block-data");
			var $itemContent = $elem.find(".grid-item-content");

			var color = $elemData.attr("data-color_bg_block");
			var colorActive = typeof $elemData.attr("data-color_bg_elem_active") != "undefined" ? $elemData.attr("data-color_bg_elem_active") : true;
			var overlayColor = typeof $elemData.attr("data-overlay_block_color") != "undefined" ? $elemData.attr("data-overlay_block_color") : "";
			var overlayActive = typeof $elemData.attr("data-overlay_block_color_active") != "undefined" ? $elemData.attr("data-overlay_block_color_active") : false;

			var idImage = typeof $elemData.attr("data-id_image_bg_block") == "undefined" ? "" : $elemData.attr("data-id_image_bg_block");
			var imageUrl = typeof $elemData.attr("data-image_bg_block") == "undefined" ? "" : $elemData.attr("data-image_bg_block");
			var width = typeof $itemContent.attr("data-background_image_width") == "undefined" ? "" : $itemContent.attr("data-background_image_width");
			var height = typeof $itemContent.attr("data-background_image_height") == "undefined" ? "" : $itemContent.attr("data-background_image_height");
			var activeImage = typeof $elemData.attr("data-image_bg_elem_active") != "undefined" ? $elemData.attr("data-image_bg_elem_active") : true;
			var defaultTypeImage = $elem.parents(".grid-stack-row").attr("data-layout") == "fixed" ? "full" : "natural";
			var typeBGimage = typeof $elemData.attr('data-type_bg_block') == "undefined" ? defaultTypeImage : $elemData.attr('data-type_bg_block');

			var mp4Video = typeof $elemData.attr('data-video_mp4_url') == "undefined" ? "" : $elemData.attr('data-video_mp4_url');
			var youtubeVideo = typeof $elemData.attr('data-video_bg_url_elem') == "undefined" ? "" : $elemData.attr('data-video_bg_url_elem');
			var mp4VideoID = typeof $elemData.attr('data-video_bg_id_elem') == "undefined" ? "" : $elemData.attr('data-video_bg_id_elem');
			var vimeoUrl = typeof $elemData.attr('data-video_bg_url_vimeo_elem') == "undefined" ? "" : $elemData.attr('data-video_bg_url_vimeo_elem');

			var currentBlockData = {
				bgColor: {
					color: color,
					active: colorActive,
					rexID: rex_block_id
				},
				imageBG: {
					idImage: idImage,
					imageUrl: imageUrl,
					width: width,
					height: height,
					typeBGimage: typeBGimage,
					active: activeImage,
					defaultTypeImage: defaultTypeImage,
					photoswipe: false,
					activePhotoswipe: false,
				},
				bgVideo: {
					youtubeVideo: youtubeVideo,
					vimeoUrl: vimeoUrl,
					mp4Video: mp4Video,
					mp4VideoID: mp4VideoID
				},
				overlay: {
					color: overlayColor,
					active: overlayActive,
					rexID: rex_block_id
				}
			};

			var data = {
				eventName: "rexlive:editBlockOptions",
				activeBlockData: currentBlockData
			};



			Rexbuilder_Util_Editor.sendParentIframeMessage(data);
			return;
		});
	}); // End of the DOM ready

})(jQuery);