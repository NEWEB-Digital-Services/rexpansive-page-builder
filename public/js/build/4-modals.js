;
(function ($) {
	'use strict';

	$(function () {

		var $lean_overlay = $('.lean-overlay');

		// Prepare the variables that holds the Frame Uploaders
		var image_uploader_frame, image_block_edit_frame, navigator_media_frame, video_uploader_frame, video_block_edit_frame, textfill_image_upload_frame;

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
			// $color_preview: $('#overlay-palette-preview'),
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

		$(document).on(
			'click',
			'#backresponsive-set-cancel',
			function (e) {
				e.preventDefault();
				CloseModal($('#modal-background-responsive-set').parent(
					'.rex-modal-wrap'));
			});

		$(document)
			.on(
				'click',
				'#backresponsive-set-save',
				function (e) {
					e.preventDefault();
					var gridID = $(this).attr('data-section_id');
					var gallery = $('.grid-number-' + gridID);
					// console.log(this);
					var layout = section_config_modal_properties.$section_layout_type.filter(':checked').val();
					/*
					var section_id = $(this).attr('data-section_id'),
						color = $('.backresponsive-color-section').spectrum('get'),
						opacity = $('.backresponsive-opacity-section').val(),
						gutter = $('.section-set-block-gutter').val(),
						custom_classes = $('#section-set-custom-class').val(),
						section_width = '',
						section_is_full_width = (true === section_config_modal_properties.$section_full.prop('checked') ? 'true' : 'false'),
						section_is_boxed_width = (true === section_config_modal_properties.$section_boxed.prop('checked') ? 'true' : 'false'),
						isFull = (true === section_config_modal_properties.$is_full.prop('checked') ? 'true' : ''),
						holdGrid = (true === section_config_modal_properties.$hold_grid.prop('checked') ? 'true' : 'false'),
						//has_small_overlay = ( true  === 	section_config_modal_properties.$has_overlay_small.prop('checked') ? 'true' : '' ), 
						//has_medium_overlay = ( true === section_config_modal_properties.$has_overlay_medium.prop('checked') ? 'true' : '' ), 
						//has_large_overlay = ( true === section_config_modal_properties.$has_overlay_large.prop('checked') ? 'true' : '' ), 
						section_custom_name = section_config_modal_properties.$section_id.val(),
						layout = section_config_modal_properties.$section_layout_type.filter(':checked').val();
						*/
					//var $row = $('.builder-row[data-count=' + 	section_id + ']'); $row.attr('data-layout', layout);
					gallery.perfectGridGalleryEditor('updateSection', {
						'layout': layout
					});
					setBuilderTimeStamp();

					CloseModal($('#modal-background-responsive-set').parent('.rex-modal-wrap'));
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
		// $('.builder-section-config').hover();
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

		$(document).on('rexlive:undo', function (e) {
			console.log(e);
			console.log('undo');
		});

		$(document).on('rexlive:redo', function (e) {
			console.log(e);
			console.log('redo');
		});

		$(document).on("rexlive:saveDefaultLayout", function () {
			console.log("saving default layout");

			var idPost = parseInt($('#id-post').attr('data-post-id'));

			var postClean = createCleanPost();
			//console.log(postClean);

			var shortcodePage = '';

			Rexbuilder_Util.$rexContainer.find('.rexpansive_section').each(function () {
				var $section = $(this);
				if (!$section.hasClass("removing_section")) {
					shortcodePage += createSectionProperties($section, "shortcode", null);
				}
			});
			console.log(shortcodePage);

			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: _plugin_frontend_settings.rexajax.ajaxurl,
				data: {
					action: 'rexlive_save_default_layout',
					nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
					post_id_to_update: idPost,
					clean_post: postClean,
					rex_shortcode: shortcodePage,
				},
				success: function (response) {
					console.log(response);
					if (response.success) {
						console.log('default layout aggiornato');
					} else {
						console.log(response.msg);
						console.log("errore");
					}
					console.log('chiama effettuata con successo');
				},
				error: function (response) {
					console.log(response);
					console.log('errore chiama ajax');
				}
			});
		});

		$(document).on('rexlive:saveCustomizations', function (e) {
			var $layoutData = Rexbuilder_Util.$rexContainer.parent().children("#rexbuilder-layout-data");
			console.log($layoutData);
			var $layoutsCustomDiv = $layoutData.children(".layouts-customizations");
			var $layoutsAvaiableDiv = $layoutData.children(".available-layouts");


			var idPost = parseInt($('#id-post').attr('data-post-id'));

			var activeLayout = e.settings.selected;
			var activeLayoutName = activeLayout[0];
			var updatedLayouts = e.settings.updatedLayouts;

			console.log("saving customization " + activeLayoutName);

			var oldCustomizations;

			if ($layoutsCustomDiv.data("empty-customizations")) {
				oldCustomizations = [];
			} else {
				oldCustomizations = JSON.parse($layoutsCustomDiv.text());
			}

			var customizationsArray = [];
			$.each(oldCustomizations, function (i, oldCustom) {
				var oldLay = oldCustom;
				if (oldLay.name != activeLayoutName) {
					customizationsArray.push(oldLay);
				}
			});

			customizationsArray.push(createCustomization(activeLayoutName));

			$layoutsCustomDiv.text(JSON.stringify(customizationsArray));
			$layoutsAvaiableDiv.text(JSON.stringify(updatedLayouts));

			//ajax call for saving layouts type and names
			var layoutsNames = [];
			$.each(customizationsArray, function (i, layout) {
				layoutsNames.push(layout.name);
			});
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: _plugin_frontend_settings.rexajax.ajaxurl,
				data: {
					action: 'rexlive_save_avaiable_layouts',
					nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
					post_id_to_update: idPost,
					names: layoutsNames
				},
				success: function (response) {
					console.log(response);
					if (response.success) {
						console.log('nomi layout aggiornati');
					}
					console.log('chiama effettuata con successo');
				},
				error: function (response) {
					console.log('errore chiama ajax');
				}
			});

			//saving layouts customizations
			$.each(customizationsArray, function (i, layout) {
				console.log(layout);
				if (layout.name == activeLayoutName) {
					if (layout.sections != "") {
						console.log(layout);
						console.log(layout.sections);
						$.ajax({
							type: 'POST',
							dataType: 'json',
							url: _plugin_frontend_settings.rexajax.ajaxurl,
							data: {
								action: 'rexlive_save_customization_layout',
								nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
								post_id_to_update: idPost,
								sections: layout.sections,
								layout_name: layout.name
							},
							success: function (response) {
								console.log(response);
								if (response.success) {
									console.log('layout custom aggiornato');
								}
								console.log('chiama effettuata con successo');
							},
							error: function (response) {
								console.log('errore chiama ajax');
							}
						});
					}
				}
			});
		});

		var createCustomization = function (layoutName) {
			var data =
			{
				name: layoutName,
				sections: []
			}
			data.sections = createSectionsCustomizations(layoutName);
			return data;
		}

		var createSectionsCustomizations = function (layoutName) {
			var output = [];
			Rexbuilder_Util.$rexContainer.children('.rexpansive_section').each(function () {
				var $section = $(this);
				if (!$section.hasClass("removing_section")) {
					var sectionRexID = $section.attr("data-rexlive-section-id");

					var section_props = {
						section_rex_id: sectionRexID,
						targets: [],
					}
					section_props.targets = createTargets($section, layoutName);
					output.push(section_props);
				}
			});

			return output;
		}

		var checkEditsSection = function ($section) {
			return $section.attr("data-rexlive-section-edited") == "true" ? true : false;
		}
		/*
		data-rexlive-element-edited="true"
		*/
		var checkEditsElement = function ($elem) {
			return $elem.attr("data-rexlive-element-edited") == "true" ? true : false;
		}

		var createTargets = function ($section, layoutName) {
			var targets = [];

			var section_props = {
				name: "self",
				props: {}
			}
			console.log(layoutName);
			if (layoutName == "default" || checkEditsSection($section)) {
				console.log("saving: " + "self");
				section_props.props = createSectionProperties($section, "customLayout", layoutName);
			}
			targets.push(section_props);

			var $gridGallery = $section.find('.grid-stack-row');
			var galleryIstance = $gridGallery.data().plugin_perfectGridGalleryEditor;
			var elementsOrdered = galleryIstance.getElementTopBottom();

			galleryIstance.updateAllElementsProperties();

			$(elementsOrdered).each(function () {
				var $elem = $(this);
				if (!$elem.hasClass("removing_block")) {
					var blockRexID = $elem.attr("data-rexbuilder-block-id");
					var block_props = {
						name: blockRexID,
						props: {}
					}
					if (layoutName == "default" || checkEditsElement($elem)) {
						console.log("saving: " + blockRexID);
						block_props.props = createBlockProperties($elem, "customLayout", layoutName);
					}
					targets.push(block_props);
				}
			});
			return targets;
		}

		var createCleanPost = function () {
			var post = "";
			console.log("creating clean post");
			Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
				$(this).children(".grid-stack-item").each(function () {
					var $textWrap = $(this).find(".text-wrap");
					if ($textWrap.hasClass("medium-editor-element")) {
						var $textWrapNoEditor = $textWrap.clone(false);
						$textWrapNoEditor.children(".medium-insert-buttons").remove();
						$textWrapNoEditor.children(".text-editor-span-fix").remove();
						if ($textWrapNoEditor.text().trim().length != 0) {
							post += $textWrapNoEditor.html();
							post += "<br>";
						}
					} else {
						if ($textWrap.text().trim().length != 0) {
							post += $textWrap.html();
							post += "<br>";
						}
					}
				});
			});
			return post;
		}

		var createBlockProperties = function ($elem, mode, layoutName) {
			var id = "",
				rex_id = "",
				type = "text",
				size_x = 1,
				size_y = 1,
				row = '',
				col = '',
				gs_start_h = 1,
				gs_width = 1,
				gs_height = 1,
				gs_y = '',
				gs_x = '',
				color_bg_block = "#ffffff",
				image_bg_block = "",
				image_width = 0,
				image_height = 0,
				id_image_bg_block = "",
				video_mp4_url = "",
				video_bg_id = "",
				video_bg_url = "",
				video_bg_url_vimeo = "",
				type_bg_block = "",
				image_size = 'full',
				photoswipe = '',
				linkurl = '',
				block_custom_class = '',
				block_padding = '',
				overlay_block_color = '',
				zak_background = "",
				zak_side = "",
				zak_title = "",
				zak_icon = "",
				zak_foreground = "",
				block_animation = "fadeInUpBig",
				video_has_audio = '0',
				block_has_scrollbar = "false",
				block_live_edited = "";

			var content = "";
			var $textWrap;
			var output;
			var $itemContent = $elem.find('.grid-item-content');
			var $itemData = $elem.children(".rexbuilder-block-data");
			
			id = $elem.attr('id') === undefined ? "" : $elem.attr('id');
			rex_id = $elem.attr('data-rexbuilder-block-id');
			type = $itemData.attr('data-type');
			size_x = $elem.attr('data-width');
			size_y = $elem.attr('data-height');
			row = $elem.attr('data-row');
			col = $elem.attr('data-col');
			gs_start_h = $elem.attr('data-gs-height');
			gs_width = $elem.attr('data-gs-width');
			gs_height = $elem.attr('data-gs-height');
			gs_y = $elem.attr('data-gs-y');
			gs_x = $elem.attr('data-gs-x');
			color_bg_block = $itemContent.css('background-color') != '' ? $itemContent
				.css('background-color')
				: '#ffffff';
			image_bg_block = $itemData.attr('data-image_bg_block') === undefined ? ""
				: $itemData.attr('data-image_bg_block');
			image_width = $itemContent.attr('data-background-image-width') === undefined ? ""
				: parseInt($itemContent.attr('data-background-image-width'));
			image_height = $itemContent.attr('data-background-image-height') === undefined ? ""
				: parseInt($itemContent.attr('data-background-image-height'));
			id_image_bg_block = $itemData.attr('data-id_image_bg_block') === undefined ? ""
				: $itemData.attr('data-id_image_bg_block');
			video_bg_id = $itemData.attr('data-video_bg_id') === undefined ? ""
				: $itemData.attr('data-video_bg_id');
			video_mp4_url = $itemData.attr('data-video_mp4_url') === undefined ? ""
				: $itemData.attr('data-video_mp4_url');
			video_bg_url = $itemData.attr('data-video_bg_url') === undefined ? ""
				: $itemData.attr('data-video_bg_url');
			video_bg_url_vimeo = $itemData.attr('data-video_bg_url_vimeo') === undefined ? ""
				: $itemData.attr('data-video_bg_url_vimeo');
			type_bg_block = $itemData.attr('data-type_bg_block') === undefined ? "full"
				: $itemData.attr('data-type_bg_block');
			image_size = $itemData.attr('data-image_size') === undefined ? "full"
				: $itemData.attr('data-image_size');
			photoswipe = $itemData.attr('data-photoswipe') === undefined ? ""
				: $itemData.attr('data-photoswipe');
			linkurl = $itemData.attr('data-linkurl') === undefined ? ""
				: $itemData.attr('data-linkurl');
			block_custom_class = $itemData.attr('data-block_custom_class') === undefined ? ""
				: $itemData.attr('data-block_custom_class');
			block_padding = $itemData.attr('data-block_padding') === undefined ? ""
				: $itemData.attr('data-block_padding');
			overlay_block_color = $itemData.attr('data-overlay_block_color') === undefined ? ""
				: $itemData.attr('data-overlay_block_color');
			zak_background = $itemData.attr('data-zak_background') === undefined ? ""
				: $itemData.attr('data-zak_background');
			zak_side = $itemData.attr('data-zak_side') === undefined ? ""
				: $itemData.attr('data-zak_side');
			zak_title = $itemData.attr('data-zak_title') === undefined ? ""
				: $itemData.attr('data-zak_title');
			zak_icon = $itemData.attr('data-zak_icon') === undefined ? ""
				: $itemData.attr('data-zak_icon');
			zak_foreground = $itemData.attr('data-zak_foreground') === undefined ? ""
				: $itemData.attr('data-zak_foreground');
			block_animation = $itemData.attr('data-block_animation') === undefined ? "fadeInUpBig"
				: $itemData.attr('data-block_animation');
			video_has_audio = $itemData.attr('data-video_has_audio') === undefined ? "0"
				: $itemData.attr('data-video_has_audio');
			block_has_scrollbar = $itemData.attr('data-block_has_scrollbar') === undefined ? "false"
				: $itemData.attr('data-block_has_scrollbar');
			block_live_edited = $itemData.attr('data-rexlive-edited') === undefined ? "" : "true";

			if (!$elem.hasClass('block-has-slider')) {
				$textWrap = $itemContent.find('.text-wrap');
				var $savingBlock = $textWrap.clone(false);
				$savingBlock.find('.medium-insert-buttons').remove();
				$savingBlock.find('.text-editor-span-fix').remove();
				if ($savingBlock.text().trim() == "") {
					content = "";
				} else {
					content = $savingBlock.html();
				}
			} else {
				content = '[RexSlider slider_id="' + parseInt($elem.find(".rex-slider-wrap").attr("data-slider-id")) + '"]';
			}


			if (mode == "shortcode") {
				output = '[RexpansiveBlock'
					+ ' id="' + id
					+ '" rexbuilder_block_id="' + rex_id
					+ '" type="' + type
					+ '" size_x="' + size_x
					+ '" size_y="' + size_y
					+ '" row="' + row
					+ '" col="' + col
					+ '" gs_start_h="' + gs_start_h
					+ '" gs_width="' + gs_width
					+ '" gs_height="' + gs_height
					+ '" gs_y="' + gs_y
					+ '" gs_x="' + gs_x
					+ '" color_bg_block="' + color_bg_block
					+ '" image_bg_block="' + image_bg_block
					+ '" id_image_bg_block="' + id_image_bg_block
					+ '" video_bg_id="' + video_bg_id
					+ '" video_mp4_url="' + video_mp4_url
					+ '" video_bg_url="' + video_bg_url
					+ '" video_bg_url_vimeo="' + video_bg_url_vimeo
					+ '" type_bg_block="' + type_bg_block
					+ '" image_size="' + image_size
					+ '" photoswipe="' + photoswipe
					+ '" linkurl="' + linkurl
					+ '" block_custom_class="' + block_custom_class
					+ '" block_padding="' + block_padding
					+ '" overlay_block_color="' + overlay_block_color
					+ '" zak_background="' + zak_background
					+ '" zak_side="' + zak_side
					+ '" zak_title="' + zak_title
					+ '" zak_icon="' + zak_icon
					+ '" zak_foreground="' + zak_foreground
					+ '" block_animation="' + block_animation
					+ '" video_has_audio="' + video_has_audio
					+ '" block_has_scrollbar="' + block_has_scrollbar
					+ '" block_live_edited="' + block_live_edited
					+ '"]' + content
					+ '[/RexpansiveBlock]';
				return output;
			} else if (mode == "customLayout") {

				var props = {};

				if (layoutName == "default") {
					props["hide"] = false;
					props["rexbuilder_block_id"] = rex_id;
					props["type"] = type;
					props["size_x"] = size_x;
					props["size_y"] = size_y;
					props["row"] = row;
					props["col"] = col;
					props["gs_start_h"] = gs_start_h;
					props["gs_width"] = gs_width;
					props["gs_height"] = gs_height;
					props["gs_y"] = gs_y;
					props["gs_x"] = gs_x;
					props["color_bg_block"] = color_bg_block;
					props["image_bg_block"] = image_bg_block;
					props["image_width"] = image_width;
					props["image_height"] = image_height;
					props["id_image_bg_block"] = id_image_bg_block;
					props["video_bg_id"] = video_bg_id;
					props["video_mp4_url"] = video_mp4_url;
					props["video_bg_url_youtube"] = video_bg_url;
					props["video_bg_url_vimeo"] = video_bg_url_vimeo;
					props["type_bg_block"] = type_bg_block;
					props["image_size"] = image_size;
					props["photoswipe"] = photoswipe;
					props["block_custom_class"] = block_custom_class;
					props["block_padding"] = block_padding;
					props["overlay_block_color"] = overlay_block_color;
					props["zak_background"] = zak_background;
					props["zak_side"] = zak_side;
					props["zak_title"] = zak_title;
					props["zak_icon"] = zak_icon;
					props["zak_foreground"] = zak_foreground;
					props["block_animation"] = block_animation;
					props["video_has_audio"] = video_has_audio;
					props["block_has_scrollbar"] = block_has_scrollbar;
					props["block_live_edited"] = block_live_edited;
				} else {
					props["hide"] = false;
					props["rexbuilder_block_id"] = rex_id;
					props["type"] = type;
					props["size_x"] = size_x;
					props["size_y"] = size_y;
					props["row"] = row;
					props["col"] = col;
					props["gs_start_h"] = gs_start_h;
					props["gs_width"] = gs_width;
					props["gs_height"] = gs_height;
					props["gs_y"] = gs_y;
					props["gs_x"] = gs_x;
					props["color_bg_block"] = color_bg_block;
					props["image_bg_block"] = image_bg_block;
					props["image_width"] = image_width;
					props["image_height"] = image_height;
					props["id_image_bg_block"] = id_image_bg_block;
					props["video_bg_id"] = video_bg_id;
					props["video_mp4_url"] = video_mp4_url;
					props["video_bg_url_youtube"] = video_bg_url;
					props["video_bg_url_vimeo"] = video_bg_url_vimeo;
					props["type_bg_block"] = type_bg_block;
					props["image_size"] = image_size;
					props["photoswipe"] = photoswipe;
					props["block_custom_class"] = block_custom_class;
					props["block_padding"] = block_padding;
					props["overlay_block_color"] = overlay_block_color;
					props["zak_background"] = zak_background;
					props["zak_side"] = zak_side;
					props["zak_title"] = zak_title;
					props["zak_icon"] = zak_icon;
					props["zak_foreground"] = zak_foreground;
					props["block_animation"] = block_animation;
					props["video_has_audio"] = video_has_audio;
					props["block_has_scrollbar"] = block_has_scrollbar;
					props["block_live_edited"] = block_live_edited;

				}

				return props;
			}
		};

		var createSectionProperties = function ($section, mode, layoutName) {
			var section_name = "",
				type = "perfect-grid",
				color_bg_section = "#ffffff",
				dimension = "full",
				margin = "",
				image_bg_section = "",
				id_image_bg_section = "",
				video_bg_url_section = '',
				video_bg_id_section = '',
				video_bg_url_vimeo_section = '',
				full_height = '',
				block_distance = 20,
				layout = "fixed",
				responsive_background = '',
				custom_classes = '',
				section_width = '',
				row_separator_top = '',
				row_separator_bottom = '',
				row_separator_right = '',
				row_separator_left = '',
				row_margin_top = '',
				row_margin_bottom = '',
				row_margin_right = '',
				row_margin_left = '',
				rexlive_section_id = '';

			var output = '';
			var $gridGallery = $section.find('.grid-stack-row');
			var $sectionData = $section.children('.section-data');
			var galleryIstance = $gridGallery.data().plugin_perfectGridGalleryEditor;
			section_name = $sectionData.attr('data-section_name') === undefined ? ""
				: $sectionData.attr('data-section_name');
			type = $sectionData.attr('data-type') === undefined ? "perfect-grid"
				: $sectionData.attr('data-type');
			color_bg_section = $sectionData.attr('data-color_bg_section') === undefined ? "#ffffff"
				: $sectionData.attr('data-color_bg_section');
			dimension = $sectionData.attr('data-dimension') === undefined ? "full"
				: $sectionData.attr('data-dimension');
			margin = $sectionData.attr('data-margin') === undefined ? ""
				: $sectionData.attr('data-margin');
			image_bg_section = $sectionData.attr('data-image_bg_section') === undefined ? ""
				: $sectionData.attr('data-image_bg_section');
			id_image_bg_section = $sectionData.attr('data-id_image_bg_section') === undefined ? ""
				: $sectionData.attr('data-id_image_bg_section');
			video_bg_url_section = $sectionData.attr('data-video_bg_url_section') === undefined ? ""
				: $sectionData.attr('data-video_bg_url_section');
			video_bg_id_section = $sectionData.attr('data-video_bg_id_section') === undefined ? ""
				: $sectionData.attr('data-video_bg_id_section');
			video_bg_url_vimeo_section = $sectionData.attr('data-video_bg_url_vimeo_section') === undefined ? ""
				: $sectionData.attr('data-video_bg_url_vimeo_section');
			video_bg_url_vimeo_section = video_bg_url_vimeo_section == 'undefined' ? ""
				: video_bg_url_vimeo_section;
			full_height = $sectionData.attr('data-full_height') === undefined ? ""
				: $sectionData.attr('data-full_height');
			block_distance = $sectionData.attr('data-block_distance') === undefined ? 20
				: parseInt($sectionData.attr('data-block_distance'));
			layout = $sectionData.attr('data-layout') === undefined ? ""
				: $sectionData.attr('data-layout');
			responsive_background = $sectionData.attr('data-responsive_background') === undefined ? "fixed"
				: $sectionData.attr('data-responsive_background');
			custom_classes = $sectionData.attr('data-custom_classes') === undefined ? ""
				: $sectionData.attr('data-custom_classes');
			section_width = $sectionData.attr('data-section_width') === undefined ? ""
				: $sectionData.attr('data-section_width');
			section_width = section_width == '%' ? "" : section_width;
			row_separator_top = $sectionData.attr('data-row_separator_top') === undefined ? ""
				: $sectionData.attr('data-row_separator_top');
			row_separator_bottom = $sectionData.attr('data-row_separator_bottom') === undefined ? ""
				: $sectionData.attr('data-row_separator_bottom');
			row_separator_right = $sectionData.attr('row_separator_right') === undefined ? ""
				: $sectionData.attr('data-row_separator_right');
			row_separator_left = $sectionData.attr('data-row_separator_left') === undefined ? ""
				: $sectionData.attr('data-row_separator_left');
			row_margin_top = $sectionData.attr('data-row_margin_top') === undefined ? ""
				: $sectionData.attr('data-row_margin_top');
			row_margin_bottom = $sectionData.attr('data-row_margin_bottom') === undefined ? ""
				: $sectionData.attr('data-row_margin_bottom');
			row_margin_right = $sectionData.attr('data-row_margin_right') === undefined ? ""
				: $sectionData.attr('data-row_margin_right');
			row_margin_left = $sectionData.attr('data-row_margin_left') === undefined ? ""
				: $sectionData.attr('data-row_margin_left');
			rexlive_section_id = $section.attr("data-rexlive-section-id");
			if (mode == "shortcode") {
				output = '[RexpansiveSection'
					+ ' section_name="' + section_name
					+ '" type="' + type
					+ '" color_bg_section="' + color_bg_section
					+ '" dimension="' + dimension
					+ '" margin="' + margin
					+ '" image_bg_section="' + image_bg_section
					+ '" id_image_bg_section="' + id_image_bg_section
					+ '" video_bg_url_section="' + video_bg_url_section
					+ '" video_bg_id_section="' + video_bg_id_section
					+ '" video_bg_url_vimeo_section="' + video_bg_url_vimeo_section
					+ '" full_height="' + full_height
					+ '" block_distance="' + block_distance
					+ '" layout="' + layout
					+ '" responsive_background="' + responsive_background
					+ '" custom_classes="' + custom_classes
					+ '" section_width="' + section_width
					+ '" row_separator_top="' + row_separator_top
					+ '" row_separator_bottom="' + row_separator_bottom
					+ '" row_separator_right="' + row_separator_right
					+ '" row_separator_left="' + row_separator_left
					+ '" row_margin_top="' + row_margin_top
					+ '" row_margin_bottom="' + row_margin_bottom
					+ '" row_margin_right="' + row_margin_right
					+ '" row_margin_left="' + row_margin_left
					+ '" rexlive_section_id="' + rexlive_section_id
					+ '" row_edited_live="true"]';

				galleryIstance.fillEmptySpaces();
				galleryIstance.updateAllElementsProperties();

				var elementsOrdered = galleryIstance.getElementTopBottom();

				$(elementsOrdered).each(function () {
					var $elem = $(this);
					if (!$elem.hasClass("removing_block")) {
						output += createBlockProperties($elem, "shortcode", null);
					}
				});

				output += '[/RexpansiveSection]';
				return output;

			} else if (mode == "customLayout") {

				var props = {};

				if (layoutName == "default") {
					props["hide"] = false;
					props["section_name"] = section_name;
					props["type"] = type;
					props["color_bg_section"] = color_bg_section;
					props["dimension"] = dimension;
					props["margin"] = margin;
					props["image_bg_section"] = image_bg_section;
					props["id_image_bg_section"] = id_image_bg_section;
					props["video_bg_id_section"] = video_bg_id_section;
					props["video_bg_url_section"] = video_bg_url_section;
					props["video_bg_url_vimeo_section"] = video_bg_url_vimeo_section;
					props["full_height"] = full_height;
					props["block_distance"] = block_distance;
					props["layout"] = layout;
					props["responsive_background"] = responsive_background;
					props["custom_classes"] = custom_classes;
					props["section_width"] = section_width;
					props["row_separator_top"] = row_separator_top;
					props["row_separator_bottom"] = row_separator_bottom;
					props["row_separator_right"] = row_separator_right;
					props["row_separator_left"] = row_separator_left;
					props["row_margin_top"] = row_margin_top;
					props["row_margin_bottom"] = row_margin_bottom;
					props["row_margin_right"] = row_margin_right;
					props["row_margin_left"] = row_margin_left;

				} else {

					props["section_name"] = section_name;
					if (section_name != "") {
					}
					if (type != "perfect-grid") {
						props["type"] = type;
					}
					if (color_bg_section != "#ffffff") {
						props["color_bg_section"] = color_bg_section;
					}
					if (dimension != "full") {
						props["dimension"] = dimension;
					}
					if (margin != "") {
						props["margin"] = margin;
					}
					if (image_bg_section != "") {
						props["image_bg_section"] = image_bg_section;
					}
					if (id_image_bg_section != "") {
						props["id_image_bg_section"] = id_image_bg_section;
					}
					if (video_bg_id_section != "") {
						props["video_bg_id_section"] = video_bg_id_section;
					}
					if (video_bg_url_section != "") {
						props["video_bg_url_section"] = video_bg_url_section;
					}
					if (video_bg_url_vimeo_section != "") {
						props["video_bg_url_vimeo_section"] = video_bg_url_vimeo_section;
					}
					if (full_height != "") {
						props["full_height"] = full_height;
					}
					if (block_distance != 20) {
						props["block_distance"] = block_distance;
					}
					if (layout != "fixed") {
						props["layout"] = layout;
					}
					if (responsive_background != "") {
						props["responsive_background"] = responsive_background;
					}
					if (custom_classes != "") {
						props["custom_classes"] = custom_classes;
					}
					if (section_width != "") {
						props["section_width"] = section_width;
					}
					if (row_separator_top != "") {
						props["row_separator_top"] = row_separator_top;
					}
					if (row_separator_bottom != "") {
						props["row_separator_bottom"] = row_separator_bottom;
					}
					if (row_separator_right != "") {
						props["row_separator_right"] = row_separator_right;
					}
					if (row_separator_left != "") {
						props["row_separator_left"] = row_separator_left;
					}
					if (row_margin_top != "") {
						props["row_margin_top"] = row_margin_top;
					}
					if (row_margin_bottom != "") {
						props["row_margin_bottom"] = row_margin_bottom;
					}
					if (row_margin_right != "") {
						props["row_margin_right"] = row_margin_right;
					}
					if (row_margin_left != "") {
						props["row_margin_left"] = row_margin_left;
					}
				}

				return props;
			}
		}

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

		// ----------------------------------
		// ------------------------------------------
		var file_frame; // variable for the wp.media file_frame

		// attach a click event (or whatever you want) to some element on your
		// page
		$('#modal-setting-button').on(
			'click',
			'#background_up_img',
			function (event) {
				event.preventDefault();

				// if the file_frame has already been created, just reuse it
				if (file_frame) {
					file_frame.open();
					return;
				}

				file_frame = wp.media.frames.file_frame = wp.media({
					/*
					 * title: $( this ).data( 'uploader_title' ), button: {
					 * text: $( this ).data( 'uploader_button_text' ), },
					 * multiple: false // set this to true for multiple file
					 * selection
					 */
				});

				file_frame.on('select', function () {
					attachment = file_frame.state().get('selection')
						.first().toJSON();

					// do something with the file here
					$('#frontend-button').hide();
					$('#frontend-image').attr('src', attachment.url);
				});

				file_frame.open();
			});
		// ------------------------------------------

		$(document)
			.on(
				'click',
				'.el-size-settingButton',
				function (c) { // c -> click del mouse
					c.preventDefault(); // preventDef -> non fa andare
					// in un evento di default
					var $rexpansiveSection = $(this).parents(
						'.rexpansive_section'); // this -> il div
					// che crea evento
					var $row = $($rexpansiveSection
						.find('.perfect-grid-gallery'));
					var sectionNumber = $row
						.perfectGridGalleryEditor('getSectionNumber');
					console.log(sectionNumber);
					console.log(this);
					// DA CONTROLLARE IL FATTO CHE SELEZIONI IL NUMERO
					// DELLA ROW CORRETTA (sectionNumber)

					$('#back-set-save').attr('data-section_id',
						sectionNumber);
					$('#back-set-reset').attr('data-section_id',
						sectionNumber);
					//OpenModal($('#modal-setting-button').parent('.rex-modal-wrap'));

				});

		$(document).on('click', '#back-set-reset', function (c) {
			c.preventDefault();
			CloseModal($('#modal-setting-button').parent('.rex-modal-wrap'));
		});

		$(document).on(
			'click',
			'.builder-section-config',
			function (e) {

				e.preventDefault();
				var $rexpansiveSection = $(this).parents(
					'.rexpansive_section');
				var $row = $($rexpansiveSection
					.find('.perfect-grid-gallery'));
				var sectionNumber = $row
					.perfectGridGalleryEditor('getSectionNumber');
				$('#backresponsive-set-save').attr('data-section_id',
					sectionNumber);
				$('#backresponsive-set-reset').attr('data-section_id',
					sectionNumber);
				OpenModal($('#modal-background-responsive-set').parent(
					'.rex-modal-wrap'));
			});
	}); // End of the DOM ready

})(jQuery);