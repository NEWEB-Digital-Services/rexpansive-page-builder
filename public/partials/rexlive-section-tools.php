<?php
/**
 * Print the markup of the modals of the builder
 *
 * @link       htto://www.neweb.info
 * @since      1.0.10
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials
 */

defined('ABSPATH') or exit;

?>
<div class="section-toolBox">
	<div class="tools">
		
		<div>
			<div class="tool-button--big">
				<label>
					<input type="radio" name="row-dimension" checked>
					<span><?php Rexbuilder_Utilities::get_icon('#B001-Full'); ?></span>
				</label>
				<label>
					<input type="radio" name="row-dimension">
					<span><?php Rexbuilder_Utilities::get_icon('#B002-Boxed'); ?></span>
				</label>
			</div>
		</div>
		<!-- // right area: row dimension -->

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
						<?php Rexbuilder_Utilities::get_icon('#B005-Empty'); ?>
					</div>
				</div>
			</div>
		</div>
		<!-- // center area: insert element -->

		<div>
			<div class="tool-button tool-button--inline builder-copy-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy row', 'rexpansive');?>">
				<i class="material-icons">&#xE14D;</i>
			</div>

			<div class="tool-button tool-button--inline builder-move-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Move row', 'rexpansive');?>">
			<i class="material-icons">&#xE8D5;</i>
			</div>

			<div class="tool-button-floating">
				<div class="tool-button builder-section-config tooltipped" data-position="bottom" data-tooltip="<?php _e('Row settings', 'rexpansive');?>">
					<i class="material-icons">&#xE8B8;</i>
				</div>
				<div class="tool-button_list">
					<div class="tool-button collapse-grid tooltipped">
						C
					</div>
					
					<div class="tool-button edit-background-section tooltipped">
						<?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
					</div>
					
					<div class="tool-button open-model tooltipped">
						M
					</div>
					
					<div class="tool-button update-model-button tooltipped locked">
						L
					</div>
				</div>
			</div>


		</div>
		<!-- // left area: clone, move, settings -->
	</div>

	<div class="tool-button builder-delete-row waves-effect tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete row', 'rexspansive');?>">
			<i class="material-icons">&#xE5CD;</i>
	</div>
	<!-- // remove section -->
</div>