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
		
		<div class="bl_col-6 bl_d-flex bl_ai-c">
			<div class="<?php echo $tool_button_classes; ?> tool-button--inline">
				<label>
					<input type="radio" class="edit-row-width" data-section_width="full" name="row-dimension-<?php echo $atts['rexlive_section_id']; ?>" value="100%" <?php checked('full',$atts['dimension'],true); ?>>
					<span><?php Rexbuilder_Utilities::get_icon('#B001-Full'); ?></span>
				</label>
				<label>
					<input type="radio" class="edit-row-width" data-section_width="boxed" name="row-dimension-<?php echo $atts['rexlive_section_id']; ?>" value="<?php echo ( 'boxed' == $atts['dimension'] ? esc_attr( $atts['section_width'] ) : '80%' ); ?>" <?php checked('boxed',$atts['dimension'],true); ?>>
					<span><?php Rexbuilder_Utilities::get_icon('#B002-Boxed'); ?></span>
				</label>
			</div><!-- // row dimension -->

			<div class="<?php echo $tool_button_classes; ?> tool-button--inline">
				<label>
					<input type="radio" class="edit-row-layout" data-section_layout="fixed" name="row-layout-<?php echo $atts['rexlive_section_id']; ?>" value="fixed" <?php checked('fixed',$atts['layout'],true); ?>>
					<span><?php Rexbuilder_Utilities::get_icon('#B011-Grid'); ?></span>
				</label>
				<label>
					<input type="radio" class="edit-row-layout" data-section_layout="masonry" name="row-layout-<?php echo $atts['rexlive_section_id']; ?>" value="masonry" <?php checked('masonry',$atts['dimension'],true); ?>>
					<span><?php Rexbuilder_Utilities::get_icon('#B010-Masonry'); ?></span>
				</label>
			</div><!-- // row layout -->

			<div class="<?php echo $tool_button_classes; ?> tool-button--inline collapse-grid tooltipped">
				<?php Rexbuilder_Utilities::get_icon('#B006-Collapse'); ?>
			</div><!-- // collapse -->
		</div>
		<!-- // left area: row dimension, layout, collapse -->

		<div class="bl_col-6 bl_d-flex bl_jc-sb bl_ai-c">
		
			<div class="bl_d-iflex bl_ai-c">
				<div class="tool-button-floating">
					<!-- to add an empty block add this class: add-new-block-empty -->
					<div class="<?php echo $tool_button_classes_right; ?> tooltipped active">
						<?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
					</div>
		
					<div class="tool-button_list">
						<div class="tool-button add-new-block-image tooltipped">
							<?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
						</div>
		
						<div class="tool-button add-new-block-text tooltipped">
							<?php Rexbuilder_Utilities::get_icon('#B003-Text'); ?>
						</div>
						
						<div class="tool-button add-new-block-video tooltipped">
							<?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
						</div>
		
						<div class="tool-button add-new-block-slider tooltipped">
							<?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
						</div>
					</div>
				</div>
			</div><!-- // insert element -->

			<div class="bl_d-iflex bl_ai-c row-toolBox__fast-configuration">

				<div class="tool-button--double-icon--wrap">
					<div class="<?php echo $tool_button_classes; ?> tool-button--inline edit-row-image-background tooltipped" data-position="bottom" data-tooltip="" value="<?php echo esc_attr( $atts['id_image_bg_section'] ); ?>">
						<?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
					</div>
					<div class="tool-button tool-button--inline tool-button--black tool-button--double-icon deactivate-row-image-background">
						<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
					</div>
				</div><!-- // Change Row image background -->

				<div class="tool-button--double-icon--wrap">
					<input class="spectrum-input-element" type="text" name="edit-row-color-background" value="<?php echo esc_attr( $atts['color_bg_section'] ); ?>">
					<div class="tool-button tool-button--inline tool-button--black tool-button--double-icon deactivate-row-color-background">
						<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
					</div>
				</div><!-- // Change Row color background -->

				<div class="tool-button--double-icon--wrap">
					<input class="spectrum-input-element" type="text" name="edit-row-overlay-color" value="<?php echo esc_attr( $atts['row_overlay_color'] ); ?>">
					<div class="tool-button tool-button--inline tool-button--black tool-button--double-icon deactivate-row-overlay-color">
						<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
					</div>
				</div><!-- // Change Row overlay color -->

				<div class="tool-button--double-icon--wrap">
					<div class="<?php echo $tool_button_classes; ?> tool-button--inline edit-row-video-background">
						<?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
					</div>
					<div class="tool-button tool-button--inline tool-button--black tool-button--double-icon deactivate-row-video-background">
						<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
					</div>
				</div>
				<!-- // Add background video -->

			</div><!-- // fast configuration elements -->

			<div class="bl_d-iflex bl_ai-c">
				<div class="<?php echo $tool_button_classes_right; ?> tool-button--inline builder-copy-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy row', 'rexpansive');?>">
					<?php Rexbuilder_Utilities::get_icon('#Z004-Copy'); ?>
				</div>
				
				<div class="<?php echo $tool_button_classes_right; ?> tool-button--inline builder-move-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Move row', 'rexpansive');?>">
					<?php Rexbuilder_Utilities::get_icon('#B007-Move'); ?>
				</div>

				<div class="tool-button-floating">
					<div class="<?php echo $tool_button_classes_right; ?> builder-section-config tooltipped" data-position="bottom" data-tooltip="<?php _e('Row settings', 'rexpansive');?>">
						<?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>					
					</div>
					<div class="tool-button_list">						
						<div class="tool-button edit-background-section tooltipped">
							<?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
						</div>
						
						<div class="tool-button open-model tooltipped">
							<?php Rexbuilder_Utilities::get_icon('#B005-RexModel'); ?>
						</div>
						
						<div class="tool-button update-model-button tooltipped locked">
							<span class="unlocked-icon"><?php Rexbuilder_Utilities::get_icon('#B009-Lock-Open'); ?></span>
							<span class="locked-icon"><?php Rexbuilder_Utilities::get_icon('#B008-Lock-Close'); ?></span>
						</div>
					</div>
				</div>

				<div class="<?php echo $tool_button_classes_right; ?> tool-button--inline builder-delete-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete row', 'rexspansive');?>">
					<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
				</div>

			</div><!-- clone, move, settings -->
		</div>
		<!-- // right area -->		
	</div>
	<!-- // remove section -->
</div>