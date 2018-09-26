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

?>
<div class="section-toolBox">
	<div class="tools">
		
		<div>
			<div class="tool-button--big">
				<label>
					<input type="radio" class="edit-section-width" name="row-dimension-<?php echo $atts['rexlive_section_id']; ?>" value="full" <?php checked('full',$atts['dimension'],true); ?>>
					<span><?php Rexbuilder_Utilities::get_icon('#B001-Full'); ?></span>
				</label>
				<label>
					<input type="radio" class="edit-section-width" name="row-dimension-<?php echo $atts['rexlive_section_id']; ?>" value="boxed" <?php checked('boxed',$atts['dimension'],true); ?>>
					<span><?php Rexbuilder_Utilities::get_icon('#B002-Boxed'); ?></span>
				</label>
			</div>
		</div>
		<!-- // left area: row dimension -->

		<div>
			<div class="tool-button-floating">
				<div class="tool-button add-new-block-empty tooltipped active">
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
						<?php Rexbuilder_Utilities::get_icon('#B004-Video'); ?>
					</div>
	
					<div class="tool-button add-new-block-slider tooltipped">
						<?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
					</div>
				</div>
			</div>
		</div>
		<!-- // center area: insert element -->

		<div>
			<div class="tool-button tool-button--inline builder-copy-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy row', 'rexpansive');?>">
				<?php Rexbuilder_Utilities::get_icon('#Z004-Copy'); ?>
			</div>
			
			<div class="tool-button tool-button--inline builder-move-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Move row', 'rexpansive');?>">
				<?php Rexbuilder_Utilities::get_icon('#B007-Move'); ?>
			</div>

			<div class="tool-button-floating">
				<div class="tool-button builder-section-config tooltipped" data-position="bottom" data-tooltip="<?php _e('Row settings', 'rexpansive');?>">
					<?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>					
				</div>
				<div class="tool-button_list">
					<div class="tool-button collapse-grid tooltipped">
						<?php Rexbuilder_Utilities::get_icon('#B006-Colapse'); ?>
					</div>
					
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


		</div>
		<!-- // right area: clone, move, settings -->
	</div>

	<div class="tool-button tool-button--black builder-delete-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete row', 'rexspansive');?>">
		<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
	</div>
	<!-- // remove section -->
</div>