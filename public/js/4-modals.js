; (function ($) {
	'use strict';

	$(function () {

		var $lean_overlay = $('.lean-overlay');

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
			// HOLD GRID config
			$hold_grid: $("#rx-hold-grid"),
			// ID and navigator configuration
			$section_id: $('#sectionid-container'),
			$save_button: $('#backresponsive-set-save'),

			$block_gutter: $('.section-set-block-gutter'),
			// Row separator
			$row_separator_top: $('#row-separator-top'),
			$row_separator_right: $('#row-separator-right'),
			$row_separator_bottom: $('#row-separator-bottom'),
			$row_separator_left: $('#row-separator-left'),

			// Row zoom
			$section_active_photoswipe: $('#section-active-photoswipe'),
			section_photoswipe_changed: false,
		};
		/**
		 * Open a modal dialog box	
		 * @param {jQuery Object} $target modal to open  
		 * @param {boolean} 	target_only active only the modal not the overlay
		 * @param {Array} 		additional_class Array of additional classes
		 */
		var OpenModal = function ($target, target_only, additional_class) {
			target_only = typeof target_only !== 'undefined' ? target_only : false;
			additional_class = typeof additional_class !== 'undefined' ? additional_class : [];

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
		 * @param {jQuery Object}  $target modal to close
		 */
		var CloseModal = function ($target, target_only, additional_class) {
			target_only = typeof target_only !== 'undefined' ? target_only : false;
			additional_class = typeof additional_class !== 'undefined' ? additional_class : [];

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
		 * @param {jQuery Object}  $target
		 */
		var resetModalDimensions = function ($target) {
			$target.css('height', 'auto');
			$target.css('width', 'auto');
		};

		var setBuilderTimeStamp = function () {
			var timestamp = new Date();
			console.log(timestamp);
			//$('#_rexbuilder').val(Date.UTC(timestamp.getFullYear(),timestamp.getMonth(),timestamp.getDate()));
		};

		$(document).on('click', '#backresponsive-set-cancel', function (e) {
			e.preventDefault();
			CloseModal($('#modal-background-responsive-set').parent('.rex-modal-wrap'));
		});

		$(document).on('click', '#backresponsive-set-save', function (e) {
			e.preventDefault();
			var gridID = $(this).attr('data-section_id');
			var gallery = $('.grid-number-' + gridID);
			//console.log(this);
			var layout = section_config_modal_properties.$section_layout_type.filter(':checked').val();
			gallery.perfectGridGalleryEditor('reLaunchGrid', {
				'layout': layout
			});
            /* var 
                section_id = $(this).attr('data-section_id'),
                color = $('.backresponsive-color-section').spectrum('get'),
                opacity = $('.backresponsive-opacity-section').val(),
                gutter = $('.section-set-block-gutter').val(),
                custom_classes = $('#section-set-custom-class').val(),
                section_width = '',
                section_is_full_width = (true === section_config_modal_properties.$section_full.prop('checked') ? 'true' : 'false'),
                section_is_boxed_width = (true === section_config_modal_properties.$section_boxed.prop('checked') ? 'true' : 'false'),
                isFull = (true === section_config_modal_properties.$is_full.prop('checked') ? 'true' : ''),
                holdGrid = (true === section_config_modal_properties.$hold_grid.prop('checked') ? 'true' : 'false'),
                //has_small_overlay = ( true === section_config_modal_properties.$has_overlay_small.prop('checked') ? 'true' : '' ),
                //has_medium_overlay = ( true === section_config_modal_properties.$has_overlay_medium.prop('checked') ? 'true' : '' ),
                //has_large_overlay = ( true === section_config_modal_properties.$has_overlay_large.prop('checked') ? 'true' : '' ),
                section_custom_name = section_config_modal_properties.$section_id.val();

                var layout = section_config_modal_properties.$section_layout_type.filter(':checked').val();
            
			    var $row = $('.builder-row[data-count=' + section_id + ']');
                $row.attr( 'data-layout', layout ); */

			setBuilderTimeStamp();

			CloseModal($('#modal-background-responsive-set').parent('.rex-modal-wrap'));

		});
		/* var section_id = $(this).attr('data-section_id'),
			color = $('.backresponsive-color-section').spectrum('get'),
			opacity = $('.backresponsive-opacity-section').val(),
			gutter = $('.section-set-block-gutter').val(),
			custom_classes = $('#section-set-custom-class').val(),
			section_width = '',
			section_is_full_width = ( true === section_config_modal_properties.$section_full.prop('checked') ? 'true' : 'false' ),
			section_is_boxed_width = ( true === section_config_modal_properties.$section_boxed.prop('checked') ? 'true' : 'false' ),
			isFull = ( true === section_config_modal_properties.$is_full.prop('checked') ? 'true' : '' ),
			holdGrid = ( true === section_config_modal_properties.$hold_grid.prop('checked') ? 'true' : 'false' ),
			//has_small_overlay = ( true === section_config_modal_properties.$has_overlay_small.prop('checked') ? 'true' : '' ),
			//has_medium_overlay = ( true === section_config_modal_properties.$has_overlay_medium.prop('checked') ? 'true' : '' ),
			//has_large_overlay = ( true === section_config_modal_properties.$has_overlay_large.prop('checked') ? 'true' : '' ),
			section_custom_name = section_config_modal_properties.$section_id.val();

		var layout = section_config_modal_properties.$section_layout_type.filter(':checked').val();

		var $row = $('.builder-row[data-count=' + section_id + ']');
		$row.attr( 'data-layout', layout );

		var section_saved_settings = $row.attr( 'data-backresponsive' ),
			section_saved_custom_classes = '';
		
		if(typeof section_saved_settings != 'undefined' && section_saved_settings !== '') {
			section_saved_settings = JSON.parse(section_saved_settings);
			section_saved_custom_classes = section_saved_settings.custom_classes;
		}


		// Handle main builder view checkboxes
		var section_width_type = $row.find('.builder-edit-row-wrap input[type="radio"][name^="section-dimension-"]');
		var section_width_type_full = section_width_type.filter('[id^=section-full]');
		var section_width_type_boxed = section_width_type.filter('[id^=section-boxed]');

		// Setting custom name section
		$row.attr( 'data-sectionid', section_custom_name);

		// Setting section layout type
		// switch(layout) {
		// 	case 'masonry': 	//This means that the user is changing the section view from fixed TO masonry
		// 		$row.find('.builder-elements li.item:not(.expand)').each(function() {
		// 			var $this = $(this);
		// 			var bg_settings = $this.data('bg_settings');
		// 			if(typeof bg_settings != 'undefined' && '' != bg_settings.bg_img_type && 'full' == bg_settings.bg_img_type ) {
		// 				bg_settings.bg_img_type = 'natural';
		// 				$this.attr('data-bg_settings', JSON.stringify(bg_settings));
		// 				$this.trigger('blockChangeImage');
		// 			}
		// 		});
		// 		break;
		// 	case 'fixed': 	//This means that the user is changing the section view from masonry TO fixed
		// 		$row.find('.builder-elements li.item:not(.expand)').each(function() {
		// 			var $this = $(this);
		// 			var bg_settings = $this.data('bg_settings');
		// 			if(typeof bg_settings != 'undefined' && '' != bg_settings.bg_img_type && 'natural' == bg_settings.bg_img_type ) {
		// 				bg_settings.bg_img_type = 'full';
		// 				$this.attr('data-bg_settings', JSON.stringify(bg_settings));
		// 				$this.trigger('blockChangeImage');
		// 			}
		// 		});
		// 		break;
		// 	default:
		// 		break;
		// }

		// Setting section overlay
		/*var section_has_overlay = false;

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
		}//

		// Row Margin
		
		// if( '-1' != section_config_modal_properties.$row_separator_top.val().search(/\D/g) || '' == section_config_modal_properties.$row_separator_top.val() ) {
			$row.attr( 'data-row-separator-top', section_config_modal_properties.$row_separator_top.val() );
		// }

		// if( '-1' != section_config_modal_properties.$row_separator_right.val().search(/\D/g) || '' == section_config_modal_properties.$row_separator_right.val() ) {
			$row.attr( 'data-row-separator-right', section_config_modal_properties.$row_separator_right.val() );
		// }

		// if( '-1' != section_config_modal_properties.$row_separator_bottom.val().search(/\D/g) || '' == section_config_modal_properties.$row_separator_bottom.val() ) {
			$row.attr( 'data-row-separator-bottom', section_config_modal_properties.$row_separator_bottom.val() );
		// }

		// if( '-1' != section_config_modal_properties.$row_separator_left.val().search(/\D/g) || '' == section_config_modal_properties.$row_separator_left.val() ) {
			$row.attr( 'data-row-separator-left', section_config_modal_properties.$row_separator_left.val() );
		// }

		// Section Photoswipe
		if( section_config_modal_properties.section_photoswipe_changed ) {
			if( section_config_modal_properties.$section_active_photoswipe.prop('checked') ) {
				// Here goes auto block-photoswipe logic
				$row.attr('data-section-active-photoswipe', '1');
				set_blocks_on_row_property($row, 'photoswipe', 'true')
			} else {
				$row.attr('data-section-active-photoswipe', '0');
				set_blocks_on_row_property($row, 'photoswipe', '');
			}
		}

		// Overlay
		var overlay_infos = section_saved_custom_classes.match(/active-(large|medium|small)-overlay/g);
		if(overlay_infos) {
			overlay_infos = overlay_infos.join(' ');
		} else {
			overlay_infos = '';
		}

		// Hold Grid
		var holded_info = '';
		if( 'true' == holdGrid ) {
			holded_info = 'rex-block-grid';	
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

		var clean_custom_classes = custom_classes.trim() + ' ' + overlay_infos.trim() + ' ' + holded_info;

		//console.log(clean_custom_classes);

		var config_settings = {
			gutter : gutter,
			isFull : isFull,
			custom_classes : clean_custom_classes.trim(),
			section_width : section_width,
		};

		$row.attr( 'data-backresponsive', JSON.stringify(config_settings) );

		setBuilderTimeStamp();

		CloseModal( $('#modal-background-responsive-set').parent('.rex-modal-wrap') );
	});
	 */
		$(document).on('click', '.builder-section-config', function (e) {
			e.preventDefault();
			var $parent = $(this).parents('.rexpansive_section');
			var $row = $($parent.find('.perfect-grid-gallery'));
			var sectionNumber;
			sectionNumber = $row.perfectGridGalleryEditor('getSectionNumber');
			$('#backresponsive-set-save').attr('data-section_id', sectionNumber);
			$('#backresponsive-set-reset').attr('data-section_id', sectionNumber);
			OpenModal($('#modal-background-responsive-set').parent('.rex-modal-wrap'));
		});
	});	// End of the DOM ready

})(jQuery);    