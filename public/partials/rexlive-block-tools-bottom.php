<?php
/**
 * Print the markup of the modals of the builder
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/public/partials
 */

defined( 'ABSPATH' ) or exit;
?>
<div class="rexlive-block-toolbox bottom-tools">
	<div class="rexlive-bottom-block-tools bl_d-flex bl_jc-c">
		<div class="bl_d-iflex bl_ai-c block-toolBox__fast-configuration">

			<div class="tool-button--double-icon--wrap<?php echo ( $not_has_image ? ' tool-button--hide' : '' ); ?> tippy" data-tippy-content="<?php _e('Background Image','rexpansive-builder'); ?>">
				<div class="tool-button tool-button--inline edit-block-image">
					<?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
				</div>
				<div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-image-background">
					<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
				</div>
			</div><!-- // Change Block image background -->

			<div class="tool-button tool-button--inline tool-button--block-bottom--fix edit-block-image-position<?php echo ( $not_has_image ? ' tool-button--hide' : '' ); ?> tippy" data-tippy-content="<?php _e('Image Settings','rexpansive-builder'); ?>">
				<?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>
			</div>

			<div class="tool-button--double-icon--wrap tippy" data-tippy-content="<?php _e('Background Color','rexpansive-builder'); ?>">
				<span class="edit-block-color-background tool-button tool-button--inline tool-button--empty tool-button--color"></span>
				<div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
				<div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
				<div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-color-background">
					<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
				</div>
			</div><!-- // Change Block color background -->

			<div class="tool-button--double-icon--wrap tool-button--opacity-preview<?php echo ( $not_has_overlay ? ' tool-button--hide' : ' tool-button--picker-preview' ); ?> tippy" data-tippy-content="<?php _e('Overlay','rexpansive-builder'); ?>">
				<span class="edit-block-overlay-color tool-button tool-button--inline tool-button--empty tool-button--color"></span>
				<div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"<?php echo ( !$not_has_overlay ? ' style="background-color:' . $atts['overlay_block_color'] . ';"' : '' ); ?>></div>
				<div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
				<div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-overlay-color">
					<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
				</div>
			</div><!-- // Change Block overlay color -->

			<div class="tool-button--double-icon--wrap<?php echo ( $not_has_video ? ' tool-button--hide' : '' ); ?> tippy" data-tippy-content="<?php _e('Background Video','rexpansive-builder'); ?>">
				<div class="tool-button tool-button--inline edit-block-video-background">
					<?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
				</div>
				<div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-video-background">
					<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
				</div>
			</div><!-- // Change Block Video background -->
		</div>
	</div>
</div>