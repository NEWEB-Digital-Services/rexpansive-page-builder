;
(function ($) {
	'use strict';

	$(function () {

		var $lean_overlay = $('.lean-overlay');

		// Prepare the variables that holds the Frame Uploaders
		var image_uploader_frame, image_block_edit_frame, navigator_media_frame, video_uploader_frame, video_block_edit_frame, textfill_image_upload_frame;
		/**
		 * Open a modal dialog box
		 * 
		 * @param {jQuery Object} $target modal to open
		 * 
		 * @param {boolean}
		 *            target_only active only the modal not the overlay
		 * @param {Array}
		 *            additional_class Array of additional classes
		 */
		var OpenModal = function ($target, target_only, additional_class) {
			target_only = typeof target_only !== 'undefined' ? target_only
				: false;
			additional_class = typeof additional_class !== 'undefined' ? additional_class
				: [];

			if (!target_only) {
				$('body').addClass('rex-modal-open');
				$lean_overlay.show();
			} else {
				$target.addClass('rex-in--up');
			}
			$target.addClass('rex-in').show();

			if (additional_class.length) {
				for (var i = 0; i < additional_class.length; i++) {
					$target.find('.rex-modal').addClass(additional_class[i]);
				}
			}

			resetModalDimensions($target.find('.rex-modal'));
		};

		/**
		 * Close a modal dialog box
		 * 
		 * @param {jQuery Object} $target modal to close
		 */
		var CloseModal = function ($target, target_only, additional_class) {
			target_only = typeof target_only !== 'undefined' ? target_only
				: false;
			additional_class = typeof additional_class !== 'undefined' ? additional_class
				: [];

			if (!target_only && !$target.hasClass('rex-in--up')) {
				$('body').removeClass('rex-modal-open');
				$lean_overlay.hide();
			}
			$target.removeClass('rex-in').hide();
			if ($target.hasClass('rex-in--up')) {
				$target.removeClass('rex-in--up');
			}

			if (additional_class.length) {
				for (var i = 0; i < additional_class.length; i++) {
					$target.find('.rex-modal').removeClass(additional_class[i]);
				}
			}

			resetModalDimensions($target.find('.rex-modal'));
		};

		/**
		 * reset a modal height to prevent dynamic content bugs
		 * 
		 * @param {jQuery Object} $target
		 */
		var resetModalDimensions = function ($target) {
			$target.css('height', 'auto');
			$target.css('width', 'auto');
		};

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

		$(document).on("rexlive:change_section_custom_classes", function (e) {
			var data = e.settings.data_to_send;
			console.log(data);

			var $section = Rexbuilder_Util_Editor.sectionChangingOptionsObj;

			var reverseData = {
				classes: oldClasses
			}

			Rexbuilder_Dom_Util.updateSectionCustomClasses(data.newClasses);

			//actionData: STATO DOPO
			var actionData = {
				classes: data.newClasses
			}

			//Rexbuilder_Util_Editor.pushAction($section, "updateSectionCustomClasses", actionData, reverseData);
		});

		// ----------------------------------
		/*
		* function uploadBlockBackground($wrap) { if( image_block_edit_frame ) {
			* image_block_edit_frame.open(); return; }
			* 
	 * //create a new Library, base on defaults //you can put your
	 * attributes in var editImage = wp.media.controller.Library.extend({
	 * defaults : _.defaults({ id: 'upload-block-bg', title: 'Upload
	 * Background', allowLocalEdits: true, displaySettings: true,
	 * displayUserSettings: true, multiple : false, library: wp.media.query( {
	 * type: 'image' } ), type : 'image',//audio, video, application/pdf,
	 * ... etc }, wp.media.controller.Library.prototype.defaults ) });
	 * 
	 * //Setup media frame image_block_edit_frame = wp.media({ button : {
	 * text : 'Select' }, state : 'upload-block-bg', states : [ new
	 * editImage() ] });
	 * 
	 * //on close, if there is no select files, remove all the files already
	 * selected in your main frame
	 * image_block_edit_frame.on('close',function() { var selection =
	 * image_block_edit_frame.state('upload-block-bg').get('selection');
	 * if(!selection.length){ } });
	 * 
	 * 
	 * image_block_edit_frame.on( 'select', function() { var state =
	 * image_block_edit_frame.state('upload-block-bg'); var selection =
	 * state.get('selection'); var imageArray = [];
	 * 
	 * if ( ! selection ) return;
	 * 
	 * //to get right side attachment UI info, such as: size and alignments
	 * //org code from /wp-includes/js/media-editor.js, arround `line 603 --
	 * send: { ... attachment: function( props, attachment ) { ... `
	 * selection.each(function(attachment) { var display = state.display(
	 * attachment ).toJSON(); var obj_attachment = attachment.toJSON() var
	 * caption = obj_attachment.caption, options, html;
	 *  // If captions are disabled, clear the caption. if ( !
	 * wp.media.view.settings.captions ) delete obj_attachment.caption;
	 * 
	 * display = wp.media.string.props( display, obj_attachment );
	 * 
	 * options = { id: obj_attachment.id, post_content:
	 * obj_attachment.description, post_excerpt: caption };
	 * 
	 * if ( display.linkUrl ) options.url = display.linkUrl;
	 * 
	 * if ( 'image' === obj_attachment.type ) { } else if ( 'video' ===
	 * obj_attachment.type ) { html = wp.media.string.video( display,
	 * obj_attachment ); } else if ( 'audio' === obj_attachment.type ) {
	 * html = wp.media.string.audio( display, obj_attachment ); } else {
	 * html = wp.media.string.link( display ); options.post_title =
	 * display.title; }
	 * 
	 * //attach info to attachment.attributes object
	 * attachment.attributes['nonce'] =
	 * wp.media.view.settings.nonce.sendToEditor;
	 * attachment.attributes['attachment'] = options;
	 * attachment.attributes['html'] = html;
	 * attachment.attributes['post_id'] = wp.media.view.settings.post.id;
	 * 
	 * $wrap.val(obj_attachment.id);
	 * background_modal_properties.$image_url.val(obj_attachment.url);
	 * background_modal_properties.$image_id.val(obj_attachment.id);
	 * background_modal_properties.$image_size.val(display.size);
	 * background_modal_properties.$image_preview.css('background-image',
	 * 'url(' + obj_attachment.url + ')');
	 * background_modal_properties.$image_preview_icon.hide();
	 * background_modal_properties.$type_image.prop('checked', true); });
	 * });
	 * 
	 * //reset selection in popup, when open the popup
	 * image_block_edit_frame.on('open',function() { var attachment; var
	 * selection =
	 * image_block_edit_frame.state('upload-block-bg').get('selection');
	 * 
	 * //remove all the selection first selection.each(function(image) {
	 * attachment = wp.media.attachment( image.attributes.id );
	 * attachment.fetch(); selection.remove( attachment ? [ attachment ] : [] );
	 * });
	 *  // Check the already inserted image if(
	 * background_modal_properties.$image_id.val() ) { attachment =
	 * wp.media.attachment( background_modal_properties.$image_id.val() );
	 * attachment.fetch(); selection.add( attachment ? [ attachment ] : [] ); }
	 * });
	 * 
	 * //now open the popup image_block_edit_frame.open(); } //
	 * uploadBlockBackground END
	 * 
	 * 
	 * $('#modal-setting-button').on('click', '#background_up_img',
	 * function(event){ //c -> click del mouse console.log("ciao");
	 * event.preventDefault(); uploadBlockBackground($(this)); });
	 */
		/* ------------- CSS page editor --------------- */
		var ace_css_editor_modal_properties = {
			$open_button: $('#rex-open-ace-css-editor'),
			$modal: $('#rex-css-editor'),
			$modal_wrap: null,
			$save_button: $('#css-editor-save'),
			$cancel_button: $('#css-editor-cancel'),
		};

		ace_css_editor_modal_properties.$modal_wrap = ace_css_editor_modal_properties.$modal.parent('.rex-modal-wrap');
		var $custom_css_content = $('textarea[id=_rexbuilder_custom_css]');
		var $styleElement = $("#rexpansive-builder-style-inline-css");
		var editor = ace.edit('rex-css-ace-editor');

		//var CSSMode = ace.require("ace/mode/css").Mode;
		//editor.session.setMode(new CSSMode());
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/css");

		ace_css_editor_modal_properties.$open_button.on('click', function (e) {
			e.preventDefault();
			if ($custom_css_content.text() !== '') {
				editor.setValue($custom_css_content.text());
				editor.clearSelection();
			}
			OpenModal(ace_css_editor_modal_properties.$modal_wrap);
		});

		ace_css_editor_modal_properties.$save_button.on('click', function (e) {
			e.preventDefault();
			$custom_css_content.text(editor.getValue());
			$styleElement.text($custom_css_content.text());
			CloseModal(ace_css_editor_modal_properties.$modal_wrap);
		});

		ace_css_editor_modal_properties.$cancel_button.on('click', function (e) {
			e.preventDefault();
			CloseModal(ace_css_editor_modal_properties.$modal_wrap);
		});

		// attach a click event (or whatever you want) to some element on your
		// page
		/* 		$('#modal-setting-button').on('click', '#background_up_img', function (event) {
					event.preventDefault();
		
					// if the file_frame has already been created, just reuse it
					if (file_frame) {
						file_frame.open();
						return;
					}
		
					file_frame = wp.media.frames.file_frame = wp.media({
						
						 title: $( this ).data( 'uploader_title' ), button: {
						 text: $( this ).data( 'uploader_button_text' ), },
						 multiple: false // set this to true for multiple file
						 selection
					});
		
					file_frame.on('select', function () {
						attachment = file_frame.state().get('selection')
							.first().toJSON();
		
						// do something with the file here
						$('#frontend-button').hide();
						$('#frontend-image').attr('src', attachment.url);
					});
		
					file_frame.open();
				}); */
		// ------------------------------------------

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

					sectionName: nameSection
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
			console.log("add sliderds");
			var $section = $(e.target).parents(".rexpansive_section");
			var rex_section_id = $section.attr('data-rexlive-section-id');
			var data = {
				eventName: "rexlive:addNewSlider",
			};

			Rexbuilder_Util_Editor.sectionAddingElementRexID = rex_section_id;
			Rexbuilder_Util_Editor.sectionAddingElementObj = $section;

			Rexbuilder_Util_Editor.sendParentIframeMessage(data);
		});

		$(document).on('click', '.builder-change-background', function (e) {
			console.log("opzioni blocco");
			e.preventDefault();
			return;
		});
	}); // End of the DOM ready

})(jQuery);