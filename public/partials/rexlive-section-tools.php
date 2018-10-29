<?php
/**
 * Print the markup of the row toolbar buttons
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/public/partials
 */

defined('ABSPATH') or exit;

$tool_button_classes_right = 'tool-button tool-button--flat';
$tool_button_classes = 'tool-button';

?>
<div class="section-toolBox">
	<div class="tools">
		
		<div class="bl_d-flex bl_ai-c tools-area tool-area--side">

			<div class="switch-toggle switch-live">
				<input type="radio" class="edit-row-width" data-section_width="full" id="row-dimension-full-<?php echo $atts['rexlive_section_id']; ?>" name="row-dimension-<?php echo $atts['rexlive_section_id']; ?>" value="100%" <?php checked('full',$atts['dimension'],true); ?>>
				<label class="tippy" data-tippy-content="<?php _e('Full','rexpansive'); ?>" for="row-dimension-full-<?php echo $atts['rexlive_section_id']; ?>"><span><?php Rexbuilder_Utilities::get_icon('#B001-Full'); ?></span></label>
				<input type="radio" class="edit-row-width" data-section_width="boxed" id="row-dimension-boxed-<?php echo $atts['rexlive_section_id']; ?>" name="row-dimension-<?php echo $atts['rexlive_section_id']; ?>" value="<?php echo ( 'boxed' == $atts['dimension'] ? esc_attr( $atts['section_width'] ) : '80%' ); ?>" <?php checked('boxed',$atts['dimension'],true); ?>>
				<label class="tippy" data-tippy-content="<?php _e('Boxed','rexpansive'); ?>" for="row-dimension-boxed-<?php echo $atts['rexlive_section_id']; ?>"><span><?php Rexbuilder_Utilities::get_icon('#B002-Boxed'); ?></span></label>
				<a></a>
			</div><!-- // Row dimension -->

			<div class="switch-toggle switch-live">
				<input type="radio" class="edit-row-layout" data-section_layout="masonry" id="row-layout-masonry-<?php echo $atts['rexlive_section_id']; ?>" name="row-layout-<?php echo $atts['rexlive_section_id']; ?>" value="masonry" <?php checked('masonry',$atts['layout'],true); ?>>
				<label class="tippy" data-tippy-content="<?php _e('Masonry','rexpansive'); ?>" for="row-layout-masonry-<?php echo $atts['rexlive_section_id']; ?>"><span><?php Rexbuilder_Utilities::get_icon('#B010-Masonry'); ?></span></label>
				<input type="radio" class="edit-row-layout" data-section_layout="fixed" id="row-layout-fixed-<?php echo $atts['rexlive_section_id']; ?>" name="row-layout-<?php echo $atts['rexlive_section_id']; ?>" value="fixed" <?php checked('fixed',$atts['layout'],true); ?>>
				<label class="tippy" data-tippy-content="<?php _e('Grid','rexpansive'); ?>" for="row-layout-fixed-<?php echo $atts['rexlive_section_id']; ?>"><span><?php Rexbuilder_Utilities::get_icon('#B011-Grid'); ?></span></label>
			</div><!-- // Row layout -->

			<div class="<?php echo $tool_button_classes_right; ?> tool-button--inline collapse-grid tippy" data-tippy-content="<?php _e('Collapse','rexpansive'); ?>">
				<?php Rexbuilder_Utilities::get_icon('#B006-Collapse'); ?>
			</div><!-- // collapse -->
		</div>
		<!-- // left area: row dimension, layout, collapse -->

		<div class="bl_d-flex bl_ai-c tools-area tool-area--center">
			<div class="tool-button tool-button--flat tool-button--inline tool-button__image--flat add-new-block-image tippy" data-tippy-content="<?php _e('Image','rexpansive'); ?>">
				<?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
			</div>

			<div class="tool-button tool-button--flat add-new-block-text tool-button__text--flat tool-button--inline tippy" data-tippy-content="<?php _e('Text','rexpansive'); ?>">
				<?php Rexbuilder_Utilities::get_icon('#B003-Text'); ?>
			</div>

			<div class="tool-button tool-button--flat tool-button--inline tool-button__video--flat add-new-block-video tippy" data-tippy-content="<?php _e('Video','rexpansive'); ?>">
				<?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
			</div>

			<div class="tool-button-floating">
				<!-- to add an empty block add this class: add-new-block-empty -->
				<div class="<?php echo $tool_button_classes_right; ?> active">
					<?php Rexbuilder_Utilities::get_icon('#Z009-More'); ?>
				</div>
	
				<div class="tool-button_list">
					<div class="tool-button add-new-block-slider tippy" data-tippy-content="<?php _e('Slider','rexpansive'); ?>">
						<?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
					</div>

					<div class="tool-button add-new-section tippy" data-tippy-content="<?php _e('Insert Row','rexpansive'); ?>" data-new-row-position="after">
						<?php Rexbuilder_Utilities::get_icon('#B016-New-Adjacent-Row'); ?>
					</div>
				</div>
			</div>
		</div><!-- // insert element -->

		<div class="bl_d-flex bl_ai-c bl_jc-fe tools-area tool-area--side">

			<div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__fast-configuration">

				<div class="tool-button--double-icon--wrap tool-button--distance-fix">
					<div class="<?php echo $tool_button_classes; ?> tool-button--inline edit-row-image-background tooltipped<?php echo ( "" != $atts['id_image_bg_section'] ? ' tool-button--image-preview' : '' ); ?>" data-position="bottom" data-tooltip="" value="<?php echo esc_attr( $atts['id_image_bg_section'] ); ?>"<?php echo ( "" != $atts['id_image_bg_section'] ? ' style="background-image:url(' . $atts['image_bg_section'] . ');"' : '' ); ?>>
						<?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
					</div>
					<div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-image-background">
						<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
					</div>
				</div><!-- // Change Row image background -->

				<div class="tool-button--double-icon--wrap tool-button--distance-fix">
					<input class="spectrum-input-element" type="text" name="edit-row-color-background">
					<div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
					<div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-color-background">
						<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
					</div>
				</div><!-- // Change Row color background -->

				<div class="tool-button--double-icon--wrap tool-button--distance-fix">
					<input class="spectrum-input-element" type="text" name="edit-row-overlay-color">
					<div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
					<div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
					<div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-overlay-color">
						<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
					</div>
				</div><!-- // Change Row overlay color -->

				<div class="tool-button--double-icon--wrap tool-button__video-fast tool-button--distance-fix">
					<div class="<?php echo $tool_button_classes; ?> tool-button--inline tool-button--flat edit-row-video-background">
						<?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
					</div>
					<div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-video-background">
						<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
					</div>
				</div>
				<!-- // Add background video -->

				<div class="tool-button tool-button--flat update-model-button tool-button--distance-fix--small locked tippy">
					<span class="unlocked-icon"><?php Rexbuilder_Utilities::get_icon('#B015-UnClosed'); ?></span>
					<span class="locked-icon"><?php Rexbuilder_Utilities::get_icon('#B014-Closed'); ?></span>
				</div>

			</div><!-- // fast configuration elements -->

			<div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__standard-configuration">
				<div class="<?php echo $tool_button_classes_right; ?> tool-button--inline builder-copy-row tippy" data-tippy-content="<?php _e('Copy row', 'rexpansive');?>">
					<?php Rexbuilder_Utilities::get_icon('#Z004-Copy'); ?>
				</div>
				
				<div class="<?php echo $tool_button_classes_right; ?> tool-button--inline builder-move-row tippy" data-tippy-content="<?php _e('Move row', 'rexpansive');?>">
					<?php Rexbuilder_Utilities::get_icon('#B007-Move'); ?>
				</div>

				<div class="tool-button-floating">
					<div class="<?php echo $tool_button_classes_right; ?> builder-section-config tool-button--flat--distance-fix tippy" data-tippy-content="<?php _e('Row settings', 'rexpansive');?>">
						<?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>					
					</div>
					<div class="tool-button_list">	
						<div class="tool-button tool-button--full edit-background-section tippy tool-button--hide">
							<?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
						</div>

						<div class="tool-button tool-button--full edit-row-image-background tooltipped <?php echo ( "" != $atts['id_image_bg_section'] ? ' tool-button--hide' : '' ); ?>">
							<?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
						</div>

						<div class="tool-button--double-icon--wrap">
							<input class="spectrum-input-element" type="text" name="edit-row-color-background">
							<div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
							<div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
						</div><!-- // Change Row color background -->

						<div class="tool-button--double-icon--wrap">
							<input class="spectrum-input-element" type="text" name="edit-row-overlay-color">
							<div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
							<div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
						</div>
						<!-- // Change Row overlay color -->

						<div class="tool-button edit-row-video-background">
							<?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
						</div>
						
						<div class="tool-button open-model tooltipped">
							<?php Rexbuilder_Utilities::get_icon('#B005-RexModel'); ?>
						</div>
					</div>
				</div>

				<div class="<?php echo $tool_button_classes_right; ?> tool-button--inline builder-delete-row tippy" data-tippy-content="<?php _e('Delete row', 'rexspansive');?>">
					<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
				</div>

			</div><!-- clone, move, settings -->
		</div>
		<!-- // right area -->		
	</div>
	<!-- // remove section -->
</div>
<div class="section-toolBoox__highlight"></div>
<div class="section-block-noediting-ui">
	<div class="no-editing--indicator bl_d-flex bl_jc-c bl_ai-c">
		<span class="call-update-model-button tippy" data-tippy-content="<?php _e('Edit Model','rexpansive'); ?>"><?php Rexbuilder_Utilities::get_icon('#B014-Closed'); ?></span>
	</div>
</div>