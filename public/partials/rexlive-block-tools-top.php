<?php
/**
 * Print the block top tools
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/public/partials
 * @deprecated	2.0.3
 */

defined( 'ABSPATH' ) or exit;
?>
<div class="rexlive-block-toolbox top-tools">
	<div class="rexlive-top-block-tools">
		<div class="el-size-viewer tool-indicator"><span class="el-size-viewer__val"></span> <span class="el-size-viewer__um">PX</span></div>

		<div class="bl_d-iflex bl_ai-c block-toolBox__editor-tools">
			<div class="tool-button tool-button--inline edit-block-content<?php echo ( "" !== trim( $content ) ? ' tool-button--hide' : '' ); ?> tippy" data-tippy-content="<?php _e('Text','rexpansive-builder'); ?>">
				<?php Rexbuilder_Utilities::get_icon('#B003-Text'); ?>
			</div>
			<div class="tool-button tool-button--inline builder-edit-slider tippy" data-tippy-content="<?php _e('RexSlider','rexpansive-builder'); ?>">
				<?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
			</div><!-- // rexslider -->
		</div>

		<div class="bl_d-iflex bl_ai-c block-toolBox__config-tools">
			<div class="tool-button tool-button--inline tool-button--hide edit-block-gradient tippy" data-tippy-content="<?php _e('Gradient', 'rexpansive-builder'); ?>" style="margin-right:15px">
			<?php Rexbuilder_Utilities::get_icon('#Z010-Logo'); ?>
			</div>

			<div class="tool-button tool-button--inline edit-block-accordion tippy" data-tippy-content="<?php _e('Accordion', 'rexpansive-builder'); ?>" style="margin-right:15px">
			<?php Rexbuilder_Utilities::get_icon('#Z010-Logo'); ?>
			</div>

			<div class="tool-button tool-button--inline edit-block-slideshow tippy" data-tippy-content="<?php _e('Slideshow', 'rexpansive-builder'); ?>" style="margin-right:15px">
			<?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>
			</div>

			<div class="tool-button tool-button--inline edit-block-content-position<?php echo ( "" === trim( $content ) ? ' tool-button--hide' : '' ); ?> tippy" data-tippy-content="<?php _e('Content Position','rexpansive-builder'); ?>" style="margin-right:15px">
				<?php Rexbuilder_Utilities::get_icon('#C005-Layout'); ?>
			</div>
			
			<div class="tool-button tool-button--inline builder-copy-block tippy" data-tippy-content="<?php _e('Copy block', 'rexpansive-builder'); ?>">
				<?php Rexbuilder_Utilities::get_icon('#Z004-Copy'); ?>
			</div>

			<div class="tool-button-floating block-toolBox__config-list">
				<div class="tool-button" data-tippy-content="<?php _e('Block settings', 'rexpansive-builder');?>">
					<?php Rexbuilder_Utilities::get_icon('#Z009-More'); ?>					
				</div>
				
				<div class="tool-button_list">
					<div class="tool-button tool-button--inline tool-button_list--item builder-edit-block tippy" data-tippy-content="<?php _e('Block settings','rexpansive-builder'); ?>">
						<?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>
					</div><!-- // settings -->

					<div class="tool-button--double-icon--wrap tool-button_list--item<?php echo ( !$not_has_image ? ' tool-button--hide' : '' ); ?>">
						<div class="tool-button tool-button--inline edit-block-image tippy" data-tippy-content="<?php _e('Background Image','rexpansive-builder'); ?>">
							<?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
						</div>                        
					</div><!-- // Change Block image background -->

					<div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="<?php _e('Background Color','rexpansive-builder'); ?>">
						<span class="edit-block-color-background tool-button tool-button--inline tool-button--empty tool-button--color"></span>
					</div><!-- // Change Block color background -->

					<div class="tool-button--double-icon--wrap tool-button--opacity-preview tool-button_list--item<?php echo ( !$not_has_overlay ? ' tool-button--hide' : '' ); ?> tippy" data-tippy-content="<?php _e('Overlay','rexpansive-builder'); ?>">
						<span class="edit-block-overlay-color tool-button tool-button--inline tool-button--empty tool-button--color"></span>
						<div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
					</div><!-- // Change Block overlay color -->

					<div class="tool-button--double-icon--wrap tool-button_list--item<?php echo ( !$not_has_video ? ' tool-button--hide' : '' ); ?> tippy" data-tippy-content="<?php _e('Background Video','rexpansive-builder'); ?>">
						<div class="tool-button tool-button--inline edit-block-video-background">
							<?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
						</div>
					</div><!-- // Change Block Video background -->


					<div class="tool-button tool-button--inline tool-button_list--item builder-edit-slider tippy" data-tippy-content="<?php _e('RexSlider','rexpansive-builder'); ?>">
						<?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
					</div><!-- // rexslider -->

					<div class="tool-button tool-button--inline tool-button_list--item builder-copy-block tippy" data-tippy-content="<?php _e('Copy block', 'rexpansive-builder'); ?>">
						<?php Rexbuilder_Utilities::get_icon('#Z004-Copy'); ?>
					</div>
				</div>
			</div>

			<div class="tool-button tool-button--inline builder-delete-block waves-effect tippy" data-tippy-content="<?php _e('Delete block', 'rexpansive-builder'); ?>">
				<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
			</div>
		</div>
	</div>
	<div class="tool-button builder-delete-block waves-effect tippy" data-tippy-content="<?php _e('Delete block', 'rexpansive-builder'); ?>">
		<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
	</div>
</div>