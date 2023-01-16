<?php
/**
 * Modal for RexButton editing
 *
 * @since x.x.x
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
	<div id="rex-wpcf7-content-adder" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable setting-edited">
		<!-- Closing Button -->
		<div class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="<?php esc_attr_e( 'Close', 'rexpansive-builder' ); ?>">
				<span class="rex-button">
					<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
				</span>
		</div>
		<!-- General Wrap -->
		<div class="modal-content">
			<?php include 'rexlive-loader-modal.php'; ?> <!-- // Add text field -->
			
			<div id="rex-add-text-field" class="add-content bl_modal-row bl_modal-row--clickable bl_modal-row--padded">
					<div class="add-content__row">
							<div class="tool-button tool-button--flat tool-button--add-big-grey add-content__button tippy" data-tippy-content="<?php _e('Text', 'rexpansive-builder'); ?>">
									<?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
							</div>
							<div id="rex-wpcf7-add-text-field" class="add-content__icon l-icon--dark-grey">
									<?php Rexbuilder_Utilities::get_icon('#B023-Input-Text'); ?>
							</div>
							<div class="add-content__text">text</div>
					</div>
			</div>
			<!-- // Add Textarea Field -->
			<div id="rex-add-textarea-field" class="add-content bl_modal-row bl_modal-row--clickable bl_modal-row--padded">
					<div class="add-content__row">
							<div class="tool-button tool-button--flat tool-button--add-big-grey add-content__button tippy" data-tippy-content="<?php _e('Textarea', 'rexpansive-builder'); ?>">
									<?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
							</div>
							<div id="rex-wpcf7-add-textarea-field" class="add-content__icon l-icon--dark-grey">
									<?php Rexbuilder_Utilities::get_icon('#B029-Input-Text-Area'); ?>
							</div>
							<div class="add-content__text">textarea</div>
					</div>
			</div>
			<!-- // Add Menu Field -->
			<div id="rex-add-menu-field" class="add-content bl_modal-row bl_modal-row--clickable bl_modal-row--padded">
					<div class="add-content__row">
							<div class="tool-button tool-button--flat tool-button--add-big-grey add-content__button tippy" data-tippy-content="<?php _e('Select', 'rexpansive-builder'); ?>">
									<?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
							</div>
							<div id="rex-wpcf7-add-select-field" class="add-content__icon l-icon--dark-grey">
									<?php Rexbuilder_Utilities::get_icon('#B030-Input-Select'); ?>
							</div>
							<div class="add-content__text">select</div>
					</div>
			</div>
			<!-- // Add radiobuttons -->
			<div id="rex-add-radiobuttons-field" class="add-content bl_modal-row bl_modal-row--clickable bl_modal-row--padded">
					<div class="add-content__row">
							<div class="tool-button tool-button--flat tool-button--add-big-grey add-content__button tippy" data-tippy-content="<?php _e('Radio Buttons', 'rexpansive-builder'); ?>">
									<?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
							</div>
							<div id="rex-wpcf7-add-radio-field" class="add-content__icon l-icon--dark-grey">
									<?php Rexbuilder_Utilities::get_icon('#B031-Input-Radio'); ?>
							</div>
							<div class="add-content__text">radio buttons</div>
					</div>
			</div>
			<!-- // Add Checkbox -->
			<div id="rex-add-checkbox-field" class="add-content bl_modal-row bl_modal-row--clickable bl_modal-row--padded">
					<div class="add-content__row">
							<div class="tool-button tool-button--flat tool-button--add-big-grey add-content__button tippy" data-tippy-content="<?php _e('Checkbox', 'rexpansive-builder'); ?>">
									<?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
							</div>
							<div id="rex-wpcf7-add-checkbox-field" class="add-content__icon l-icon--dark-grey">
									<?php Rexbuilder_Utilities::get_icon('#B032-Input-Checkbox'); ?>
							</div>
							<div class="add-content__text ">checkbox</div>
					</div>
			</div>
			<!-- // Add File -->
			<div id="rex-add-file-field" class="add-content bl_modal-row bl_modal-row--clickable bl_modal-row--padded">
					<div class="add-content__row">
							<div class="tool-button tool-button--flat tool-button--add-big-grey add-content__button tippy" data-tippy-content="<?php _e('File', 'rexpansive-builder'); ?>">
									<?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
							</div>
							<div id="rex-wpcf7-add-file-field" class="add-content__icon l-icon--dark-grey">
									<?php Rexbuilder_Utilities::get_icon('#B033-Input-Upload'); ?>
							</div>
							<div class="add-content__text">file</div>
					</div>
			</div>
			<!-- // Add Submit Button -->
			<div id="rex-add-submit-button" class="add-content bl_modal-row bl_modal-row--clickable bl_modal-row--padded">
					<div class="add-content__row">
							<div class="tool-button tool-button--flat tool-button--add-big-grey add-content__button tippy" data-tippy-content="<?php _e('Button', 'rexpansive-builder'); ?>">
									<?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
							</div>
							<div id="rex-wpcf7-add-submit-field" class="add-content__icon l-icon--dark-grey">
									<?php Rexbuilder_Utilities::get_icon('#B034-Input-Button'); ?>
							</div>
							<div class="add-content__text">button</div>
					</div>
			</div>
		</div>
	</div>
</div>
<!-- Add Form Content -->