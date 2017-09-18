/*!
 * Rexpansive builder
 * 
 */
;(function( $ ) {
	'use strict';

	$(function() {
		// Prepare the variables that holds the html templates
		var element_actions = $('#rexbuilder-tmpl-element-actions').html().trim(),
			section_template = $('#rexbuilder-tmpl-section').html(),
			empty_template = $('#rexbuilder-tmpl-empty-element').html(),
			text_template = $('#rexbuilder-tmpl-text-element').html().trim(),
			image_template = $('#rexbuilder-tmpl-image-element').html().trim();

		// Prepare the variables that holds the html template for the notices
		var notice_video_template = $('#rexbuilder-tmpl-notice-video').html().trim();

		var counter = 0,
			collect = [],	// Define an array for collect all of the sections
			$text_editor = $('#rexeditor-modal'),
			$expand_editor = $('#rexeditor-expand-modal'),
			$builderArea = $('#builder-area'),
			$page_template = $('#page_template');

		var real_area = $('#rexbuilder').parent('.meta-box-sortables').width();	// Better start area for calculate the builder dimensions

		var grid_settings = {
			'grid_area_width': real_area - 46,	// Width of a '.gridster ul'
			'grid_columns': 12,									// Number of max columns
			'widget_margins': 8,								// Margins of the blocks
			'widget_dimension': null							// Block base dimension
		};
		grid_settings.widget_dimension = Math.round( ( 
					grid_settings.grid_area_width - (
						grid_settings.widget_margins * ( grid_settings.grid_columns * 2 ) ) ) / grid_settings.grid_columns );

		// Prepare the variables that holds the Frame Uploaders
		var image_uploader_frame,
			image_block_edit_frame,
			navigator_media_frame,
			video_uploader_frame,
			video_block_edit_frame;

		// Prepare a global reference for update correctly new image blocks
		var global_section_reference;

		var $lean_overlay = $('.lean-overlay');

		/* ------------- CSS page editor --------------- */
		var ace_css_editor_modal_properties = {
			$open_button: $('#rex-open-ace-css-editor'),
			$modal: $('#rex-css-editor'),
			$save_button: $('#css-editor-save'),
			$cancel_button: $('#css-editor-cancel'),
		};

		var $custom_css_content = $('textarea[id=_rexbuilder_custom_css]');	

		var editor = ace.edit('rex-css-ace-editor');
		//var CSSMode = ace.require("ace/mode/css").Mode;
		//editor.session.setMode(new CSSMode());
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/css");

		ace_css_editor_modal_properties.$open_button.on('click', function(e) {
			e.preventDefault();
			if($custom_css_content.text() !== '') {
				editor.setValue($custom_css_content.text());
				editor.clearSelection();
			}
			ace_css_editor_modal_properties.$modal.show();
			$lean_overlay.show();
		});

		ace_css_editor_modal_properties.$save_button.on('click', function(e) {
			e.preventDefault();
			$custom_css_content.text(editor.getValue());
			ace_css_editor_modal_properties.$modal.hide();
			$lean_overlay.hide();
		});

		ace_css_editor_modal_properties.$cancel_button.on('click', function(e) {
			e.preventDefault();
			ace_css_editor_modal_properties.$modal.hide();
			$lean_overlay.hide();
		});

		// Static object for block padding edit
		var block_content_padding_properties = {
			$trigger: $('#content-padding-open-modal'),
			$modal: $('#block-modal-content-padding'),
			$block_padding_top: $('#block-padding-top'),
			$block_padding_right: $('#block-padding-right'),
			$block_padding_bottom: $('#block-padding-bottom'),
			$block_padding_left: $('#block-padding-left'),
			$block_padding_type_pixel: $('.block-padding-type[value=pixel]'),
			$block_padding_type_percentage: $('.block-padding-type[value=percentage]'),
			$save_button: $('#block-set-content-padding-save'),
			$cancel_button: $('#block-set-content-padding-cancel')
		};

		block_content_padding_properties.$trigger.on('click', function() {
			var block_id = $('#editor-save').val(),
				saved = $(block_id).attr('data-content-padding');

			/* ------------ Content Padding Handle ---------------------- */
			if( typeof saved != 'undefined' && '' != saved ) {
				var paddings = saved.split(';');
				if( paddings.length > 1 ) {
					block_content_padding_properties.$block_padding_top.val( paddings[0].replace( /[\D]+/g, '' ) );
					block_content_padding_properties.$block_padding_right.val( paddings[1].replace( /[\D]+/g, '' ) );
					block_content_padding_properties.$block_padding_bottom.val( paddings[2].replace( /[\D]+/g, '' ) );
					block_content_padding_properties.$block_padding_left.val( paddings[3].replace( /[\D]+/g, '' ) );
				} else {
					block_content_padding_properties.$block_padding_top.val( paddings[0].replace( /[\D]+/g, '' ) );
					block_content_padding_properties.$block_padding_right.val( paddings[0].replace( /[\D]+/g, '' ) );
					block_content_padding_properties.$block_padding_bottom.val( paddings[0].replace( /[\D]+/g, '' ) );
					block_content_padding_properties.$block_padding_left.val( paddings[0].replace( /[\D]+/g, '' ) );
				}
				var width_type = paddings[0].match( /[\D]+/g )[0];
				switch( width_type ) {
					case 'px':
						block_content_padding_properties.$block_padding_type_pixel.prop('checked', true);
						break;
					case '%':
						block_content_padding_properties.$block_padding_type_percentage.prop('checked', true);
						break;
					default:
						break;
				}
			} else {
				block_content_padding_properties.$block_padding_top.val( '5' );
				block_content_padding_properties.$block_padding_right.val( '5' );
				block_content_padding_properties.$block_padding_bottom.val( '5' );
				block_content_padding_properties.$block_padding_left.val( '5' );
				block_content_padding_properties.$block_padding_type_percentage.prop('checked', true);
			}

			$text_editor.addClass('push-down-modal');
			block_content_padding_properties.$modal.show();
		});

		block_content_padding_properties.$save_button.on('click', function() {
			var block_id = $('#editor-save').val(),
				block_padding = '',
				padding_type = $('.block-padding-type:checked').val(),
				padding_unit_measure = '';

			switch(padding_type) {
				case 'percentage':
					padding_unit_measure = '%;';
					break;
				case 'pixel':
					padding_unit_measure = 'px;';
					break;
				default:
					break;
			}

			var pt = block_content_padding_properties.$block_padding_top.val();
			var pr = block_content_padding_properties.$block_padding_right.val();
			var pb = block_content_padding_properties.$block_padding_bottom.val();
			var pl = block_content_padding_properties.$block_padding_left.val();

			if( typeof pt != 'undefined' && pt != '' && pt.search( /[\d]+/g ) !== -1 ) {
				block_padding += pt + padding_unit_measure;
			} else {
				block_padding += '0' + padding_unit_measure;
			}

			if( typeof pr != 'undefined' && pr != '' && pr.search( /[\d]+/g ) !== -1 ) {
				block_padding += pr + padding_unit_measure;
			} else {
				block_padding += '0' + padding_unit_measure;
			}

			if( typeof pb != 'undefined' && pb != '' && pb.search( /[\d]+/g ) !== -1 ) {
				block_padding += pb + padding_unit_measure;
			} else {
				block_padding += '0' + padding_unit_measure;
			}

			if( typeof pl != 'undefined' && pl != '' && pl.search( /[\d]+/g ) !== -1 ) {
				block_padding += pl + padding_unit_measure;
			} else {
				block_padding += '0' + padding_unit_measure;
			}
			
			$(block_id).attr('data-content-padding', block_padding);

			$text_editor.removeClass('push-down-modal');
			block_content_padding_properties.$modal.hide();
		});

		block_content_padding_properties.$cancel_button.on('click', function() {
			$text_editor.removeClass('push-down-modal');
			block_content_padding_properties.$modal.hide();
		});

		/* -------- Static object for block position edit --------- */
		var block_content_position_properties = {
			$trigger: $('#content-position-open-modal'),
			$modal: $('#block-modal-content-position'),
			$save_button: $('#block-set-content-position-save'),
			$cancel_button: $('#block-set-content-position-cancel'),
			$positions: $('#block-modal-content-position .content-position'),
		};

		block_content_position_properties.$trigger.on('click', function() {
			var block_id = $('#editor-save').val(),
				saved = $(block_id).attr('data-block-custom-classes');
			
			block_content_position_properties.$positions.prop('checked', false);

			if(typeof saved != 'undefined' && saved != '') {
				var coordinates = saved.match(/rex-flex-(top|middle|bottom|left|center|right)/g);
				if( coordinates && coordinates.length > 0) {

					coordinates[0] = coordinates[0].replace('rex-flex-', '') ;
					coordinates[1] = coordinates[1].replace('rex-flex-', '') ;
					var filter = '[value=';
					if(coordinates[0].search(/(top|middle|bottom)/g) != -1) {
						filter += coordinates[0] + '-' + coordinates[1] + ']';
					} else {
						filter += coordinates[1] + '-' + coordinates[0] + ']';
					}
					block_content_position_properties.$positions.filter(filter).prop('checked', true);
				} else {
					block_content_position_properties.$positions.prop('checked', false);
				}
			}

			$text_editor.addClass('push-down-modal');
			block_content_position_properties.$modal.show();
		});

		block_content_position_properties.$save_button.on('click', function() {
			var block_id = $('#editor-save').val(),
				saved = $(block_id).attr('data-block-custom-classes'),
				set = '',
				set_preview ='';

			if(typeof saved == 'undefined' || saved == '' ) {
				saved = '';
			}

			/* -- Setting Content Position -- */
			var flex_content_position = block_content_position_properties.$positions.filter(':checked').val();
			saved = saved.replace(/rex-flex-(top|middle|bottom|left|center|right)\s*/g, '');

			if( typeof flex_content_position != 'undefined' && flex_content_position !== '' ) {
				set_preview += 'element-content-positioned';
				var coordinates = flex_content_position.match(/(top|middle|bottom|left|center|right)/g);
				switch(coordinates[0]) {
					case 'top':
						set += ' rex-flex-top';
						set_preview += ' element-content-positioned-top';
						break;
					case 'middle':
						set += ' rex-flex-middle';
						set_preview += ' element-content-positioned-middle';
						break;
					case 'bottom':
						set += ' rex-flex-bottom';
						set_preview += ' element-content-positioned-bottom';
						break;
					default:
						break;
				}
				switch(coordinates[1]) {
					case 'left':
						set += ' rex-flex-left';
						set_preview += ' element-content-positioned-left';
						break;
					case 'center':
						set += ' rex-flex-center';
						set_preview += ' element-content-positioned-center';
						break;
					case 'right':
						set += ' rex-flex-right';
						set_preview += ' element-content-positioned-right';
						break;
					default:
						break;
				}
			}

			saved = saved + ' ' + set.trim();
			$(block_id).attr('data-block-custom-classes', saved.trim());
			$(block_id)
				.find('.element-preview-wrap')
				.removeClass('element-content-positioned-top element-content-positioned-middle element-content-positioned-bottom element-content-positioned-left element-content-positioned-center element-content-positioned-right')
				.addClass(set_preview);

			$text_editor.removeClass('push-down-modal');
			block_content_position_properties.$modal.hide();
		});

		block_content_position_properties.$cancel_button.on('click', function() {
			$text_editor.removeClass('push-down-modal');
			block_content_position_properties.$modal.hide();
		});

		/* ------------ Block Properties Configuration ------------- */
		var background_modal_properties = {
			isset: false,
			$modal: null,
			$background_type: null,
			
			$type_image: $('#background-value-image'),
			$image_preview: null,
			$image_preview_icon: null,
			$image_url: null,
			$image_id: null,
			$image_type_wrap: null,
			$image_type: null,
			$type_color: $('#background-value-color'),
			$color_runtime_value: $('#background-block-color-runtime'),
			$color_value: $('#background-block-color'),
			$color_preview: null,
			$color_preview_icon: $('#background-preview-icon'),
			$color_palette_wrap: $('#bg-color-palette'),
			$color_palette_buttons: $('#bg-color-palette .bg-palette-selector'),
			$video_choose: $('.rex-block-choose-video'),
			$video_upload: $('#rex-block-upload-mp4'),
			$video_mp4: $('#rex-block-choose-mp4'),
			$video_mp4_id: $('#rex-block-mp4-id'),
			$video_youtube: $('#rex-block-choose-youtube'),
			$video_youtube_url: $('#rex-block-youtube-url'),
			$video_youtube_label: $('#rex-block-youtube-url-label'),
			$save_button: $('#background_set_save'),
			$cancel_button: null,
			$zoom_wrap: $('#bg-set-photoswipe'),
			$has_zoom: $('#background_photoswipe'),
			$link_wrap: $('#bg-set-link-wrap'),
			$has_link: $('#block_has_link'),
			$link_value: $('#block_link_value'),
			$class_wrap: $('#block-set-class-wrap'),
			$class_value: $('#block_custom_class'),
			$padding_wrap: $('#block-set-padding-wrap'),

			$positions: $('#background_block_set .content-position'),

			$block_padding_top: $('#bm-block-padding-top'),
			$block_padding_right: $('#bm-block-padding-right'),
			$block_padding_bottom: $('#bm-block-padding-bottom'),
			$block_padding_left: $('#bm-block-padding-left'),
			$block_padding_type_pixel: $('.bm-block-padding-type[value=pixel]'),
			$block_padding_type_percentage: $('.bm-block-padding-type[value=percentage]'),
			
			$overlay_color_value: $('#overlay-color-block-value'),
			$overlay_color_palette_buttons: $('#bg-overlay-block-color-palette .bg-palette-selector'),
			$overlay_color_preview_icon: $('#overlay-block-preview-icon'),
			$has_overlay_group: $('.block-has-overlay'),
			$has_overlay_small: $('#block-has-overlay-small'),
			$has_overlay_medium: $('#block-has-overlay-medium'),
			$has_overlay_large: $('#block-has-overlay-large'),
		};

		background_modal_properties.$color_value.spectrum({
			containerClassName: 'card',
			replacerClassName: 'btn-floating',
			preferredFormat: 'hex',
			showPalette: false,
			showAlpha: true,
			showInput: true,
			containerClassName: 'rexbuilder-materialize-wrap block-background-color-picker',
			show: function(color) {
				background_modal_properties.$type_color.prop("checked", true);
				if( '' === background_modal_properties.$color_runtime_value.val() ) {
					background_modal_properties.$color_value.spectrum('set','#ffffff');
				}
			},
			move: function(color) {
				background_modal_properties.$color_preview_icon.hide();
			},
			change: function(color) {
				//$('#palette-preview .bg-palette-button').css('backgroundColor', color.toRgbString() );
				//$('#palette-preview .bg-palette-value').val( color.toRgbString() );
				background_modal_properties.$color_palette_buttons.removeClass('palette-color-active');
				//background_modal_properties.$color_palette_buttons.filter('#palette-preview').addClass('palette-color-active');
				//background_modal_properties.$color_palette_buttons.filter('#palette-preview').find('.bg-palette-button-before').css('borderColor', color.toRgbString() );
			},
			cancelText: '',
			chooseText: '',
		});

		$('.block-background-color-picker .sp-cancel').on('click', function() {
			var block_id = background_modal_properties.$save_button.attr('data-block_id');
			var section_id = background_modal_properties.$save_button.attr('data-section_id');

			var background_saved_data = '';

			if('' != block_id) {
				background_saved_data = $('#' + block_id).attr('data-bg_settings');
			} else if ('' != section_id) {
				background_saved_data = $('.builder-row[data-count=' + section_id + ']').attr('data-gridproperties');
			}

			if( '' === background_saved_data ) {	// Block almost created
				background_modal_properties.$color_runtime_value.val('');
				background_modal_properties.$color_preview_icon.show();
			} else {
				var background_color = (JSON.parse(background_saved_data)).color;
				if( '' === background_color ) {	// Block with no background set
					background_modal_properties.$color_runtime_value.val('');
					background_modal_properties.$color_preview_icon.show();
				} else {
					background_modal_properties.$color_runtime_value.val(background_color);
				}
			}
			
		});

		$('.block-background-color-picker .sp-choose').on('click', function() {
			background_modal_properties.$color_preview_icon.hide();
			background_modal_properties.$color_runtime_value.val(background_modal_properties.$color_value.spectrum('get'));
		});

		background_modal_properties.$color_palette_buttons.on('click', function(event) {
			$(event.currentTarget).addClass('palette-color-active');
			background_modal_properties.$color_preview_icon.hide();
			background_modal_properties.$color_palette_buttons.not(event.currentTarget).removeClass('palette-color-active');
			background_modal_properties.$type_color.prop("checked", true);
			background_modal_properties.$color_value.spectrum('set', $(event.currentTarget).find('.bg-palette-value').val());
			background_modal_properties.$color_runtime_value.val($(event.currentTarget).find('.bg-palette-value').val());
		});

		background_modal_properties.$overlay_color_value.spectrum({
			containerClassName: 'card',
			replacerClassName: 'btn-floating',
			preferredFormat: 'hex',
			showPalette: false,
			showAlpha: true,
			showInput: true,
			containerClassName: 'rexbuilder-materialize-wrap block-overlay-color-picker',
			move: function(color) {
				background_modal_properties.$overlay_color_preview_icon.hide();
			},
			change: function(color) {
				background_modal_properties.$overlay_color_palette_buttons.removeClass('palette-color-active');
			},
			cancelText: '',
			chooseText: '',
		});

		background_modal_properties.$color_preview_icon.on('click', function() {
			background_modal_properties.$color_value.spectrum('show');
			return false;
		});

		background_modal_properties.$overlay_color_preview_icon.on('click', function() {
			background_modal_properties.$overlay_color_value.spectrum('show');
			return false;
		});

		background_modal_properties.$overlay_color_palette_buttons.on('click', function(event) {
			$(event.currentTarget).addClass('palette-color-active');
			background_modal_properties.$overlay_color_preview_icon.hide();
			background_modal_properties.$overlay_color_palette_buttons.not(event.currentTarget).removeClass('palette-color-active');
			background_modal_properties.$overlay_color_value.spectrum('set', $(event.currentTarget).find('.bg-palette-value').val());
		});

		$('.block-overlay-color-picker .sp-choose').on('click', function() {
			background_modal_properties.$overlay_color_preview_icon.hide();
		});

		background_modal_properties.$video_youtube_url.on('change keyup paste', function() {
			if($(this).val() != '') {
				background_modal_properties.$video_youtube.attr('checked', true);
			} else {
				background_modal_properties.$video_youtube.attr('checked', false);
			}
		});

		/* -------- Section Configuration Properties ------------ */
		var section_config_modal_properties = {
			$section_layout_type: $('.builder-edit-row-layout'),
			$section_fixed: $('#section-fixed'),
			$section_masonry: $('#section-masonry'),
			$section_full: $('#section-full-modal'),
			$section_boxed: $('#section-boxed-modal'),
			$section_boxed_width: $('.section-set-boxed-width'),
			$section_boxed_width_type: $('.section-width-type'),
			$has_overlay_small: $('#section-has-overlay-small'),
			$has_overlay_medium: $('#section-has-overlay-medium'),
			$has_overlay_large: $('#section-has-overlay-large'),
			$color_value: $('.backresponsive-color-section'),
			$color_palette_buttons: $('#bg-overlay-color-palette .bg-palette-selector'),
			$color_preview_icon: $('#overlay-preview-icon'),
			//$color_preview: $('#overlay-palette-preview'),
			// FULL height configuration
			$is_full: $('#section-is-full'),
			// ID and navigator configuration
			$section_id: $('#sectionid-container'),
			$save_button: $('#backresponsive-set-save'),
		};

		section_config_modal_properties.$color_value.spectrum({
			containerClassName: 'card',
			replacerClassName: 'btn-floating',
			//showPalette: true,
			showInput: true,
			preferredFormat: 'hex',
			showAlpha: true,
			cancelText: '',
			chooseText: '',
			containerClassName: 'rexbuilder-materialize-wrap section-overlay-color-picker',
			move: function(color) {
				section_config_modal_properties.$color_preview_icon.hide();
			},
			change: function(color) {
				//$('#overlay-palette-preview .bg-palette-button').css('backgroundColor', color.toRgbString() );
				//$('#overlay-palette-preview .bg-palette-value').val( color.toRgbString() );
				section_config_modal_properties.$color_palette_buttons.removeClass('palette-color-active');
				//section_config_modal_properties.$color_palette_buttons.filter('#overlay-palette-preview').addClass('palette-color-active');
				//section_config_modal_properties.$color_palette_buttons.filter('#overlay-palette-preview').find('.bg-palette-button-before').css('borderColor', color.toRgbString() );
			}
		});

		/*$('#overlay-palette-preview').on('click', function() {
			console.log($('#overlay-palette-preview .bg-palette-value').val());
			section_config_modal_properties.$color_value.spectrum('show');
			section_config_modal_properties.$color_value.spectrum('set', $('#overlay-palette-preview .bg-palette-value').val() );
			return false;
		});*/

		section_config_modal_properties.$color_preview_icon.on('click', function() {
			section_config_modal_properties.$color_value.spectrum('show');
			return false;
		});

		section_config_modal_properties.$color_palette_buttons.on('click', function(event) {
			$(event.currentTarget).addClass('palette-color-active');
			section_config_modal_properties.$color_preview_icon.hide();
			section_config_modal_properties.$color_palette_buttons.not(event.currentTarget).removeClass('palette-color-active');
			section_config_modal_properties.$color_value.spectrum('set', $(event.currentTarget).find('.bg-palette-value').val());
			//$('#palette-preview .bg-palette-button').css('backgroundColor', $(event.currentTarget).find('.bg-palette-value').val() );
			//$('#palette-preview .bg-palette-value').val( $(event.currentTarget).find('.bg-palette-value').val() );
		});

		section_config_modal_properties.$section_full.on('click', function() {
			section_config_modal_properties.$section_boxed_width.val('100');
			section_config_modal_properties.$section_boxed_width_type.filter('[value="percentage"]').prop('checked', true);
		});

		section_config_modal_properties.$section_boxed.on('click', function() {
			var section_id = section_config_modal_properties.$save_button.attr('data-section_id'),
				$row = $('.builder-row[data-count=' + section_id + ']'),
				config_settings = '';

			if( '' !== $row.attr( 'data-backresponsive' ) ) {
				config_settings = JSON.parse( $row.attr( 'data-backresponsive' ) );
			}

			if( '' != config_settings ) {
				var saved_width = config_settings.section_width.replace(/(%|px)/g, '');
				if('' != saved_width) {
					section_config_modal_properties.$section_boxed_width.val(saved_width);
				} else {
					section_config_modal_properties.$section_boxed_width.val('80');
				}
			}

			section_config_modal_properties.$section_boxed_width_type.filter('[value="percentage"]').prop('checked', true);
		});

		section_config_modal_properties.$section_boxed_width.on('change keyup paste', function() {
			var inserted_value = $(this).val();
			var width_type = section_config_modal_properties.$section_boxed_width_type.filter(':checked');
			if(inserted_value == '100' && 'percentage' == width_type.val()) {
				section_config_modal_properties.$section_full.prop('checked', true);
			} else {
				section_config_modal_properties.$section_boxed.prop('checked', true);
			}
		});

		section_config_modal_properties.$section_boxed_width_type.on('click', function() {
			var width_type = $(this).val();
			if('pixel' == width_type) {
				section_config_modal_properties.$section_boxed.prop('checked', true);
			} else if('percentage' == width_type && '100' == section_config_modal_properties.$section_boxed_width.val() ) {
				section_config_modal_properties.$section_full.prop('checked', true);
			}
		});

		$('.section-overlay-color-picker .sp-choose').on('click', function() {
			section_config_modal_properties.$color_preview_icon.hide();
		});

		$(window).on('scroll', function() {
			background_modal_properties.$color_value.spectrum('reflow');
			background_modal_properties.$overlay_color_value.spectrum('reflow');
			section_config_modal_properties.$color_value.spectrum('reflow');
		});

		$('.sp-container .sp-button-container .sp-cancel').append('<i class="rex-icon">n</i>');
		$('.sp-container .sp-button-container .sp-choose').append('<i class="rex-icon">m</i>');

		$('.sp-container .sp-input-container').append('<span class="rex-material-bar"></span>');

		/* ------ Video Insertion ----------- */

		var video_modal_properties = {
			$modal: $('#rex-video-block'),
			$video_choose: $('.rex-choose-video'),
			$video_upload: $('#rex-upload-mp4'),
			$video_mp4: $('#rex-choose-mp4'),
			$video_mp4_id: $('#rex-mp4-id'),
			$video_youtube: $('#rex-choose-youtube'),
			$video_youtube_url: $('#rex-youtube-url'),
			$video_youtube_label: $('#rex-youtube-url-label'),
			$save_button: $('#rex-video-block-save'),
			$cancel_button: $('#rex-video-block-cancel'),
		};

		video_modal_properties.$save_button.on('click', function() {
			var bg_setts = {
				color:'',
				image:'',
				url:'',
				bg_img_type:'full',			
				linkurl:'',
				video:'',
				youtube:video_modal_properties.$video_youtube_url.val(),
			};

			if( video_modal_properties.$video_youtube_url.val() != '' ) {
				var html = '<li id="block_' + global_section_reference.sectIndex + '_' + global_section_reference.internalIndex + '" class="video with-border item z-depth-1 hoverable svg-ripple-effect" data-block_type="video" data-block-custom-classes=\'\' data-content-padding=\'\' data-bg_settings=\'' + JSON.stringify( bg_setts ) + '\'>' + 
							element_actions +
							'<div class="element-data">' +
								'<textarea class="data-text-content" display="none"></textarea>' +
							'</div>' +
							'<div class="element-preview-wrap">' +
								'<div class="element-preview">' +
									'<div class="backend-image-preview" data-image_id=""></div>' +
								'</div>' +
							'</div>' +
							notice_video_template +
						'</li>';

				global_section_reference.gridRef.add_widget(html, 2, 2);
				global_section_reference.internalIndex++;
			}

			video_modal_properties.$modal.hide();
			$lean_overlay.hide();
		});

		video_modal_properties.$cancel_button.on('click', function() {
			video_modal_properties.$modal.hide();
			$lean_overlay.hide();
		});

		video_modal_properties.$video_upload.on('click', function() {
			uploadVideoBlock();
		});

		// Live activation/deactivation of radio button on url insertion/delete
		video_modal_properties.$video_youtube_url.on('change keyup paste', function() {
			if($(this).val() != '') {
				video_modal_properties.$video_youtube.attr('checked', true);
			} else {
				video_modal_properties.$video_youtube.attr('checked', false);
			}
		});

		$(document).on('click', '.builder-show-widgets', function() {
			return false;
		});

		// Define an object that represents a single row of the rexbuilder
		function Section($el, i) {
			this.sectionRef = $el;			//jQuery reference for the row
			this.gridRef = null;			//Reference for the grid
			this.sectIndex = i;				//Index of the section
			this.gridSerialized = null;		//JSON object representing the content of the grid
			this.internalIndex = 0;			//Internal index for the grid widgets
			this.gridster_options = null;

			this.init = function() {
				this.sectionRef.attr('data-count', this.sectIndex);
				this.launchGrid();
				//Set the internal index to the max + 1 index, to avoid conflicts with removes and inserts
				//Using UnderscoreJS
				var nextIndex = _.max( _.map( _.pluck(this.gridRef.$widgets, 'id'), function(string) {
					return parseInt(string.substring(string.lastIndexOf('_') + 1 , string.length));
				})) + 1;

				if(nextIndex != '-Infinity') {
					this.internalIndex = nextIndex;
				}				
			};

			var foo = function() {
				console.log('foo');
				return false;
			};

			this.launchGrid = function() {
				var wdim = grid_settings.widget_dimension,
					wmar = grid_settings.widget_margins;

				var global_intial_size_x = null;
				var global_next_position = null;
				var global_widget_resized_$ref = null,
					global_widget_resized_original_grid_data = null,
					global_widget_resized_new_grid_data = null;

				this.gridster_options = {
					widget_selector: '.item',
					resize: {
						enabled: true,
						axes: ['x', 'y', 'both'],
						start: function(e, ui, $widget) {
							var resized_widget_info = $widget.coords().grid;
							
							global_intial_size_x = this.resize_initial_sizex;
							global_next_position = resized_widget_info.col + resized_widget_info.size_x;
							
							console.log(this);
						},
						resize: function(e, ui, $widget) {
							var $other_widgets = this.$widgets.not($widget);		// other widgest of the grid
							var resized_widget_info = $widget.coords().grid;				// widget resized info
							var that = this;			// refernce of the actual grid

							$other_widgets.each(function(i, el) {
								var x = el.getAttribute('data-col');
								var step;
								step = that.resize_last_sizex - global_intial_size_x;
								if(step > 0) {
									if(x == global_next_position) {
										var w = parseInt(el.getAttribute('data-sizex')),
											h = parseInt(el.getAttribute('data-sizey'));
										if(w >= 2 && h == resized_widget_info.size_y) {
											console.log('posso procedere');
											var wgd = {
												col: parseInt(el.getAttribute('data-col')),
												row: resized_widget_info.row,
												size_x: w,
												size_y: h,
											};
											
											var new_wgd = {
												col: wgd.col + step,
												row: wgd.row,
												size_x: w - step,
												size_y: h,
											};

											console.log(wgd);
											console.log(new_wgd);

											// First method
											//that.mutate_widget_in_gridmap($(el), wgd, new_wgd);
											
											// Second method (that pairs with the one in the resize.stop event handling)
											that.resize_widget($(el), new_wgd.size_x, new_wgd.size_y);
											/*$(el).simulate('drag',{
												moves: 1,
												dx: step * that.min_widget_width,
												dy: 0
											});*/

											global_widget_resized_$ref = $(el);
											global_widget_resized_original_grid_data = wgd;
											global_widget_resized_new_grid_data = new_wgd;
										}
									}
								}
							});
						},
						stop: function(e, ui, $widget) {
							if(global_widget_resized_$ref) {
								var that = this;
								setTimeout(function() {
									that.remove_from_gridmap(global_widget_resized_original_grid_data);
									that.add_to_gridmap(global_widget_resized_new_grid_data);
									
									global_widget_resized_$ref.attr('data-col', global_widget_resized_new_grid_data.col);
									global_widget_resized_$ref.attr('data-row', global_widget_resized_new_grid_data.row);

									//that.move_widget_to(global_widget_resized_$ref, global_widget_resized_new_grid_data.row);

									//that.$changed = that.$changed.add(global_widget_resized_$ref);

									//Referesh the grid
									that.generate_grid_and_stylesheet();
									that.get_widgets_from_DOM();
									that.set_dom_grid_height();
									global_widget_resized_$ref = null;
								}, 500);
							}
						},
					},
					/*draggable: {
						drag: function(e, ui) {
							ui.$player.find('.btn-floating').bind('click', foo);
						},
						stop: function(e, ui) {
							ui.$player.find('.btn-floating').unbind('click', foo);
						},
					},*/
					widget_margins: [wmar,wmar],
					widget_base_dimensions: [wdim, wdim],
					min_cols: grid_settings.grid_columns,
					serialize_params: function ($w, wgd) {
						var type = $w.attr("data-block_type"),
							content = '',
							bg_info = $w.attr('data-bg_settings'),
							class_info = $w.attr('data-block-custom-classes'),
							padding_info = $w.attr('data-content-padding');
						switch(type) {
							case 'text':
								content = $w.find(".data-text-content").text();
								break;
							case 'video':
								content = $w.find(".data-text-content").text();
								break;
							case 'image':
								content = $w.find(".data-text-content").text();
								break;
							case 'expand':
								content = $w.find('.data-zak-content').attr('data-zak-content');
								break;
							case 'empty':
								if($w.find(".data-text-content").length > 0) {
									content = $w.find(".data-text-content").text();
								}
								break;
							default:
								break;
						}
						var output = '';
						output += '[RexpansiveBlock id="' + $w.prop("id") + '" type="' + type +
										'" col="' + wgd.col + '" row="' + wgd.row +
										'" size_x="' + wgd.size_x + '" size_y="' + wgd.size_y + '"';
						if( bg_info ) {
							var bg_block_info = JSON.parse(bg_info);
							output += ' color_bg_block="' + bg_block_info.color + '" image_bg_block="' + bg_block_info.url + 
										'" id_image_bg_block="' + bg_block_info.image + 
										'" type_bg_block="' + bg_block_info.bg_img_type + 
										'" video_bg_id="' + bg_block_info.video +
										'" video_bg_url="' + bg_block_info.youtube +
										'" photoswipe="' + bg_block_info.photoswipe + 
										'" linkurl="' + bg_block_info.linkurl + 
										//'" block_custom_class="' + bg_block_info.block_custom_class +
										'" overlay_block_color="' + bg_block_info.overlay_block_color + '"';
						} else {
							output += ' color_bg_block="" image_bg_block="" id_image_bg_block="" type_bg_block="" photoswipe="" linkurl=""';
						}
						if( class_info ) {
							output += ' block_custom_class="' + class_info + '" ';
						}
						if( padding_info ) {
							output += ' block_padding="' + padding_info + '" ';
						}
						if( type == 'expand') {
							var zak_content = JSON.parse(content);
							output += ' zak_background="' + zak_content.background_id + '" zak_title="' + zak_content.title + 
										'" zak_side="' + zak_content.side + '" zak_icon="' + zak_content.icon_id + '"' +
										' zak_foreground="' + zak_content.foreground_id + '"';
						} else {
							output += ' zak_background="" zak_title="" zak_side="" zak_icon=""';
						}
						output += ']';
						if( type == 'expand' ) {
							output += JSON.parse(content).content;
						} else {
							output += content;
						}
						output += '[/RexpansiveBlock]';
						
						return {
							id: $w.prop("id"),
							content: output,				 			
							col: wgd.col,
							row: wgd.row,
							size_x: wgd.size_x,
							size_y: wgd.size_y
						};
					},
				};
				//var settings = $.extend({}, rex_gridster_parameters, this.gridster_options);
				var settings = this.gridster_options;
				this.gridRef = this.sectionRef.find('.gridster > ul').gridster(settings).data('gridster');
				this.sectionRef.find('.gridster > ul').css('min-height', wdim * 2);

				$(document).trigger('sectionCollectData', [ this ] );
			};

			this.addElementOnGrid = function(type) {
				var gridElement,
					gridElementId = 'block_' + this.sectIndex + '_' + this.internalIndex,
					this_section = this;

				global_section_reference = this;
				
				switch(type) {
					case 'image':
						RenderMediaUploader();
						break;
					case 'text':
						openTextEditor('.builder-row[data-count="' + this.sectIndex + '"] #' + gridElementId, '');
						$('#editor-cancel').val('new-block');
						break;
					case 'expand':
						openExpandEditor('.builder-row[data-count="' + this.sectIndex + '"] #' + gridElementId, '');
						gridElement = '<li id="' + gridElementId + '" class="expand item z-depth-1 hoverable svg-ripple-effect" data-block_type="expand" data-block-custom-classes=\'\' data-content-padding=\'\' data-bg_settings=\'\'>' + 
											element_actions +
											'<div class="element-data">' +
												// Use the value to send the shortcode to the DB
												// Use the data attribute to set preview and comunicate with the editor
												'<input class="data-zak-content" type="hidden" value=\'\' data-zak-content=\'\'>' +
											'</div>' +
											'<div class="element-preview">' +
												'<div class="zak-block zak-image-side"></div>' +
												'<div class="zak-block zak-text-side"></div>' +
											'</div>' +
										'</li>';
						this.gridRef.add_widget(gridElement, 12, 2);
						this.internalIndex++;
						launchTooltips();
						break;
					case 'video':
						video_modal_properties.$video_choose.prop('checked', false);
						video_modal_properties.$video_mp4_id.val('');
						video_modal_properties.$video_youtube_url.val('');
						video_modal_properties.$modal.show();
						$lean_overlay.show();
						break;
					case 'empty':
						gridElement = empty_template.replace(/\bdata.emptyid\b/g, gridElementId);
						this.gridRef.add_widget(gridElement, 2, 2);
						this.internalIndex++;
						launchTooltips();
						break;
					default:
						break;
				}
			};

			this.copyElementToGrid = function($el) {
				var new_id = $el.attr('id').match(/block_\d+_/g);
				if(new_id.length > 0) {
					new_id = new_id[0] + this.internalIndex;
					$el.attr('id', new_id);
					var w = $el.attr('data-sizex');
					var h = $el.attr('data-sizey');
					var copy_markup = $el.wrap('<p/>').parent().html();

					this.gridRef.add_widget(copy_markup, w, h);
					this.internalIndex++;
					launchTooltips();
				}
			};

			this.removeElementFromGrid = function(el) {
				this.gridRef.remove_widget(el);
				$(document).trigger('sectionCollectData', [ this ] );
			};

			this.collectGridData = function() {
				this.gridSerialized = this.gridRef.serialize();
				
				this.gridSerialized = Gridster.sort_by_row_and_col_asc(this.gridSerialized);

				var c = _.map(this.gridSerialized, function(obj) {
					return _.first(_.values(_.pick( obj, 'content' )));
				});

				this.sectionRef.attr('data-gridcontent', c.join(''));
			};

			this.fillEmptyCells = function() {
				var gridElementId,
					gridElement,
					cols = this.gridRef.container_width / this.gridRef.min_widget_width,
					rows = this.gridRef.container_height / this.gridRef.min_widget_width,
					i,
					j;
				var guard;
				var w, h;
				var internal_i, internal_j;

				for(j=1;j<=rows;j++) {
					for(i=1;i<=cols;i++) {
						if(this.gridRef.is_empty(i,j)) {
							guard = 0;
							w = h = 1;
							internal_i = i;
							internal_j = j;

							while(internal_i<=cols && this.gridRef.is_empty(internal_i, internal_j)) {
								guard = internal_i;
								internal_i++;
							}
							w = internal_i-i;
							internal_j++;
							internal_i=i;

							while(internal_j<=rows) {
								while(internal_i<=guard) {
									if(this.gridRef.is_empty(internal_i, internal_j)) {
										internal_i++;
									} else {
										break;
									}
								}
								if(internal_i-1 == guard) {
									internal_j++;
									internal_i=i;
								} else {
									break;
								}
							}

							h = internal_j-j;

							gridElementId = 'block_' + this.sectIndex + '_' + this.internalIndex;
							gridElement = empty_template.replace(/\bdata.emptyid\b/g, gridElementId);						
							this.gridRef.add_widget(gridElement, w, h, i, j);
							this.internalIndex++;
						}
					}
				}
				launchTooltips();
			};
		};

		// Looking for already saved sections
		$('.builder-row').each(function(index, el) {
			collect[index] = new Section($(el), index);
			collect[index].init();
			counter++;
		});

		// Make the area sortable
		$builderArea.sortable({
			revert: true,
			handle: '.builder-move-row'
		});

		//Function that saves the datas of all the sections
		var saveAllData = function() {
			var ready = $builderArea.sortable('instance');
			var i;
			if(typeof ready != "undefined" && ready !== null) {
				var sectionGrid = $builderArea.sortable('toArray', { attribute: 'data-gridcontent' } );
				var sectionBackground = $builderArea.sortable('toArray', { attribute: 'data-gridproperties' } );
				var sectionDimension = $builderArea.sortable('toArray', { attribute: 'data-griddimension' } );
				var sectionLayout = $builderArea.sortable('toArray', { attribute: 'data-layout' } );
				var sectionIdentifiers = $builderArea.sortable('toArray', { attribute: 'data-sectionid' } );
				var sectionBackgroundResponsive = $builderArea.sortable('toArray', { attribute: 'data-backresponsive' } );

				for(i=0;i<sectionGrid.length;i++) {
					sectionGrid[i] = createSectionShortcode(sectionGrid[i], sectionBackground[i], sectionDimension[i], sectionLayout[i], sectionIdentifiers[i], sectionBackgroundResponsive[i]);
				}
				sectionGrid = sectionGrid.join('');

				setBuilderTimeStamp();

				var ed = tinyMCE.get('content');

				if ( typeof ed === "undefined" || ed === null) { // text editor
					$('#content').val( sectionGrid );
					$('#content').text( sectionGrid );
				} else if(typeof sectionGrid != "undefined" && sectionGrid !== null) {
					ed.setContent(sectionGrid);
					ed.save( { no_events: true } );
				}
			}
		};

		var setBuilderTimeStamp = function() {
			var timestamp = new Date();
			$('#_rexbuilder').val(Date.UTC(timestamp.getFullYear(),timestamp.getMonth(),timestamp.getDate()));
		};

		// Handle the event that serialize all the data on a certain section
		$(document).on('sectionCollectData', function(e, row) {
			if( _plugin_backend_settings.activate_builder && $('#builder-switch').prop('checked') ) {
				row.collectGridData();
				saveAllData();
			}
		});

		$(document).on('mouseup', '.gridster > ul li.item', function (ev) {
			var r = collect[$(this).parents('.builder-row').attr('data-count')];
		});

		$(window).on('resize', function() {
			var new_widget_dim, i;
			new_widget_dim =  Math.round( ( 
					( $('#rexbuilder').width() - 46 ) - (
						grid_settings.widget_margins * ( grid_settings.grid_columns * 2 ) ) ) / grid_settings.grid_columns );
			grid_settings.widget_dimension = new_widget_dim;
			for(i=0;i<collect.length;i++) {
				collect[i].sectionRef.find('.gridster > ul').css('width', '100%').css('min-height', new_widget_dim * 2);
				collect[i].gridRef.resize_widget_dimensions({
					widget_base_dimensions: [new_widget_dim, new_widget_dim]
				});
			}
		});

		// Ripple effect on builder blocks
		$(document).on('click', '.item.svg-ripple-effect', function(e) {
			//if($(e.target).hasClass('material-icons') || $(e.target).hasClass('gs-resize-handle')) {
			//} else {
			var x = e.pageX;
			var y = e.pageY;
			var clickY = y - $(this).offset().top;
			var clickX = x - $(this).offset().left;
			var box = this;

			var setX = parseInt(clickX);
			var setY = parseInt(clickY);
			$(this).find("svg").remove();
			$(this).append('<svg><circle cx="'+setX+'" cy="'+setY+'" r="'+0+'"></circle></svg>');
			   
			 
			var c = $(box).find("circle");
			var radius = 0;
			var box_width = $(box).outerWidth();
			var box_height = $(box).outerHeight();

			if(box_width > box_height) {
				radius = box_width;
			} else {
				radius = box_height;
			}

			radius = Math.sqrt(box_width * box_width + box_height * box_height);

			c.animate(
				{
					"r" : radius
				},
				{
					specialEasing: "easeOutQuad",
					duration: Math.floor(radius * 0.5),
					/*step : function(val){
						c.attr("r", val);
					},*/
					complete: function() {
						$(this).animate({
							opacity: 0,
						}, {
							duration: Math.floor(radius * 0.6),
							specialEasing: "easeOutExpo",
						});
					}
				}
			);
			 //}
		});

		var global_tooltipped = $('.tooltipped');

		//Functions
		var launchTooltips = function() {
			$('.tooltipped').not(global_tooltipped).tooltip({delay: 50});
			global_tooltipped = $('.tooltipped');
		};

		//Functions

		// Function that creates a new text block and places it on the global referenced sections
		var createNewTextBlock = function() {
			var template,
				new_id = 'block_' + global_section_reference.sectIndex + '_' + global_section_reference.internalIndex;

			template = text_template.replace(/\bdata.imageid\b/g, new_id).replace(/\bdata.elementactionsplaceholder\b/g, element_actions);

			global_section_reference.gridRef.add_widget(template, 2, 2);
			global_section_reference.internalIndex++;
		};

		// Open WYSWYG text editor
		var openTextEditor = function(id, content) {
			var tinyMCE_editor = tinyMCE.get('rexbuilder_editor');

			if(typeof id != "undefined" && id !== null) {
				$('#editor-save').val(id);
			}

			if ( typeof tinyMCE_editor === "undefined" || tinyMCE_editor === null) { // text editor
				$('#rexbuilder_editor').val( content );
				$('#rexbuilder_editor').text( content );
			} else {
				tinyMCE_editor.setContent(content);
				tinyMCE_editor.save( { no_events: true } );
			}

			$text_editor.show();
			$lean_overlay.show();
		};

		var openExpandEditor = function(id, content) {
			var tinyMCE_editor = tinyMCE.get('rexbuilder_expand_editor'),
				$topFields = $('.expand-editor-topfields');

			if(typeof id != "undefined" && id !== null) {
				$('#expand-editor-save').val(id);
				$topFields.find('input:not(.exp-side-holder)').each(function() {
					$(this).val('');
				});
			}

			if( typeof content != "undefined" && content !== null && content !== '' ) {			// Sets values if already presents
				$topFields.find('.exp-back-holder').val(content.background_url);
				$topFields.find('.exp-back-holder').attr('data-image_id', content.background_id);
				$topFields.find('.exp-title-holder').val(content.title);
				$topFields.find('.exp-icon-holder').val(content.icon_url);
				$topFields.find('.exp-icon-holder').attr('data-icon_id', content.icon_id);
				$topFields.find('.exp-side-holder[value=' + content.side + ']').prop("checked", true);
				$topFields.find('.zak-foreground-holder').val(content.foreground_url);
				$topFields.find('.zak-foreground-holder').attr('data-foreground-id', content.foreground_id);
				content = content.content;
			}

			if ( typeof tinyMCE_editor === "undefined" || tinyMCE_editor === null) { // text editor
				$('#rexbuilder_expand_editor').val( content );
				$('#rexbuilder_expand_editor').text( content );
			} else {
				tinyMCE_editor.setContent( content );
				tinyMCE_editor.save( { no_events: true } );
			}

			$expand_editor.show();
		};

		/**
		 *	@var	data		string	a JSON array of objects stringified
		 *	@return	shortcode	string	the shortcode created
		 */
		var createSectionShortcode = function(data, settings, settsdim, settlayout, settIdentifier, settBackResp) {			
			var shortcode = '',
				section_settings,
				dimension;
			shortcode = '[RexpansiveSection ';
			if( settIdentifier ) {
				shortcode += 'section_name="' + settIdentifier + '" ';
			} else {
				shortcode += 'section_name="" ';
			}
			if( settings ) {
				section_settings = JSON.parse(settings);
				shortcode += 'color_bg_section="' + section_settings.color + '" image_bg_section="' + section_settings.url + '" id_image_bg_section="' + section_settings.image + + '" video_bg_url_section="' + section_settings.youtube + '" video_bg_id_section="' + section_settings.video + '" ';
			} else {
				shortcode += 'color_bg_section="" image_bg_section="" id_image_bg_section="" ';
			}
			if( settsdim ) {
				dimension = settsdim
				shortcode += 'dimension="' + dimension + '" margin="" ';
			} else {
				shortcode += 'dimension="" margin="" ';
			}
			if( settlayout ) {
				shortcode += 'layout="' + settlayout + '" ';
			} else {
				shortcode += 'layout="" ';
			}
			if( settBackResp ) {
				var config_settings = JSON.parse(settBackResp);
				var backrespoptions = 'rgba(' + config_settings.r + ',' + config_settings.g + ',' + config_settings.b + ',' + config_settings.a +')';
				shortcode += 'responsive_background="' + backrespoptions + '" ';
				shortcode += 'block_distance="' + config_settings.gutter + '" ';
				shortcode += 'full_height="' + config_settings.isFull + '" ';
				shortcode += 'custom_classes="' + config_settings.custom_classes + '" ';
				shortcode += 'section_width="' + config_settings.section_width + '" ';
			} else {
				shortcode += 'responsive_background=""';
			}
			shortcode += ']' + data + '[/RexpansiveSection]';
			return shortcode;
		};

		/**
		 *	Function that pick up the first element in a wrap and places it at the end
		 *
		 *	@param	$wrap		jQueryElement
		 *	@param	selector	string of css selector
		 */
		var switchBlocks = function($wrap, selector) {
			$el = $wrap.children(selector).detach();
			$wrap.append($el);
		};

		//Events
		// Adding a new section
		$('#builder-add-row').click(function(e) {
			e.preventDefault();
			var newEl = $(section_template.replace(/\bdata.index\b/g, counter));
			$builderArea.append(newEl);
			collect[counter] = new Section(newEl, counter);
			collect[counter].init();
			counter++;
			launchTooltips();
		});

		// Copy an entire section
		$(document).on('click', '.builder-copy-row', function(e) {
			e.preventDefault();
			var $section_copy = $(this).parents('.builder-row').clone();
			$section_copy.attr('data-count', counter);
			$section_copy.find('.rex-edit-dimension-wrap input[id^=section-full-]').attr('id', 'section-full-' + counter).attr('name', 'section-dimension-' + counter);
			$section_copy.find('.rex-edit-dimension-wrap label[for^=section-full-]').attr('for', 'section-full-' + counter);
			$section_copy.find('.rex-edit-dimension-wrap input[id^=section-boxed-]').attr('id', 'section-boxed-' + counter).attr('name', 'section-dimension-' + counter);
			$section_copy.find('.rex-edit-dimension-wrap label[for^=section-boxed-]').attr('for', 'section-boxed-' + counter);

			$section_copy.find('.rex-edit-layout-wrap input[id^=section-fixed-]').attr('id', 'section-fixed-' + counter).attr('name', 'section-layout-' + counter);
			$section_copy.find('.rex-edit-layout-wrap label[for^=section-fixed-]').attr('for', 'section-fixed-' + counter);
			$section_copy.find('.rex-edit-layout-wrap input[id^=section-masonry-]').attr('id', 'section-masonry-' + counter).attr('name', 'section-layout-' + counter);
			$section_copy.find('.rex-edit-layout-wrap label[for^=section-masonry-]').attr('for', 'section-masonry-' + counter);

			$builderArea.append($section_copy);
			collect[counter] = new Section($section_copy, counter);
			collect[counter].init();
			counter++;
			launchTooltips();
		});

		// Delete an entire section
		$(document).on('click', '.builder-delete-row', function(e) {
			if( _plugin_backend_settings.activate_builder && $('#builder-switch').prop('checked') ) {
				e.preventDefault();
				counter--;
				//Remove the element from the array of sections (with splice, otherwise an empty space remain)
				
				// Save the internal id of the section to delete
				var sectionToDeleteId = parseInt( $(this).parents('.builder-row').attr('data-count') );

				// Find the arrayt index of the section to delete
				var index = -1;
				for(var i = 0, len = collect.length; i < len; i++) {
					if (collect[i].sectIndex === sectionToDeleteId ) {
						index = i;
						break;
					}
				}
 
				collect.splice( index , 1);

				$(this).parents('.builder-row').remove();
				saveAllData();
			}
		});

		// Handle the edit of an element
		$(document).on( 'click', '.edit_handler', function(e) {
			e.preventDefault();
			var $container = $(this).parents('li');
			var parent_row_id = $container.parents('.builder-row').attr('data-count');
			var id_block_to_save = '.builder-row[data-count="' + parent_row_id + '"] #' + $container.attr('id');

			var $father = collect[$container.parents('.builder-row').attr('data-count')];
			
			switch( $container.attr('data-block_type') ) {
				case 'image':
					openTextEditor(id_block_to_save, $container.find('.data-text-content').text());
					break;
				case 'text':
					openTextEditor(id_block_to_save, $container.find('.data-text-content').text());
					break;
				case 'expand':
					saved_content =  $container.find('.data-zak-content').attr('data-zak-content');
					
					openExpandEditor(id_block_to_save, JSON.parse(saved_content));
					break;
				case 'video':
					openTextEditor(id_block_to_save, $container.find('.data-text-content').text());
					break;
				case 'empty':
					openTextEditor(id_block_to_save, $container.find('.data-text-content').text());
					break;
				default:
					break;
			}            
		});

		// Adding an element inside a section
		$(document).on('click', '.builder-add', function(e) {
			if(!$(this).hasClass('builder-show-widgets')) {
				e.preventDefault();
				var choice = $(this).val();
				collect[$(this).parents('.builder-row').attr('data-count')].addElementOnGrid(choice);
				if('post-new-php' == adminpage && $(this).parents('.builder-buttons-new-row').length > 0) {
					$(this).parents('.builder-buttons-new-row').hide();
					$(this).parents('.builder-new-row').find('.builder-buttons').css('visibility', 'visible');
				}
			}
		});

		// Copy a single element
		$(document).on('click', '.copy-handler', function(e) {
			e.preventDefault();
			var $el = $(this).parents('li');
			var $copy = $el.clone();
			var parent_row_id = $el.parents('.builder-row').attr('data-count');
			collect[parent_row_id].copyElementToGrid($copy);
		});

		// Delete a single element
		$(document).on('click', '.delete_handler', function(e) {
			e.preventDefault();
			var el = $(this).parents('li');
			collect[$(this).parents('.builder-row').attr('data-count')].removeElementFromGrid(el);
		});

		// Modal editors handlers
		$('#rexeditor-close').on('click', function(e) {
			e.preventDefault();
			$('#editor-save').val('');
			$text_editor.hide();
			$lean_overlay.hide();
			tinyMCE.triggerSave();
		});

		$('#editor-cancel').on('click', function(e) {
			e.preventDefault();
			$('#editor-cancel').val('');
			$('#editor-save').val('');
			block_content_padding_properties.$modal.hide();
			block_content_position_properties.$modal.hide();
			$text_editor.hide();
			$lean_overlay.hide();
		});

		$('#rexeditor-expand-close').on('click', function(e) {
			e.preventDefault();
			$('#expand-editor-save').val('');
			$expand_editor.hide();
			tinyMCE.triggerSave();
		});

		$('#expand-editor-cancel').on('click', function(e) {
			e.preventDefault();
			$('#expand-editor-save').val('');
			$expand_editor.hide();
			tinyMCE.triggerSave();
		});

		$('#editor-save').on('click', function(e) {
			e.preventDefault();

			if($('#editor-cancel').val() == 'new-block') {
				createNewTextBlock();
				launchTooltips();
			}

			tinyMCE.triggerSave();
			var tinyMCE_editor = tinyMCE.get('rexbuilder_editor');
			var editor = $('#rexbuilder_editor');
			var editor_value = editor.val();
			var $blockToSave = $($(this).val());

			if( $blockToSave.attr('data-block_type') == 'image') {
				$blockToSave.find('.element-preview .backend-image-preview').empty().append(editor_value.replace(/'/ig,"’"));
			} else {
				$blockToSave.find('.element-preview').empty().append(editor_value.replace(/'/ig,"’"));
			}

			$blockToSave.find('.data-text-content').text(editor_value.replace(/'/ig,"’"));

			$('#editor-cancel').val('');

			block_content_padding_properties.$modal.hide();
			block_content_position_properties.$modal.hide();

			$text_editor.hide();
			$lean_overlay.hide();
		});

		$('#expand-editor-save').on('click', function(e) {
			e.preventDefault();
			tinyMCE.triggerSave();
			var tinyMCE_editor = tinyMCE.get('rexbuilder_expand_editor'),
				editor = $('#rexbuilder_expand_editor'),
				$blockToSave = $($(this).val()),
				dataToSave = {
					side: '',
					background_url: '',
					background_id: '',
					title: '',
					icon_url: '',
					icon_id: '',
					content: '',
					foreground_id: '',
					foreground_url: ''
				};
			
			dataToSave.side = $('.exp-side-holder').filter(':checked').val();
			if( dataToSave.side == 'left' ) {
				switchBlocks($blockToSave.find('.element-preview'), '.zak-text-side');
			} else if( dataToSave.side == 'right' ) {
				switchBlocks($blockToSave.find('.element-preview'), '.zak-image-side');
			}
			dataToSave.background_url = $('.exp-back-holder').val();
			dataToSave.background_id = $('.exp-back-holder').attr('data-image_id');
			dataToSave.title = $('.exp-title-holder').val();
			dataToSave.icon_url = $('.exp-icon-holder').val();
			dataToSave.icon_id = $('.exp-icon-holder').attr('data-icon_id');

			if( '' !== $( '.zak-foreground-holder' ).val() ) {
				dataToSave.foreground_id = $('.zak-foreground-holder').attr( 'data-foreground-id' );
				dataToSave.foreground_url = $( '.zak-foreground-holder' ).val();
			} else {
				$('.zak-foreground-holder').attr( 'data-foreground-id', '' );
				$( '.zak-foreground-holder' ).val( '' );
			}
			
			var str = editor.val();
			dataToSave.content = str.replace(/'/ig,"’");

			// Save the dates
			$blockToSave.find('.data-zak-content')
						.attr('data-zak-content', JSON.stringify(dataToSave));

			$blockToSave.find('.zak-text-side')
						.empty()
						.append('<h2>' + dataToSave.title + '</h2>');

			if( dataToSave.icon_url ) {
				$blockToSave.find('.zak-text-side').append('<img src="' + dataToSave.icon_url + '">');
			}
			
			$blockToSave.find('.zak-text-side').append('<div class="text-preview">' + editor.val().replace(/'/ig,"’")/*.replace(/\n/ig,"<br>")*/ + '</div>');

			$blockToSave.find('.zak-image-side')
						.html('<img src="' + dataToSave.background_url + '">');

			$expand_editor.hide();
		});

		$('.exp-back-upload').on('click', function(e) {
			e.preventDefault();
			uploadZakBackground($('input.exp-back-holder'));
		});

		$('.exp-icon-upload').on('click', function(e) {
			e.preventDefault();
			uploadZakIcon($('input.exp-icon-holder'));
		});

		$('.zak-foreground-upload').on('click', function(e) {
			e.preventDefault();
			uploadZakForeground($('input.zak-foreground-holder'));
		});

		/**
		 *	Open the modal for edit the background of a block
		 */
		$(document).on('click', '.background_handler', function(e) {
			e.preventDefault();
			var $this = $(this),
				id = $this.parents('.item').attr('id'),
				block_parent = $this.parents('.builder-row').attr('data-count'),
				saved = '',
				block_custom_class = $('#' + id).attr('data-block-custom-classes');

			// If not getted, set the properties of the background modal
			if( !background_modal_properties.isset ) {
				background_modal_properties.isset = true;
				background_modal_properties.$modal = $('#background_block_set');
				background_modal_properties.$background_type = $('.background_type');
				background_modal_properties.$type_image = $('#background-value-image');
				background_modal_properties.$image_preview = $('#bg-img-preview');
				background_modal_properties.$image_preview_icon = background_modal_properties.$image_preview.find('i');
				background_modal_properties.$image_url = $('#background_url');
				background_modal_properties.$image_id = $('#background_up_img');
				background_modal_properties.$image_type_wrap = $('#bg-set-img-type');
				background_modal_properties.$image_type = $('.background_image_type');
				//background_modal_properties.$type_color = $('#background-value-color');
				//background_modal_properties.$color_value = $('#background-block-color');
				background_modal_properties.$color_preview = $('#background-color-preview');

				background_modal_properties.$zoom_wrap = $('#bg-set-photoswipe');
				background_modal_properties.$has_zoom = $('#background_photoswipe');
				background_modal_properties.$link_wrap = $('#bg-set-link-wrap');
				background_modal_properties.$has_link = $('#block_has_link');
				background_modal_properties.$link_value = $('#block_link_value');
				background_modal_properties.$class_wrap = $('#block-set-class-wrap');
				background_modal_properties.$class_value = $('#block_custom_class');
				background_modal_properties.$padding_wrap = $('#block-set-padding-wrap');

				background_modal_properties.$save_button = $('#background_set_save');
				background_modal_properties.$cancel_button = $('#background_set_cancel');
			}

			if($this.parents('#' + id).attr('data-bg_settings') !== '') {
				saved = JSON.parse($this.parents('#' + id).attr('data-bg_settings'));
			}

			background_modal_properties.$save_button.attr('data-block_id', id).attr('data-block_parent', block_parent);
			background_modal_properties.$image_preview_icon.show();

			background_modal_properties.$color_value.spectrum('set', 'transparent');
			background_modal_properties.$color_runtime_value.val('');

			background_modal_properties.$image_url.val('');
			background_modal_properties.$image_id.val('');

			background_modal_properties.$color_palette_buttons.removeClass('palette-color-active');
			background_modal_properties.$color_preview.css('background-color', 'transparent');
			background_modal_properties.$type_color.prop('checked', true);
			background_modal_properties.$color_preview_icon.show();

			$('.background_image_type[value=full]').prop('checked', true);
			background_modal_properties.$has_zoom.prop('checked', false);
			background_modal_properties.$image_preview.css('background-image', 'none');
			 
			if( typeof saved.color != 'undefined' && saved.color !== '' ) {
				background_modal_properties.$color_runtime_value.val(saved.color);
				background_modal_properties.$color_value.spectrum('set', saved.color);
				background_modal_properties.$color_preview_icon.hide();
				if( saved.bg_img_type == 'full') {
					background_modal_properties.$image_url.val('');
					background_modal_properties.$image_id.val('');
				}
				background_modal_properties.$type_color.prop("checked", true);

				background_modal_properties.$color_preview.css('background-color', saved.color);
			} else if( typeof saved.image != 'undefined' && saved.image !== '' ) {
				background_modal_properties.$color_value.spectrum('set', 'transparent');
				background_modal_properties.$image_id.val(saved.image);
				background_modal_properties.$image_url.val(saved.url);
				background_modal_properties.$image_preview.css('background-image', 'url(' + saved.url + ')');
				background_modal_properties.$image_preview_icon.hide();
				$('.background_type[value=image]').prop("checked", true);
				$('.background_image_type[value=' + saved.bg_img_type +']').prop('checked', true);
				background_modal_properties.$color_preview.css('background-color', 'transparent');
			}

			background_modal_properties.$video_choose.prop('checked', false);
			background_modal_properties.$video_mp4_id.val('');
			background_modal_properties.$video_youtube_url.val('');
			background_modal_properties.$video_youtube_label.removeClass('active');

			if( typeof saved.video != 'undefined' && '' !== saved.video ) {
				background_modal_properties.$video_mp4_id.val(saved.video);
				background_modal_properties.$video_mp4.prop('checked', true);
			}

			if( typeof saved.youtube != 'undefined' && '' !== saved.youtube ) {
				background_modal_properties.$video_youtube.prop('checked', true);
				background_modal_properties.$video_youtube_url.val(saved.youtube);
				background_modal_properties.$video_youtube_label.addClass('active');
			}

			background_modal_properties.$link_value.val('');
			background_modal_properties.$has_link.prop('checked', false);
			background_modal_properties.$link_value.next().removeClass('active');

			if(typeof saved.linkurl != 'undefined' && saved.linkurl !== '') {
				//background_modal_properties.$has_link.prop('checked', true);
				background_modal_properties.$link_value.val(saved.linkurl);
				background_modal_properties.$link_value.next().addClass('active');
			}

			if(saved.photoswipe == 'true') {
				background_modal_properties.$has_zoom.prop('checked', true);
			}

			background_modal_properties.$class_value.val('');
			var temp_classes = '';
			if(typeof block_custom_class != 'undefined') {
				var temp_classes = block_custom_class;
			}

			/* ------- Content Position ---------- */
			background_modal_properties.$positions.prop('checked', false);
			var s = temp_classes;

			if(typeof s != 'undefined' && s != '') {
				var coordinates = s.match(/rex-flex-(top|middle|bottom|left|center|right)/g);
				if( coordinates && coordinates.length > 0) {

					coordinates[0] = coordinates[0].replace('rex-flex-', '') ;
					coordinates[1] = coordinates[1].replace('rex-flex-', '') ;
					var filter = '[value=';
					if(coordinates[0].search(/(top|middle|bottom)/g) != -1) {
						filter += coordinates[0] + '-' + coordinates[1] + ']';
					} else {
						filter += coordinates[1] + '-' + coordinates[0] + ']';
					}
					background_modal_properties.$positions.filter(filter).prop('checked', true);
					temp_classes = temp_classes.replace(/rex-flex-(top|middle|bottom|left|center|right)\s*/g, '');
				} else {
					background_modal_properties.$positions.prop('checked', false);
				}
			}

			/* -------- Content Padding -------------------- */
			var saved_padding = $('#' + id).attr('data-content-padding');

			if( typeof saved_padding != 'undefined' && '' != saved_padding ) {
				var paddings = saved_padding.split(';');
				if( paddings.length > 1 ) {
					background_modal_properties.$block_padding_top.val( paddings[0].replace( /[\D]+/g, '' ) );
					background_modal_properties.$block_padding_right.val( paddings[1].replace( /[\D]+/g, '' ) );
					background_modal_properties.$block_padding_bottom.val( paddings[2].replace( /[\D]+/g, '' ) );
					background_modal_properties.$block_padding_left.val( paddings[3].replace( /[\D]+/g, '' ) );
				} else {
					background_modal_properties.$block_padding_top.val( paddings[0].replace( /[\D]+/g, '' ) );
					background_modal_properties.$block_padding_right.val( paddings[0].replace( /[\D]+/g, '' ) );
					background_modal_properties.$block_padding_bottom.val( paddings[0].replace( /[\D]+/g, '' ) );
					background_modal_properties.$block_padding_left.val( paddings[0].replace( /[\D]+/g, '' ) );
				}
				var width_type = paddings[0].match( /[\D]+/g )[0];
				switch( width_type ) {
					case 'px':
						background_modal_properties.$block_padding_type_pixel.prop('checked', true);
						break;
					case '%':
						background_modal_properties.$block_padding_type_percentage.prop('checked', true);
						break;
					default:
						break;
				}
			} else {
				background_modal_properties.$block_padding_top.val( '5' );
				background_modal_properties.$block_padding_right.val( '5' );
				background_modal_properties.$block_padding_bottom.val( '5' );
				background_modal_properties.$block_padding_left.val( '5' );
				background_modal_properties.$block_padding_type_percentage.prop('checked', true);
			}

			/* -------- Overlay Block Handle --------------- */
			background_modal_properties.$has_overlay_small.prop('checked', false);
			background_modal_properties.$has_overlay_medium.prop('checked', false);
			background_modal_properties.$has_overlay_large.prop('checked', false);

			background_modal_properties.$overlay_color_preview_icon.show();
			background_modal_properties.$overlay_color_palette_buttons.removeClass('palette-color-active');

			if(typeof block_custom_class != 'undefined' && block_custom_class != '') {
				var overlay_activators = block_custom_class.match(/active-(large|medium|small)-block-overlay/g);
				if( overlay_activators && overlay_activators.length > 0 ) {
					for(var i = 0; i<overlay_activators.length; i++) {
						var temp_overlay = overlay_activators[i];
						temp_overlay = temp_overlay.match(/active-(large|medium|small)(?=-block-overlay)/g);
						temp_overlay = temp_overlay[0].replace(/active-/g, '');
						var temp_filter = '[value=' + temp_overlay + ']';
						background_modal_properties.$has_overlay_group.filter(temp_filter).prop('checked', true);
					}
					temp_classes = temp_classes.replace(/active-(large|medium|small)-block-overlay\s*/g, '');
				}
			}

			var overlay_block_color = saved.overlay_block_color;
			if(typeof overlay_block_color != 'undefined' && overlay_block_color !== '') {
				background_modal_properties.$overlay_color_value.spectrum('set', overlay_block_color);
				background_modal_properties.$overlay_color_preview_icon.hide();
			} else {
				background_modal_properties.$overlay_color_value.spectrum('set', 'rgba(255,255,255,0.5)');
			}

			temp_classes = temp_classes.replace(/rex-flex-(top|middle|bottom|left|center|right)\s*/g, '');
			background_modal_properties.$class_value.val(temp_classes.trim());

			if(temp_classes != '') {
				background_modal_properties.$class_value.next().addClass('active');
			} else {
				background_modal_properties.$class_value.next().removeClass('active');
			}

			background_modal_properties.$modal.removeClass('rex-modal-section-background');

			background_modal_properties.$modal.show();
			background_modal_properties.$image_type_wrap.show();
			background_modal_properties.$link_wrap.show();
			background_modal_properties.$zoom_wrap.show();
			background_modal_properties.$class_wrap.show();
			background_modal_properties.$padding_wrap.show();

			$lean_overlay.show();
		});

		$('#background_block_set').on('click', '#background_up_img, #background_url, #bg-img-preview', function() {
		//$('#background_up_img').on('click', function() {
			uploadBlockBackground($(this));
		});

		$('#background_block_set').on('click', '#rex-block-upload-mp4', function() {
			editVideoBlock($(this));
		});

		$('#background_set_cancel').on('click', function() {
			$('#background_set_save').attr('data-block_id', '');
			$('#background_set_save').attr('data-section_id', '');
			$('#background_block_set').hide();
			$lean_overlay.hide();
		});

		$('#background_block_set').on('focus', '#block_link_value', function() {
			$('#block_has_link').prop('checked', true);
		});

		/**
		 *	Open the modal for edit the background of a section
		 */
		$(document).on('click', '.background_section_preview', function(e) {
			e.preventDefault();
			var $parent = $(this).parents('.builder-row'),
				saved;

			// If not setted, set the properties of the background modal
			if( !background_modal_properties.isset ) {
				background_modal_properties.isset = true;
				background_modal_properties.$modal = $('#background_block_set');
				background_modal_properties.$background_type = $('.background_type');
				background_modal_properties.$type_image = $('#background-value-image');
				background_modal_properties.$image_preview = $('#bg-img-preview');
				background_modal_properties.$image_preview_icon = background_modal_properties.$image_preview.find('i');
				background_modal_properties.$image_url = $('#background_url');
				background_modal_properties.$image_id = $('#background_up_img');
				background_modal_properties.$image_type_wrap = $('#bg-set-img-type');
				background_modal_properties.$image_type = $('.background_image_type');
				//background_modal_properties.$type_color = $('#background-value-color');
				//background_modal_properties.$color_value = $('#background-block-color');
				background_modal_properties.$color_preview = $('#background-color-preview');

				background_modal_properties.$zoom_wrap = $('#bg-set-photoswipe');
				background_modal_properties.$has_zoom = $('#background_photoswipe');
				background_modal_properties.$link_wrap = $('#bg-set-link-wrap');
				background_modal_properties.$has_link = $('#block_has_link');
				background_modal_properties.$link_value = $('#block_link_value');
				background_modal_properties.$class_wrap = $('#block-set-class-wrap');
				background_modal_properties.$class_value = $('#block_custom_class');
				background_modal_properties.$padding_wrap = $('#block-set-padding-wrap');

				background_modal_properties.$save_button = $('#background_set_save');
				background_modal_properties.$cancel_button = $('#background_set_cancel');
			}
			
			if($parent.attr('data-gridproperties') !== '') {
				saved = JSON.parse($parent.attr('data-gridproperties'));
			}

			background_modal_properties.$save_button.attr('data-section_id', $parent.attr('data-count'));
			background_modal_properties.$image_preview_icon.show();
			// $('#background_block_set').find('.background_set_image_type').hide(); TODO

			//$('#background-block-color').val('#ffffff');
			background_modal_properties.$color_value.spectrum('set', 'transparent');
			background_modal_properties.$color_runtime_value.val('');
			background_modal_properties.$image_url.val('');
			background_modal_properties.$image_id.val('');
			background_modal_properties.$background_type.prop('checked', false);

			background_modal_properties.$color_palette_buttons.removeClass('palette-color-active');
			background_modal_properties.$color_preview.css('background-color', 'transparent');
			background_modal_properties.$image_preview.css('background-image', 'none');
			background_modal_properties.$color_preview_icon.show();
			
			if( typeof saved.color != 'undefined' && saved.color !== '' ) {
				background_modal_properties.$color_value.spectrum('set', saved.color);
				background_modal_properties.$color_runtime_value.val(saved.color);
				background_modal_properties.$type_color.prop('checked', true);
				background_modal_properties.$color_preview.css('background-color', saved.color);
				background_modal_properties.$color_preview_icon.hide();
				
			} else if( typeof saved.image != 'undefined' && saved.image !== '' ) {
				background_modal_properties.$image_url.val(saved.url);
				background_modal_properties.$image_id.val(saved.image);
				background_modal_properties.$type_image.prop('checked', true);
				background_modal_properties.$image_preview.css('background-image', 'url(' + saved.url + ')');
				background_modal_properties.$image_preview_icon.hide();
			}

			background_modal_properties.$video_choose.prop('checked', false);
			background_modal_properties.$video_mp4_id.val('');
			background_modal_properties.$video_youtube_url.val('');
			background_modal_properties.$video_youtube_label.removeClass('active');

			if( typeof saved.video != 'undefined' && '' !== saved.video ) {
				background_modal_properties.$video_mp4.prop('checked', true);
				background_modal_properties.$video_mp4_id.val(saved.video);
			}

			if( typeof saved.youtube != 'undefined' && '' !== saved.youtube ) {
				background_modal_properties.$video_youtube.prop('checked', true);
				background_modal_properties.$video_youtube_url.val(saved.youtube);
				background_modal_properties.$video_youtube_label.addClass('active');
			}

			background_modal_properties.$modal.addClass('rex-modal-section-background');

			background_modal_properties.$modal.show();
			background_modal_properties.$zoom_wrap.hide();
			background_modal_properties.$link_wrap.hide();
			background_modal_properties.$class_wrap.hide();
			background_modal_properties.$padding_wrap.hide();
			background_modal_properties.$image_type_wrap.hide();
			$lean_overlay.show();
		});

		$('#background_block_set').on('focus', '#background_url, #background_up_img', function() {
			background_modal_properties.$type_image.prop('checked', true);
			/*background_modal_properties.$type_image_check.addClass('is-checked');
			background_modal_properties.$type_transparent_check.removeClass('is-checked');
			background_modal_properties.$type_color_check.removeClass('is-checked');*/
		});

		$('#background_block_set').on('focus', '#background-block-color', function() {
			background_modal_properties.$type_color.prop('checked', true);
			/*background_modal_properties.$type_color_check.addClass('is-checked');
			background_modal_properties.$type_transparent_check.removeClass('is-checked');
			background_modal_properties.$type_image_check.removeClass('is-checked');*/
		});

		/*$('#background_block_set').on('focus', '#background_url, #background-block-color, .background_image_type[value=full]', function() {
			$(this).siblings('.background_type').prop('checked', true);
		});
		$('#background_block_set').on('click', '#background_up_img', function() {
			$(this).siblings('.background_type').prop('checked', true);
		});*/

		/*$(document).find('.builder-edit-row-dimension').each(function() {
			var dim = {
				type: '',
				margin: 0,
			};
			dim.type = $(this).val();
			console.log(dim.type);
			$(this).parents('.builder-row').attr('data-griddimension', JSON.stringify(dim));
		});*/

		$('#background_set_save').on('click', function() {
			var id = $(this).attr('data-block_id'),
				block_parent = $(this).attr('data-block_parent'),
				section_id = $(this).attr('data-section_id'),
				type = $('.background_type:checked').val(),
				saved_custom_classes = $('#' + id).attr('data-block-custom-classes'),
				set = { 
					color: '', 
					image: '', 
					url: '', 
					bg_img_type: '', 
					photoswipe: '', 
					linkurl: '',
					block_custom_class: '',
					block_padding: '',
					video: '',
					youtube: '',
					overlay_block_color: '',
				},
				bg_image_type = $('.background_image_type:checked').val();

			switch(type) {
				case 'transparent':
					set.color = set.image = set.url = set.bg_img_type = '';
					break;
				case 'image':
					set.image = $('#background_up_img').val();
					set.url = $('#background_url').val();
					set.bg_img_type = $('.background_image_type:checked').val();
					break;
				case 'color':
					var c = background_modal_properties.$color_value.spectrum('get');
					//var alp = background_modal_properties.$color_opacity.noUiSlider.get() / 100;
					c = c.toRgbString();
					//c = c.replace(/^\w+/g, 'rgba');
					//c = c.replace(/\)/g, ', ' + alp + ')');
					set.color = c;

					set.color = background_modal_properties.$color_runtime_value.val();

					if( 'natural' == bg_image_type ) {
						set.image = $('#background_up_img').val();
						set.url = $('#background_url').val();
						set.bg_img_type = $('.background_image_type:checked').val();
					}
					break;
				default:
					break;
			}

			var $block_notice = $('#' + id).find('.element-visual-info');
			var active_video_notice = false;

			if( typeof background_modal_properties.$video_mp4_id.val() != 'undefined' 
				&& '' !== background_modal_properties.$video_mp4_id.val() ) {
				set.video = background_modal_properties.$video_mp4_id.val();
				active_video_notice = true;
			}

			if( typeof background_modal_properties.$video_youtube_url.val() != 'undefined' 
				&& '' !== background_modal_properties.$video_youtube_url.val() ) {
				set.youtube = background_modal_properties.$video_youtube_url.val();
				active_video_notice = true;
			}

			if(active_video_notice) {
				$block_notice.addClass('rex-active-video-notice');
			} else {
				$block_notice.removeClass('rex-active-video-notice');
			}

			if( section_id ) { // Edit the background of a section
				$('.builder-row[data-count=' + section_id + ']').attr('data-gridproperties', JSON.stringify(set));
				// Set the live preview
				switch(type) {
					case 'transparent':
						$('.builder-row[data-count=' + section_id + ']').find('.background_section_preview').css('background-image', 'none' );
						$('.builder-row[data-count=' + section_id + ']').find('.background_section_preview').css('background-color', 'transparent' );
						$('.builder-row[data-count=' + section_id + ']').find('.gridster > ul').css('background-color', 'transparent');
						$('.builder-row[data-count=' + section_id + ']').find('.gridster > ul').css('background-image', 'none');
						break;
					case 'image':
						$('.builder-row[data-count=' + section_id + ']').find('.background_section_preview').css('background-image', 'url(' + set.url + ')' );
						$('.builder-row[data-count=' + section_id + ']').find('.background_section_preview').css('background-color', 'transparent' );
						$('.builder-row[data-count=' + section_id + ']').find('.gridster > ul').css('background-image', 'url(' + set.url + ')' );
						$('.builder-row[data-count=' + section_id + ']').find('.gridster > ul').css('background-color', 'transparent');
						break;
					case 'color':
						$('.builder-row[data-count=' + section_id + ']').find('.background_section_preview').css('background-image', 'none' );
						$('.builder-row[data-count=' + section_id + ']').find('.background_section_preview').css('background-color', set.color );
						$('.builder-row[data-count=' + section_id + ']').find('.gridster > ul').css('background-color', set.color);
						$('.builder-row[data-count=' + section_id + ']').find('.gridster > ul').css('background-image', 'none');
						break;
					default:
						break;
				}
			} else if( id ) { // Edit the background of a block
				var $block_to_save = $('.builder-row[data-count="' + block_parent + '"] #' + id);

				//if($('.block_has_link').prop('checked') == true) {
				if(typeof background_modal_properties.$link_value.val() != 'undefined' &&
					background_modal_properties.$link_value.val() != '') {
					set.linkurl = $('#block_link_value').val();
				}

				if($('#background_photoswipe').prop('checked') == true) {
					set.photoswipe = 'true';
				}

				//if(typeof background_modal_properties.$class_value.val() != 'undefined' && background_modal_properties.$class_value.val() != '') {
				var inserted_classes = background_modal_properties.$class_value.val();

				var classi_merge = saved_custom_classes.match(/active-(small|medium|large)-block-overlay|rex-flex-(top|middle|bottom|left|center|right)/g);
				if(!classi_merge) {
					classi_merge = '';
				} else {
					classi_merge = classi_merge.join(' ');
				}
				var class_value = inserted_classes.trim() + ' ' + classi_merge.trim();

				$block_to_save.attr('data-block-custom-classes', class_value);

				/* -- Setting Content Position -- */

				var flex_content_position = background_modal_properties.$positions.filter(':checked').val();
				var set_position = '',
					set_preview = '';
				var s = saved_custom_classes.replace(/rex-flex-(top|middle|bottom|left|center|right)\s*/g, '');

				if( typeof flex_content_position != 'undefined' && flex_content_position !== '' ) {
					set_preview += 'element-content-positioned';
					var coordinates = flex_content_position.match(/(top|middle|bottom|left|center|right)/g);
					switch(coordinates[0]) {
						case 'top':
							set_position += ' rex-flex-top';
							set_preview += ' element-content-positioned-top';
							break;
						case 'middle':
							set_position += ' rex-flex-middle';
							set_preview += ' element-content-positioned-middle';
							break;
						case 'bottom':
							set_position += ' rex-flex-bottom';
							set_preview += ' element-content-positioned-bottom';
							break;
						default:
							break;
					}
					switch(coordinates[1]) {
						case 'left':
							set_position += ' rex-flex-left';
							set_preview += ' element-content-positioned-left';
							break;
						case 'center':
							set_position += ' rex-flex-center';
							set_preview += ' element-content-positioned-center';
							break;
						case 'right':
							set_position += ' rex-flex-right';
							set_preview += ' element-content-positioned-right';
							break;
						default:
							break;
					}
				}

				s = s + ' ' + set_position.trim();
				$block_to_save.attr('data-block-custom-classes', s.trim());
				$block_to_save
					.find('.element-preview-wrap')
					.removeClass('element-content-positioned-top element-content-positioned-middle element-content-positioned-bottom element-content-positioned-left element-content-positioned-center element-content-positioned-right')
					.addClass(set_preview);

				/* ------ Setting Content Padding ---------- */
				var block_padding = '',
					padding_type = $('.bm-block-padding-type:checked').val(),
					padding_unit_measure = '';

				switch(padding_type) {
					case 'percentage':
						padding_unit_measure = '%;';
						break;
					case 'pixel':
						padding_unit_measure = 'px;';
						break;
					default:
						break;
				}

				var pt = background_modal_properties.$block_padding_top.val();
				var pr = background_modal_properties.$block_padding_right.val();
				var pb = background_modal_properties.$block_padding_bottom.val();
				var pl = background_modal_properties.$block_padding_left.val();

				if( typeof pt != 'undefined' && pt != '' && pt.search( /[\d]+/g ) !== -1 ) {
					block_padding += pt + padding_unit_measure;
				} else {
					block_padding += '0' + padding_unit_measure;
				}

				if( typeof pr != 'undefined' && pr != '' && pr.search( /[\d]+/g ) !== -1 ) {
					block_padding += pr + padding_unit_measure;
				} else {
					block_padding += '0' + padding_unit_measure;
				}

				if( typeof pb != 'undefined' && pb != '' && pb.search( /[\d]+/g ) !== -1 ) {
					block_padding += pb + padding_unit_measure;
				} else {
					block_padding += '0' + padding_unit_measure;
				}

				if( typeof pl != 'undefined' && pl != '' && pl.search( /[\d]+/g ) !== -1 ) {
					block_padding += pl + padding_unit_measure;
				} else {
					block_padding += '0' + padding_unit_measure;
				}
				
				$block_to_save.attr('data-content-padding', block_padding);

				/* ------ Setting Block Overlay ------------ */
				var overlay_activation = background_modal_properties.$has_overlay_group.filter(':checked').map(function() {
					return this.value;
				}).get();

				var custom_overlay = '';

				for( var i = 0; i < overlay_activation.length; i++ ) {
					switch(overlay_activation[i]) {
						case 'small':
							custom_overlay += ' active-small-block-overlay';
							break;
						case 'medium':
							custom_overlay += ' active-medium-block-overlay';
							break;
						case 'large':
							custom_overlay += ' active-large-block-overlay';
							break;
						default:
							break;
					}
				}

				//if( custom_overlay != '' ) {
				var saved_classes = $block_to_save.attr('data-block-custom-classes');
				saved_classes = saved_classes.replace(/active-(small|medium|large)-block-overlay\s*/g, '').trim();

				var to_save = saved_classes + ' ' + custom_overlay.trim();
				$block_to_save.attr('data-block-custom-classes', to_save.trim());
				//}

				var overlay_block_color = background_modal_properties.$overlay_color_value.spectrum('get').toRgbString();
				if(overlay_block_color != '' && overlay_activation.length != 0) {
					set.overlay_block_color = overlay_block_color;
					$block_to_save.find('.element-visual-info').css('background-color', overlay_block_color);
				} else {
					set.overlay_block_color = '';
					background_modal_properties.$overlay_color_value.spectrum('set', 'transparent');
					$block_to_save.find('.element-visual-info').css('background-color', 'transparent');
				}

				$block_to_save.attr('data-bg_settings', JSON.stringify(set));
				switch(type) {
					case 'transparent':
						$block_to_save.find('.element-preview-wrap').css('background-image', '');
						$block_to_save.find('.element-preview-wrap').css('background-color', '');
						$block_to_save.find('.element-preview').find('img').remove();
						if($block_to_save.find('.data-text-content').val() == '') {
							$block_to_save.trigger('blockBecomeEmpty');
						}
						$block_to_save.addClass('with-border').removeClass('no-border');
						break;
					case 'image':
						if( bg_image_type == 'full' ) {
							$block_to_save.find('.element-preview-wrap').css('background-image', 'url(' + set.url + ')' );
							$block_to_save.find('.element-preview').find('img').remove();
						} else if( bg_image_type == 'natural' ) {
							$block_to_save.find('.element-preview-wrap').css('background-image', '' );
							$block_to_save.find('.element-preview').empty().append('<img src="' + set.url + '" alt="">');
							$block_to_save.find('.element-data textarea').val('');
						}
						$block_to_save.addClass('no-border').removeClass('with-border');
						$block_to_save.trigger('blockReturnsNormal');
						break;
					case 'color':
						$block_to_save.find('.element-preview-wrap').css('background-color', set.color );
						$block_to_save.find('.element-preview-wrap').css('background-image', '' );
						if( 'natural' == bg_image_type ) {
							$block_to_save.find('.element-preview').empty().append('<img src="' + set.url + '" alt="">');
							$block_to_save.find('.element-data textarea').val('');
							//naturalImageSet($('#' + id));
						}
						if(set.color != 'rgba(255, 255, 255, 0)' || set.color != 'transparent') {
							$block_to_save.addClass('no-border').removeClass('with-border');
						} else {
							$block_to_save.addClass('with-border').removeClass('no-border');
						}
						$block_to_save.trigger('blockReturnsNormal');
						break;
					default:
						break;
				}

				if( type != 'transparent' ) {

					if( $block_to_save.hasClass('empty') ) {
						if( set.color !== '' || set.image !== '' ) {
							$block_to_save.find('.element-preview .vert-wrap').addClass('hidden');
						} else {
							$block_to_save.find('.element-preview .vert-wrap').removeClass('hidden');
						}
					}
				} else {
					//$('#' + id).find('.element-preview').css('background-image', '');
					//$('#' + id).find('.element-preview').find('img').remove();
				}
				$block_to_save.trigger('blockChangeImage');
				$(document).trigger('sectionCollectData', collect[$block_to_save.parents('.builder-row').attr('data-count')] );
			}

			$(this).attr('data-block_id', '');
			$(this).attr('data-section_id', '');
			$('#background_block_set').hide();
			$lean_overlay.hide();
		});

		$('.background_type').on('change', function(e) {
		});

		$(document).on('click', '.builder-edit-sectionid', function(e) {
			e.preventDefault();
			var $parent = $(this).parents('.builder-row');

			$('#sectionid-set-save').attr('data-section_id', $parent.attr('data-count'));
			if($parent.attr('data-sectionid') === '') {
				$('#sectionid-container').val('');
			} else {
				$('#sectionid-container').val($parent.attr('data-sectionid'));
			}

			$('#modal-sectionid-set').show();
		});

		$(document).on('click', '#sectionid-set-cancel', function(e) {
			e.preventDefault();
			$('#modal-sectionid-set').hide();
		});

		$(document).on('click', '#sectionid-set-save', function(e) {
			e.preventDefault();
			var section_id = $(this).attr('data-section_id');

			$('.builder-row[data-count=' + section_id + ']').attr('data-sectionid', $('#sectionid-container').val());
			$('#modal-sectionid-set').hide();
		});

		/**
		 *	Open the modal for config the section
		 */

		$(document).on('click', '.builder-section-config', function(e) {
			e.preventDefault();
			var $parent = $(this).parents('.builder-row'),
				config_settings,
				//navigation_settings,
				layout_settings,
				custom_section_name = $parent.attr( 'data-sectionid' );

			section_config_modal_properties.$color_palette_buttons.removeClass('palette-color-active');

			var section_width_type = $parent.find('.builder-edit-row-wrap input[type="radio"][name^="section-dimension-"]').filter(':checked').val();

			if( '' !== $parent.attr( 'data-backresponsive' ) ) {
				config_settings = JSON.parse( $parent.attr( 'data-backresponsive' ) );
			}

			/*if( '' !== $parent.attr( 'data-sectionid' ) ) {
				navigation_settings = JSON.parse( $parent.attr( 'data-sectionid' ) );
			}*/

			if( '' !== $parent.attr( 'data-layout' ) ) {
				layout_settings = $parent.attr( 'data-layout' );
			}

			if( '' !== custom_section_name ) {
				section_config_modal_properties.$section_id.val( custom_section_name );
			} else {
				section_config_modal_properties.$section_id.val( '' );
			}

			section_config_modal_properties.$section_layout_type.prop('checked', false);
			switch(layout_settings) {
				case 'fixed':
					section_config_modal_properties.$section_fixed.prop('checked', true);
					break;
				case 'masonry':
					section_config_modal_properties.$section_masonry.prop('checked', true);
					break;
				default:
					section_config_modal_properties.$section_fixed.prop('checked', true);
					break;
			}

			section_config_modal_properties.$has_overlay_small.prop('checked', false);
			section_config_modal_properties.$has_overlay_medium.prop('checked', false);
			section_config_modal_properties.$has_overlay_large.prop('checked', false);
			section_config_modal_properties.$color_preview_icon.show();

			section_config_modal_properties.$color_value.spectrum('set', 'rgba(255,255,255,0.5)');

			if( config_settings ) {
				/* -------- Overlay Section Handler ----------------------- */
				var overlay_regexr = /active-(small|medium|large)-overlay/g;
				var overlay_info = config_settings.custom_classes.match(overlay_regexr, '');
				if( overlay_info ) {
					for(var i=0;i<overlay_info.length;i++) {
						switch(overlay_info[i]) {
							case 'active-small-overlay':
								section_config_modal_properties.$has_overlay_small.prop('checked', true);
								break;
							case 'active-medium-overlay':
								section_config_modal_properties.$has_overlay_medium.prop('checked', true);
								break;
							case 'active-large-overlay':
								section_config_modal_properties.$has_overlay_large.prop('checked', true);
								break;
							default:
								break;
						}
					}
					var overlay_color = 'rgba(' + config_settings.r + ',' + config_settings.g + ',' + config_settings.b + ',' + config_settings.a + ')';
					section_config_modal_properties.$color_value.spectrum('set', overlay_color);
					if(config_settings.a != 0)
						section_config_modal_properties.$color_preview_icon.hide();
				}

				var custom_classes = config_settings.custom_classes.replace(overlay_regexr, '');

				/* --------- Gutter Section Handler --------------------------- */
				if( typeof config_settings.gutter != 'undefined') {
					$('.section-set-block-gutter').val( config_settings.gutter );
				} else {
					$('.section-set-block-gutter').val( '20' );
				}

				if( typeof custom_classes != 'undefined' && custom_classes != '' ) {
					$('#section-set-custom-class').val( custom_classes );
				} else {
					$('#section-set-custom-class').val( '' );
				}

				if( typeof config_settings.isFull != 'undefined' && 'true' == config_settings.isFull ) {
					section_config_modal_properties.$is_full.prop('checked', true);
				} else {
					section_config_modal_properties.$is_full.prop('checked', false);
				}

				/*if( typeof config_settings.section_width != 'undefined' && config_settings.section_width !== '' ) {
					var width_type = ( config_settings.section_width ).match( /[\D]+/g )[0];
					var width_value = ( config_settings.section_width ).replace( /[\D]+/g, '');
					if( width_value === '' ) {
						width_value = 80;
					}

					if('full' == section_width_type || ( '100' == width_value && '%' == width_type ) ) {
						section_config_modal_properties.$section_boxed_width.val( '100' );
						$('.section-width-type[value=percentage]').prop('checked', true);
						section_config_modal_properties.$section_full.prop('checked', true);
					} else if('boxed' == section_width_type) {
						section_config_modal_properties.$section_boxed_width.val( width_value );
						section_config_modal_properties.$section_boxed.prop('checked', true);
						switch( width_type ) {
							case 'px':
								$('.section-width-type[value=pixel]').prop('checked', true);
								break;
							case '%':
								$('.section-width-type[value=percentage]').prop('checked', true);
								break;
							default:
								break;
						}
					}
				}*/

				if('full' == section_width_type) {
					section_config_modal_properties.$section_boxed_width.val( '100' );
					$('.section-width-type[value=percentage]').prop('checked', true);
					section_config_modal_properties.$section_full.prop('checked', true);
				} else if('boxed' == section_width_type) {
					if( typeof config_settings.section_width != 'undefined' && config_settings.section_width !== '' ) {
						var width_type = ( config_settings.section_width ).match( /[\D]+/g )[0];
						var width_value = ( config_settings.section_width ).replace( /[\D]+/g, '');
						if( width_value === '' ) {
							width_value = 80;
						}
						section_config_modal_properties.$section_boxed_width.val( width_value );
						section_config_modal_properties.$section_boxed.prop('checked', true);
						switch( width_type ) {
							case 'px':
								$('.section-width-type[value=pixel]').prop('checked', true);
								break;
							case '%':
								$('.section-width-type[value=percentage]').prop('checked', true);
								break;
							default:
								break;
						}
					} else {
						$('.section-width-type[value=percentage]').prop('checked', true);
						section_config_modal_properties.$section_boxed_width.val( '80' );
						section_config_modal_properties.$section_boxed.prop('checked', true);
					}
				}
			} else {
				$('.backresponsive-opacity-section').val( '0' );
				$('.section-set-block-gutter').val( '20' );
				$('#section-set-custom-class').val( '' );
				$('.section-width-type[value=percentage]').prop('checked', true);
				if('full' == section_width_type) {
					section_config_modal_properties.$section_boxed_width.val( '100' );
					section_config_modal_properties.$section_full.prop('checked', true);
				} else if('boxed' == section_width_type) {
					section_config_modal_properties.$section_boxed_width.val( '80' );
					section_config_modal_properties.$section_boxed.prop('checked', true);
				}
				section_config_modal_properties.$is_full.prop('checked', false);
			}

			$('#backresponsive-set-save').attr('data-section_id', $parent.attr('data-count'));
			$('#backresponsive-set-reset').attr('data-section_id', $parent.attr('data-count'));
			$('#modal-background-responsive-set').show();
			$lean_overlay.show();
		});

		$(document).on('click', '#backresponsive-set-cancel', function(e) {
			e.preventDefault();
			$('#modal-background-responsive-set').hide();
			$lean_overlay.hide();
		});

		$(document).on('click', '#backresponsive-set-reset', function(e) {
			e.preventDefault();
			var section_id = $(this).attr('data-section_id');
			$('.builder-row[data-count=' + section_id + ']').attr( 'data-backresponsive', '') ;
			$('#modal-background-responsive-set').hide();
			$lean_overlay.hide();
		});

		$(document).on('click', '#backresponsive-set-save', function(e) {
			e.preventDefault();
			var section_id = $(this).attr('data-section_id'),
				color = $('.backresponsive-color-section').spectrum('get'),
				opacity = $('.backresponsive-opacity-section').val(),
				gutter = $('.section-set-block-gutter').val(),
				custom_classes = $('#section-set-custom-class').val(),
				section_width = '',
				section_is_full_width = ( true === section_config_modal_properties.$section_full.prop('checked') ? 'true' : 'false' ),
				section_is_boxed_width = ( true === section_config_modal_properties.$section_boxed.prop('checked') ? 'true' : 'false' ),
				isFull = ( true === section_config_modal_properties.$is_full.prop('checked') ? 'true' : '' ),
				has_small_overlay = ( true === section_config_modal_properties.$has_overlay_small.prop('checked') ? 'true' : '' ),
				has_medium_overlay = ( true === section_config_modal_properties.$has_overlay_medium.prop('checked') ? 'true' : '' ),
				has_large_overlay = ( true === section_config_modal_properties.$has_overlay_large.prop('checked') ? 'true' : '' ),
				section_custom_name = section_config_modal_properties.$section_id.val();

			var layout = section_config_modal_properties.$section_layout_type.filter(':checked').val();

			var $row = $('.builder-row[data-count=' + section_id + ']');
			$row.attr( 'data-layout', layout );

			// Handle main builder view checkboxes
			var section_width_type = $row.find('.builder-edit-row-wrap input[type="radio"][name^="section-dimension-"]');
			var section_width_type_full = section_width_type.filter('[id^=section-full]');
			var section_width_type_boxed = section_width_type.filter('[id^=section-boxed]');

			// Setting custom name section
			if(section_custom_name != '') {
				$row.attr( 'data-sectionid', section_custom_name);
			}

			// Setting section layout type
			switch(layout) {
				case 'masonry': 	//This means that the user is changing the section view from fixed TO masonry
					$row.find('.builder-elements li.item:not(.expand)').each(function() {
						var $this = $(this);
						var bg_settings = $this.data('bg_settings');
						if(typeof bg_settings != 'undefined' && '' != bg_settings.bg_img_type && 'full' == bg_settings.bg_img_type ) {
							bg_settings.bg_img_type = 'natural';
							$this.attr('data-bg_settings', JSON.stringify(bg_settings));
							$this.trigger('blockChangeImage');
						}
					});
					break;
				case 'fixed': 	//This means that the user is changing the section view from masonry TO fixed
					$row.find('.builder-elements li.item:not(.expand)').each(function() {
						var $this = $(this);
						var bg_settings = $this.data('bg_settings');
						if(typeof bg_settings != 'undefined' && '' != bg_settings.bg_img_type && 'natural' == bg_settings.bg_img_type ) {
							bg_settings.bg_img_type = 'full';
							$this.attr('data-bg_settings', JSON.stringify(bg_settings));
							$this.trigger('blockChangeImage');
						}
					});
					break;
				default:
					break;
			}

			// Setting section overlay
			var section_has_overlay = false;

			if( 'true' == has_small_overlay ) {
				custom_classes += ' active-small-overlay';
				section_has_overlay = true;
			}

			if( 'true' == has_medium_overlay ) {
				custom_classes += ' active-medium-overlay';
				section_has_overlay = true;
			}

			if( 'true' == has_large_overlay ) {
				custom_classes += ' active-large-overlay';
				section_has_overlay = true;
			}

			// Section dimension
			if( 'true' == section_is_full_width ) {
				section_width_type_full.prop('checked', true);
				section_width_type_boxed.prop('checked', false);
				$row.attr('data-griddimension', 'full');
			} else if( 'true' == section_is_boxed_width ) {
				section_width_type_full.prop('checked', false);
				section_width_type_boxed.prop('checked', true);
				$row.attr('data-griddimension', 'boxed');
			}

			section_width = section_config_modal_properties.$section_boxed_width.val();

			var width_type = $('.section-width-type:checked').val();
			switch(width_type) {
				case 'percentage':
					if('100' == section_width) {
						section_width = '';
					}
					section_width = section_width + '%';
					break;
				case 'pixel':
					section_width = section_width + 'px';
					break;
				default:
					break;
			}

			var config_settings = {
				r: Math.floor(color._r),
				g: Math.floor(color._g),
				b: Math.floor(color._b),
				a: color._a,
				gutter : gutter,
				isFull : isFull,
				custom_classes : custom_classes.trim(),
				section_width : section_width
			};

			// Setting overlay section preview
			if(section_has_overlay) {
				var section_overlay_preview = ':rgba(' + config_settings.r + ',' + config_settings.g + ',' + config_settings.b + ',' + config_settings.a + ')';
				$row.find('.gridster .section-visual-info').css('background-color', section_overlay_preview).addClass('active-section-visual-info');
			} else {
				$row.find('.gridster .section-visual-info').removeClass('active-section-visual-info');
			}

			$row.attr( 'data-backresponsive', JSON.stringify(config_settings) );

			setBuilderTimeStamp();

			$('#modal-background-responsive-set').hide();
			$lean_overlay.hide();
		});

		// Main builder view radio button handler
		$(document).on('change', '.builder-edit-row-dimension', function() {
			var dim = $(this).val();
			$(this).parents('.builder-row').attr('data-griddimension', dim);
		});

		/*$(document).find('.builder-edit-row-layout').each(function() {
			var layout = $(this).val();
			console.log(layout);
			$(this).parents('.builder-row').attr('data-layout', layout);
		});*/

		/*$(document).on('change', '.builder-edit-row-layout', function() {			
			var layout = $(this).val();
			var $row = $(this).parents('.builder-row');
			$row.attr('data-layout', layout);

			switch(layout) {
				case 'masonry': 	//This means that the user is changing the section view from fixed TO masonry
					$row.find('.builder-elements li.item:not(.expand)').each(function() {
						var $this = $(this);
						var bg_settings = $this.data('bg_settings');
						if(typeof bg_settings !== 'undefined' && '' !== bg_settings.bg_img_type && 'full' == bg_settings.bg_img_type ) {
							bg_settings.bg_img_type = 'natural';
							$this.attr('data-bg_settings', JSON.stringify(bg_settings));
							$this.trigger('blockChangeImage');
						}
					});
					break;
				case 'fixed': 	//This means that the user is changing the section view from masonry TO fixed
					$row.find('.builder-elements li.item:not(.expand)').each(function() {
						var $this = $(this);
						var bg_settings = $this.data('bg_settings');
						if(typeof bg_settings !== 'undefined' && '' !== bg_settings.bg_img_type && 'natural' == bg_settings.bg_img_type ) {
							bg_settings.bg_img_type = 'full';
							$this.attr('data-bg_settings', JSON.stringify(bg_settings));
							$this.trigger('blockChangeImage');
						}
					});
					break;
				default:
					break;
			}
		});*/

		$(document).on('blockBecomeEmpty', 'li.item', function() {
			var empty_template = '<div class="vert-wrap" style="background-color:#ddd;"><div class="vert-elem"><span class="empty-label">SPACE</span></div></div>';
			$(this).find('.backend-image-preview').hide();

			if( $(this).find('.element-preview .vert-wrap').length === 0 ) {
				$(this).find('.element-preview').append(empty_template);
			} else {
				$(this).find('.element-preview .vert-wrap').show();
			}
		});

		$(document).on('blockReturnsNormal', 'li.item', function() {
			$(this).find('.backend-image-preview').show();
			$(this).find('.element-preview .vert-wrap').hide();
		});

		$(document).on('blockChangeImage', 'li.item', function() {
			var setts = JSON.parse($(this).attr('data-bg_settings'));
			if(setts.bg_img_type == 'natural') {
				$(this).find('.edit_handler').addClass('hide-edit-handler');
			} else {
				$(this).find('.edit_handler').removeClass('hide-edit-handler');
			}
		});


		/**
		 *	Force to collect the data before saving the post
		 */
		$('#post').on('submit', function(e) {
			var i;
			if( _plugin_backend_settings.activate_builder && $('#builder-switch').prop('checked') ) {
				for(i=0;i<collect.length;i++) {
					collect[i].fillEmptyCells();
					collect[i].collectGridData();
				}
				saveAllData();
				return true;
			}
		});

		/**
		 *	Handle live refersh for WPML
		 */

		var $icl_copy_content_button = $('#icl_cfo');		// For WPML issues
		var wpml_global_import_check = false;

		if( $icl_copy_content_button.length > 0 ) {

			$icl_copy_content_button.on('click', function() {
				wpml_global_import_check = true;
			});

			// Listen to all the AJAX calls
			$(document).ajaxSuccess(function(event, xhr, settings) {
				// If the call comes from the WPML button...
				if( icl_ajx_url != settings.url) {
					// I put this check here because it's the most likely
				} else {
					if(!wpml_global_import_check) {
						// I put this check here because it's the most likely
					} else {
						wpml_global_import_check = false;
						$gridarea.find('#builder-area').empty();
						$gridarea.find('#builder-area').append('<tr id="loading-builder"><td>LOADING...<img src="' + icl_ajxloaderimg_src + '"</td></tr>');
						var content = $(this).val();
						$.ajax({
							url: rexajax.ajaxurl,
							type: 'post',
							data: {
								action: 'live_refresh_builder',
								post_id: $('#icl_set_duplicate').attr('data-wpml_original_post_id'),
								rexnonce: rexajax.rexnonce,
							},
							success: function(response) {
								$('#loading-builder').remove();
								$gridarea.find('#builder-area').html(response);
								collect = [];
								counter = 0;
								$('.builder-row').each(function(index, el) {
									collect[index] = new Section($(el), index);
									collect[index].init();
									counter++;
								});
								
								$builderArea.sortable('refresh');
								/*$builderArea.sortable({
									revert: true,
									handle: '.builder-move-row'
								}).sortable('refresh');*/
							},
						});
					}
				}
			});

		}

		function RenderMediaUploader() {
			// If the frame is already opened, return it
			if( image_uploader_frame ) {
				image_uploader_frame.open();
				return;
			}

			//create a new Library, base on defaults
			//you can put your attributes in
			var insertImage = wp.media.controller.Library.extend({
				defaults :  _.defaults({
					id:        'insert-image',
					title:      'Insert Image',
					allowLocalEdits: true,
					displaySettings: true,
					displayUserSettings: true,
					multiple : true,
					library: wp.media.query( { type: 'image' } ),
					type : 'image'//audio, video, application/pdf, ... etc
				  }, wp.media.controller.Library.prototype.defaults )
			});

			//Setup media frame
			image_uploader_frame = wp.media({
				button : { text : 'Select' },
				state : 'insert-image',
				states : [
					new insertImage()
				]
			});

			//on close, if there is no select files, remove all the files already selected in your main frame
			image_uploader_frame.on('close',function() {
				var selection = image_uploader_frame.state('insert-image').get('selection');
				if(!selection.length){
				}				
			});


			image_uploader_frame.on('select', function() {
				var state = image_uploader_frame.state('insert-image');
				var selection = state.get('selection');
				var imageArray = [];

				if ( ! selection ) return;

				 //to get right side attachment UI info, such as: size and alignments
				//org code from /wp-includes/js/media-editor.js, arround `line 603 -- send: { ... attachment: function( props, attachment ) { ... `
				selection.each(function(attachment) {
					var display = state.display( attachment ).toJSON();
					var obj_attachment = attachment.toJSON();
					var caption = obj_attachment.caption, options, html;

					// If captions are disabled, clear the caption.
					if ( ! wp.media.view.settings.captions )
						delete obj_attachment.caption;

					display = wp.media.string.props( display, obj_attachment );

					options = {
						id:        obj_attachment.id,
						post_content: obj_attachment.description,
						post_excerpt: caption
					};

					if ( display.linkUrl )
						options.url = display.linkUrl;

					if ( 'image' === obj_attachment.type ) {
						var img_prev_src;
						img_prev_src = obj_attachment.url;

						var bg_setts = {
							color:'',
							image:obj_attachment.id,
							url:obj_attachment.url,
							bg_img_type:'full',
							//photoswipe:'',
							linkurl:''
						};
						var new_block_id = 'block_' + global_section_reference.sectIndex + '_' + global_section_reference.internalIndex;
						var html = image_template
							.replace(/\bdata.textid\b/, new_block_id)
							.replace(/\bdata.bgblocksetts\b/, JSON.stringify( bg_setts ))
							.replace(/\bdata.elementactionsplaceholder\b/, element_actions)
							.replace(/\bdata.imgprevsrc\b/, img_prev_src)
							.replace(/\bdata.attachmentid\b/, obj_attachment.id);

						/*html = '<li id="block_' + global_section_reference.sectIndex + '_' + global_section_reference.internalIndex + '" class="image item no-border z-depth-1 hoverable svg-ripple-effect" data-block_type="image" data-block-custom-classes=\'\' data-content-padding=\'\' data-bg_settings=\'' + JSON.stringify( bg_setts ) + '\'>' + 
									element_actions +
									'<div class="element-data">' +
										'<textarea class="data-text-content" display="none"></textarea>' +
									'</div>' +
									'<div class="element-preview" style="background-image:url(' + img_prev_src + ');">' +
										'<div class="backend-image-preview" data-image_id="'+ obj_attachment.id + '"></div>' +
									'</div>' +
								'</li>';*/
					} else if ( 'video' === obj_attachment.type ) {
						html = wp.media.string.video( display, obj_attachment );
					} else if ( 'audio' === obj_attachment.type ) {
						html = wp.media.string.audio( display, obj_attachment );
					} else {
						html = wp.media.string.link( display );
						options.post_title = display.title;
					}

					//attach info to attachment.attributes object
					attachment.attributes['nonce'] = wp.media.view.settings.nonce.sendToEditor;
					attachment.attributes['attachment'] = options;
					attachment.attributes['html'] = html;
					attachment.attributes['post_id'] = wp.media.view.settings.post.id;
					
					global_section_reference.gridRef.add_widget(attachment.attributes['html'], 2, 2);
					global_section_reference.internalIndex++;
					launchTooltips();
				});
				$(document).trigger('sectionCollectData', global_section_reference );
			});

			//reset selection in popup, when open the popup
			image_uploader_frame.on('open',function() {
				var selection = image_uploader_frame.state('insert-image').get('selection');

				//remove all the selection first
				selection.each(function(image) {
					var attachment = wp.media.attachment( image.attributes.id );
					attachment.fetch();
					selection.remove( attachment ? [ attachment ] : [] );
				});
			});

			//now open the popup
			image_uploader_frame.open();
		}	// RenderMediaUploader END


		function uploadBlockBackground($wrap) {
			if( image_block_edit_frame ) {
				image_block_edit_frame.open();
				return;
			}

			//create a new Library, base on defaults
			//you can put your attributes in
			var editImage = wp.media.controller.Library.extend({
				defaults :  _.defaults({
					id:        'upload-block-bg',
					title:      'Upload Background',
					allowLocalEdits: true,
					displaySettings: true,
					displayUserSettings: true,
					multiple : false,
					library: wp.media.query( { type: 'image' } ),
					type : 'image',//audio, video, application/pdf, ... etc	            
				  }, wp.media.controller.Library.prototype.defaults )
			});

			//Setup media frame
			image_block_edit_frame = wp.media({
				button : { text : 'Select' },
				state : 'upload-block-bg',
				states : [
					new editImage()
				]
			});

			//on close, if there is no select files, remove all the files already selected in your main frame
			image_block_edit_frame.on('close',function() {
				var selection = image_block_edit_frame.state('upload-block-bg').get('selection');
				if(!selection.length){
				}
			});


			image_block_edit_frame.on( 'select', function() {
				var state = image_block_edit_frame.state('upload-block-bg');
				var selection = state.get('selection');
				var imageArray = [];

				if ( ! selection ) return;

				 //to get right side attachment UI info, such as: size and alignments
				//org code from /wp-includes/js/media-editor.js, arround `line 603 -- send: { ... attachment: function( props, attachment ) { ... `
				selection.each(function(attachment) {
					var display = state.display( attachment ).toJSON();
					var obj_attachment = attachment.toJSON()
					var caption = obj_attachment.caption, options, html;

					// If captions are disabled, clear the caption.
					if ( ! wp.media.view.settings.captions )
						delete obj_attachment.caption;

					display = wp.media.string.props( display, obj_attachment );

					options = {
						id:        obj_attachment.id,
						post_content: obj_attachment.description,
						post_excerpt: caption
					};

					if ( display.linkUrl )
						options.url = display.linkUrl;

					if ( 'image' === obj_attachment.type ) {
					} else if ( 'video' === obj_attachment.type ) {
						html = wp.media.string.video( display, obj_attachment );
					} else if ( 'audio' === obj_attachment.type ) {
						html = wp.media.string.audio( display, obj_attachment );
					} else {
						html = wp.media.string.link( display );
						options.post_title = display.title;
					}

					//attach info to attachment.attributes object
					attachment.attributes['nonce'] = wp.media.view.settings.nonce.sendToEditor;
					attachment.attributes['attachment'] = options;
					attachment.attributes['html'] = html;
					attachment.attributes['post_id'] = wp.media.view.settings.post.id;

					$wrap.val(obj_attachment.id);
					background_modal_properties.$image_url.val(obj_attachment.url);
					background_modal_properties.$image_id.val(obj_attachment.id);
					background_modal_properties.$image_preview.css('background-image', 'url(' + obj_attachment.url + ')');
					background_modal_properties.$image_preview_icon.hide();
					background_modal_properties.$type_image.prop('checked', true);
				});
			});

			//reset selection in popup, when open the popup
			image_block_edit_frame.on('open',function() {
				var attachment;
				var selection = image_block_edit_frame.state('upload-block-bg').get('selection');

				//remove all the selection first
				selection.each(function(image) {
					attachment = wp.media.attachment( image.attributes.id );
					attachment.fetch();
					selection.remove( attachment ? [ attachment ] : [] );
				});

				// Check the already inserted image
				if( background_modal_properties.$image_id.val() ) {
					attachment = wp.media.attachment( background_modal_properties.$image_id.val() );
					attachment.fetch();
					selection.add( attachment ? [ attachment ] : [] );
				}
			});

			//now open the popup
			image_block_edit_frame.open();
		}	// uploadBlockBackground END

		function uploadVideoBlock() {
			// If the frame is already opened, return it
			if( video_uploader_frame ) {
				video_uploader_frame.open();
				return;
			}

			//create a new Library, base on defaults
			//you can put your attributes in
			var insertVideo = wp.media.controller.Library.extend({
				defaults :  _.defaults({
					id:        'insert-video',
					title:      'Insert Video',
					allowLocalEdits: true,
					displaySettings: true,
					displayUserSettings: true,
					multiple : true,
					library: wp.media.query( { type: 'video' } ),
					type : 'video'//audio, video, application/pdf, ... etc
				  }, wp.media.controller.Library.prototype.defaults )
			});

			//Setup media frame
			video_uploader_frame = wp.media({
				button : { text : 'Select' },
				state : 'insert-video',
				states : [
					new insertVideo()
				]
			});

			//on close, if there is no select files, remove all the files already selected in your main frame
			video_uploader_frame.on('close',function() {
				var selection = video_uploader_frame.state('insert-video').get('selection');
				/*if(selection.length == 0) {
					video_modal_properties.$video_mp4_id.val('');
				}
				background_modal_properties.$video_mp4.prop('checked', false);
				if(!selection.length){
					console.log(selection);
					video_modal_properties.$video_mp4.prop('checked', false);
				}*/
				video_modal_properties.$video_mp4_id.val('');
				video_modal_properties.$video_mp4.prop('checked', false);
			});


			video_uploader_frame.on('select', function() {
				var state = video_uploader_frame.state('insert-video');
				var selection = state.get('selection');
				var imageArray = [];

				if ( ! selection ) {
					return;
				}

				 //to get right side attachment UI info, such as: size and alignments
				//org code from /wp-includes/js/media-editor.js, arround `line 603 -- send: { ... attachment: function( props, attachment ) { ... `
				selection.each(function(attachment) {
					var display = state.display( attachment ).toJSON();
					var obj_attachment = attachment.toJSON();
					var caption = obj_attachment.caption, options, html;

					// If captions are disabled, clear the caption.
					if ( ! wp.media.view.settings.captions )
						delete obj_attachment.caption;

					display = wp.media.string.props( display, obj_attachment );

					options = {
						id:        obj_attachment.id,
						post_content: obj_attachment.description,
						post_excerpt: caption
					};

					if ( display.linkUrl )
						options.url = display.linkUrl;

					if ( 'video' === obj_attachment.type ) {
						var img_prev_src;
						img_prev_src = obj_attachment.url;

						var bg_setts = {
							color:'',
							image:'',
							url:'',
							bg_img_type:'full',
							//photoswipe:'',
							linkurl:'',
							video:obj_attachment.id,
							youtube:'',
						};
						html = '<li id="block_' + global_section_reference.sectIndex + '_' + global_section_reference.internalIndex + '" class="video with-border item z-depth-1 hoverable svg-ripple-effect" data-block_type="video" data-block-custom-classes=\'\' data-content-padding=\'\' data-bg_settings=\'' + JSON.stringify( bg_setts ) + '\'>' + 
									element_actions +
									'<div class="element-data">' +
										'<textarea class="data-text-content" display="none"></textarea>' +
									'</div>' +
									'<div class="element-preview-wrap">' +
										'<div class="element-preview">' +
											'<div class="backend-image-preview" data-image_id="'+ obj_attachment.id + '"></div>' +
										'</div>' +
									'</div>' +
									notice_video_template +
								'</li>';
					} else if ( 'image' === obj_attachment.type ) {
						html = wp.media.string.video( display, obj_attachment );
					} else if ( 'audio' === obj_attachment.type ) {
						html = wp.media.string.audio( display, obj_attachment );
					} else {
						html = wp.media.string.link( display );
						options.post_title = display.title;
					}

					//attach info to attachment.attributes object
					attachment.attributes['nonce'] = wp.media.view.settings.nonce.sendToEditor;
					attachment.attributes['attachment'] = options;
					attachment.attributes['html'] = html;
					attachment.attributes['post_id'] = wp.media.view.settings.post.id;
					
					global_section_reference.gridRef.add_widget(attachment.attributes['html'], 2, 2);
					global_section_reference.internalIndex++;
					launchTooltips();
				});
				video_modal_properties.$modal.hide();
				$lean_overlay.hide();
				$(document).trigger('sectionCollectData', global_section_reference );
			});

			//reset selection in popup, when open the popup
			video_uploader_frame.on('open',function() {
				var selection = video_uploader_frame.state('insert-video').get('selection');

				//remove all the selection first
				selection.each(function(image) {
					var attachment = wp.media.attachment( image.attributes.id );
					attachment.fetch();
					selection.remove( attachment ? [ attachment ] : [] );
				});
			});

			//now open the popup
			video_uploader_frame.open();
		}	// uploadVideoBlock END

		function editVideoBlock($wrap) {
			if( video_block_edit_frame ) {
				video_block_edit_frame.open();
				return;
			}

			//create a new Library, base on defaults
			//you can put your attributes in
			var editVideo = wp.media.controller.Library.extend({
				defaults :  _.defaults({
					id:        'upload-block-video',
					title:      'Upload Video',
					allowLocalEdits: true,
					displaySettings: true,
					displayUserSettings: true,
					multiple : false,
					library: wp.media.query( { type: 'video' } ),
					type : 'video',//audio, video, application/pdf, ... etc	            
				  }, wp.media.controller.Library.prototype.defaults )
			});

			//Setup media frame
			video_block_edit_frame = wp.media({
				button : { text : 'Select' },
				state : 'upload-block-video',
				states : [
					new editVideo()
				]
			});

			//on close, if there is no select files, remove all the files already selected in your main frame
			video_block_edit_frame.on('close',function() {
				var selection = video_block_edit_frame.state('upload-block-video').get('selection');

				if(selection.length == 0 || (selection.length == 1 && background_modal_properties.$video_mp4_id.val() == '')) {
					background_modal_properties.$video_mp4_id.val('');
					background_modal_properties.$video_mp4.prop('checked', false);
				}
			});


			video_block_edit_frame.on( 'select', function() {

				var state = video_block_edit_frame.state('upload-block-video');
				var selection = state.get('selection');
				var imageArray = [];

				if ( ! selection ) return;

				 //to get right side attachment UI info, such as: size and alignments
				//org code from /wp-includes/js/media-editor.js, arround `line 603 -- send: { ... attachment: function( props, attachment ) { ... `
				selection.each(function(attachment) {
					var display = state.display( attachment ).toJSON();
					var obj_attachment = attachment.toJSON()
					var caption = obj_attachment.caption, options, html;

					// If captions are disabled, clear the caption.
					if ( ! wp.media.view.settings.captions )
						delete obj_attachment.caption;

					display = wp.media.string.props( display, obj_attachment );

					options = {
						id:        obj_attachment.id,
						post_content: obj_attachment.description,
						post_excerpt: caption
					};

					if ( display.linkUrl )
						options.url = display.linkUrl;

					if ( 'image' === obj_attachment.type ) {
					} else if ( 'video' === obj_attachment.type ) {
						html = wp.media.string.video( display, obj_attachment );
					} else if ( 'audio' === obj_attachment.type ) {
						html = wp.media.string.audio( display, obj_attachment );
					} else {
						html = wp.media.string.link( display );
						options.post_title = display.title;
					}

					//attach info to attachment.attributes object
					attachment.attributes['nonce'] = wp.media.view.settings.nonce.sendToEditor;
					attachment.attributes['attachment'] = options;
					attachment.attributes['html'] = html;
					attachment.attributes['post_id'] = wp.media.view.settings.post.id;

					background_modal_properties.$video_mp4.prop('checked', true);
					background_modal_properties.$video_mp4_id.val(obj_attachment.id);
				});
			});

			//reset selection in popup, when open the popup
			video_block_edit_frame.on('open',function() {
				var attachment;
				var selection = video_block_edit_frame.state('upload-block-video').get('selection');

				//remove all the selection first
				selection.each(function(video) {
					attachment = wp.media.attachment( video.attributes.id );
					attachment.fetch();
					selection.remove( attachment ? [ attachment ] : [] );
				});

				// Check the already inserted image
				if( background_modal_properties.$video_mp4_id.val() != '' ) {
					attachment = wp.media.attachment( background_modal_properties.$video_mp4_id.val() );
					attachment.fetch();

					selection.add( attachment ? [ attachment ] : [] );
				}
			});

			//now open the popup
			video_block_edit_frame.open();
		}	// editVideoBlock END

	});	// End of the DOM ready

})( jQuery );
