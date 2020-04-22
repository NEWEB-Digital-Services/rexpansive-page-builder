/**
 * HTML templates in string, much faster on Safari
 * @since  2.0.4
 */
var Rexbuilder_Live_Templates = (function() {
	"use strict";

	function getTemplate( tmpl, data ) {
		switch( tmpl ) {
			case 'tmpl-tool-save':
				return '<div class="rex-modal__outside-footer"><div id="rex-model__add-new-model" class="tool-button tool-button--inline tool-button--save"><span class="btn-save--edited"><i class="l-svg-icons"><svg><use xlink:href="#A006-Save"></use></svg></i></span><span class="btn-save--saved"><i class="l-svg-icons"><svg><use xlink:href="#A006-Save"></use></svg></i></span></div></div>';

			case 'tmpl-tool-close':
				return '<div class="tool-button tool-button--black tool-button--close rex-modal__close-button"><i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i></div>';

			case 'tmpl-palette-item':
				return '<div class="palette-item"><div class="tool-button tool-button--deactivate palette-item__delete"><i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i></div></div>';

			case 'tmpl-block-drag-handle':
				return '<div class="rexlive-block-drag-handle"></div>';

			case 'tmpl-new-section':
				data = 'undefined' !== typeof data ? data : { rexID: '', dimension: 'full', dimensionClass: 'center-disposition', layout: 'fixed', sectionWidth: '100%', fullHeight: 'false', blockDistance: 20, rowSeparatorTop: 20, rowSeparatorBottom: 20, rowSeparatorRight: 20, rowSeparatorLeft: 20 };

				return '<section class="rexpansive_section empty-section' + ( data.rowSeparatorTop < 25 ? ' ui-tools--near-top' : '' ) + '" data-rexlive-section-id="' + data.rexID + '" data-rexlive-section-name=""> <div class="section-data" style="display: none;" data-section_name="" data-type="perfect-grid" data-color_bg_section="" data-color_bg_section_active="true"data-dimension="' + data.dimension + '" data-image_bg_section_active="true" data-image_bg_section="" data-id_image_bg_section=""data-video_bg_url_section="" data-video_bg_id_section="" data-video_bg_width_section="" data-video_bg_height_section="" data-video_bg_url_vimeo_section="" data-full_height="' + data.fullHeight + '"data-block_distance="' + data.blockDistance + '" data-layout="' + data.layout + '" data-responsive_background="" data-custom_classes=""data-section_width="' + data.sectionWidth + '" data-row_separator_top="' + data.rowSeparatorTop + '" data-row_separator_bottom="' + data.rowSeparatorBottom + '"data-row_separator_right="' + data.rowSeparatorRight + '" data-row_separator_left="' + data.rowSeparatorLeft + '" data-margin=""data-row_margin_top="" data-row_margin_bottom="" data-row_margin_right="" data-row_margin_left="" data-row_active_photoswipe=""data-row_overlay_color="" data-row_overlay_active="false" data-rexlive_section_id="' + data.rexID + '" data-row_edited_live="true"></div> <div class="responsive-overlay"> <div class="rex-row__dimension ' + data.dimensionClass + '"> <div class="perfect-grid-gallery grid-stack grid-stack-row" data-separator="' + data.blockDistance + '" data-layout="' + data.layout + '"data-full-height="' + data.fullHeight + '" data-row-separator-top="' + data.rowSeparatorTop + '" data-row-separator-right="' + data.rowSeparatorRight + '"data-row-separator-bottom="' + data.rowSeparatorBottom + '" data-row-separator-left="' + data.rowSeparatorLeft + '"> <div class="perfect-grid-sizer"></div> </div> </div> </div> </section>';
			case 'tmpl-toolbox-section':
				data = 'undefined' !== typeof data ? data : { rexID: '', dimension: 'full', layout: 'fixed' };

				return '<div class="section-toolBox"><div class="tools"><div class="bl_d-flex bl_ai-c tools-area tool-area--side tool-area--left"><div class="switch-toggle switch-live"><input type="radio" class="edit-row-width" data-section_width="full" id="row-dimension-full-' + data.rexID + '" name="row-dimension-' + data.rexID + '" value="100%"' + ( 'full' == data.dimension ? ' checked' : '' ) + '><label class="tippy" data-tippy-content="' + _plugin_frontend_settings.labels.full + '" for="row-dimension-full-' + data.rexID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B001-Full"></use></svg></i></span></label><input type="radio" class="edit-row-width" data-section_width="boxed" id="row-dimension-boxed-' + data.rexID + '" name="row-dimension-' + data.rexID + '" value="80%"' + ( 'boxed' == data.dimension ? ' checked' : '' ) + '><label class="tippy" data-tippy-content="' + _plugin_frontend_settings.labels.boxed + '" for="row-dimension-boxed-' + data.rexID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B002-Boxed"></use></svg></i></span></label></div><div class="switch-toggle switch-live" style="display:none;"><input type="radio" class="edit-row-layout" data-section_layout="fixed" id="row-layout-fixed-' + data.rexID + '" name="row-layout-' + data.rexID + '" value="fixed"><label class="tippy" data-tippy-content="' + _plugin_frontend_settings.labels.grid + '" for="row-layout-fixed-' + data.rexID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B017-Grid-Layout"></use></svg></i></span></label><input type="radio" class="edit-row-layout" data-section_layout="masonry" id="row-layout-masonry-' + data.rexID + '" name="row-layout-' + data.rexID + '" value="masonry"><label class="tippy" data-tippy-content="' + _plugin_frontend_settings.labels.masonry + '" for="row-layout-masonry-' + data.rexID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B010-Masonry"></use></svg></i></span></label></div><div class="bl_switch tippy" data-tippy-content="' + _plugin_frontend_settings.labels.grid_on_off + '"><label><input class="edit-row-layout-checkbox" type="checkbox"' + ( 'fixed' == data.layout ? ' checked' : '' ) + '><span class="lever"></span><span class="bl_switch__icon"><i class="l-svg-icons"><svg><use xlink:href="#B017-Grid-Layout"></use></svg></i></span></label></div><div class="tool-button tool-button--flat tool-button--inline collapse-grid tippy" data-tippy-content="' + _plugin_frontend_settings.labels.collapse + '"><i class="l-svg-icons"><svg><use xlink:href="#B006-Collapse"></use></svg></i></div></div><div class="bl_d-flex bl_ai-c tools-area tool-area--center"><div class="tool-button tool-button--flat tool-button--inline tool-button__image--flat add-new-block-image tippy" data-tippy-content="' + _plugin_frontend_settings.labels.insert_image + '"><i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i></div><div class="tool-button tool-button--flat tool-button__text--flat add-new-block-text tool-button--inline tippy" data-tippy-content="' + _plugin_frontend_settings.labels.insert_text + '"><i class="l-svg-icons"><svg><use xlink:href="#B003-Text"></use></svg></i></div> <div class="tool-button tool-button--flat tool-button--inline tool-button__video--flat add-new-block-video tippy" data-tippy-content="' + _plugin_frontend_settings.labels.insert_video + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button-floating"> <div class="tool-button tool-button--flat active"> <i class="l-svg-icons"><svg><use xlink:href="#Z009-More"></use></svg></i> </div> <div class="tool-button_list"> <div class="tool-button add-new-block-slider tool-button_list--item tippy" data-tippy-content="' + _plugin_frontend_settings.labels.slider + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-RexSlider"></use></svg></i> </div> <div class="tool-button tippy add-new-section tool-button_list--item" data-tippy-content="' + _plugin_frontend_settings.labels.insert_row + '" data-new-row-position="after"> <i class="l-svg-icons"><svg><use xlink:href="#B016-New-Adjacent-Row"></use></svg></i> </div> </div> </div> </div> <div class="bl_d-flex bl_ai-c bl_jc-fe tools-area tool-area--side"> <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__fast-configuration"> <div class="tool-button tool-button--flat update-model-button tool-button--distance-fix--small locked tippy" data-tippy-content="' + _plugin_frontend_settings.labels.model + '"> <span class="unlocked-icon"><i class="l-svg-icons"><svg><use xlink:href="#B015-UnClosed"></use></svg></i> </span> <span class="locked-icon"><i class="l-svg-icons"><svg><use xlink:href="#B014-Closed"></use></svg></i> </span> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="' + _plugin_frontend_settings.labels.background_image + '"> <div class="tool-button tool-button--inline edit-row-image-background tippy" data-tippy-content="" value=""> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-image-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="' + _plugin_frontend_settings.labels.background_color + '"> <span class="edit-row-color-background tool-button tool-button--inline tool-button--empty tool-button--color"></span> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-color-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--opacity-preview tool-button--model-hide tippy" data-tippy-content="' + _plugin_frontend_settings.labels.overlay + '"> <span class="edit-row-overlay-color tool-button tool-button--inline tool-button--empty tool-button--color"></span><div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-overlay-color"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button__video-fast tool-button--hide tool-button--distance-fix tool-button--model-hide tippy" data-tippy-content="' + _plugin_frontend_settings.labels.background_video + '"> <div class="tool-button tool-button--inline tool-button--flat edit-row-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__standard-configuration"> <div class="tool-button tool-button--flat tool-button--inline builder-copy-row tippy" data-tippy-content="' + _plugin_frontend_settings.labels.copy_row + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z004-Copy"></use></svg></i> </div> <div class="tool-button tool-button--flat tool-button--inline builder-move-row tippy" data-tippy-content="' + _plugin_frontend_settings.labels.move_row + '"> <i class="l-svg-icons"><svg><use xlink:href="#B007-Move"></use></svg></i> </div> <div class="tool-button-floating tool-button--model-hide"> <div class="tool-button tool-button--flat tool-button--flat--distance-fix" data-tippy-content="' + _plugin_frontend_settings.labels.row_settings + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z009-More"></use></svg></i> </div> <div class="tool-button_list"> <div class="tool-button builder-section-config tool-button_list--item tippy" data-tippy-content="' + _plugin_frontend_settings.labels.row_settings + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z005-Setting"></use></svg></i> </div> <div class="tool-button tool-button--full tool-button_list--item edit-background-section tippy tool-button--hide"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button tool-button--full tool-button_list--item edit-row-image-background tippy" data-tippy-content="' + _plugin_frontend_settings.labels.background_image + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="' + _plugin_frontend_settings.labels.background_color + '"> <span class="edit-row-color-background tool-button tool-button--inline tool-button--empty tool-button--color"></span> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> </div> <div class="tool-button--double-icon--wrap tool-button_list--item tool-button--opacity-preview tippy" data-tippy-content="' + _plugin_frontend_settings.labels.overlay + '"> <span class="edit-row-overlay-color tool-button tool-button--inline tool-button--empty tool-button--color"></span><div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> </div> <div class="tool-button edit-row-video-background tool-button_list--item tippy" data-tippy-content="' + _plugin_frontend_settings.labels.background_video + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button open-model tool-button_list--item tippy" data-tippy-content="' + _plugin_frontend_settings.labels.model + '"> <i class="l-svg-icons"><svg><use xlink:href="#B005-RexModel"></use></svg></i> </div> </div> </div> <div class="tool-button tool-button--flat tool-button--inline builder-delete-row tippy" data-tippy-content="' + _plugin_frontend_settings.labels.delete_row + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> </div> </div> <div class="section-toolBoox__highlight"></div> <div class="section-block-noediting-ui"> <div class="no-editing--indicator bl_d-flex bl_jc-c bl_ai-c"> <span class="call-update-model-button"><i class="l-svg-icons"><svg><use xlink:href="#B014-Closed"></use></svg></i> </span> </div> </div>';

			case 'tmpl-toolbox-block-wrap':
				data = 'undefined' !== typeof data ? data : { block_type: '' };
				return '<div class="ui-focused-element-highlight"> <div class="rexlive-block-toolbox top-tools"> <div class="rexlive-top-block-tools"> <div class="el-size-viewer tool-indicator"><span class="el-size-viewer__val"></span> <span class="el-size-viewer__um">PX</span></div> <div class="bl_d-iflex bl_ai-c block-toolBox__editor-tools"> <div class="tool-button tool-button--inline edit-block-content"> <i class="l-svg-icons"><svg><use xlink:href="#B003-Text"></use></svg></i> </div> <div class="tool-button tool-button--inline builder-edit-slider"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-RexSlider"></use></svg></i> </div> </div> <div class="bl_d-iflex bl_ai-c block-toolBox__config-tools"> <div class="tool-button tool-button--inline tool-button--hide edit-block-gradient tippy" data-tippy-content="' + _plugin_frontend_settings.labels.gradient + '" style="margin-right:15px"> <i class="l-svg-icons"><svg><use xlink:href="#Z010-Logo"></use></svg></i> </div> <div class="tool-button tool-button--inline edit-block-content-position tool-button--hide" style="margin-right:15px"> <i class="l-svg-icons"><svg><use xlink:href="#C005-Layout"></use></svg></i> </div> <div class="tool-button tool-button--inline edit-block-accordion tippy" data-tippy-content="' + _plugin_frontend_settings.labels.accordion + '" style="margin-right:15px"> <i class="l-svg-icons"><svg><use xlink:href="#Z010-Logo"></use></svg></i> </div> <div class="tool-button tool-button--inline edit-block-slideshow tippy" data-tippy-content="' + _plugin_frontend_settings.labels.slideshow + '" style="margin-right:15px"> <i class="l-svg-icons"><svg><use xlink:href="#Z005-Setting"></use></svg></i> </div> <div class="tool-button tool-button--inline builder-copy-block tippy" data-tippy-content="' + _plugin_frontend_settings.labels.copy_block + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z004-Copy"></use></svg></i> </div> <div class="tool-button-floating block-toolBox__config-list"> <div class="tool-button" data-tippy-content="' + _plugin_frontend_settings.labels.block_settings + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z009-More"></use></svg></i> </div> <div class="tool-button_list"> <div class="tool-button tool-button--inline tool-button_list--item builder-edit-block tippy" data-tippy-content="' + _plugin_frontend_settings.labels.block_settings + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z005-Setting"></use></svg></i> </div> <div class="tool-button--double-icon--wrap tool-button_list--item' + ( data.block_type == 'image' ? ' tool-button--hide' : '' ) + ' tippy" data-tippy-content="' + _plugin_frontend_settings.labels.background_image + '"> <div class="tool-button tool-button--inline edit-block-image tippy"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="' + _plugin_frontend_settings.labels.background_color + '"> <span class="edit-block-color-background tool-button tool-button--inline tool-button--empty tool-button--color"></span> </div> <div class="tool-button--double-icon--wrap tool-button--opacity-preview tool-button_list--item tippy" data-tippy-content="' + _plugin_frontend_settings.labels.overlay + '"> <span class="edit-block-overlay-color tool-button tool-button--inline tool-button--empty tool-button--color"></span> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> </div> <div class="tool-button--double-icon--wrap tool-button_list--item' + ( data.block_type == 'video' ? ' tool-button--hide' : '' ) + ' tippy" data-tippy-content="' + _plugin_frontend_settings.labels.background_video + '"> <div class="tool-button tool-button--inline edit-block-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> </div> <div class="tool-button tool-button--inline tool-button_list--item builder-edit-slider tippy" data-tippy-content="' + _plugin_frontend_settings.labels.rexslider + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-RexSlider"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button_list--item builder-copy-block tippy" data-tippy-content="' + _plugin_frontend_settings.labels.copy_block + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z004-Copy"></use></svg></i> </div> </div> </div> <div class="tool-button tool-button--inline builder-delete-block waves-effect tippy" data-tippy-content="' + _plugin_frontend_settings.labels.delete_block + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> <div class="tool-button tool-button--black builder-delete-block waves-effect tippy" data-tippy-content="' + _plugin_frontend_settings.labels.delete_block + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="rexlive-block-toolbox bottom-tools" data-block_type="' + data.block_type + '"> <div class="rexlive-bottom-block-tools bl_d-flex bl_jc-c"> <div class="bl_d-iflex bl_ai-c block-toolBox__fast-configuration"> <div class="tool-button--double-icon--wrap' + ( data.block_type != 'image' ? ' tool-button--hide' : '' ) + ' tippy" data-tippy-content="' + _plugin_frontend_settings.labels.background_image + '"> <div class="tool-button tool-button--inline edit-block-image"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-image-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button tool-button--inline tool-button--block-bottom--fix edit-block-image-position' + ( data.block_type != 'image' ? ' tool-button--hide' : '' ) + ' tippy" data-tippy-content="' + _plugin_frontend_settings.labels.image_settings + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z005-Setting"></use></svg></i> </div> <div class="tool-button--double-icon--wrap tool-button--hide"> <span class="edit-block-color-background tool-button tool-button--inline tool-button--empty tool-button--color"></span> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-color-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button--hide"> <span class="edit-block-overlay-color tool-button tool-button--inline tool-button--empty tool-button--color"></span> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-overlay-color"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap' + ( data.block_type != 'video' ? ' tool-button--hide' : '' ) + '"> <div class="tool-button tool-button--inline edit-block-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> </div> </div> <div class="rexlive-block-toolbox mobile-tools"> <div class="rexlive-mobile-block-tools bl_d-flex bl_jc-sb bl_ai-c"> <div class="el-size-viewer tool-indicator"><span class="el-size-viewer__val"></span> <span class="el-size-viewer__um">PX</span></div> <div class="tool-button tool-button--inline builder-delete-block waves-effect tippy" data-tippy-content="' + _plugin_frontend_settings.labels.delete_block + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> </div>';
			
			case 'tmpl-toolbox-block-wrap-clean':
				return '<div class="ui-focused-element-highlight"> <div class="rexlive-block-toolbox top-tools"> <div class="rexlive-top-block-tools"> <div class="el-size-viewer tool-indicator"><span class="el-size-viewer__val"></span> <span class="el-size-viewer__um">PX</span></div> <div class="bl_d-iflex bl_ai-c block-toolBox__editor-tools"> <div class="tool-button tool-button--inline edit-block-content' + ( data.has_content ? ' tool-button--hide ' : ' ' ) + 'tippy" data-tippy-content="' + _plugin_frontend_settings.labels.text + '"> <i class="l-svg-icons"><svg><use xlink:href="#B003-Text"></use></svg></i> </div> <div class="tool-button tool-button--inline builder-edit-slider tippy" data-tippy-content="' + _plugin_frontend_settings.labels.rexslider + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-RexSlider"></use></svg></i> </div> </div> <div class="bl_d-iflex bl_ai-c block-toolBox__config-tools"> <div class="tool-button tool-button--inline tool-button--hide edit-block-gradient tippy" data-tippy-content="' + _plugin_frontend_settings.labels.gradient + '" style="margin-right:15px"> <i class="l-svg-icons"><svg><use xlink:href="#Z010-Logo"></use></svg></i> </div> <div class="tool-button tool-button--inline edit-block-accordion tippy" data-tippy-content="' + _plugin_frontend_settings.labels.accordion + '" style="margin-right:15px"> <i class="l-svg-icons"><svg><use xlink:href="#Z010-Logo"></use></svg></i> </div> <div class="tool-button tool-button--inline edit-block-slideshow tippy" data-tippy-content="' + _plugin_frontend_settings.labels.slideshow + '" style="margin-right:15px"> <i class="l-svg-icons"><svg><use xlink:href="#Z005-Setting"></use></svg></i> </div> <div class="tool-button tool-button--inline edit-block-content-position' + ( ! data.has_content ? ' tool-button--hide ' : ' ' ) + 'tippy" data-tippy-content="' + _plugin_frontend_settings.labels.content_position + '" style="margin-right:15px"> <i class="l-svg-icons"><svg><use xlink:href="#C005-Layout"></use></svg></i> </div> <div class="tool-button tool-button--inline builder-copy-block tippy" data-tippy-content="' + _plugin_frontend_settings.labels.copy_block + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z004-Copy"></use></svg></i> </div> <div class="tool-button-floating block-toolBox__config-list"> <div class="tool-button" data-tippy-content="' + _plugin_frontend_settings.labels.block_settings + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z009-More"></use></svg></i> </div> <div class="tool-button_list"> <div class="tool-button tool-button--inline tool-button_list--item builder-edit-block tippy" data-tippy-content="' + _plugin_frontend_settings.labels.block_settings + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z005-Setting"></use></svg></i> </div> <div class="tool-button--double-icon--wrap tool-button_list--item' + ( ! data.not_has_image ? ' tool-button--hide' : '' ) + '"> <div class="tool-button tool-button--inline edit-block-image tippy" data-tippy-content="' + _plugin_frontend_settings.labels.background_image + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="' + _plugin_frontend_settings.labels.background_color + '"> <span class="edit-block-color-background tool-button tool-button--inline tool-button--empty tool-button--color"></span> </div> <div class="tool-button--double-icon--wrap tool-button--opacity-preview tool-button_list--item' + ( ! data.not_has_overlay ? ' tool-button--hide ' : ' ' ) + 'tippy" data-tippy-content="' + _plugin_frontend_settings.labels.overlay + '"> <span class="edit-block-overlay-color tool-button tool-button--inline tool-button--empty tool-button--color"></span> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> </div> <div class="tool-button--double-icon--wrap tool-button_list--item' + ( ! data.not_has_video ? ' tool-button--hide ' : ' ' ) + 'tippy" data-tippy-content="' + _plugin_frontend_settings.labels.background_video + '"> <div class="tool-button tool-button--inline edit-block-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> </div> <div class="tool-button tool-button--inline tool-button_list--item builder-edit-slider tippy" data-tippy-content="' + _plugin_frontend_settings.labels.rexslider + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-RexSlider"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button_list--item builder-copy-block tippy" data-tippy-content="' + _plugin_frontend_settings.labels.copy_block + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z004-Copy"></use></svg></i> </div> </div> </div> <div class="tool-button tool-button--inline builder-delete-block waves-effect tippy" data-tippy-content="' + _plugin_frontend_settings.labels.delete_block + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> <div class="tool-button builder-delete-block waves-effect tippy" data-tippy-content="' + _plugin_frontend_settings.labels.delete_block + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="rexlive-block-toolbox bottom-tools"> <div class="rexlive-bottom-block-tools bl_d-flex bl_jc-c"> <div class="bl_d-iflex bl_ai-c block-toolBox__fast-configuration"> <div class="tool-button--double-icon--wrap' + ( data.not_has_image ? ' tool-button--hide ' : ' ' ) + 'tippy" data-tippy-content="' + _plugin_frontend_settings.labels.background_image + '"> <div class="tool-button tool-button--inline edit-block-image"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-image-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button tool-button--inline tool-button--block-bottom--fix edit-block-image-position' + ( data.not_has_image ? ' tool-button--hide ' : ' ' ) + 'tippy" data-tippy-content="' + _plugin_frontend_settings.labels.image_settings + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z005-Setting"></use></svg></i> </div> <div class="tool-button--double-icon--wrap tippy" data-tippy-content="' + _plugin_frontend_settings.labels.background_color + '"> <span class="edit-block-color-background tool-button tool-button--inline tool-button--empty tool-button--color"></span> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-color-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button--opacity-preview' + ( data.not_has_overlay ? ' tool-button--hide ' : ' tool-button--picker-preview ' ) + 'tippy" data-tippy-content="' + _plugin_frontend_settings.labels.overlay + '"> <span class="edit-block-overlay-color tool-button tool-button--inline tool-button--empty tool-button--color"></span> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"' + ( ! data.not_has_overlay ? ' style="background-color:' + data.overlay + ';"' : '' ) + '></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-overlay-color"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap' + ( data.not_has_video ? ' tool-button--hide ' : ' ' ) + 'tippy" data-tippy-content="' + _plugin_frontend_settings.labels.background_video + '"> <div class="tool-button tool-button--inline edit-block-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> </div> </div> <div class="rexlive-block-toolbox mobile-tools"> <div class="rexlive-mobile-block-tools bl_d-flex bl_jc-sb bl_ai-c"> <div class="el-size-viewer tool-indicator"><span class="el-size-viewer__val"></span> <span class="el-size-viewer__um">PX</span></div> <div class="tool-button tool-button--inline builder-delete-block waves-effect tippy" data-tippy-content="' + _plugin_frontend_settings.labels.delete_block + '"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> </div>';
			default:
				return '';
		}
	}

	return {
		getTemplate: getTemplate
	}
})();