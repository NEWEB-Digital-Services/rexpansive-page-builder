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
			var timestamp = new Date();
			console.log(timestamp);
			// $('#_rexbuilder').val(Date.UTC(timestamp.getFullYear(),timestamp.getMonth(),timestamp.getDate()));
		};

		$(document).on("rexlive:set_gallery_layout", function (e) {
			var data = e.settings.data_to_send;

			var sectionID = Rexbuilder_Util_Editor.sectionAddingElementRexID;
			var $section = Rexbuilder_Util_Editor.sectionAddingElementObj;
			var $gallery = $section.find(".grid-stack-row");
			var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);

			//reverseData: STATO PRIMA
			var oldDisposition = galleryInstance.createActionDataMoveBlocksGrid();
			console.log("data received");
			console.log(data); 
			
			var reverseData = {
				gutter: $gallery.attr("data-separator"),
				row_separator_top: $gallery.attr("data-row-separator-top"),
				row_separator_bottom: $gallery.attr("data-row-separator-bottom"),
				row_separator_right: $gallery.attr("data-row-separator-right"),
				row_separator_left: $gallery.attr("data-row-separator-left"),
				fullHeight: $gallery.attr("data-full-height"),
				layout: $gallery.attr("data-layout"),
				section_width: $gallery.parent().css("max-width"),
				dimension: $gallery.parent().hasClass("full-disposition") ? "full" : "boxed",
				collapse_grid: $section.attr("data-rex-collapse-grid"),
				blocksDisposition: $.extend(true, {}, oldDisposition)
			}

			setBuilderTimeStamp();

			//DA CAPIRE DOVE ANDARE PER AGGIORNARE LE INFORMAZIONI NEL DOM, PER ORA FACCIAMOLO QUA
			$gallery.attr("data-layout", data.newLayout);
			$gallery.attr("data-full-height", data.fullHeight);

			var newDisposition = galleryInstance.updateGridSettingsModalUndoRedo({
				'layout': data.newLayout,
				'fullHeight': data.fullHeight
			});

			//actionData: STATO DOPO
			var actionData = {
				gutter: $gallery.attr("data-separator"),
				row_separator_top: $gallery.attr("data-row-separator-top"),
				row_separator_bottom: $gallery.attr("data-row-separator-bottom"),
				row_separator_right: $gallery.attr("data-row-separator-right"),
				row_separator_left: $gallery.attr("data-row-separator-left"),
				fullHeight: data.fullHeight,
				layout: data.newLayout,
				section_width: $gallery.parent().css("max-width"),
				dimension: $gallery.parent().hasClass("full-disposition") ? "full" : "boxed",
				collapse_grid: $section.attr("data-rex-collapse-grid"),
				blocksDisposition: $.extend(true, {}, newDisposition)
			}

			Rexbuilder_Util_Editor.pushAction($section, "updateSection", actionData, reverseData);
			Rexbuilder_Util_Editor.sectionAddingElementRexID = null;
			Rexbuilder_Util_Editor.sectionAddingElementObj = null;
		});


		/*
		 * var section_id = $(this).attr('data-section_id'), color =
		 * $('.backresponsive-color-section').spectrum('get'), opacity =
		 * $('.backresponsive-opacity-section').val(), gutter =
		 * $('.section-set-block-gutter').val(), custom_classes =
		 * $('#section-set-custom-class').val(), section_width = '',
		 * section_is_full_width = ( true ===
		 * section_config_modal_properties.$section_full.prop('checked') ?
		 * 'true' : 'false' ), section_is_boxed_width = ( true ===
		 * section_config_modal_properties.$section_boxed.prop('checked') ?
		 * 'true' : 'false' ), isFull = ( true ===
		 * section_config_modal_properties.$is_full.prop('checked') ? 'true' : '' ),
		 * holdGrid = ( true ===
		 * section_config_modal_properties.$hold_grid.prop('checked') ? 'true' :
		 * 'false' ), //has_small_overlay = ( true ===
		 * section_config_modal_properties.$has_overlay_small.prop('checked') ?
		 * 'true' : '' ), //has_medium_overlay = ( true ===
		 * section_config_modal_properties.$has_overlay_medium.prop('checked') ?
		 * 'true' : '' ), //has_large_overlay = ( true ===
		 * section_config_modal_properties.$has_overlay_large.prop('checked') ?
		 * 'true' : '' ), section_custom_name =
		 * section_config_modal_properties.$section_id.val();
		 * 
		 * var layout =
		 * section_config_modal_properties.$section_layout_type.filter(':checked').val();
		 * 
		 * var $row = $('.builder-row[data-count=' + section_id + ']');
		 * $row.attr( 'data-layout', layout );
		 * 
		 * var section_saved_settings = $row.attr( 'data-backresponsive' ),
		 * section_saved_custom_classes = '';
		 * 
		 * if(typeof section_saved_settings != 'undefined' &&
		 * section_saved_settings !== '') { section_saved_settings =
		 * JSON.parse(section_saved_settings); section_saved_custom_classes =
		 * section_saved_settings.custom_classes; }
		 * 
		 *  // Handle main builder view checkboxes var section_width_type =
		 * $row.find('.builder-edit-row-wrap
		 * input[type="radio"][name^="section-dimension-"]'); var
		 * section_width_type_full =
		 * section_width_type.filter('[id^=section-full]'); var
		 * section_width_type_boxed =
		 * section_width_type.filter('[id^=section-boxed]');
		 *  // Setting custom name section $row.attr( 'data-sectionid',
		 * section_custom_name);
		 *  // Setting section layout type // switch(layout) { // case
		 * 'masonry': //This means that the user is changing the section view
		 * from fixed TO masonry // $row.find('.builder-elements
		 * li.item:not(.expand)').each(function() { // var $this = $(this); //
		 * var bg_settings = $this.data('bg_settings'); // if(typeof bg_settings !=
		 * 'undefined' && '' != bg_settings.bg_img_type && 'full' ==
		 * bg_settings.bg_img_type ) { // bg_settings.bg_img_type = 'natural'; //
		 * $this.attr('data-bg_settings', JSON.stringify(bg_settings)); //
		 * $this.trigger('blockChangeImage'); // } // }); // break; // case
		 * 'fixed': //This means that the user is changing the section view from
		 * masonry TO fixed // $row.find('.builder-elements
		 * li.item:not(.expand)').each(function() { // var $this = $(this); //
		 * var bg_settings = $this.data('bg_settings'); // if(typeof bg_settings !=
		 * 'undefined' && '' != bg_settings.bg_img_type && 'natural' ==
		 * bg_settings.bg_img_type ) { // bg_settings.bg_img_type = 'full'; //
		 * $this.attr('data-bg_settings', JSON.stringify(bg_settings)); //
		 * $this.trigger('blockChangeImage'); // } // }); // break; // default: //
		 * break; // }
		 *  // Setting section overlay /*var section_has_overlay = false;
		 * 
		 * if( 'true' == has_small_overlay ) { custom_classes += '
		 * active-small-overlay'; section_has_overlay = true; }
		 * 
		 * if( 'true' == has_medium_overlay ) { custom_classes += '
		 * active-medium-overlay'; section_has_overlay = true; }
		 * 
		 * if( 'true' == has_large_overlay ) { custom_classes += '
		 * active-large-overlay'; section_has_overlay = true; }//
		 *  // Row Margin
		 *  // if( '-1' !=
		 * section_config_modal_properties.$row_separator_top.val().search(/\D/g) || '' ==
		 * section_config_modal_properties.$row_separator_top.val() ) {
		 * $row.attr( 'data-row-separator-top',
		 * section_config_modal_properties.$row_separator_top.val() ); // }
		 *  // if( '-1' !=
		 * section_config_modal_properties.$row_separator_right.val().search(/\D/g) || '' ==
		 * section_config_modal_properties.$row_separator_right.val() ) {
		 * $row.attr( 'data-row-separator-right',
		 * section_config_modal_properties.$row_separator_right.val() ); // }
		 *  // if( '-1' !=
		 * section_config_modal_properties.$row_separator_bottom.val().search(/\D/g) || '' ==
		 * section_config_modal_properties.$row_separator_bottom.val() ) {
		 * $row.attr( 'data-row-separator-bottom',
		 * section_config_modal_properties.$row_separator_bottom.val() ); // }
		 *  // if( '-1' !=
		 * section_config_modal_properties.$row_separator_left.val().search(/\D/g) || '' ==
		 * section_config_modal_properties.$row_separator_left.val() ) {
		 * $row.attr( 'data-row-separator-left',
		 * section_config_modal_properties.$row_separator_left.val() ); // }
		 *  // Section Photoswipe if(
		 * section_config_modal_properties.section_photoswipe_changed ) { if(
		 * section_config_modal_properties.$section_active_photoswipe.prop('checked') ) { //
		 * Here goes auto block-photoswipe logic
		 * $row.attr('data-section-active-photoswipe', '1');
		 * set_blocks_on_row_property($row, 'photoswipe', 'true') } else {
		 * $row.attr('data-section-active-photoswipe', '0');
		 * set_blocks_on_row_property($row, 'photoswipe', ''); } }
		 *  // Overlay var overlay_infos =
		 * section_saved_custom_classes.match(/active-(large|medium|small)-overlay/g);
		 * if(overlay_infos) { overlay_infos = overlay_infos.join(' '); } else {
		 * overlay_infos = ''; }
		 *  // Hold Grid var holded_info = ''; if( 'true' == holdGrid ) {
		 * holded_info = 'rex-block-grid'; }
		 *  // Section dimension if( 'true' == section_is_full_width ) {
		 * section_width_type_full.prop('checked', true);
		 * section_width_type_boxed.prop('checked', false);
		 * $row.attr('data-griddimension', 'full'); } else if( 'true' ==
		 * section_is_boxed_width ) { section_width_type_full.prop('checked',
		 * false); section_width_type_boxed.prop('checked', true);
		 * $row.attr('data-griddimension', 'boxed'); }
		 * 
		 * section_width =
		 * section_config_modal_properties.$section_boxed_width.val();
		 * 
		 * var width_type = $('.section-width-type:checked').val();
		 * switch(width_type) { case 'percentage': if('100' == section_width) {
		 * section_width = ''; } section_width = section_width + '%'; break;
		 * case 'pixel': section_width = section_width + 'px'; break; default:
		 * break; }
		 * 
		 * var clean_custom_classes = custom_classes.trim() + ' ' +
		 * overlay_infos.trim() + ' ' + holded_info;
		 * 
		 * //console.log(clean_custom_classes);
		 * 
		 * var config_settings = { gutter : gutter, isFull : isFull,
		 * custom_classes : clean_custom_classes.trim(), section_width :
		 * section_width, };
		 * 
		 * $row.attr( 'data-backresponsive', JSON.stringify(config_settings) );
		 * 
		 * setBuilderTimeStamp();
		 * 
		 * CloseModal(
		 * $('#modal-background-responsive-set').parent('.rex-modal-wrap') );
		 * });
		 */
		$(document).on(
			'click',
			'#section-fixed',
			function (e) {
				$('#bg-set-full-section').parent().removeClass(
					'hide-full-height-option');
			}
		);

		$(document).on(
			'click',
			'#section-masonry',
			function (e) {
				$('#bg-set-full-section').parent().addClass(
					'hide-full-height-option');
			}
		);

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
			$('#backresponsive-set-save').attr('data-section_id', sectionID);
			$('#backresponsive-set-reset').attr('data-section_id', sectionID);

			e.preventDefault();
			var $section = $(e.target).parents(".rexpansive_section");
			var s_id = $section.attr('data-rexlive-section-id');

			var data = {
				eventName: "rexlive:openSectionModal",
			};

			Rexbuilder_Util_Editor.sectionAddingElementRexID = s_id;
			Rexbuilder_Util_Editor.sectionAddingElementObj = $section;

			Rexbuilder_Util_Editor.sendParentIframeMessage(data);
		});

		// Launch to the iframe parent the event to open the Media Uploader
		$(document).on("click", ".add-new-block-image", function (e) {
			e.preventDefault();
			var $section = $(e.target).parents(".rexpansive_section");
			var s_id = $section.attr('data-rexlive-section-id');
			var data = {
				eventName: "rexlive:openMediaUploader",
			};

			Rexbuilder_Util_Editor.sectionAddingElementRexID = s_id;
			Rexbuilder_Util_Editor.sectionAddingElementObj = $section;

			Rexbuilder_Util_Editor.sendParentIframeMessage(data);
		});

		// Launch to the iframe parent the event to open the add video modal
		$(document).on("click", ".add-new-block-video", function (e) {
			e.preventDefault();
			var $section = $(e.target).parents(".rexpansive_section");
			var s_id = $section.attr('data-rexlive-section-id');
			var data = {
				eventName: "rexlive:addNewBlockVideo",
			};

			Rexbuilder_Util_Editor.sectionAddingElementRexID = s_id;
			Rexbuilder_Util_Editor.sectionAddingElementObj = $section;

			Rexbuilder_Util_Editor.sendParentIframeMessage(data);
		});

		$(document).on("click", ".add-new-block-slider", function (e) {
			e.preventDefault();
			console.log("add sliderds"); 
			var $section = $(e.target).parents(".rexpansive_section");
			var s_id = $section.attr('data-rexlive-section-id');
			var data = {
				eventName: "rexlive:addNewSlider",
			};

			Rexbuilder_Util_Editor.sectionAddingElementRexID = s_id;
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